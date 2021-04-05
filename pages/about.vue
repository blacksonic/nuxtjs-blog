<template>
  <div class="main-wrapper">
    <article class="about-section py-5">
      <div class="container">
        <h2 class="title mb-3">About Me</h2>

        <p><b>Helping others create quality software with Javascript</b></p>

        <figure>
          <img
            class="img-fluid"
            src="~/assets/images/about-cover.jpg"
            alt="VuesomeDev"
          />
        </figure>

        <p>
          I have started my career as a web developer 10+ years ago. I like
          challenges in which I can use modern tools and technologies to develop
          outstanding web applications in look, performance and efficiency. I
          specialise in front-end web technologies - Vue, React, and Angular. My
          back-end stack includes Node.js with Express/Koa, and PHP. I do most
          of my projects with Test Driven Development.
        </p>
      </div>
    </article>
  </div>
</template>
<script>
export default {
  head() {
    return {
      title: 'About - VuesomeDev',
    }
  },
}
</script>
