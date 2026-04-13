import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDir = path.join(process.cwd(), 'src/content/posts')
const draftsDir = path.join(process.cwd(), 'src/content/drafts')

interface Frontmatter {
  title?: string
  date?: string
  description?: string
  tags?: string[]
}

export interface DraftMeta extends Frontmatter {
  date: string
  slug: string
}

export interface PostMeta extends Frontmatter {
  slug: string
}

export function getDraft(date: string, slug: string) {
  const filePath = path.join(draftsDir, date, `${slug}.md`)
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  if (data.date) data.date = String(data.date).split('T')[0]
  return { data, content }
}

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'))
  return files.map(file => {
    const slug = file.replace(/\.md$/, '')
    const { data } = matter(fs.readFileSync(path.join(postsDir, file), 'utf8'))
    return { slug, ...(data as Frontmatter) }
  })
}

export function getAllDrafts(): DraftMeta[] {
  const results: DraftMeta[] = []
  const dateFolders = fs.readdirSync(draftsDir)
  for (const date of dateFolders) {
    const dateDir = path.join(draftsDir, date)
    if (!fs.statSync(dateDir).isDirectory()) continue
    const files = fs.readdirSync(dateDir).filter(f => f.endsWith('.md'))
    for (const file of files) {
      const slug = file.replace(/\.md$/, '')
      const { data } = matter(fs.readFileSync(path.join(dateDir, file), 'utf8'))
      results.push({ ...(data as Frontmatter), date: String(date), slug })
    }
  }
  return results
}