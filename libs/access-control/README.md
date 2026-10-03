# @nestledjs/access-control

A transport-agnostic React console for administering platform roles, permission catalogs, and
direct role assignments. It deliberately does not know about GraphQL, Prisma, or generated CRUD;
the host application supplies an adapter whose mutations enforce its authorization invariants.

Organization/member-facing permission management does not belong in this package. That workflow is
product UI and remains in the application template so teams can adapt it to their ownership, seat,
invitation, and delegation model.

## Usage

```tsx
import { PlatformAccessControl } from '@nestledjs/access-control'

export function AccessControlPage() {
  return <PlatformAccessControl adapter={platformAccessControlAdapter} theme="system" />
}
```

The package entry loads its styles automatically. The `./styles.css` export remains available for
tools that need to inspect or preload the stylesheet, but application code should not need a
separate side-effect import.

The `PlatformAccessControlAdapter` interface contains purpose-built operations for loading the
catalog, searching principals, editing roles, and changing assignments. Do not implement it with a
generic CRUD client: role changes need grant ceilings, immutable system-role checks, auditing, and
transactional updates on the server.

## Themes

`theme` accepts `light`, `dark`, or `system`. System mode follows the operating-system preference
and also recognizes a `.dark` ancestor, so it integrates with class-based application themes. All
colors are semantic CSS custom properties scoped beneath `.nac-root`; hosts may override those
variables without replacing component markup.

## Running unit tests

Run `nx test access-control` to execute the unit tests via [Vitest](https://vitest.dev/).
