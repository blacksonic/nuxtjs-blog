<template>
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
        <NuxtLink :to="'/articles/' + article.slug">
          {{ article.title }}
        </NuxtLink>
      </h3>
      <div class="meta mb-1">
        <span class="date">Published {{ article.ago }}</span>
        <span class="time">{{ article.readingTime }}</span>
      </div>
      <div class="intro">{{ article.description }}</div>
      <NuxtLink :to="'/articles/' + article.slug" class="more-link">
        Read more &rarr;
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
}
</script>
