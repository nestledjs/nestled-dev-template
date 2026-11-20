// Lists the mutation call sites that read a refusal from the mutation's result (`result.error`,
// `result.errors`, `const { error } = await mutate(...)`) while setting no `errorPolicy` of their
// own.
//
// Under the web client's mutation default, `errorPolicy: 'none'` (libs/shared/apollo makeClient), a
// refused mutation rejects: the promise never resolves with an `error`, so such a read never sees
// the refusal. Where the call sits in a `try` with a `catch` (or has a `.catch`), the catch sees
// it and the read is only dead code. Where it does not, the refusal is an unhandled rejection: no
// message, and whatever the error branch did (stay on the form, show the API message) never runs.
// Those are the sites to fix: move the handling into a catch.
//
//   node scripts/audit-mutation-error-reads.mjs [dir...]          list the sites (default: apps libs)
//   node scripts/audit-mutation-error-reads.mjs --json [dir...]   the same, as JSON
//
// It exits 1 when a site reads the result with nothing to catch the rejection, 0 otherwise.
//
// What counts as a mutation call site: `useMutation(document, options)`, a generated
// `useXxxMutation(options)` hook, and `client.mutate(options)` / `apollo.mutate(options)`. A site
// whose options are not an object literal (a variable, or an object that spreads another) may set
// `errorPolicy` where this cannot see; it is listed as "check by hand" and never fails the run.
// Reads are found within the function that calls the executor. A wrapper hook (a `run()` that
// awaits the executor and returns the result to its callers) is listed where it reads the result,
// not at each caller: audit the wrapper's callers for how they use what it returns.

import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const workspaceRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const ERROR_FIELDS = new Set(['error', 'errors'])
// A helper handed the whole result is taken to read its error when its name says so.
const ERROR_HELPER = /error|fail|refus/i
const SKIPPED_PATH =
  /(^|\/)(node_modules|generated|__generated__)\/|\.(spec|test|stories)\.[cm]?tsx?$|\.d\.ts$/

/** `errorPolicy` in an options argument: 'set', 'unset', or 'unknown' (not a plain literal). */
function errorPolicyIn(options) {
  if (!options) return 'unset'
  if (!ts.isObjectLiteralExpression(options)) return 'unknown'
  let spread = false
  for (const property of options.properties) {
    if (ts.isSpreadAssignment(property)) spread = true
    else if (property.name && property.name.getText() === 'errorPolicy') return 'set'
  }
  return spread ? 'unknown' : 'unset'
}

function calleeName(call) {
  const callee = call.expression
  if (ts.isIdentifier(callee)) return callee.text
  if (ts.isPropertyAccessExpression(callee)) return callee.name.text
  return null
}

/** The mutation hook or direct `.mutate` call `call` is, with its options, or null. */
function mutationSite(call) {
  const name = calleeName(call)
  if (name === 'useMutation') return { kind: 'hook', options: call.arguments[1] }
  if (name && /^use[A-Z]\w*Mutation$/.test(name))
    return { kind: 'hook', options: call.arguments[0] }
  if (name === 'mutate' && ts.isPropertyAccessExpression(call.expression)) {
    return { kind: 'direct', options: call.arguments[0] }
  }
  return null
}

function enclosingFunction(node) {
  let current = node.parent
  while (current && !ts.isFunctionLike(current) && !ts.isSourceFile(current))
    current = current.parent
  return current
}

/** Whether a rejection of `node` reaches a catch: a `try` with a `catch` around it, or a `.catch`. */
function isCaught(node) {
  let child = node
  let current = node.parent
  while (current && !ts.isFunctionLike(current) && !ts.isSourceFile(current)) {
    if (ts.isTryStatement(current) && current.catchClause && current.tryBlock === child) return true
    if (
      ts.isPropertyAccessExpression(current) &&
      current.expression === child &&
      current.name.text === 'catch'
    ) {
      return true
    }
    child = current
    current = current.parent
  }
  return false
}

function bindsErrorField(pattern) {
  return (
    ts.isObjectBindingPattern(pattern) &&
    pattern.elements.some(element =>
      ERROR_FIELDS.has((element.propertyName ?? element.name).getText()),
    )
  )
}

/**
 * How `scope` reads a refusal off the variable `name`: `.error` / `.errors`, or by handing the whole
 * result to a helper named for errors (`mutationErrorMessage(result)`), which reads it there. Null
 * when it does not.
 */
function errorReadOf(scope, name) {
  let found = null
  const visit = node => {
    if (found) return
    if (
      ts.isPropertyAccessExpression(node) &&
      ERROR_FIELDS.has(node.name.text) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === name
    ) {
      found = `reads ${name}.${node.name.text}`
      return
    }
    if (
      ts.isCallExpression(node) &&
      ERROR_HELPER.test(node.expression.getText()) &&
      node.arguments.some(argument => ts.isIdentifier(argument) && argument.text === name)
    ) {
      found = `passes ${name} to ${node.expression.getText()}()`
      return
    }
    ts.forEachChild(node, visit)
  }
  visit(scope)
  return found
}

function unwrap(node) {
  let current = node
  while (current.parent && ts.isParenthesizedExpression(current.parent)) current = current.parent
  return current
}

/** How the result of the executor call `call` is read for a refusal, or null when it is not. */
function errorRead(call) {
  let result = unwrap(call)
  if (result.parent && ts.isAwaitExpression(result.parent)) result = unwrap(result.parent)
  const parent = result.parent
  if (!parent) return null

  if (ts.isPropertyAccessExpression(parent) && parent.expression === result) {
    if (ERROR_FIELDS.has(parent.name.text)) return `reads .${parent.name.text}`
    if (parent.name.text === 'then') {
      const callback = parent.parent?.arguments?.[0]
      const param = callback && ts.isFunctionLike(callback) ? callback.parameters?.[0] : undefined
      if (param && bindsErrorField(param.name)) return 'destructures error in .then'
      const read = param && ts.isIdentifier(param.name) && errorReadOf(callback, param.name.text)
      if (read) return `${read} in .then`
    }
    return null
  }
  if (ts.isVariableDeclaration(parent) && parent.initializer === result) {
    if (bindsErrorField(parent.name)) return 'destructures error'
    return ts.isIdentifier(parent.name)
      ? errorReadOf(enclosingFunction(parent), parent.name.text)
      : null
  }
  if (
    ts.isBinaryExpression(parent) &&
    parent.right === result &&
    parent.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
    ts.isIdentifier(parent.left)
  ) {
    return errorReadOf(enclosingFunction(parent), parent.left.text)
  }
  return null
}

/** The executor names a hook call is destructured into (`const [run] = useMutation(...)`). */
function executorName(hookCall) {
  const declaration = unwrap(hookCall).parent
  if (!declaration || !ts.isVariableDeclaration(declaration)) return null
  if (!ts.isArrayBindingPattern(declaration.name)) return null
  const first = declaration.name.elements[0]
  return first && ts.isBindingElement(first) && ts.isIdentifier(first.name) ? first.name.text : null
}

/** The functions declared in `source` by name (`function f() {}`, `const f = () => {}`). */
function functionsByName(source) {
  const functions = new Map()
  const visit = node => {
    if (ts.isFunctionDeclaration(node) && node.name) functions.set(node.name.text, node)
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))
    ) {
      functions.set(node.name.text, node.initializer)
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  return functions
}

/**
 * The calls of the executor `name` in `scope`, following it one level into a helper of the same
 * file it is handed to (`runUpdate(updateMutation, ...)`, called there as its parameter).
 */
function callsTo(scope, name, functions, followed = new Set()) {
  const calls = []
  const visit = node => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      if (node.expression.text === name) calls.push(node)
      const helper = functions.get(node.expression.text)
      const index = node.arguments.findIndex(
        argument => ts.isIdentifier(argument) && argument.text === name,
      )
      const param = helper && index >= 0 ? helper.parameters[index] : undefined
      if (param && ts.isIdentifier(param.name) && !followed.has(helper)) {
        followed.add(helper)
        calls.push(...callsTo(helper, param.name.text, functions, followed))
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(scope)
  return calls
}

/** The findings in one source text. */
export function auditSource(fileName, text) {
  const kind = fileName.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  const source = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true, kind)
  const findings = []
  const functions = functionsByName(source)
  const line = node => source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1

  const report = (site, executorCall, read, policy) => {
    findings.push({
      file: fileName,
      line: line(executorCall),
      siteLine: line(site),
      read,
      verdict:
        policy === 'unknown' ? 'check-by-hand' : isCaught(executorCall) ? 'dead-read' : 'uncaught',
    })
  }

  const visit = node => {
    if (ts.isCallExpression(node)) {
      const site = mutationSite(node)
      const policy = site && errorPolicyIn(site.options)
      if (site && policy !== 'set') {
        if (site.kind === 'direct') {
          const read = errorRead(node)
          if (read) report(node, node, read, policy)
        } else {
          const name = executorName(node)
          const scope = name && enclosingFunction(node)
          for (const call of scope ? callsTo(scope, name, functions) : []) {
            const read = errorRead(call)
            if (read) report(node, call, read, policy)
          }
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  return findings
}

/** The tracked TypeScript files under `dirs` that can hold application mutation sites. */
export function sourceFiles(root, dirs) {
  return execFileSync('git', ['ls-files', '--', ...dirs], { cwd: root, encoding: 'utf8' })
    .split('\n')
    .filter(path => /\.tsx?$/.test(path) && !SKIPPED_PATH.test(path))
}

export function auditFiles(root, dirs) {
  return sourceFiles(root, dirs).flatMap(path =>
    auditSource(path, readFileSync(join(root, path), 'utf8')),
  )
}

const VERDICTS = {
  uncaught:
    'nothing catches the rejection: a refusal is lost (unhandled), and the error branch never runs. Move the handling into a catch.',
  'dead-read':
    'a catch sees the refusal; the result read is dead code. Optional: drop it, keep the catch.',
  'check-by-hand':
    'the options are not a plain object literal, so errorPolicy may be set elsewhere. Check it.',
}

export function formatFindings(findings) {
  if (findings.length === 0) return 'No mutation site reads a refusal from its result.\n'
  const lines = []
  for (const verdict of Object.keys(VERDICTS)) {
    const group = findings.filter(finding => finding.verdict === verdict)
    if (group.length === 0) continue
    lines.push(`${verdict} (${group.length}): ${VERDICTS[verdict]}`)
    for (const finding of group) {
      const site =
        finding.siteLine === finding.line ? '' : ` (mutation set up at line ${finding.siteLine})`
      lines.push(`  ${finding.file}:${finding.line}  ${finding.read}${site}`)
    }
    lines.push('')
  }
  return `${lines.join('\n')}\n`
}

export function main(argv, root = workspaceRoot) {
  const json = argv.includes('--json')
  const dirs = argv.filter(arg => !arg.startsWith('--'))
  const findings = auditFiles(root, dirs.length > 0 ? dirs : ['apps', 'libs'])
  process.stdout.write(json ? `${JSON.stringify(findings, null, 2)}\n` : formatFindings(findings))
  return findings.some(finding => finding.verdict === 'uncaught') ? 1 : 0
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = main(process.argv.slice(2))
}
