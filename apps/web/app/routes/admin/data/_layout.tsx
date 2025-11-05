import * as Sdk from '@nestled-template/shared/sdk'
import { DATABASE_MODELS } from '@nestled-template/shared/sdk'
import { AdminDataProvider, AdminDataLayout } from '@nestled-template/data-browser'
import { formTheme } from '@nestled-template/shared/styles'

export default function DataLayoutRoute() {
  return (
    <AdminDataProvider sdk={Sdk} databaseModels={DATABASE_MODELS} basePath="/admin/data" formTheme={formTheme}>
      <style dangerouslySetInnerHTML={{__html: `
        /* Override library padding and ensure overflow works */
        .admin-data-wrapper {
          overflow-x: auto !important;
          width: 100% !important;
        }
        .admin-data-wrapper main {
          padding-left: 0 !important;
          padding-right: 0 !important;
          padding-top: 1.5rem !important;
          padding-bottom: 1.5rem !important;
          overflow-x: visible !important;
        }
        .admin-data-wrapper .max-w-full {
          max-width: none !important;
          overflow-x: visible !important;
        }
        @media (min-width: 768px) {
          .admin-data-wrapper main {
            padding-top: 2rem !important;
            padding-bottom: 2rem !important;
          }
        }
        @media (min-width: 1024px) {
          .admin-data-wrapper main {
            padding-top: 3rem !important;
            padding-bottom: 3rem !important;
          }
        }
      `}} />
      <div className="admin-data-wrapper">
        <AdminDataLayout />
      </div>
    </AdminDataProvider>
  )
}
