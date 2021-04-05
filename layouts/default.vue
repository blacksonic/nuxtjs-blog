<template>
  <div>
    <header class="header text-center">
      <h1 class="blog-name pt-lg-4 mb-0">
        <NuxtLink to="/">VuesomeDev</NuxtLink>
      </h1>

      <nav class="navbar navbar-expand-lg navbar-dark">
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navigation"
          aria-controls="navigation"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div id="navigation" class="collapse navbar-collapse flex-column">
          <div class="profile-section pt-3 pt-lg-0">
            <img
              class="profile-image mb-3 rounded-circle mx-auto"
              src="~/assets/images/profile.jpeg"
              alt="VuesomeDev"
            />

            <div class="bio mb-3">
              Hi, my name is Gábor Soós. I'm helping others create quality
              software with Javascript.
            </div>
            <!--//bio-->
            <ul class="social-list list-inline py-3 mx-auto">
              <li class="list-inline-item">
                <a href="https://twitter.com/vuesomedev"
                  ><font-awesome-icon :icon="['fab', 'twitter']"
                /></a>
              </li>
              <li class="list-inline-item">
                <a href="https://www.linkedin.com/in/soosgabor"
                  ><font-awesome-icon :icon="['fab', 'linkedin']"
                /></a>
              </li>
              <li class="list-inline-item">
                <a href="https://github.com/blacksonic"
                  ><font-awesome-icon :icon="['fab', 'github']"
                /></a>
              </li>
              <li class="list-inline-item">
                <a href="https://dev.to/vuesomedev"
                  ><font-awesome-icon :icon="['fab', 'dev']"
                /></a>
              </li>
              <li class="list-inline-item">
                <a href="https://medium.com/@vuesomedev"
                  ><font-awesome-icon :icon="['fab', 'medium']"
                /></a>
              </li>
            </ul>
            <hr />
          </div>

          <ul class="navbar-nav flex-column text-left">
            <li class="nav-item active">
              <NuxtLink to="/" class="nav-link"
                ><font-awesome-icon :icon="['fas', 'home']" class="fa-fw" />
                Home <span class="sr-only">(current)</span></NuxtLink
              >
            </li>
            <li class="nav-item">
              <NuxtLink to="/articles/page/1" class="nav-link"
                ><font-awesome-icon :icon="['fas', 'bookmark']" class="fa-fw" />
                Articles</NuxtLink
              >
            </li>
            <li class="nav-item">
              <NuxtLink to="/about" class="nav-link"
                ><font-awesome-icon :icon="['fas', 'user']" class="fa-fw" />
                About</NuxtLink
              >
            </li>
          </ul>

          <div class="my-2 my-md-3">
            <a
              class="btn btn-primary"
              href="mailto:soos.gabor86@gmail.com?subject=Question"
              target="_blank"
              >Get in Touch</a
            >
          </div>
        </div>
      </nav>
    </header>

    <Nuxt />
  </div>
</template>
