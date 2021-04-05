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
          </div>
        </div>

        <nav class="blog-nav nav nav-justified my-5">
          <NuxtLink
            v-if="notFirstPage"
            :to="'/articles/page/' + (page - 1)"
            class="nav-link-prev nav-item nav-link rounded-left"
            >Previous<i class="arrow-prev fas fa-long-arrow-alt-left"></i
          ></NuxtLink>
          <NuxtLink
            v-if="morePages"
            :to="'/articles/page/' + (page + 1)"
            class="nav-link-next nav-item nav-link rounded"
            >Next<i class="arrow-next fas fa-long-arrow-alt-right"></i
          ></NuxtLink>
        </nav>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  async asyncData({ $content, params, error }) {
    try {
      const page = parseInt(params.page, 10)
      const perPage = 3
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
        .skip(perPage * (page - 1))
        .limit(perPage)
        .fetch()
      const moreArticles = await $content('articles')
        .only(['slug'])
        .sortBy('published_at', 'desc')
        .skip(perPage * page)
        .limit(perPage)
        .fetch()

      return {
        articles,
        page,
        notFirstPage: page > 1,
        morePages: moreArticles.length > 0,
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
