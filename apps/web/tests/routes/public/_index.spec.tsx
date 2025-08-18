import React from 'react'
import { render, screen } from '@testing-library/react'
import { createRoutesStub } from 'react-router'
import PublicIndex from '../../../app/routes/public/_index'

describe('Public Homepage', () => {
  test('renders main headline and call-to-action', () => {
    const ReactRouterStub = createRoutesStub([
      {
        path: '/',
        Component: PublicIndex,
      },
    ])

    render(<ReactRouterStub />)

    // Main headline
    expect(screen.getByText('Strong Communities,')).toBeTruthy()
    expect(screen.getByText('Stronger Businesses')).toBeTruthy()

    // Main description
    expect(screen.getByText(/Join our vibrant community of entrepreneurs/)).toBeTruthy()

    // Primary CTA buttons
    expect(screen.getByText('Find a chapter')).toBeTruthy()
    expect(screen.getByText('Learn more')).toBeTruthy()
  })

  test('renders stats section with correct values', () => {
    const ReactRouterStub = createRoutesStub([
      {
        path: '/',
        Component: PublicIndex,
      },
    ])

    render(<ReactRouterStub />)

    // Stats section headline
    expect(screen.getByText('Proven Strategies for Long Term Growth')).toBeTruthy()
    expect(screen.getByText("We've been having a blast growing with our members.")).toBeTruthy()

    // Stats values
    expect(screen.getByText('2006')).toBeTruthy()
    expect(screen.getByText('5')).toBeTruthy()
    expect(screen.getByText('10,000 +')).toBeTruthy()

    // Stats labels
    expect(screen.getByText('Since')).toBeTruthy()
    expect(screen.getByText('States')).toBeTruthy()
    expect(screen.getByText('Members Served')).toBeTruthy()
  })

  test('renders features section with all four features', () => {
    const ReactRouterStub = createRoutesStub([
      {
        path: '/',
        Component: PublicIndex,
      },
    ])

    render(<ReactRouterStub />)

    // Features section headline
    expect(screen.getByText('How does Biz to Biz help your business grow?')).toBeTruthy()

    // All four features
    expect(screen.getByText('Strategic Weekly Meetings')).toBeTruthy()
    expect(screen.getByText('Non-Compete Exclusive Spots')).toBeTruthy()
    expect(screen.getByText('Mentorship & Skills Development')).toBeTruthy()
    expect(screen.getByText('A Positive Community')).toBeTruthy()

    // Feature descriptions (partial text matches)
    expect(screen.getByText(/One hour and fifteen minute weekly meetings/)).toBeTruthy()
    expect(screen.getByText(/You'll be the only person in your industry/)).toBeTruthy()
    expect(screen.getByText(/Biz members all have unique skills and talents/)).toBeTruthy()
    expect(screen.getByText(/Be part of a supportive group of business owners/)).toBeTruthy()
  })

  test('renders testimonial section', () => {
    const ReactRouterStub = createRoutesStub([
      {
        path: '/',
        Component: PublicIndex,
      },
    ])

    render(<ReactRouterStub />)

    // Testimonial text
    expect(screen.getByText(/As a long time Biz to Biz member/)).toBeTruthy()
    expect(screen.getByText(/My Biz to Biz group is my business family/)).toBeTruthy()

    // Testimonial attribution
    expect(screen.getByText('Pam Artmann')).toBeTruthy()
    expect(screen.getByText('Edina Realty')).toBeTruthy()
  })

  test('renders call-to-action sections', () => {
    const ReactRouterStub = createRoutesStub([
      {
        path: '/',
        Component: PublicIndex,
      },
    ])

    render(<ReactRouterStub />)

    // Multiple CTA sections
    expect(screen.getByText('Ready to dive in?')).toBeTruthy()
    expect(screen.getByText("Join us as a guest to see what it's all about.")).toBeTruthy()
    expect(screen.getByText('Ready to Expand Your Network?')).toBeTruthy()
    expect(screen.getByText('Find your local chapter today.')).toBeTruthy()

    // Multiple "Find a Chapter" buttons (should have at least 2)
    const findChapterButtons = screen.getAllByText('Find a Chapter')
    expect(findChapterButtons.length).toBeGreaterThanOrEqual(2)
  })

  test('renders process section', () => {
    const ReactRouterStub = createRoutesStub([
      {
        path: '/',
        Component: PublicIndex,
      },
    ])

    render(<ReactRouterStub />)

    // Process section content
    expect(screen.getByText('YOUR SUCCESS DRIVES EVERYTHING WE DO')).toBeTruthy()
    expect(screen.getByText('Our Process')).toBeTruthy()
    expect(screen.getByText(/We believe it is our responsibility to empower you/)).toBeTruthy()
    expect(screen.getByText(/With over 10,000 members served/)).toBeTruthy()
  })

  test('renders navigation links to member directory', () => {
    const ReactRouterStub = createRoutesStub([
      {
        path: '/',
        Component: PublicIndex,
      },
    ])

    render(<ReactRouterStub />)

    // Member profile links (checking by href since they're image-only links)
    expect(document.querySelector('a[href="/directory/member/candice-freeman"]')).toBeTruthy()
    expect(document.querySelector('a[href="/directory/member/gary-swenson-cmb"]')).toBeTruthy()
    expect(document.querySelector('a[href="/directory/member/mitch-roberts"]')).toBeTruthy()
  })
}) 