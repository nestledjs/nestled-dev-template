import ts from 'typescript'

export type AuthOperationKind = 'graphql' | 'http'

export type AuthOperation = {
  classDecorators: string
  className: string
  decorators: string
  kind: AuthOperationKind
  line: number
  name: string
}

const graphqlOperationDecorators = new Set(['Mutation', 'Query', 'ResolveField', 'Subscription'])

const httpOperationDecorators = new Set([
  'All',
  'Delete',
  'Get',
  'Head',
  'Options',
  'Patch',
  'Post',
  'Put',
  'Sse',
])

const authLevelDecorator = /@(?:Public|Authenticated|AdminOnly)\s*\(\s*\)/
const nonAuthGuardPattern = /Throttler|RateLimit/

const getDecorators = (node: ts.Node): readonly ts.Decorator[] =>
  ts.canHaveDecorators(node) ? (ts.getDecorators(node) ?? []) : []

const getDecoratorName = (decorator: ts.Decorator): string => {
  const expression = ts.isCallExpression(decorator.expression)
    ? decorator.expression.expression
    : decorator.expression

  if (ts.isIdentifier(expression)) return expression.text
  if (ts.isPropertyAccessExpression(expression)) return expression.name.text
  return ''
}

const getDecoratorSource = (
  decorators: readonly ts.Decorator[],
  sourceFile: ts.SourceFile,
): string => decorators.map(decorator => decorator.getText(sourceFile)).join('\n')

const getClassKind = (decoratorNames: Set<string>): AuthOperationKind | undefined => {
  if (decoratorNames.has('Controller')) return 'http'
  if (decoratorNames.has('Resolver')) return 'graphql'
  return undefined
}

const isOperationDecorator = (name: string, kind: AuthOperationKind): boolean =>
  kind === 'http' ? httpOperationDecorators.has(name) : graphqlOperationDecorators.has(name)

const getMethodName = (method: ts.MethodDeclaration, sourceFile: ts.SourceFile): string => {
  if (ts.isIdentifier(method.name) || ts.isStringLiteral(method.name)) return method.name.text
  return method.name.getText(sourceFile)
}

const getGuardNames = (source: string): string[] => {
  const guards = new Set<string>()

  for (const useGuards of source.matchAll(/@UseGuards\s*\(([^)]*)\)/g)) {
    for (const guard of useGuards[1].matchAll(/\b[A-Z]\w*Guard\b/g)) {
      guards.add(guard[0])
    }
  }

  return [...guards].sort((left, right) => left.localeCompare(right))
}

export const getOperationGuardNames = (operation: AuthOperation): string[] =>
  [
    ...new Set([
      ...getGuardNames(operation.classDecorators),
      ...getGuardNames(operation.decorators),
    ]),
  ].sort((left, right) => left.localeCompare(right))

export const hasAuthenticationGuard = (operation: AuthOperation): boolean =>
  getOperationGuardNames(operation).some(guard => !nonAuthGuardPattern.test(guard))

export const declaresAuthLevel = (operation: AuthOperation): boolean =>
  authLevelDecorator.test(operation.decorators) ||
  authLevelDecorator.test(operation.classDecorators)

export const getAuthOperations = (source: string, fileName = 'source.ts'): AuthOperation[] => {
  const sourceFile = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  const operations: AuthOperation[] = []

  for (const statement of sourceFile.statements) {
    if (!ts.isClassDeclaration(statement)) continue

    const classDecorators = getDecorators(statement)
    const classDecoratorNames = new Set(classDecorators.map(getDecoratorName))
    const kind = getClassKind(classDecoratorNames)
    if (!kind) continue

    const className = statement.name?.text ?? '(anonymous class)'
    const classDecoratorSource = getDecoratorSource(classDecorators, sourceFile)

    for (const member of statement.members) {
      if (!ts.isMethodDeclaration(member)) continue

      const methodDecorators = getDecorators(member)
      if (
        !methodDecorators.some(decorator => isOperationDecorator(getDecoratorName(decorator), kind))
      ) {
        continue
      }

      const line =
        sourceFile.getLineAndCharacterOfPosition(member.name.getStart(sourceFile)).line + 1
      operations.push({
        classDecorators: classDecoratorSource,
        className,
        decorators: getDecoratorSource(methodDecorators, sourceFile),
        kind,
        line,
        name: getMethodName(member, sourceFile),
      })
    }
  }

  return operations
}
