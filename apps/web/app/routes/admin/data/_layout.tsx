import * as Sdk from '@nestled-template/shared/sdk'
import { DATABASE_MODELS } from '@nestled-template/shared/sdk'
import { AdminDataProvider, AdminDataLayout } from '@nestled-template/admin-data'

export default function DataLayoutRoute() {
  return (
    <AdminDataProvider sdk={Sdk} databaseModels={DATABASE_MODELS} basePath="/admin/data">
      <AdminDataLayout />
    </AdminDataProvider>
  )
}
