<template>
  <div class="main-wrapper">
    <section class="cta-section theme-bg-light py-5">
      <div class="container text-center">
        <h2 class="heading">
          VuesomeDev - A blog about Javascript focused on Vue.js and Node.js
        </h2>
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

    <footer class="footer text-center py-2 theme-bg-dark">
      <small class="copyright">
        Designed by
        <a href="http://themes.3rdwavemedia.com" target="_blank">
          Xiaoying Riley
        </a>
      </small>
    </footer>
  </div>
</template>

<script>
import { createApi } from '~/lib/api'

export default {
  async asyncData({ $content, error }) {
    const { getArticles, hasMoreArticles, hasLessArticles } = createApi({
      $content,
    })

    try {
      const page = 1
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
}
</script>
