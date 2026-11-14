import { CombinedGraphQLErrors } from '@apollo/client'
import { ORGANIZATION_CONTEXT_REQUIRED_CODE } from '@nestled-template/shared/apollo'
import { Link } from 'react-router'

type ErrorWithGraphQLErrors = {
  graphQLErrors?: Array<{ extensions?: { code?: unknown } }>
}

/**
 * Whether the API refused the request because it has no active organization (a 403
 * `ORGANIZATION_CONTEXT_REQUIRED`): the user is signed in, so this is never a logout.
 */
export function isOrganizationContextRequired(error: unknown): boolean {
  const errors = CombinedGraphQLErrors.is(error)
    ? error.errors
    : (error as ErrorWithGraphQLErrors | null)?.graphQLErrors
  return !!errors?.some?.(e => e?.extensions?.code === ORGANIZATION_CONTEXT_REQUIRED_CODE)
}

/**
 * Shown when a page needs an organization and the account has none selected, or is no longer a
 * member of the one it had. The session is kept. The template has no organization picker yet, so
 * this explains the state and offers a way back.
 */
export function OrganizationRequired() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-6 text-zinc-900 dark:bg-zinc-950 dark:text-white">
      <section className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-xl dark:border-white/10 dark:bg-zinc-900">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
          No organization selected
        </p>
        <h1 className="mt-3 text-3xl font-bold">This page needs an organization</h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-300">
          You are still signed in, but your account has no active organization, or you are no longer
          a member of the one you were using. Ask an organization owner to invite you, or contact an
          administrator.
        </p>
        <Link
          to="/members/dashboard"
          className="mt-6 inline-flex rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-zinc-950 transition hover:bg-emerald-400"
        >
          Return to dashboard
        </Link>
      </section>
    </main>
  )
}
