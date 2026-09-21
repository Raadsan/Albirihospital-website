"use client"

import * as React from "react"
import Image from "next/image"
import {
  PlusIcon,
  SearchIcon,
  EyeIcon,
  Trash2Icon,
  RefreshCwIcon,
  UploadCloudIcon,
  Loader2Icon,
  PencilIcon,
  AlertCircleIcon,
} from "lucide-react"
import { toast } from "sonner"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import api from "@/app/api/api"
import { getApiErrorMessage } from "@/lib/api-error"

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  category: string
  author: string
  published: boolean
  views: number
  createdAt: string
}

const emptyBlogForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image: "/images/1.png",
  category: "Health Tips",
  author: "Al-Birri Medical Team",
  published: true,
}

export default function BlogsPage() {
  const [blogs, setBlogs] = React.useState<BlogPost[]>([])
  const [loading, setLoading] = React.useState(false)
  const [uploadingImage, setUploadingImage] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("ALL")
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)
  const [editingBlog, setEditingBlog] = React.useState<BlogPost | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [loadError, setLoadError] = React.useState("")

  const [formData, setFormData] = React.useState(emptyBlogForm)

  const fetchBlogs = React.useCallback(async () => {
    setLoading(true)
    setLoadError("")
    try {
      const response = await api.get("/blogs?all=true")
      if (response.data && Array.isArray(response.data.data)) {
        setBlogs(response.data.data)
      } else if (Array.isArray(response.data)) {
        setBlogs(response.data)
      }
    } catch (err: unknown) {
      console.error("Error fetching blogs:", err)
      setLoadError(getApiErrorMessage(err, "Articles could not be loaded. Please refresh and try again."))
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBlogs()
  }, [fetchBlogs])

  const openCreateBlog = () => {
    setEditingBlog(null)
    setFormData(emptyBlogForm)
    setIsSheetOpen(true)
  }

  const openEditBlog = (blog: BlogPost) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      image: blog.image,
      category: blog.category,
      author: blog.author,
      published: blog.published,
    })
    setIsSheetOpen(true)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
    setFormData({ ...formData, title, slug })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    const uploadFormData = new FormData()
    uploadFormData.append("image", file)
    uploadFormData.append("folder", "blogs")

    try {
      const response = await api.post("/upload", uploadFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      if (response.data && response.data.url) {
        setFormData((prev) => ({ ...prev, image: response.data.url }))
        toast.success("Blog cover uploaded to Cloudinary!")
      }
    } catch (err: unknown) {
      console.error("Blog image upload failed:", err)
      toast.error(getApiErrorMessage(err, "Failed to upload image. You can also paste an image URL."))
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim() || !formData.image.trim()) {
      toast.error("Please complete the title, summary, content, and cover image.")
      return
    }

    setSaving(true)
    try {
      const response = editingBlog
        ? await api.patch(`/blogs/${editingBlog.id}`, formData)
        : await api.post("/blogs", formData)
      const savedBlog = response.data?.data as BlogPost | undefined
      if (!savedBlog) throw new Error("Blog API returned no record")
      setBlogs((prev) => editingBlog
        ? prev.map((blog) => blog.id === savedBlog.id ? savedBlog : blog)
        : [savedBlog, ...prev]
      )
      setIsSheetOpen(false)
      setEditingBlog(null)
      setFormData(emptyBlogForm)
      toast.success(editingBlog ? "Article updated successfully" : "New article published successfully")
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "The article could not be saved."))
    } finally {
      setSaving(false)
    }
  }

  const togglePublished = async (id: string, current: boolean) => {
    try {
      const response = await api.patch(`/blogs/${id}`, { published: !current })
      const updated = response.data?.data as BlogPost | undefined
      setBlogs((prev) => prev.map((b) => (b.id === id ? (updated || { ...b, published: !current }) : b)))
      toast.success(!current ? "Article published live" : "Article set to draft")
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "The publishing status was not updated."))
    }
  }

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return
    try {
      await api.delete(`/blogs/${id}`)
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "The article could not be deleted."))
      return
    }
    setBlogs((prev) => prev.filter((b) => b.id !== id))
    toast.success("Article successfully removed")
  }

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      categoryFilter === "ALL" || blog.category.toLowerCase() === categoryFilter.toLowerCase()
    return matchesSearch && matchesCategory
  })

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  News & Articles Management
                </h1>
                <p className="text-sm text-muted-foreground">
                  Al-Birri Hospital: Author, edit, and publish healthcare news and educational articles.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchBlogs}
                  disabled={loading}
                  className="gap-1.5"
                >
                  <RefreshCwIcon className={`size-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>

                {/* Create Blog Sheet */}
                <Sheet open={isSheetOpen} onOpenChange={(open) => {
                  setIsSheetOpen(open)
                  if (!open) setEditingBlog(null)
                }}>
                  <SheetTrigger render={
                    <Button size="sm" onClick={openCreateBlog} className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                      <PlusIcon className="size-4" />
                      Create Article
                    </Button>
                  } />
                  <SheetContent className="w-full sm:max-w-2xl md:max-w-3xl overflow-y-auto p-6 sm:p-8">
                    <SheetHeader className="border-b border-border/60 pb-4">
                      <SheetTitle className="text-xl font-bold flex items-center gap-2.5 text-foreground">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                          <PlusIcon className="size-4" />
                        </span>
                        {editingBlog ? "Edit Healthcare Article" : "Write New Healthcare Article"}
                      </SheetTitle>
                      <SheetDescription className="text-sm text-muted-foreground mt-1">
                        {editingBlog ? "Update the article and its publishing details." : "Create health advice, clinical updates, or hospital announcements."}
                      </SheetDescription>
                    </SheetHeader>

                    <form onSubmit={handleSaveBlog} className="space-y-6 pt-5">
                      {/* Row 1: Title & Slug */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Article Title <span className="text-rose-500">*</span>
                          </Label>
                          <Input
                            id="title"
                            placeholder="Headline title..."
                            value={formData.title}
                            onChange={handleTitleChange}
                            required
                            className="h-11 rounded-xl border-border/80 px-3.5 text-sm focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="slug" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Web URL Link (Slug)
                          </Label>
                          <Input
                            id="slug"
                            placeholder="article-slug-format"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="h-11 rounded-xl border-border/80 px-3.5 text-sm font-mono focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                          />
                        </div>
                      </div>

                      {/* Row 2: Category & Author */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="category" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Article Category
                          </Label>
                          <Select
                            value={formData.category}
                            onValueChange={(val) => setFormData({ ...formData, category: val ?? "Health Tips" })}
                          >
                            <SelectTrigger id="category" className="h-11 rounded-xl border-border/80 px-3.5 text-sm">
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Health Tips">Health Tips</SelectItem>
                              <SelectItem value="Technology">Technology</SelectItem>
                              <SelectItem value="Emergency Care">Emergency Care</SelectItem>
                              <SelectItem value="Hospital News">Hospital News</SelectItem>
                              <SelectItem value="Wellness">Wellness</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="author" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Author / Medical Desk
                          </Label>
                          <Input
                            id="author"
                            placeholder="e.g. Al-Birri Medical Team"
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            className="h-11 rounded-xl border-border/80 px-3.5 text-sm focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                          />
                        </div>
                      </div>

                      {/* Row 3: Cover Image & Cloudinary */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="image" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Article Cover Photo
                          </Label>
                          <span className="inline-flex items-center gap-1 rounded-full border border-secondary bg-secondary/55 px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                            Secure media storage
                          </span>
                        </div>

                        <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-border/80 p-4 bg-muted/20">
                          <div className="flex flex-wrap items-center gap-3">
                            <label
                              htmlFor="blog-cover-file"
                              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 transition-colors shadow-xs"
                            >
                              {uploadingImage ? (
                                <Loader2Icon className="size-4 animate-spin text-primary" />
                              ) : (
                                <UploadCloudIcon className="size-4 text-emerald-600" />
                              )}
                              {uploadingImage ? "Uploading..." : "Choose Cover Image"}
                            </label>
                            <input
                              id="blog-cover-file"
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={uploadingImage}
                              className="hidden"
                            />
                            {uploadingImage && (
                              <span className="text-xs text-muted-foreground animate-pulse">Uploading to cloud storage...</span>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            {formData.image && (
                              <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted shadow-xs">
                                <Image
                                  src={formData.image}
                                  alt="Cover preview"
                                  fill
                                  sizes="80px"
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <Input
                              id="image"
                              placeholder="/images/1.png or https://res.cloudinary.com/..."
                              value={formData.image}
                              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                              className="h-11 rounded-xl text-xs font-mono border-border/80"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Row 4: Excerpt */}
                      <div className="space-y-2">
                        <Label htmlFor="excerpt" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Short Summary / Excerpt
                        </Label>
                        <textarea
                          id="excerpt"
                          rows={2}
                          className="w-full rounded-xl border border-border/80 bg-background px-4 py-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 resize-none leading-relaxed"
                          placeholder="1-2 sentences summarizing key takeaway for the preview card..."
                          value={formData.excerpt}
                          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                          required
                        />
                      </div>

                      {/* Row 5: Content */}
                      <div className="space-y-2">
                        <Label htmlFor="content" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Full Article Content <span className="text-rose-500">*</span>
                        </Label>
                        <textarea
                          id="content"
                          rows={7}
                          className="w-full rounded-xl border border-border/80 bg-background px-4 py-3.5 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 resize-none leading-relaxed font-sans"
                          placeholder="Write the full comprehensive article content here..."
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          required
                        />
                      </div>

                      {/* Submit */}
                      <Button
                        type="submit"
                        disabled={saving || uploadingImage}
                        className="mt-4 h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-md shadow-blue-950/15 transition-all hover:bg-primary/90"
                      >
                        {saving ? <Loader2Icon className="size-4 animate-spin" /> : null}
                        {saving ? "Saving..." : editingBlog ? "Save Article Changes" : "Publish Article"}
                      </Button>
                    </form>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {loadError ? (
              <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
                <AlertCircleIcon className="size-4 shrink-0" />
                {loadError}
              </div>
            ) : null}

            {/* Filter toolbar */}
            <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-4 shadow-xs md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search title, author, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val ?? "ALL")}>
                  <SelectTrigger className="w-[180px] h-10">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Categories</SelectItem>
                    <SelectItem value="Health Tips">Health Tips</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Emergency Care">Emergency Care</SelectItem>
                    <SelectItem value="Hospital News">Hospital News</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Blogs List */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {!loading && filteredBlogs.length === 0 ? (
                <div className="col-span-full rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
                  No articles match this view. Create an article or change the filters.
                </div>
              ) : null}
              {filteredBlogs.map((blog) => (
                <Card key={blog.id} className="overflow-hidden border-border/70 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary" className="text-xs font-medium">
                        {blog.category}
                      </Badge>
                      <button
                        onClick={() => togglePublished(blog.id, blog.published)}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border transition-colors ${
                          blog.published
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        <span className={`size-1.5 rounded-full ${blog.published ? "bg-emerald-500" : "bg-amber-500"}`} />
                        {blog.published ? "Published" : "Draft"}
                      </button>
                    </div>
                    <CardTitle className="text-base font-bold mt-2 text-foreground line-clamp-2">
                      {blog.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                      <span>{blog.author}</span>
                      <span>•</span>
                      <span>{blog.createdAt}</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-4 pt-1 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {blog.excerpt || blog.content}
                  </CardContent>

                  <CardFooter className="p-4 pt-2 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <EyeIcon className="size-3.5" />
                      <span>{blog.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => togglePublished(blog.id, blog.published)}
                      >
                        {blog.published ? "Make Draft" : "Publish"}
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 gap-1 px-2 text-xs text-primary" onClick={() => openEditBlog(blog)}>
                        <PencilIcon className="size-3.5" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteBlog(blog.id)}
                        title="Delete Article"
                      >
                        <Trash2Icon className="size-3.5" />
                        Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
