import { useParams } from 'react-router'
import type { Route } from './+types/$slug'
import { useBlogPostsQuery } from '@nestled-template/shared/sdk'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params
  if (!slug) throw new Response('Not Found', { status: 404 })
  return { slug }
}

export function meta({ data }: Route.MetaArgs) {
  const title = data?.slug ? `Blog: ${data.slug}` : 'Blog Post'
  const description = 'Read insights and articles from Biz to Biz.'
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
  ]
}

export default function BlogPost() {
  const params = useParams()
  const { data, loading, error } = useBlogPostsQuery({
    variables: {
      input: {
        take: 1,
        skip: 0,
        filters: { slug: params.slug, status: 'Published' },
      },
    },
    notifyOnNetworkStatusChange: true,
  })

  const post = data?.blogPosts?.[0]

  if (loading) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 text-center text-gray-500">Loading…</div>
      </div>
    )
  }
  if (error || !post) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 text-center text-gray-500">Post not found</div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <article>
          <header className="mb-8">
            {post.image ? (
              <img
                src={post.image}
                alt={post.imageAlt ?? post.title}
                className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover mb-8"
              />
            ) : null}
            <div className="flex items-center gap-x-4 text-sm mb-4">
              <time dateTime={post.publishedAt ?? ''} className="text-gray-500">
                {post.publishedAt?.slice(0, 10)}
              </time>
              {post.categories?.map(category => (
                <span
                  key={category.slug}
                  className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600"
                >
                  {category.name}
                </span>
              ))}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-2">
              {post.title}
            </h1>
            {(post.excerpt || post.metaDescription) && (
              <p className="text-xl leading-8 text-gray-600">{post.excerpt ?? post.metaDescription}</p>
            )}
          </header>
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {post.content || ''}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  )
}
