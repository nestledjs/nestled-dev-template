import { AdminDataEditErrorBoundary, AdminDataEditPage } from '@nestled-template/admin-data'

export default function EditDataRoute() {
  return <AdminDataEditPage />
}

export function ErrorBoundary({ error }: Readonly<{ error: Error }>) {
  return <AdminDataEditErrorBoundary error={error} />
}

