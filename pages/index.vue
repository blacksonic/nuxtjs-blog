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
          <div class="media">
            <NuxtLink :to="'/articles/' + article.slug">
              <content-img
                :src="article.cover_image"
                :alt="article.title"
                class="mr-3 img-fluid post-thumb d-none d-md-flex"
              ></content-img>
            </NuxtLink>
            <div class="media-body">
              <h3 class="title mb-1">
                <NuxtLink :to="'/articles/' + article.slug">{{
                  article.title
                }}</NuxtLink>
              </h3>
              <div class="meta mb-1">
                <span class="date">Published {{ article.ago }}</span
                ><span class="time">{{ article.readingTime }}</span>
              </div>
              <div class="intro">{{ article.description }}</div>
              <NuxtLink :to="'/articles/' + article.slug" class="more-link"
                >Read more &rarr;</NuxtLink
              >
            </div>
            <!--//media-body-->
          </div>
          <!--//media-->
        </div>

        <nav v-if="morePages" class="blog-nav nav nav-justified my-5">
          <NuxtLink
            to="/articles/page/2"
            class="nav-link-next nav-item nav-link rounded"
            >Next<i class="arrow-next fas fa-long-arrow-alt-right"></i
          ></NuxtLink>
        </nav>
      </div>
    </section>

    <footer class="footer text-center py-2 theme-bg-dark">
      <small class="copyright"
        >Designed by
        <a href="http://themes.3rdwavemedia.com" target="_blank"
          >Xiaoying Riley</a
        ></small
      >
    </footer>
  </div>
</template>

<script>
export default {
  async asyncData({ $content, error }) {
    try {
      const perPage = 4
      const articles = await $content('articles')
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
        .limit(perPage)
        .fetch()

      const moreArticles = await $content('articles')
        .only(['slug'])
        .sortBy('published_at', 'desc')
        .skip(perPage)
        .limit(perPage)
        .fetch()

      return {
        articles,
        morePages: moreArticles.length > 0,
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
