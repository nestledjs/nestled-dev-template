import { AdminDataCreateErrorBoundary, AdminDataCreatePage } from '@nestled-template/admin-data'

export default function CreateDataRoute() {
  return <AdminDataCreatePage />
}

export function ErrorBoundary({ error }: Readonly<{ error: Error }>) {
  return <AdminDataCreateErrorBoundary error={error} />
}

