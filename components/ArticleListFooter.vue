<template>
  <nav class="blog-nav nav nav-justified my-5">
    <NuxtLink
      v-if="previous"
      :to="'/articles/page/' + (page - 1)"
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
      :to="'/articles/page/' + (page + 1)"
      class="nav-link-next nav-item nav-link rounded"
    >
      Next
      <font-awesome-icon
        :icon="['fas', 'long-arrow-alt-right']"
        class="arrow-next"
      />
    </NuxtLink>
  </nav>
</template>

<script>
export default {
  props: {
    page: {
      type: Number,
      required: true,
    },
    previous: {
      type: Boolean,
      required: true,
    },
    next: {
      type: Boolean,
      required: true,
    },
  },
}
</script>
