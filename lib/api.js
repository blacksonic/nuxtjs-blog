const perPage = 4

export function createApi({ $content }) {
  return {
    getArticles(page) {
      return $content('articles')
        .only([
          'title',
          'description',
          'cover_image',
          'slug',
          'readingTime',
          'published_at',
          'ago',
        ])
        .sortBy('published_at', 'desc')
        .skip(perPage * (page - 1))
        .limit(perPage)
        .fetch()
    },
    async hasMoreArticles(page) {
      const moreArticles = await $content('articles')
        .only(['slug'])
        .sortBy('published_at', 'desc')
        .skip(perPage * page)
        .limit(perPage)
        .fetch()

      return moreArticles.length > 0
    },
    hasLessArticles(page) {
      return page > 1
    },
    getArticle(slug) {
      return $content('articles', slug).fetch()
    },
    async getSorroundingArticle(slug) {
      const [previous, next] = await $content('articles')
        .only(['slug'])
        .sortBy('published_at', 'desc')
        .surround(slug)
        .fetch()

      return { previous, next }
    },
  }
}
