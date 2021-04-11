<template>
  <div class="main-wrapper">
    <section class="cta-section theme-bg-light py-5">
      <div class="container text-center">
        <h2 class="heading">Articles</h2>
      </div>
    </section>

    <section class="blog-list px-3 py-5 p-md-5">
      <div class="container">
        <div v-for="article in articles" :key="article.slug" class="item mb-5">
          <article-list-item :article="article"></article-list-item>
        </div>

        <article-list-footer
          :page="page"
          :previous="previous"
          :next="next"
        ></article-list-footer>
      </div>
    </section>
  </div>
</template>

<script>
import { createApi } from '~/lib/api'

export default {
  async asyncData({ $content, params, error }) {
    const { getArticles, hasMoreArticles, hasLessArticles } = createApi({
      $content,
    })

    try {
      const page = parseInt(params.page, 10)
      const articles = await getArticles(page)
      const next = await hasMoreArticles(page)
      const previous = hasLessArticles(page)

      return {
        articles,
        page,
        previous,
        next,
      }
    } catch (err) {
      error({
        statusCode: 404,
        message: 'Page could not be found',
      })
    }
  },
  head() {
    return {
      title: 'Articles - VuesomeDev',
    }
  },
}
</script>
