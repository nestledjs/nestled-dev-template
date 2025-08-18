import { index, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  // Global layout - provides GlobalContextProvider and Apollo context to ALL routes
  route('', './routes/_layout.tsx', [
    // Public routes (no conflicting paths)
    route('', './routes/public/_layout.tsx', [
      index('./routes/public/_index.tsx'),
      route('about', './routes/public/about.tsx'),
      route('login', './routes/public/login.tsx'),
      route('forgot-password', './routes/public/forgot-password.tsx'),
      route('directory/chapters', './routes/public/directory/chapters.tsx'),
      route('directory/chapter/:chapterId', './routes/public/directory/chapter/[chapterId].tsx'),
      route('directory/member/:memberId', './routes/public/directory/member/[memberId].tsx'),
      route('join', './routes/public/join/_index.tsx'),
      route('join/:chapterId/:chapterName', './routes/public/join/[chapterId]/[chapterName].tsx'),
      route('application-received', './routes/public/application-received.tsx'),
      route('award-winners', './routes/public/award-winners.tsx'),
      route('blog', './routes/public/blog.tsx'),
      // route('chapter-map', './routes/public/chapter-map.tsx'),
      route('contact', './routes/public/contact.tsx'),
      route('visit', './routes/public/visit/_index.tsx'),
      route('visit/:chapterId/:chapterName', './routes/public/visit/[chapterId]/[chapterName].tsx'),
      route('visit/confirmed', './routes/public/visit/confirmed.tsx'),
      route('privacy-policy', './routes/public/privacy-policy.tsx'),
      route('request-received', './routes/public/request-received.tsx'),
      route('terms-and-conditions', './routes/public/terms-and-conditions.tsx'),
      route('blog/:slug', './routes/public/blog/_layout.tsx', [
        index('./routes/public/blog/$slug.tsx'),
      ]),
    ]),

    // Standalone unauthorized page (outside of public layout to avoid conflicts)
    route('unauthorized', './routes/public/unauthorized.tsx'),
    // Logout route clears cookies and cache, then redirects to login
    route('logout', './routes/logout.tsx'),

    // Authenticated areas - all share the same sidebar/userback layout
    route('', './routes/_auth_layout.tsx', [
      // Members area - clean namespace separation
      route('members', './routes/members/_layout.tsx', [
        route('dashboard', './routes/members/dashboard/_layout.tsx', [
          index('./routes/members/dashboard/_index.tsx'),
          route('attendance', './routes/members/dashboard/attendance.tsx'),
          route('biz', './routes/members/dashboard/biz.tsx'),
          route('my-referrals', './routes/members/dashboard/my-referrals.tsx'),
          route('referrals-sent', './routes/members/dashboard/referrals-sent.tsx'),
          route('substitute-requests', './routes/members/dashboard/substitute-requests.tsx'),
          route('power-hours', './routes/members/dashboard/power-hours.tsx'),
          route('notes', './routes/members/dashboard/notes.tsx'),
          route('new-biz', './routes/members/dashboard/new-biz.tsx'),
          route('new-biz/:referralId', './routes/members/dashboard/new-biz.[$referralId].tsx'),
          route('new-referral', './routes/members/dashboard/new-referral.tsx'),
          route('new-power-hour', './routes/members/dashboard/new-power-hour.tsx'),
        ]),
        route('biz', './routes/members/biz/_layout.tsx', [
          index('./routes/members/biz/_index.tsx'),
          route(':bizId', './routes/members/biz/[bizId].tsx'),
        ]),
        route('notifications', './routes/members/notifications/_layout.tsx', [
          index('./routes/members/notifications/_index.tsx'),
          route(':notificationId', './routes/members/notifications/[notificationId].tsx'),
        ]),
        route('my-referrals', './routes/members/my-referrals/_layout.tsx', [
          index('./routes/members/my-referrals/_index.tsx'),
          route(':referralId', './routes/members/my-referrals/[referralId].tsx'),
        ]),
        route('referrals-sent', './routes/members/referrals-sent/_layout.tsx', [
          index('./routes/members/referrals-sent/_index.tsx'),
          route(':referralId', './routes/members/referrals-sent/[referralId].tsx'),
        ]),
        route('power-hours', './routes/members/power-hours/_layout.tsx', [
          index('./routes/members/power-hours/_index.tsx'),
          route(':powerHourId', './routes/members/power-hours/[powerHourId].tsx'),
        ]),
        route('substitute-requests', './routes/members/substitute-requests/_layout.tsx', [
          index('./routes/members/substitute-requests/_index.tsx'),
          route(
            ':substituteRequestId',
            './routes/members/substitute-requests/[substituteRequestId].tsx',
          ),
        ]),
        route('member-awards', './routes/members/member-awards.tsx'),
        route('my-profile', './routes/members/my-profile/_layout.tsx', [
          index('./routes/members/my-profile/_index.tsx'),
          route('edit', './routes/members/my-profile/edit.tsx'),
        ]),
        route('chapters', './routes/members/chapters.tsx'),
        route('members', './routes/members/members.tsx'),
        route('member/:memberId', './routes/members/member/[memberId].tsx', [
          index('./routes/members/member/[memberId]/_index.tsx'),
        ]),
        route('support', './routes/members/support.tsx'),
        route('release-notes', './routes/members/release-notes.tsx'),
        route('chapter', './routes/members/chapter/_index.tsx'),
        route('chapter/:chapterId', './routes/members/chapter/[chapterId]/_layout.tsx', [
          index('./routes/members/chapter/[chapterId]/_index.tsx'),
          route('members', './routes/members/chapter/[chapterId]/members.tsx'),
          route('attendance', './routes/members/chapter/[chapterId]/attendance.tsx'),
        ]),
        route('find-a-substitute', './routes/members/find-a-substitute.tsx'),
      ]),

      // Leaders area
      route('leaders', './routes/leaders/_layout.tsx', [
        index('./routes/leaders/_index.tsx'),
        route('reports/attendance', './routes/leaders/reports/attendance/_index.tsx'),
        route(
          'reports/attendance/:meetingId',
          './routes/leaders/reports/attendance/$meetingId.tsx',
        ),
        route('reports/attendance-by-date', './routes/leaders/reports/attendance-by-date.tsx'),
        route('reports/biz', './routes/leaders/reports/biz.tsx'),
        route('reports/member-attendance', './routes/leaders/reports/member-attendance.tsx'),
        route('reports/power-hours', './routes/leaders/reports/power-hours.tsx'),
        route('reports/referrals', './routes/leaders/reports/referrals.tsx'),
        route('reports/renewals', './routes/leaders/reports/renewals.tsx'),
      ]),

      // Admin area
      route('admin', './routes/admin/_layout.tsx', [
        index('./routes/admin/_index.tsx'),
        route('data', './routes/admin/data/_layout.tsx', [
          route(':dataTypePlural', './routes/admin/data/$dataTypePlural.tsx'),
          route(':dataType/create', './routes/admin/data/$dataType.create.tsx'),
          route(':dataType/:id', './routes/admin/data/$dataType.$id.tsx'),
        ]),
        route('import/blog', './routes/admin/import/blog.tsx'),
        route('reports', './routes/admin/reports/_index.tsx'),
        route('reports/biz', './routes/admin/reports/biz.tsx'),
        route('reports/referrals', './routes/admin/reports/referrals.tsx'),
        route('reports/power-hours', './routes/admin/reports/power-hours.tsx'),
        route(
          'reports/top-users-by-referrals',
          './routes/admin/reports/top-users-by-referrals.tsx',
        ),
        route(
          'reports/top-users-by-power-hours',
          './routes/admin/reports/top-users-by-power-hours.tsx',
        ),
        route('terminate-member', './routes/admin/terminate-member.tsx'),
        route('register-payment', './routes/admin/register-payment.tsx'),
      ]),
    ]),

    // Sitemap
    route('sitemap.xml', './routes/sitemap.xml.ts'),
  ]),
] satisfies RouteConfig
