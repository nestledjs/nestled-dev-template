import { AdminDataErrorBoundary, AdminDataListPage } from '@nestled-template/data-browser'

export default function DataListRoute() {
  return <AdminDataListPage />
}

export function ErrorBoundary({ error }: Readonly<{ error: Error }>) {
  return <AdminDataErrorBoundary error={error} />
}
