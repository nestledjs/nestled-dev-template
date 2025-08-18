import { generateRemixSitemap } from '@forge42/seo-tools/remix/sitemap'
import type { Route } from './+types/sitemap.xml'
import { href } from 'react-router'
import { makeClient } from '@nestled-template/shared/apollo'
import { PublicUsersDocument, ActiveChaptersDocument } from '@nestled-template/shared/sdk'

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { routes } = await import('virtual:react-router/server-build')
  const { origin } = new URL(request.url)

  // Fetch all public users and chapters for dynamic sitemap generation
  const dynamicUrls: string[] = []

  try {
    const apolloClient = makeClient(request, {
      apiUrl: `${process.env.VITE_API_URL || 'http://localhost:3000'}/graphql`
    })

    // Fetch public users
    const { data: usersData } = await apolloClient.query({
      query: PublicUsersDocument,
      variables: {
        input: {
          take: 1000, // Limit to prevent huge sitemaps
        },
      },
    })

    // Fetch active chapters
    const { data: chaptersData } = await apolloClient.query({
      query: ActiveChaptersDocument,
      variables: { input: { take: 500 } },
    })

    // Generate member profile URLs
    if (usersData?.publicUsers) {
      dynamicUrls.push(...usersData.publicUsers.map((user: any) => `/directory/member/${user.id}`))
    }

    // Generate chapter URLs
    if (chaptersData?.chapters) {
      dynamicUrls.push(...chaptersData.chapters.map((chapter: any) => `/directory/chapter/${chapter.id}`))
    }
  } catch (error) {
    console.error('Failed to fetch public users and chapters for sitemap:', error)
    // Continue without dynamic URLs if query fails
  }

  const sitemap = await generateRemixSitemap({
    domain: origin,
    // @ts-expect-error Doesn't properly handle * routes
    ignore: [href('/admin*'), href('/members*')],
    // @ts-expect-error Type mismatch, maybe related to a stricter type mentioned in release notes for v.7.0.0
    // https://github.com/forge-42/seo-tools/issues/8
    routes,
    dynamicUrls,
  })

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
