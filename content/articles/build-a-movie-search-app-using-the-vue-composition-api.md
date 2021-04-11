---
title: Build a movie search app using the Vue Composition API
published_at: 2019-10-17
description: The very first alpha version of Vue is released! There are a lot of exciting features coming with version 3; Vue exposes its reactivity system behind the new Composition API. If you haven't heard about it, I recommend reading the RFC describing it.
tags: vue, javascript, webdev
cover_image: build-a-movie-search-app-using-the-vue-composition-api/header.jpg
canonical_url: https://dev.to/vuesomedev/build-a-movie-search-app-using-the-vue-composition-api-5218
---

The very first [alpha version of Vue 3](https://github.com/vuejs/vue-next) is released! There are a lot of exciting features coming with version 3: Vue exposes its reactivity system behind the new Composition API. If you haven't heard about it, I recommend reading the [RFC describing it](https://vue-composition-api-rfc.netlify.com/). At first, I was a bit skeptical, but looking at React's Hooks API, which is a bit similar, I decided to give it a shot.

In this article, we will be building a movie search application using the Composition API. We won't be using object-based components. I will explain how the new API works and how can we structure the application.

When we finish, we will see something similar to this:

<content-img src="build-a-movie-search-app-using-the-vue-composition-api/final-application.jpeg" alt="Final Application"></content-img>

The application will be able to search for movies via the [Open Movie Database API](http://www.omdbapi.com/apikey.aspx) and render the results. The reason for building this application is that it is simple enough not to distract the focus from learning the new API but complex enough to show it works.

If you are not interested in the explanations, you can head straight to [the source code](https://github.com/vuesomedev/movie-search-vue) and [the final application](https://codesandbox.io/s/github/blacksonic/movie-search-vue).

### Setting up the project

For this tutorial, we will be using the Vue CLI, which can quickly generate the necessary environment.

```bash
npm install -g @vue/cli
vue create movie-search-vue
cd movie-search-vue
npm run serve
```

Our application is now running on [http://localhost:8080](http://localhost:8080/) and looks like this:

<content-img src="build-a-movie-search-app-using-the-vue-composition-api/generated-application.png" alt="Generated Application"></content-img>

Here you can see the default folder structure:

<content-img src="build-a-movie-search-app-using-the-vue-composition-api/default-folder-structure.png" alt="Default Folder Structure"></content-img>

If you don't want to install all the dependencies on your local computer, you can also start the project on [Codesandbox](https://codesandbox.io/). Codesandbox has perfect starter projects for the most significant frameworks, [including Vue](https://codesandbox.io/s/vue).

### Enabling the new API

The generated source code uses Vue 2 with the old API. To use the new API with Vue 2, we have to install the [composition plugin](https://github.com/vuejs/composition-api).

```bash
npm install @vue/composition-api
```

After installing, we have to add it as a plugin:

```javascript
import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'

Vue.use(VueCompositionApi)
```

The composition plugin is additive: you can still create and use components the old way and start using the Composition API for new ones.

We will have four components:

- App.vue: The parent component. It will handle the API calls and communicate with other components.
- Header.vue: A basic component that receives and displays the page title
- Movie.vue: It renders each movie. The movie object is passed as a property.
- Search.vue: It contains a form with the input element and the search button. It gives the search term to the app component when you submit the form.

### Creating components

Let's write our first component, the header:

```vue
<template>
  <header class="App-header">
    <h2>{{ title }}</h2>
  </header>
</template>

<script>
export default {
  name: 'Header',
  props: ['title'],
  setup() {},
}
</script>
```

Component `props` are declared the same way. You name the variables that you expect from the parent component as an array or object. These variables will be available in the template(`{{ title }}`) and in the `setup` method.

The new thing here is the `setup` method. It runs after the initial `props` resolution. The `setup` method can return an object and the properties of that object will be merged onto the template context: it means they will be available in the template. This returned object is also the place for placing the lifecycle callbacks. We will see examples for this in the Search component.

Let's take a look at the Search component:

```vue
<template>
  <form class="search">
    <input type="text" :value="movieTitle" @keyup="handleChange" />
    <input @click="handleSubmit" type="submit" value="SEARCH" />
  </form>
</template>

<script>
import { ref } from '@vue/composition-api'

export default {
  name: 'Search',
  props: ['search'],
  setup({ search }, { emit }) {
    const movieTitle = ref(search)

    return {
      movieTitle,
      handleSubmit(event) {
        event.preventDefault()
        emit('search', movieTitle.value)
      },
      handleChange(event) {
        movieTitle.value = event.target.value
      },
    }
  },
}
</script>
```

The Search component tracks keystrokes and stores the input's value on a variable. When we are finished and push the submit button, it emits the current search term up to the parent component.

The `setup` method has two parameters.

The first argument is the resolved `props` as a named object. You can use object destructuring to access its properties. The parameter is reactive, which means the `setup` function will run again when the input properties change.

The second argument is the context object. Here you can find a selective list of properties that were available on `this` in the 2.x API (`attrs`, `slots`, `parent`, `root`, `emit`).

The next new element here is the `ref` function. The `ref` function exposes Vue's reactivity system. When invoked, it creates a reactive mutable variable that has a single property `value`. The `value` property will have the value of the argument passed to the `ref` function. It is a reactive wrapper around the original value. Inside the template we won't need to reference the `value` property, Vue will unwrap it for us. If we pass in an object, it will be deeply reactive.

Reactive means when we modify the object's value (in our case the `value` property), Vue will know that the value has changed, and it needs to re-render connected templates and re-run watched functions.

It acts similar to the object properties returned from the `data` method.

```javascript
data: function() {
  return { movieTitle: 'Joker' };
}
```

### Gluing it together

The next step is to introduce the parent component for the Header and Search component, the App component. It listens for the search event coming from the Search component, runs the API when the search term changes, and passes down the found movies to a list of Movie components.

```vue
<template>
  <div class="App">
    <Header :title="'Composition API'" />
    <Search :search="state.search" @search="handleSearch" />
    <p class="App-intro">Sharing a few of our favourite movies</p>
    <div class="movies">
      <Movie v-for="movie in state.movies" :movie="movie" :key="movie.imdbID" />
    </div>
  </div>
</template>

<script>
import { reactive, watch } from '@vue/composition-api'
import Header from './Header.vue'
import Search from './Search.vue'
import Movie from './Movie.vue'

const API_KEY = 'a5549d08'

export default {
  name: 'app',
  components: {
    Header,
    Search,
    Movie,
  },
  setup() {
    const state = reactive({
      search: 'Joker',
      loading: true,
      movies: [],
      errorMessage: null,
    })

    watch(() => {
      const MOVIE_API_URL = `https://www.omdbapi.com/?s=${state.search}&apikey=${API_KEY}`

      fetch(MOVIE_API_URL)
        .then((response) => response.json())
        .then((jsonResponse) => {
          state.movies = jsonResponse.Search
          state.loading = false
        })
    })

    return {
      state,
      handleSearch(searchTerm) {
        state.loading = true
        state.search = searchTerm
      },
    }
  },
}
</script>
```

We introduce here two new elements: `reactive` and `watch`.

The `reactive` function is the equivalent of Vue 2's `Vue.observable()`.
It makes the passed object deeply reactive: takes the original object and wraps it with a proxy (ES2015 Proxy-based implementation). On the objects returned from `reactive` we can directly access properties instead of values returned from the `ref` function where we need to use the `value` property. If you want to search for equivalents in the Vue 2.x API, the `data` method would be the exact match.

One shortcoming of the `reactive` object is that we can not spread it into the returned object from the `setup` method.

The `watch` function expects a function. It tracks reactive variables inside, as the component does it for the template. When we modify a reactive variable used inside the passed function, the given function runs again. In our example, whenever the search term changes, it fetches the movies matching the search term.

One component is left, the one displaying each movie record:

```vue
<template>
  <div class="movie">
    <h2>{{ movie.Title }}</h2>
    <div>
      <img width="200" :alt="altText" :src="movie.Poster" />
    </div>
    <p>{{ movie.Year }}</p>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'

export default {
  name: 'Movie',
  props: ['movie'],
  setup({ movie }) {
    const altText = computed(() => `The movie titled: ${movie.Title}`)

    return { altText }
  },
}
</script>
```

The Movie component receives the movie to be displayed and prints its name along with its image. The exciting part is that for the `alt` field of the image we use a computed text based on its title.

The `computed` function gets a getter function and wraps the returned variable into a reactive one. The returned variable has the same interface as the one returned from the `ref` function. The difference is that it's readonly. The getter function will run again when one of the reactive variables inside the getter function change. If the `computed` function returned a non-wrapped primitive value, the template wouldn't be able to track dependency changes.

### Cleaning up components

At this moment, we have a lot of business logic inside the App component. It does two things: handle the API calls and its child components. The aim is to have one responsibility per object: the App component should only manage the components and shouldn't bother with API calls. To accomplish this, we have to extract the API call.

```javascript
import { reactive, watch } from '@vue/composition-api'
const API_KEY = 'a5549d08'

export const useMovieApi = () => {
  const state = reactive({
    search: 'Joker',
    loading: true,
    movies: [],
  })

  watch(() => {
    const MOVIE_API_URL = `https://www.omdbapi.com/?s=${state.search}&apikey=${API_KEY}`

    fetch(MOVIE_API_URL)
      .then((response) => response.json())
      .then((jsonResponse) => {
        state.movies = jsonResponse.Search
        state.loading = false
      })
  })

  return state
}
```

Now the App component shrinks only to handle the view related actions:

```javascript
import Header from './Header.vue'
import Search from './Search.vue'
import Movie from './Movie.vue'
import { useMovieApi } from '../hooks/movie-api'

export default {
  name: 'app',
  components: { Header, Search, Movie },
  setup() {
    const state = useMovieApi()

    return {
      state,
      handleSearch(searchTerm) {
        state.loading = true
        state.search = searchTerm
      },
    }
  },
}
```

And that's it; we finished implementing a little application with the new Composition API.

### Wrapping it up

We have come a long way since generating the project with Vue CLI. Let's wrap it up what we learned.

We can use the new Composition API with the current stable Vue 2 version. To accomplish this, we have to use the `@vue/composition-api` plugin. The API is extensible: we can create new components with the new API along with old ones, and the existing ones will continue to work as before.

Vue 3 will introduce many different functions:

- `setup`: resides on the component and will orchestrate the logic for the component, runs after initial `props` resolution, receives `props` and context as an argument
- `ref`: returns a reactive variable, triggers re-render of the template on change, we can manipulate its value through the `value` property.
- `reactive`: returns a reactive object (proxy-based), triggers re-render of the template on reactive variable change, we can modify its value without the `value` property
- `computed`: returns a reactive variable based on the getter function argument, tracks reactive variable changes and re-evaluates on change
- `watch`: handles side-effects based on the provided function, tracks reactive variable changes and re-runs on change

I hope this example has made you familiar with the new API and removed your skepticism as it did with me.
