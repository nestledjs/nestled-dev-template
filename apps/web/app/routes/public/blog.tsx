
import { Link } from 'react-router'
import { BlogCategory, useBlogPostsLazyQuery } from '@nestled-template/shared/sdk'
import React from 'react'

export default function Index() {
  const PAGE_SIZE = 12
  const [posts, setPosts] = React.useState<any[]>([])
  const [skip, setSkip] = React.useState(0)
  const [hasMore, setHasMore] = React.useState(true)
  const [loadPosts, { loading, error }] = useBlogPostsLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  })

  React.useEffect(() => {
    // initial load
    handleLoadMore(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleLoadMore(reset = false) {
    const nextSkip = reset ? 0 : skip
    const { data } = await loadPosts({
      variables: {
        input: {
          take: PAGE_SIZE,
          skip: nextSkip,
          orderBy: 'publishedAt',
          orderDirection: 'desc',
          filters: { status: 'Published' },
        },
      },
    })
    const newItems = data?.blogPosts ?? []
    if (reset) {
      setPosts(newItems)
      setSkip(PAGE_SIZE)
    } else {
      setPosts(prev => [...prev, ...newItems])
      setSkip(prev => prev + PAGE_SIZE)
    }
    setHasMore(newItems.length === PAGE_SIZE)
  }

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            From the blog
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">Learn how to grow your business!</p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {loading && (
            <div className="col-span-full text-center text-gray-500">Loading posts…</div>
          )}
          {error && (
            <div className="col-span-full text-center text-red-600">Failed to load posts</div>
          )}
          {posts.map(post => (
            <article key={post.slug} className="flex flex-col items-start justify-between">
              <Link className="relative w-full aspect-[16/9] cursor-pointer" to={`/blog/${post.slug}`}>
                <img
                  src={post.image}
                  alt=""
                  className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover "
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </Link>
              <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <time dateTime={post.publishedAt ?? ''} className="text-gray-500">
                    {post.publishedAt?.slice(0, 10)}
                  </time>
                  {post?.categories?.map((category: BlogCategory) => (
                    <span
                      key={category.slug}
                      // href={post.category.href}
                      className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                    >
                      {category.name}
                    </span>
                  )) ?? null}
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <Link to={`/blog/${post.slug}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                    {post.excerpt ?? post.metaDescription}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          {hasMore && (
            <button
              className="px-6 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              onClick={() => handleLoadMore(false)}
              disabled={loading}
            >
              {loading ? 'Loading…' : 'Load More'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
