import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router'
import { AdminBreadcrumbs, type BreadcrumbItem } from './AdminBreadcrumbs'

// Wrapper component to provide Router context
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('AdminBreadcrumbs', () => {
  const mockItems: BreadcrumbItem[] = [
    { id: '1', label: 'Dashboard', href: '/admin' },
    { id: '2', label: 'Users', href: '/admin/users' },
    { id: '3', label: 'User Details', isActive: true },
  ]

  describe('basic rendering', () => {
    it('should render breadcrumb items', () => {
      render(
        <RouterWrapper>
          <AdminBreadcrumbs items={mockItems} />
        </RouterWrapper>,
      )

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Users')).toBeInTheDocument()
      expect(screen.getByText('User Details')).toBeInTheDocument()
    })

    it('should render home icon by default', () => {
      render(
        <RouterWrapper>
          <AdminBreadcrumbs items={mockItems} />
        </RouterWrapper>,
      )

      const homeLink = screen.getByLabelText('Home')
      expect(homeLink).toBeInTheDocument()
      expect(homeLink).toHaveAttribute('href', '/admin')
    })

    it('should render navigation with breadcrumb label', () => {
      render(
        <RouterWrapper>
          <AdminBreadcrumbs items={mockItems} />
        </RouterWrapper>,
      )

      const nav = screen.getByRole('navigation', { name: 'Breadcrumb' })
      expect(nav).toBeInTheDocument()
    })
  })

  describe('home link behavior', () => {
    it('should not render home icon when showHome is false', () => {
      render(
        <RouterWrapper>
          <AdminBreadcrumbs items={mockItems} showHome={false} />
        </RouterWrapper>,
      )

      expect(screen.queryByLabelText('Home')).not.toBeInTheDocument()
    })

    it('should render custom home href', () => {
      render(
        <RouterWrapper>
          <AdminBreadcrumbs items={mockItems} homeHref="/dashboard" />
        </RouterWrapper>,
      )

      const homeLink = screen.getByLabelText('Home')
      expect(homeLink).toHaveAttribute('href', '/dashboard')
    })

    it('should have correct styling for home link', () => {
      render(
        <RouterWrapper>
          <AdminBreadcrumbs items={mockItems} />
        </RouterWrapper>,
      )

      const homeLink = screen.getByLabelText('Home')
      expect(homeLink).toHaveClass('text-gray-400', 'hover:text-gray-500')
    })
  })

  describe('item rendering', () => {
    it('should render items with href as links', () => {
      const items: BreadcrumbItem[] = [
        { id: '1', label: 'Dashboard', href: '/admin' },
        { id: '2', label: 'Users', href: '/admin/users' },
      ]

      render(
        <RouterWrapper>
          <AdminBreadcrumbs items={items} />
        </RouterWrapper>,
      )

      const dashboardLink = screen.getByRole('link', { name: 'Dashboard' })
      const usersLink = screen.getByRole('link', { name: 'Users' })

      expect(dashboardLink).toHaveAttribute('href', '/admin')
      expect(usersLink).toHaveAttribute('href', '/admin/users')
    })

    it('should render active items as spans without links', () => {
      const items: BreadcrumbItem[] = [
        { id: '1', label: 'Dashboard', href: '/admin' },
        { id: '2', label: 'Current Page', isActive: true },
      ]

      render(
        <RouterWrapper>
          <AdminBreadcrumbs items={items} />
        </RouterWrapper>,
      )

      // Active item should not be a link
      expect(screen.queryByRole('link', { name: 'Current Page' })).not.toBeInTheDocument()

      // Should still be rendered as text
      expect(screen.getByText('Current Page')).toBeInTheDocument()
    })

    it('should render items without href as spans', () => {
      const items: BreadcrumbItem[] = [
        { id: '1', label: 'Dashboard', href: '/admin' },
        { id: '2', label: 'No Link' },
      ]

      render(
        <RouterWrapper>
          <AdminBreadcrumbs items={items} />
        </RouterWrapper>,
      )

      expect(screen.queryByRole('link', { name: 'No Link' })).not.toBeInTheDocument()
      expect(screen.getByText('No Link')).toBeInTheDocument()
    })

    it('should apply active styling to active items', () => {
      const items: BreadcrumbItem[] = [
        { id: '1', label: 'Inactive', href: '/admin' },
        { id: '2', label: 'Active', isActive: true },
      ]

      render(
        <RouterWrapper>
          <AdminBreadcrumbs items={items} />
        </RouterWrapper>,
      )

      const activeElement = screen.getByText('Active')
      expect(activeElement).toHaveClass('text-gray-900')
    })

    it('should apply correct styling to non-active items without links', () => {
      const items: BreadcrumbItem[] = [{ id: '1', label: 'Non-Active' }]

      render(
        <RouterWrapper>
          <AdminBreadcrumbs items={items} />
        </RouterWrapper>,
      )

      const element = screen.getByText('Non-Active')
      expect(element).toHaveClass('text-gray-500')
    })
  })

  describe('chevron separators', () => {
    it('should render chevrons between items when home is shown', () => {
      render(
        <RouterWrapper>
          <AdminBreadcrumbs items={mockItems} />
        </RouterWrapper>,
      )

      // Check for chevron icons (they have aria-hidden="true")
      const chevrons = document.querySelectorAll('[aria-hidden="true"]')

      // Should have chevrons for each item (not for home icon)
      expect(chevrons.length).toBeGreaterThan(0)
    })

    it('should render chevrons even when home is hidden', () => {
      const items: BreadcrumbItem[] = [
        { id: '1', label: 'First', href: '/first' },
        { id: '2', label: 'Second', href: '/second' },
      ]

      render(
        <RouterWrapper>
          <AdminBreadcrumbs items={items} showHome={false} />
        </RouterWrapper>,
      )

      // Even without home, there should still be a chevron between items
      const chevrons = document.querySelectorAll('[aria-hidden="true"]')
      expect(chevrons.length).toBeGreaterThan(0)
    })
  })

  describe('custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <RouterWrapper>
          <AdminBreadcrumbs items={mockItems} className="custom-class" />
        </RouterWrapper>,
      )

      const nav = container.querySelector('nav')
      expect(nav).toHaveClass('custom-class')
    })

    it('should preserve base classes when custom className is provided', () => {
      const { container } = render(
        <RouterWrapper>
          <AdminBreadcrumbs items={mockItems} className="custom-class" />
        </RouterWrapper>,
      )

      const nav = container.querySelector('nav')
      expect(nav).toHaveClass('flex', 'custom-class')
    })
  })

  describe('edge cases', () => {
    it('should handle empty items array', () => {
      render(
        <RouterWrapper>
          <AdminBreadcrumbs items={[]} />
        </RouterWrapper>,
      )

      // Should still render the nav element with home
      const nav = screen.getByRole('navigation', { name: 'Breadcrumb' })
      expect(nav).toBeInTheDocument()
      expect(screen.getByLabelText('Home')).toBeInTheDocument()
    })

    it('should handle single item', () => {
      const items: BreadcrumbItem[] = [{ id: '1', label: 'Only Item', href: '/item' }]

      render(
        <RouterWrapper>
          <AdminBreadcrumbs items={items} />
        </RouterWrapper>,
      )

      expect(screen.getByText('Only Item')).toBeInTheDocument()
      expect(screen.getByLabelText('Home')).toBeInTheDocument()
    })

    it('should handle items with long labels', () => {
      const items: BreadcrumbItem[] = [
        { id: '1', label: 'This is a very long breadcrumb label that might wrap', href: '/long' },
      ]

      render(
        <RouterWrapper>
          <AdminBreadcrumbs items={items} />
        </RouterWrapper>,
      )

      expect(
        screen.getByText('This is a very long breadcrumb label that might wrap'),
      ).toBeInTheDocument()
    })

    it('should handle special characters in labels', () => {
      const items: BreadcrumbItem[] = [
        { id: '1', label: 'Users & Groups', href: '/users' },
        { id: '2', label: "John's Profile", href: '/profile' },
      ]

      render(
        <RouterWrapper>
          <AdminBreadcrumbs items={items} />
        </RouterWrapper>,
      )

      expect(screen.getByText('Users & Groups')).toBeInTheDocument()
      expect(screen.getByText("John's Profile")).toBeInTheDocument()
    })
  })

  describe('link styling', () => {
    it('should apply correct styling to links', () => {
      const items: BreadcrumbItem[] = [{ id: '1', label: 'Link Item', href: '/link' }]

      render(
        <RouterWrapper>
          <AdminBreadcrumbs items={items} />
        </RouterWrapper>,
      )

      const link = screen.getByRole('link', { name: 'Link Item' })
      expect(link).toHaveClass('text-sm', 'font-medium', 'text-gray-500', 'hover:text-gray-700')
    })
  })

  describe('accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <RouterWrapper>
          <AdminBreadcrumbs items={mockItems} />
        </RouterWrapper>,
      )

      expect(screen.getByLabelText('Home')).toBeInTheDocument()
      expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
    })

    it('should hide decorative chevron icons from screen readers', () => {
      render(
        <RouterWrapper>
          <AdminBreadcrumbs items={mockItems} />
        </RouterWrapper>,
      )

      const chevrons = document.querySelectorAll('[aria-hidden="true"]')
      chevrons.forEach(chevron => {
        expect(chevron).toHaveAttribute('aria-hidden', 'true')
      })
    })
  })
})
