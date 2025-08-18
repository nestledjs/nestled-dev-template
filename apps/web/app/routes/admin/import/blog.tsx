import React, { useMemo, useState } from 'react'
import { load as yamlLoad } from 'js-yaml'
import slugify from '@sindresorhus/slugify'
import {
  useAdminCreateBlogPostMutation,
  useAdminCreateBlogCategoryMutation,
  CreateBlogPostInput,
  CreateBlogCategoryInput,
  useAdminBlogCategoriesQuery,
  useAdminUpdateBlogPostMutation,
  useAdminBlogCategoriesLazyQuery,
} from '@nestled-template/shared/sdk'

type ParsedMarkdown = {
  frontmatter: Record<string, any>
  content: string
}

function parseMarkdown(input: string): ParsedMarkdown {
  const fmMatch = /^---[\r\n]+([\s\S]*?)[\r\n]+---[\r\n]*/.exec(input)
  if (fmMatch) {
    const fmRaw = fmMatch[1]
    const rest = input.slice(fmMatch[0].length)
    let fm: Record<string, any> = {}
    try {
      fm = yamlLoad(fmRaw) as Record<string, any>
    } catch {
      fm = {}
    }
    return { frontmatter: fm || {}, content: rest.trim() }
  }
  return { frontmatter: {}, content: input.trim() }
}

function toSlug(value?: string): string {
  if (!value) return ''
  const base = slugify(String(value).trim(), { decamelize: true })
  return base.replace(/^-+|-+$/g, '').toLowerCase()
}

function toTitleCaseFromSlug(slug: string): string {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase())
}

function normalizeImportedContent(params: {
  content: string
  title?: string
  image?: string
}): string {
  const { content, title, image } = params
  let normalized = content.replace(/\uFEFF/g, '') // strip BOM if present

  // Utility
  const canonical = (s?: string) => (s || '').toLowerCase().replace(/\s+/g, ' ').trim()
  const isTitlePlaceholderLine = (line: string) => /\{\s*attributes\.title\s*\}/i.test(line.trim())
  const isHeaderWithText = (line: string) => /^\s{0,3}#{1,6}\s+(.+?)\s*$/.test(line)
  const getHeaderText = (line: string) => {
    const m = /^\s{0,3}#{1,6}\s+(.+?)\s*$/.exec(line)
    return m ? m[1].trim() : ''
  }

  if (normalized) {
    const lines = normalized.split(/\r?\n/)

    // Trim top empty lines
    while (lines.length && lines[0].trim() === '') lines.shift()

    // 1) Remove leading H1 that matches title OR is a placeholder
    if (lines.length) {
      const first = lines[0]
      const hText = getHeaderText(first)
      const isTitleMatch = title && hText && canonical(hText) === canonical(title)
      const isPlaceholder = isTitlePlaceholderLine(first)
      if (isPlaceholder || isTitleMatch) {
        lines.shift()
        while (lines.length && lines[0].trim() === '') lines.shift()
      }
    }

    // 2) Remove a top hero image (markdown image or <img ...>) if frontmatter image exists
    if (image && lines.length) {
      const imgMdRegex = /^\s*!\[[^\]]*\]\(([^)]+)\)\s*$/
      const imgHtmlRegex = /^\s*<img\b[^>]*src=["']([^"']+)["'][^>]*>\s*$/i
      let removedImage = false
      for (let i = 0; i < Math.min(lines.length, 5); i++) {
        const line = lines[i]
        const mdMatch = imgMdRegex.exec(line)
        const htmlMatch = imgHtmlRegex.exec(line)
        if (mdMatch || htmlMatch) {
          const src = (mdMatch?.[1] || htmlMatch?.[1] || '').trim()
          if (!src || src === image || i === 0) {
            lines.splice(i, 1)
            while (i < lines.length && lines[i].trim() === '') lines.splice(i, 1)
            removedImage = true
          }
          break
        }
        if (line.trim() !== '') break
      }
      if (!removedImage) {
        // Also handle MDX-style <Image ... /> hero within first few lines
        for (let i = 0; i < Math.min(lines.length, 10); i++) {
          const line = lines[i]
          if (/^\s*<Image\b[^>]*src=/.test(line)) {
            lines.splice(i, 1)
            while (i < lines.length && lines[i].trim() === '') lines.splice(i, 1)
            break
          }
          if (line.trim() !== '') break
        }
      }
    }

    // 3) After removing hero, strip a header placeholder like "# {attributes.title}" if it remains near the top
    for (let i = 0; i < Math.min(lines.length, 10); i++) {
      const line = lines[i]
      const placeholderHeader = isTitlePlaceholderLine(line) || (isHeaderWithText(line) && isTitlePlaceholderLine(getHeaderText(line)))
      const headerEqualsTitle = isHeaderWithText(line) && title && canonical(getHeaderText(line)) === canonical(title)
      if (placeholderHeader || headerEqualsTitle) {
        lines.splice(i, 1)
        while (i < lines.length && lines[i].trim() === '') lines.splice(i, 1)
        break
      }
      // stop scanning once real content starts
      if (line.trim() !== '' && !isHeaderWithText(line)) break
    }

    normalized = lines.join('\n').trim()
  }

  return normalized
}

function computeReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export default function AdminImportBlog() {
  const [raw, setRaw] = useState('')
  const [authorId, setAuthorId] = useState('')
  const [status, setStatus] = useState<'Draft' | 'Published'>('Draft')
  const [preview, setPreview] = useState<CreateBlogPostInput | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [createPost, { loading: creating }] = useAdminCreateBlogPostMutation()
  const [createCategory] = useAdminCreateBlogCategoryMutation()
  const [updatePost] = useAdminUpdateBlogPostMutation()
  const { data: categoriesData } = useAdminBlogCategoriesQuery({ variables: { input: { take: 1000 } } })
  const [fetchCategories] = useAdminBlogCategoriesLazyQuery()

  const categoryNameToId = useMemo(() => {
    const map = new Map<string, string>()
    categoriesData?.blogCategories?.forEach((c: any) => {
      if (c?.name && c?.id) map.set(c.name.toLowerCase(), c.id)
      if (c?.slug && c?.id) map.set(c.slug.toLowerCase(), c.id)
    })
    return map
  }, [categoriesData])

  function buildInputFromMarkdown(input: string): CreateBlogPostInput {
    const { frontmatter, content } = parseMarkdown(input)
    const title: string = frontmatter.title || frontmatter.metaTitle || 'Untitled'
    const slug: string = toSlug(frontmatter.slug || title)
    const excerpt: string | undefined = frontmatter.excerpt || frontmatter.description
    const image: string | undefined = frontmatter.image || frontmatter.cover || frontmatter.thumbnail
    const imageAlt: string | undefined = frontmatter.imageAlt || frontmatter.coverAlt
    const metaTitle: string | undefined = frontmatter.metaTitle || title
    const metaDescription: string | undefined = frontmatter.metaDescription || excerpt
    const canonicalUrl: string | undefined = frontmatter.canonicalUrl
    const publishedAt: string | undefined = frontmatter.date || frontmatter.publishedAt
    const fmStatus: string | undefined = frontmatter.status
    const categories: string[] = Array.isArray(frontmatter.categories)
      ? frontmatter.categories
      : typeof frontmatter.categories === 'string'
        ? frontmatter.categories.split(',').map((s: string) => s.trim()).filter(Boolean)
        : []

    const finalStatus = (fmStatus as 'Published' | 'Draft') || status

    // Normalize content to remove duplicate hero/title from body
    const normalizedContent = normalizeImportedContent({ content, title, image })
    const readingTime = computeReadingTime(normalizedContent)

    const base: CreateBlogPostInput = {
      title,
      slug,
      content: normalizedContent,
      status: finalStatus as unknown as any,
      featured: Boolean(frontmatter.featured ?? false),
      views: Number(frontmatter.views ?? 0),
      previousSlugs: Array.isArray(frontmatter.previousSlugs) ? frontmatter.previousSlugs : [],
      excerpt: excerpt || undefined,
      image: image || undefined,
      imageAlt: imageAlt || undefined,
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
      canonicalUrl: canonicalUrl || undefined,
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : undefined,
      readingTime,
      authorId: authorId || undefined,
    }
    return base
  }

  async function ensureCategories(categoryNames: string[]): Promise<string[]> {
    const ids: string[] = []
    const seen = new Set<string>()
    for (const raw of categoryNames) {
      const original = String(raw || '').trim()
      if (!original) continue
      const slug = toSlug(original)
      const name = toTitleCaseFromSlug(slug || original)
      const lookupKeys = [original.toLowerCase(), slug, name.toLowerCase()]
      if (seen.has(slug)) continue
      seen.add(slug)

      // Check existing map by any key (name or slug)
      let existingId: string | undefined
      for (const key of lookupKeys) {
        const found = categoryNameToId.get(key)
        if (found) {
          existingId = found
          break
        }
      }

      // Also query by slug to avoid relying solely on the preloaded list
      if (!existingId) {
        try {
          const { data } = await fetchCategories({ variables: { input: { slug, take: 1 } } })
          const found = data?.blogCategories?.[0]?.id
          if (found) {
            existingId = found
          }
        } catch (e) {
          // ignore
        }
      }

      if (existingId) {
        console.log('[Import] Category exists', { slug, id: existingId })
        ids.push(existingId)
        continue
      }

      // Create it (handle unique constraint race)
      const input: CreateBlogCategoryInput = { name, slug: slug || toSlug(name) }
      try {
        const res = await createCategory({ variables: { input } })
        const newId = res.data?.createBlogCategory?.id
        if (newId) {

          ids.push(newId)
          continue
        }
      } catch (e: any) {
        const msg = String(e?.message || '')

        if (/unique constraint/i.test(msg) && /slug/i.test(msg)) {
          // Fetch the existing one and use its ID
          try {
            const { data } = await fetchCategories({ variables: { input: { slug, take: 1 } } })
            const found = data?.blogCategories?.[0]?.id
            if (found) {

              ids.push(found)
              continue
            }
          } catch (lookupErr) {
            // ignore
          }
        }
        // If we reach here, rethrow to surface the error
        throw e
      }
    }
    return ids
  }

  function handlePreview() {
    setError(null)
    try {
      const built = buildInputFromMarkdown(raw)
      setPreview(built)
    } catch (e) {
      setPreview(null)
      setError((e as Error).message)
    }
  }

  async function handleImport() {
    setMessage(null)
    setError(null)
    try {
      const built = buildInputFromMarkdown(raw)
      const { frontmatter } = parseMarkdown(raw)
      // Resolve categories to IDs (create missing ones)
      const catNames = Array.isArray(frontmatter.categories)
        ? frontmatter.categories
        : typeof frontmatter.categories === 'string'
          ? frontmatter.categories.split(',').map((s: string) => s.trim()).filter(Boolean)
          : []

      const categoriesIds = await ensureCategories(catNames)

      // Attempt create; on unique slug error, retry with -2/-3 suffixes
      const baseSlug = built.slug
      let createdId: string | undefined
      let createdTitle: string | undefined
      let attempt = 1
      let lastError: unknown
      while (attempt <= 20 && !createdId) {
        const slugCandidate = attempt === 1 ? baseSlug : `${baseSlug}-${attempt}`

        try {
          const result = await createPost({
            variables: { input: { ...built, slug: slugCandidate, categoriesIds } },
          })
          const created = result.data?.createBlogPost
          if (created?.id) {
            createdId = created.id
            createdTitle = created.title

            break
          }
          lastError = new Error('Creation did not return an ID')

        } catch (e: any) {
          lastError = e
          const msg = String(e?.message || '')

          // Retry on unique slug constraint only
          if (/unique constraint/i.test(msg) && /slug/i.test(msg)) {
            attempt += 1
            continue
          }
          // Unknown error
          throw e
        }
      }
      if (createdId) {
        // Fallback: ensure categories are attached even if create ignored them
        if (categoriesIds && categoriesIds.length > 0) {
          try {
            await updatePost({ variables: { blogPostId: createdId, input: { categoriesIds } } })

          } catch (e) {
            // Ignore; we still created the post. Categories can be attached later if needed.

          }
        }
        setMessage(`Created post: ${createdTitle}`)
        setPreview(null)
      } else {
        setError((lastError as Error)?.message || 'Failed to create post')
      }
      } catch (e) {

      setError((e as Error).message)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Import Blog Post (Paste Markdown)</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Author ID (optional)</label>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="user id"
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'Draft' | 'Published')}
        >
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Markdown (with optional frontmatter)</label>
        <textarea
          className="w-full h-72 border rounded px-3 py-2 font-mono text-sm"
          placeholder={`---\ntitle: My Post\nslug: my-post\ndate: 2024-01-01\ncategories: [Announcements, Updates]\nimage: /img/cover.jpg\nimageAlt: Cover\nexcerpt: Short summary...\nmetaTitle: SEO title\nmetaDescription: SEO description\nstatus: Published\n---\n\n# Hello World\n\nPost content here...`}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
        />
      </div>

      <div className="flex gap-2 mb-4">
        <button className="px-4 py-2 rounded bg-gray-200" onClick={handlePreview}>Preview</button>
        <button
          className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
          onClick={handleImport}
          disabled={!raw || creating}
        >
          {creating ? 'Importing...' : 'Import'}
        </button>
      </div>

      {message && <div className="mb-4 text-green-700">{message}</div>}
      {error && <div className="mb-4 text-red-700">{error}</div>}

      {preview && (
        <div className="mt-6 border rounded p-4 bg-gray-50">
          <h2 className="font-semibold mb-2">Preview</h2>
          <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(preview, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

