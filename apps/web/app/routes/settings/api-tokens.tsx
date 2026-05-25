import { useCallback, useState } from 'react'
import type { FormEvent } from 'react'
import { useLoaderData } from 'react-router'
import { KeyIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { apolloLoader } from '@nestled-template/shared/apollo'
import {
  GenerateApiToken,
  ListApiTokens,
  RevokeApiToken,
  type GenerateApiTokenMutation,
  type GenerateApiTokenMutationVariables,
  type ListApiTokensQuery,
  type RevokeApiTokenMutation,
  type RevokeApiTokenMutationVariables,
} from '@nestled-template/shared/sdk'
import { useMutation, useReadQuery, type QueryRef } from '@apollo/client/react'
import { MCP_SERVER_URL, NewTokenDisplay, TokenMeta, formatDate } from './_mcp-shared'

const AVAILABLE_TOOLS = [
  { name: 'get_profile', description: 'Read the authenticated user profile' },
  { name: 'list_organizations', description: 'List organizations you belong to' },
]

export const loader = apolloLoader()(({ preloadQuery }) => {
  const tokensQueryRef = preloadQuery<ListApiTokensQuery>(ListApiTokens)
  return { tokensQueryRef }
})

type ApiTokenListItem = ListApiTokensQuery['listApiTokens'][number]

function CreateTokenModal({
  isOpen,
  onClose,
  onSubmit,
  generating,
  error,
}: Readonly<{
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string) => void
  generating: boolean
  error: string | null
}>) {
  const [name, setName] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setName('')
  }

  function handleClose() {
    setName('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-zinc-900">
        <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-white">
          Create API Token
        </h3>
        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          This token authenticates as your personal user account.
        </p>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
              {error}
            </div>
          )}
          <label
            htmlFor="api-token-name"
            className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Token Name
          </label>
          <input
            id="api-token-name"
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
            placeholder="MacBook Pro CLI"
            required
            autoFocus
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:ring-2 focus:ring-emerald-500 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
          />
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={generating || !name.trim()}
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:bg-emerald-300"
            >
              {generating ? 'Creating...' : 'Create Token'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={generating}
              className="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ApiTokensSettings() {
  const loaderData = useLoaderData() as {
    tokensQueryRef: QueryRef<ListApiTokensQuery>
  }
  const { data } = useReadQuery(loaderData.tokensQueryRef)
  const tokens = data?.listApiTokens || []

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newToken, setNewToken] = useState<{ token: string; name: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [generateApiToken, { loading: generating }] = useMutation<
    GenerateApiTokenMutation,
    GenerateApiTokenMutationVariables
  >(GenerateApiToken)
  const [revokeApiToken] = useMutation<RevokeApiTokenMutation, RevokeApiTokenMutationVariables>(
    RevokeApiToken,
  )

  const personalTokens = tokens.filter(token => !token.organizationId)
  const activeTokens = personalTokens.filter(token => !token.revoked)
  const revokedTokens = personalTokens.filter(token => token.revoked)

  const handleGenerate = useCallback(
    async (name: string) => {
      setError(null)
      try {
        const result = await generateApiToken({
          variables: { input: { name } },
          refetchQueries: [{ query: ListApiTokens }],
        })

        if (result.data?.generateApiToken.token) {
          setNewToken({ token: result.data.generateApiToken.token, name })
          setIsModalOpen(false)
        }
      } catch (err) {
        setError((err as Error)?.message ?? 'Failed to create token')
      }
    },
    [generateApiToken],
  )

  const handleRevoke = useCallback(
    async (tokenId: string, name: string) => {
      if (
        !globalThis.confirm(
          `Revoke "${name}"? Any clients using this token will immediately lose access.`,
        )
      ) {
        return
      }

      try {
        await revokeApiToken({
          variables: { tokenId },
          refetchQueries: [{ query: ListApiTokens }],
        })
      } catch (err) {
        alert((err as Error)?.message ?? 'Failed to revoke token')
      }
    },
    [revokeApiToken],
  )

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base/7 font-semibold text-zinc-950 dark:text-white">API Tokens</h2>
          <p className="mt-1 max-w-2xl text-sm/6 text-zinc-600 dark:text-zinc-400">
            Personal tokens authenticate as your user account for API and MCP access.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setError(null)
            setIsModalOpen(true)
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          <PlusIcon className="h-4 w-4" />
          Create Token
        </button>
      </div>

      {newToken && (
        <NewTokenDisplay
          token={newToken.token}
          name={newToken.name}
          onDismiss={() => setNewToken(null)}
          tokenLabel="Your API Token"
          verb="Created"
        />
      )}

      <div className="mb-6 rounded-xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5">
        <div className="border-b border-zinc-200 p-4 dark:border-white/10">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Active Tokens</h3>
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-white/10">
          {activeTokens.length === 0 ? (
            <div className="p-8 text-center">
              <KeyIcon className="mx-auto mb-3 h-10 w-10 text-zinc-400" />
              <p className="text-sm text-zinc-600 dark:text-zinc-400">No active personal API tokens.</p>
            </div>
          ) : (
            activeTokens.map(token => (
              <div key={token.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                    {token.name}
                  </p>
                  <TokenMeta token={token} />
                </div>
                <button
                  type="button"
                  onClick={() => handleRevoke(token.id, token.name)}
                  className="rounded-lg p-2 text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                  title="Revoke token"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {revokedTokens.length > 0 && (
        <details className="mb-6 border-t border-zinc-950/5 pt-4 dark:border-white/10">
          <summary className="cursor-pointer text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200">
            Revoked Tokens ({revokedTokens.length})
          </summary>
          <div className="mt-3 space-y-2">
            {revokedTokens.map(token => (
              <div
                key={token.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200/70 bg-zinc-100/60 p-4 opacity-70 dark:border-white/10 dark:bg-white/5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-700 line-through dark:text-zinc-300">
                    {token.name}
                  </p>
                  <TokenMeta token={token} />
                </div>
                <span className="text-xs font-medium text-rose-600 dark:text-rose-400">
                  Revoked
                </span>
              </div>
            ))}
          </div>
        </details>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <h3 className="mb-3 text-base font-semibold text-zinc-900 dark:text-white">
            Claude Desktop Template
          </h3>
          <pre className="overflow-x-auto whitespace-pre rounded-lg bg-zinc-900 p-4 text-xs text-emerald-300">
            {JSON.stringify(
              {
                mcpServers: {
                  nestled: {
                    type: 'http',
                    url: MCP_SERVER_URL,
                    headers: { Authorization: 'Bearer YOUR_TOKEN' },
                  },
                },
              },
              null,
              2,
            )}
          </pre>
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
            MCP server URL:{' '}
            <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">{MCP_SERVER_URL}</code>
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-white">
            Available Tools
          </h3>
          <div className="space-y-3">
            {AVAILABLE_TOOLS.map(tool => (
              <div key={tool.name} className="flex gap-3">
                <code className="self-start whitespace-nowrap rounded bg-emerald-50 px-2 py-1 font-mono text-xs text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                  {tool.name}
                </code>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">{tool.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CreateTokenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleGenerate}
        generating={generating}
        error={error}
      />
    </section>
  )
}
