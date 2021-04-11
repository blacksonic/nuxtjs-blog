<template>
  <div class="main-wrapper">
    <article class="blog-post px-3 py-5 p-md-5">
      <div class="container">
        <header class="blog-post-header">
          <h2 class="title mb-2">{{ article.title }}</h2>
          <div class="meta mb-3">
            <span class="date">Published {{ article.ago }}</span>
            <span class="time">{{ article.readingTime }}</span>
          </div>
        </header>

        <div class="blog-post-body">
          <figure class="blog-banner">
            <content-img
              :src="article.cover_image"
              :alt="article.title"
            ></content-img>

            <figcaption
              v-if="article.cover_image_author"
              class="mt-2 text-center image-caption"
            >
              Image Credit:
              <a :href="article.cover_image_link" target="_blank">
                {{ article.cover_image_author }}
              </a>
            </figcaption>
          </figure>

          <nuxt-content :document="article" />

          <hr />
          <p v-if="article.canonical_url">
            <i>
              This post was originally published on
              <a :href="article.canonical_url">DEV.to</a>
            </i>
          </p>
        </div>

        <nav v-if="previous || next" class="blog-nav nav nav-justified my-5">
          <NuxtLink
            v-if="previous"
            :to="'/articles/' + previous.slug"
            class="nav-link-prev nav-item nav-link rounded-left"
          >
            Previous
            <font-awesome-icon
              :icon="['fas', 'long-arrow-alt-left']"
              class="arrow-prev"
            />
          </NuxtLink>
          <NuxtLink
            v-if="next"
            :to="'/articles/' + next.slug"
            class="nav-link-next nav-item nav-link rounded-right"
          >
            Next
            <font-awesome-icon
              :icon="['fas', 'long-arrow-alt-right']"
              class="arrow-next"
            />
          </NuxtLink>
        </nav>
      </div>
    </article>
  </div>
</template>

<script>
import { createApi } from '~/lib/api'

export default {
  async asyncData({ $content, params, error }) {
    const { getArticle, getSorroundingArticle } = createApi({
      $content,
    })

    try {
      const article = await getArticle(params.slug)
      const { previous, next } = await getSorroundingArticle(params.slug)

      return { article, previous, next }
    } catch (err) {
      error({
        statusCode: 404,
        message: 'Page could not be found',
      })
    }
  },
  head() {
    return {
      title: this.article.title + ' - VuesomeDev',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.article.description,
        },
      ],
    }
  },
}
</script>
