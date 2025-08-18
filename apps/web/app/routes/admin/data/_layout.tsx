import { DATABASE_MODELS } from '@nestled-template/shared/sdk'
import { getPluralName } from '@nestledjs/helpers'
import { Link, Outlet } from 'react-router' // Helper to convert PascalCase or camelCase to spaced words

// Helper to convert PascalCase or camelCase to spaced words
function spacedWords(name: string) {
  return name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
}

// Helper to convert PascalCase or camelCase to kebab-case
function kebabCase(name: string) {
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

export default function AdminDataLayout() {
  // Sort models alphabetically by plural display name
  const sortedModels = [...DATABASE_MODELS].sort((a, b) =>
    getPluralName(spacedWords(a.name)).localeCompare(getPluralName(spacedWords(b.name))),
  )

  return (
    <div className={'flex h-full overflow-hidden'}>
      <nav className="h-full min-w-52 w-52 flex-shrink-0 bg-green-web-50 p-6 border-r-1 overflow-auto">
        <h2 style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Models</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {sortedModels.map(model => (
            <li key={model.name} style={{ marginBottom: 12 }}>
              <Link to={`/admin/data/${kebabCase(getPluralName(model.name))}`}>
                {getPluralName(spacedWords(model.name))}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className={'h-full mx-auto w-full overflow-auto p-12'}>
        <Outlet />
      </main>
    </div>
  )
}
