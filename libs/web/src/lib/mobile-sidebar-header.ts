export function getMobileSidebarHeaderText(path: string): string {
  if (path.includes('dashboard')) {
    return 'Dashboard'
  } else if (path.includes('chapter')) {
    return 'Chapters'
  } else if (path.includes('member')) {
    return 'Members'
  } else if (path.includes('support')) {
    return 'Support'
  } else if (path.includes('admin')) {
    return 'Admin'
  } else {
    return 'Dashboard'
  }
}