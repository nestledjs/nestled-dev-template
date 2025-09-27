import { index, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  // Global layout - provides GlobalContextProvider and Apollo context to ALL routes
  route('', './routes/_layout.tsx', [
    // Public routes (no conflicting paths)
    route('', './routes/public/_layout.tsx', [
      index('./routes/public/_index.tsx'),
      // route('about', './routes/public/about.tsx'),
      route('login', './routes/public/login.tsx'),
      route('forgot-password', './routes/public/forgot-password.tsx'),
      // route('blog', './routes/public/blog.tsx'),
      // route('contact', './routes/public/contact.tsx'),
      // route('privacy-policy', './routes/public/privacy-policy.tsx'),
      // route('terms-and-conditions', './routes/public/terms-and-conditions.tsx'),
      // route('blog/:slug', './routes/public/blog/_layout.tsx', [
      //   index('./routes/public/blog/$slug.tsx'),
      // ]),
    ]),

    // Standalone unauthorized page (outside of public layout to avoid conflicts)
    // route('unauthorized', './routes/public/unauthorized.tsx'),
    // Logout route clears cookies and cache, then redirects to login
    route('logout', './routes/logout.tsx'),

    // Authenticated areas - all share the same sidebar/userback layout
    // route('', './routes/_auth_layout.tsx', [
    //   // Members area - clean namespace separation
    //   route('members', './routes/members/_layout.tsx', [
    //     route('dashboard', './routes/members/dashboard/_layout.tsx', [
    //       index('./routes/members/dashboard/_index.tsx'),
    //       route('attendance', './routes/members/dashboard/attendance.tsx'),
    //       route('biz', './routes/members/dashboard/biz.tsx'),
    //       route('my-referrals', './routes/members/dashboard/my-referrals.tsx'),
    //       route('referrals-sent', './routes/members/dashboard/referrals-sent.tsx'),
    //       route('substitute-requests', './routes/members/dashboard/substitute-requests.tsx'),
    //       route('power-hours', './routes/members/dashboard/power-hours.tsx'),
    //       route('notes', './routes/members/dashboard/notes.tsx'),
    //       route('new-biz', './routes/members/dashboard/new-biz.tsx'),
    //       route('new-biz/:referralId', './routes/members/dashboard/new-biz.[$referralId].tsx'),
    //       route('new-referral', './routes/members/dashboard/new-referral.tsx'),
    //       route('new-power-hour', './routes/members/dashboard/new-power-hour.tsx'),
    //     ]),
    //
    //     route('support', './routes/members/support.tsx'),
    //     route('release-notes', './routes/members/release-notes.tsx'),
    //
    //   ]),
    // ]),

    // Members area - separated out since _auth_layout.tsx doesn't exist
    route('members', './routes/members/_layout.tsx', [
      route('my-profile', './routes/members/my-profile/_layout.tsx', [
        index('./routes/members/my-profile/_index.tsx'),
        route('edit', './routes/members/my-profile/edit.tsx'),
      ]),
    ]),
    // Sitemap
    route('sitemap.xml', './routes/sitemap.xml.ts'),
  ]),
] satisfies RouteConfig
