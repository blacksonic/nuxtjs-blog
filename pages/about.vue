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

        <p><b>Hi, I'm Gabor!</b></p>
        I'm a technical lead, software engineer and content creator. I was born
        in 1986 in Hungary. After graduating with Master's degree in Electrical
        <a
          href="Engineering at Budapest University of Technology and Economics"
        >
          https://www.bme.hu/?language=en
        </a>
        I've turned towards software development.
        <p></p>

        <p>
          I've written code for
          <a href="https://www.doclerholding.com/en/main/">Docler Holding</a>,
          <a href="https://emarsys.com/">Emarsys</a>, currently
          <a href="https://www.sap.com/index.html">SAP</a> and in my free time
          for the
          <a href="https://github.com/vuesomedev">open source community</a>.
          I've started as PHP developer mainly focused in backend technologies
          and fell in love with Javascript at my current workplace. Since then
          there is no turning back: Javascript development takes up most of
          coding time.
        </p>

        <p>
          During my work I like challenges in which I can use modern tools and
          technologies to develop outstanding web applications in look,
          performance and efficiency. I specialise in front-end web technologies
          - Vue, React, and Angular. My back-end stack includes Node.js with
          Express/Koa. I do most of my projects with Test Driven Development.
        </p>

        <p>
          I spend most of my free-time with my dog Mignon 🐶 teaching her new
          tricks.
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
