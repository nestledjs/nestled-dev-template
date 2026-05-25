import { useState } from 'react'
import { ClipboardIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { CheckIcon } from '@heroicons/react/24/solid'

export const apiBase = (
  (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3000'
)
  .replace(/\/graphql\/?$/, '')
  .replace(/\/api\/?$/, '')
  .replace(/\/$/, '')

export const MCP_SERVER_URL = `${apiBase}/api/mcp`

export function buildClaudeConfig(token: string): string {
  return JSON.stringify(
    {
      mcpServers: {
        nestled: {
          type: 'http',
          url: MCP_SERVER_URL,
          headers: { Authorization: `Bearer ${token}` },
        },
      },
    },
    null,
    2,
  )
}

export function formatDate(value?: string | null): string | null {
  if (!value) return null
  return new Date(value).toLocaleDateString()
}

interface TokenMetaData {
  createdAt?: string | null
  lastUsedAt?: string | null
  expiresAt?: string | null
}

export function TokenMeta({ token }: Readonly<{ token: TokenMetaData }>) {
  const createdAt = formatDate(token.createdAt)
  const lastUsedAt = formatDate(token.lastUsedAt)
  const expiresAt = formatDate(token.expiresAt)

  return (
    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
      {createdAt ? `Created ${createdAt}` : 'Created date unavailable'}
      {lastUsedAt && <span className="ml-3">Last used {lastUsedAt}</span>}
      {expiresAt && <span className="ml-3">Expires {expiresAt}</span>}
    </p>
  )
}

export function NewTokenDisplay({
  token,
  name,
  onDismiss,
  tokenLabel = 'Your Token',
  verb = 'Generated',
}: Readonly<{
  token: string
  name: string
  onDismiss: () => void
  tokenLabel?: string
  verb?: string
}>) {
  const [copiedToken, setCopiedToken] = useState(false)
  const [copiedConfig, setCopiedConfig] = useState(false)
  const config = buildClaudeConfig(token)

  async function copyToken() {
    await navigator.clipboard.writeText(token)
    setCopiedToken(true)
    setTimeout(() => setCopiedToken(false), 2000)
  }

  async function copyConfig() {
    await navigator.clipboard.writeText(config)
    setCopiedConfig(true)
    setTimeout(() => setCopiedConfig(false), 2000)
  }

  return (
    <div className="mb-6 rounded-xl border border-emerald-400 bg-white p-6 dark:border-emerald-600 dark:bg-white/5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Token {verb}: {name}
          </h2>
          <p className="mt-1 text-sm font-medium text-amber-600 dark:text-amber-400">
            Copy this token now. It will not be shown again.
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-white/10 dark:hover:text-zinc-200"
          aria-label="Dismiss generated token"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">{tokenLabel}</p>
        <div className="flex gap-2">
          <code className="min-w-0 flex-1 break-all rounded-lg border border-zinc-200 bg-zinc-100 p-3 font-mono text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
            {token}
          </code>
          <button
            type="button"
            onClick={copyToken}
            className="rounded-lg bg-zinc-200 p-3 transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600"
            title="Copy token"
          >
            {copiedToken ? (
              <CheckIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <ClipboardIcon className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            )}
          </button>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Claude Desktop Configuration
        </p>
        <div className="relative">
          <pre className="overflow-x-auto whitespace-pre rounded-lg bg-zinc-900 p-4 text-xs text-emerald-300">
            {config}
          </pre>
          <button
            type="button"
            onClick={copyConfig}
            className="absolute right-2 top-2 rounded-lg bg-zinc-700 p-2 text-white transition-colors hover:bg-zinc-600"
            title="Copy Claude Desktop configuration"
          >
            {copiedConfig ? (
              <CheckIcon className="h-4 w-4 text-emerald-300" />
            ) : (
              <ClipboardIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
