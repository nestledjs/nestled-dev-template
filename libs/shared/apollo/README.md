# apollo

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build apollo` to build the library.

## Running unit tests

Run `nx test apollo` to execute the unit tests via [Vitest](https://vitest.dev/).

## Default error policies

`makeClient` sets `defaultOptions.query.errorPolicy: 'all'` and `defaultOptions.mutate.errorPolicy:
'none'`: a query resolves with its GraphQL error beside `data`, and a refused mutation rejects.
From Apollo Client 4.2, every default `errorPolicy` must also be declared to TypeScript, because
the result types of `client.query`, `client.mutate` and the hooks depend on it; an undeclared one
fails to type-check with TS2322 ("A default option for mutate.errorPolicy must be declared in
ApolloClient.DeclareDefaultOptions before usage"). `apollo.ts` declares both:

```ts
declare module '@apollo/client' {
  export namespace ApolloClient {
    export namespace DeclareDefaultOptions {
      interface Query {
        errorPolicy: 'all'
      }
      interface Mutate {
        errorPolicy: 'none'
      }
    }
  }
}
```

Change a default and its declaration together. On Apollo Client 4.1 the declaration is not read yet
and is harmless. See
[declaring default options for type safety](https://www.apollographql.com/docs/react/data/typescript#declaring-default-options-for-type-safety).

To find mutation call sites that still read a refusal from the result (`result.error`), which a
mutation under the `'none'` default never resolves with, run
`node scripts/audit-mutation-error-reads.mjs`.
