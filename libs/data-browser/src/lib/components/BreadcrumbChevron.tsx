import { SvgIcon } from './SvgIcon'

/** The decorative separator between breadcrumb links on the create and edit pages. */
export function BreadcrumbChevron() {
  return (
    <SvgIcon
      className="flex-shrink-0 h-5 w-5 text-gray-300 dark:text-gray-600"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </SvgIcon>
  )
}
