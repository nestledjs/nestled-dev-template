import { createHash } from 'node:crypto'
import { once } from 'node:events'
import { existsSync } from 'node:fs'
import { open, readFile, readdir, realpath, stat, unlink, utimes } from 'node:fs/promises'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawn, spawnSync } from 'node:child_process'

const root = await realpath(process.cwd())
const composeFile = join(root, '.dev', 'docker-compose.yml')
const schemaFile = join(root, 'api-schema.graphql')
const apiMainFile = join(root, 'apps', 'api', 'src', 'main.ts')
const apiEntryFile = join(root, 'dist', 'apps', 'api', 'main.js')
const sdkOutputFile = join(root, 'libs', 'shared', 'sdk', 'src', 'generated', 'graphql.ts')
const sdkSourceDirectories = [
  join(root, 'libs', 'shared', 'sdk', 'src', 'graphql'),
  join(root, 'libs', 'shared', 'sdk', 'src', '__admin'),
]
const lockFile = join(
  tmpdir(),
  `nestled-db-update-${createHash('sha256').update(root).digest('hex').slice(0, 16)}.lock`,
)
const generatedCommand = ['run', 'db-update:generate']
const composeEnvironmentArgs = existsSync(join(root, '.env'))
  ? ['--env-file', join(root, '.env')]
  : []
const apiWatchTimeoutMs = 5 * 60 * 1000
const sdkWatchTimeoutMs = 60 * 1000
const schemaRefreshTimeoutMs = 5 * 60 * 1000

const delay = milliseconds => new Promise(resolveDelay => setTimeout(resolveDelay, milliseconds))

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    env: options.env ?? process.env,
    encoding: 'utf8',
    stdio: options.capture ? 'pipe' : 'inherit',
  })

  if (result.error) {
    throw result.error
  }
  if (result.status !== 0) {
    const detail = options.capture ? `\n${result.stderr || result.stdout}` : ''
    throw new Error(`${command} ${args.join(' ')} failed with exit code ${result.status}.${detail}`)
  }
  return options.capture ? result.stdout.trim() : ''
}

async function fileStamp(file) {
  try {
    const value = await stat(file)
    return { modified: value.mtimeMs, changed: value.ctimeMs }
  } catch (error) {
    if (error.code === 'ENOENT') return undefined
    throw error
  }
}

function stampChanged(before, after) {
  if (!after) return false
  return !before || before.modified !== after.modified || before.changed !== after.changed
}

async function waitForFileChange(file, before, timeoutMs) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    const current = await fileStamp(file)
    if (stampChanged(before, current)) return current
    await delay(500)
  }
  throw new Error(`Timed out waiting for ${file} to be regenerated.`)
}

function processIsAlive(pid) {
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}

async function acquireLock() {
  try {
    const handle = await open(lockFile, 'wx')
    await handle.writeFile(JSON.stringify({ pid: process.pid, root }))
    await handle.close()
    return
  } catch (error) {
    if (error.code !== 'EEXIST') throw error
  }

  let owner
  try {
    owner = JSON.parse(await readFile(lockFile, 'utf8'))
  } catch {
    owner = undefined
  }

  if (owner?.pid && processIsAlive(owner.pid)) {
    throw new Error(`db-update is already running for this workspace (PID ${owner.pid}).`)
  }

  await unlink(lockFile).catch(error => {
    if (error.code !== 'ENOENT') throw error
  })
  const handle = await open(lockFile, 'wx')
  await handle.writeFile(JSON.stringify({ pid: process.pid, root }))
  await handle.close()
}

async function processCwd(pid) {
  if (process.platform === 'linux') {
    try {
      return await realpath(`/proc/${pid}/cwd`)
    } catch {
      return undefined
    }
  }

  if (process.platform === 'darwin') {
    const result = spawnSync('lsof', ['-a', '-p', String(pid), '-d', 'cwd', '-Fn'], {
      encoding: 'utf8',
    })
    const cwdLine = result.stdout
      ?.split('\n')
      .find(line => line.startsWith('n'))
      ?.slice(1)
    if (!cwdLine) return undefined
    try {
      return await realpath(cwdLine)
    } catch {
      return undefined
    }
  }

  return undefined
}

async function findWorkspaceProcess(predicate) {
  const result = spawnSync('ps', ['-axo', 'pid=,command='], { encoding: 'utf8' })
  if (result.status !== 0) return undefined

  for (const line of result.stdout.split('\n')) {
    const match = /^\s*(\d+)\s+(.+)$/.exec(line)
    if (!match || Number(match[1]) === process.pid || !predicate(match[2])) continue
    const cwd = await processCwd(Number(match[1]))
    if (cwd === root) return { pid: Number(match[1]), command: match[2] }
  }

  return undefined
}

const isApiWatcher = command =>
  /(?:^|[/\\\s])nx(?:\.js)?\s+(?:serve\s+api(?:\s|$)|run\s+api:serve(?:[:\s]|$))/.test(
    command,
  )
const isSdkWatcher = command =>
  command.includes('graphql-codegen') && /(?:^|\s)(?:--watch|-w)(?:\s|$)/.test(command)

async function refreshWithApiWatcher(watcher, schemaBeforeGeneration) {
  console.log(`Reusing the active API watcher (PID ${watcher.pid}).`)

  try {
    await waitForFileChange(schemaFile, schemaBeforeGeneration, 15_000)
    return
  } catch {
    // The generator produced no watched source change. Touch the entrypoint to request one restart.
  }

  const beforeTouch = await fileStamp(schemaFile)
  const now = new Date()
  await utimes(apiMainFile, now, now)
  try {
    await waitForFileChange(schemaFile, beforeTouch, apiWatchTimeoutMs)
  } catch {
    throw new Error(
      `The API watcher (PID ${watcher.pid}) did not regenerate api-schema.graphql. ` +
        'Stop or repair that watcher, then rerun pnpm db-update; no competing API was started.',
    )
  }
}

function composeArgs(...args) {
  return ['compose', ...composeEnvironmentArgs, '-f', composeFile, ...args]
}

function runningServiceContainer(service) {
  return run('docker', composeArgs('ps', '--status', 'running', '-q', service), { capture: true })
}

function publishedPort(container, containerPort) {
  const output = run(
    'docker',
    [
      'inspect',
      '--format',
      `{{(index (index .NetworkSettings.Ports "${containerPort}/tcp") 0).HostPort}}`,
      container,
    ],
    { capture: true },
  )
  if (!/^\d+$/.test(output)) {
    throw new Error(
      `Could not resolve the published port for ${containerPort}/tcp on ${container}.`,
    )
  }
  return output
}

async function waitForPostgres(container) {
  const deadline = Date.now() + 60_000
  while (Date.now() < deadline) {
    const result = spawnSync('docker', [
      'exec',
      container,
      'pg_isready',
      '-U',
      'prisma',
      '-d',
      'prisma',
    ])
    if (result.status === 0) return
    await delay(1_000)
  }
  throw new Error(
    'The disposable local Postgres dependency did not become ready within 60 seconds.',
  )
}

function reservePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer()
    server.unref()
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      if (!address || typeof address === 'string') {
        server.close()
        reject(new Error('Could not reserve a local API port.'))
        return
      }
      const port = address.port
      server.close(error => (error ? reject(error) : resolvePort(port)))
    })
  })
}

function scrubExternalCredentials(env) {
  const names = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'DIGITALOCEAN_API_TOKEN',
    'DO_API_TOKEN',
    'DO_SSH_KEY_IDS',
    'GITHUB_TOKEN',
    'MAILGUN_API_KEY',
    'POSTMARK_SERVER_TOKEN',
    'RESEND_API_KEY',
    'SENDGRID_API_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'WORKER_DROPLET_ID',
    'WORKER_IP',
    'WORKER_SSH_PRIVATE_KEY',
  ]
  for (const name of names) env[name] = ''
}

function safeApiEnvironment({ databaseUrl, redisPort, apiPort }) {
  const env = {
    ...process.env,
    DATABASE_URL: databaseUrl,
    DIRECT_URL: databaseUrl,
    TEST_DATABASE_URL: databaseUrl,
    REDIS_URL: `redis://127.0.0.1:${redisPort}`,
    REDIS_TLS_URL: '',
    HOST: '127.0.0.1',
    PORT: String(apiPort),
    NODE_ENV: 'test',
    DB_UPDATE_SCHEMA_REFRESH: 'true',
    ENABLE_ATTENDANCE_NOTIFICATIONS: 'false',
    ENABLE_RENEWAL_NOTIFICATIONS: 'false',
    JWT_SECRET: 'db-update-local-schema-refresh-only-000000000000000000000000',
    SECRET_ENCRYPTION_KEY: '0000000000000000000000000000000000000000000000000000000000000000',
    PREVIEW_WAKE_SECRET: 'db-update-local-schema-refresh-only',
    SMTP_HOST: '127.0.0.1',
  }
  scrubExternalCredentials(env)
  return env
}

function collectOutput(child) {
  let output = ''
  const append = chunk => {
    output = (output + chunk.toString()).slice(-64_000)
  }
  child.stdout.on('data', append)
  child.stderr.on('data', append)
  return () => output
}

async function stopChild(child) {
  if (child.exitCode !== null || child.signalCode !== null) return
  const exited = once(child, 'exit')
  try {
    process.kill(process.platform === 'win32' ? child.pid : -child.pid, 'SIGTERM')
  } catch {
    return
  }
  const stopped = await Promise.race([exited.then(() => true), delay(5_000).then(() => false)])
  if (stopped) return
  try {
    process.kill(process.platform === 'win32' ? child.pid : -child.pid, 'SIGKILL')
  } catch {
    // The process exited between the timeout and the signal.
  }
}

async function refreshWithIsolatedApi() {
  const services = ['postgres', 'redis']
  const previouslyRunning = new Map(
    services.map(service => [service, Boolean(runningServiceContainer(service))]),
  )
  const startedServices = services.filter(service => !previouslyRunning.get(service))
  let postgresContainer
  let databaseName
  let apiChild

  try {
    run('docker', composeArgs('up', '-d', ...services))
    postgresContainer = runningServiceContainer('postgres')
    const redisContainer = runningServiceContainer('redis')
    if (!postgresContainer || !redisContainer) {
      throw new Error('Docker Compose did not start all disposable schema-refresh dependencies.')
    }

    await waitForPostgres(postgresContainer)
    const postgresPort = publishedPort(postgresContainer, 5432)
    const redisPort = publishedPort(redisContainer, 6379)
    databaseName = `db_update_${process.pid}_${Date.now()}`
    run('docker', ['exec', postgresContainer, 'createdb', '-U', 'prisma', databaseName])
    spawnSync(
      'docker',
      [
        'exec',
        postgresContainer,
        'psql',
        '-U',
        'prisma',
        '-d',
        databaseName,
        '-c',
        'CREATE EXTENSION IF NOT EXISTS vector',
      ],
      { stdio: 'ignore' },
    )

    const databaseUrl = `postgresql://prisma:prisma@127.0.0.1:${postgresPort}/${databaseName}`
    const apiPort = await reservePort()
    const env = safeApiEnvironment({ databaseUrl, redisPort, apiPort })

    console.log('Preparing a disposable local database for schema generation.')
    run('pnpm', ['exec', 'prisma', 'db', 'push'], { env })
    run('pnpm', ['nx', 'build', 'api', '--configuration=development'], {
      env: { ...env, NX_DAEMON: 'false' },
    })

    const schemaBeforeBoot = await fileStamp(schemaFile)
    apiChild = spawn(process.execPath, [apiEntryFile], {
      cwd: root,
      env,
      detached: process.platform !== 'win32',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    const getOutput = collectOutput(apiChild)
    const exitPromise = once(apiChild, 'exit').then(([code, signal]) => ({ code, signal }))
    const schemaPromise = waitForFileChange(
      schemaFile,
      schemaBeforeBoot,
      schemaRefreshTimeoutMs,
    ).then(() => ({ refreshed: true }))
    const outcome = await Promise.race([exitPromise, schemaPromise])
    if (!('refreshed' in outcome)) {
      throw new Error(
        `The isolated API exited before regenerating api-schema.graphql ` +
          `(code ${outcome.code}, signal ${outcome.signal ?? 'none'}).\n${getOutput()}`,
      )
    }
    console.log('api-schema.graphql was regenerated by the isolated API.')
  } finally {
    if (apiChild) await stopChild(apiChild)
    if (postgresContainer && databaseName) {
      spawnSync(
        'docker',
        [
          'exec',
          postgresContainer,
          'dropdb',
          '-U',
          'prisma',
          '--if-exists',
          '--force',
          databaseName,
        ],
        { stdio: 'ignore' },
      )
    }
    if (startedServices.length > 0) {
      spawnSync('docker', composeArgs('stop', ...startedServices), { stdio: 'inherit' })
    }
  }
}

async function newestGraphqlSourceMtime() {
  let newest = (await fileStamp(schemaFile))?.modified ?? 0
  const visit = async directory => {
    let entries
    try {
      entries = await readdir(directory, { withFileTypes: true })
    } catch (error) {
      if (error.code === 'ENOENT') return
      throw error
    }
    for (const entry of entries) {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) {
        await visit(path)
      } else if (entry.isFile() && entry.name.endsWith('.graphql')) {
        newest = Math.max(newest, (await stat(path)).mtimeMs)
      }
    }
  }
  for (const directory of sdkSourceDirectories) await visit(directory)
  return newest
}

async function waitForSdkWatcher(watcher) {
  console.log(`Waiting for the active SDK watcher (PID ${watcher.pid}).`)
  const sourceMtime = await newestGraphqlSourceMtime()
  const deadline = Date.now() + sdkWatchTimeoutMs
  while (Date.now() < deadline) {
    const output = await fileStamp(sdkOutputFile)
    if (output && output.modified >= sourceMtime) {
      await delay(1_000)
      const stable = await fileStamp(sdkOutputFile)
      if (stable?.modified === output.modified) return
    }
    await delay(500)
  }
  throw new Error(
    `The SDK watcher (PID ${watcher.pid}) did not refresh generated/graphql.ts. ` +
      'Stop or repair that watcher, then rerun pnpm db-update; no competing SDK writer was started.',
  )
}

async function main() {
  await acquireLock()
  const schemaBeforeGeneration = await fileStamp(schemaFile)
  try {
    console.log('Running Prisma and Nestled generators.')
    run('pnpm', generatedCommand)

    const apiWatcher = await findWorkspaceProcess(isApiWatcher)
    if (apiWatcher) {
      await refreshWithApiWatcher(apiWatcher, schemaBeforeGeneration)
    } else {
      console.log('No API watcher found; starting an isolated one-shot schema refresh.')
      await refreshWithIsolatedApi()
    }

    const sdkWatcher = await findWorkspaceProcess(isSdkWatcher)
    if (sdkWatcher) {
      await waitForSdkWatcher(sdkWatcher)
    } else {
      console.log('No SDK watcher found; running one-shot SDK generation.')
      run('pnpm', ['sdk'])
    }
    console.log('db-update complete: generators, API schema, and typed SDK are in sync.')
  } finally {
    await unlink(lockFile).catch(error => {
      if (error.code !== 'ENOENT') throw error
    })
  }
}

await main()
