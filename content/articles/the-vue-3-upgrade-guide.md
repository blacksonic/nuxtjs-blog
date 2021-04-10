---
title: The Vue 3 upgrade guide
published_at: 2020-05-18
description: The release of Vue 3 is just around the corner. A faster, smaller and more maintainable version is coming with exciting additive features.
tags: vue, javascript, tutorial
cover_image: the-vue-3-upgrade-guide/header.png
canonical_url: https://dev.to/vuesomedev/the-vue-3-upgrade-guide-4dc4
---

The release of Vue 3 is just around the corner. We can expect a faster, smaller, more maintainable version with a lot of new exciting features. Mostly these are additions and improvements over the existing API.

Nothing is stopping you from starting your new applications with Vue 3. In this article, I'll show you how to get ahead of the curve and start experimenting with the new API by upgrading your application. If you are interested in an upgraded application, take a look at my TodoMVC application written with the Composition API or the playground that includes every new feature.

### Using the CLI

I highly recommend using the official CLI for Vue projects. Besides development and deployment tooling, it simplifies the upgrade to a one-line command:
`vue add vue-next`.

The [Vue Next plugin](https://github.com/vuejs/vue-cli-plugin-vue-next) not only upgrades and installs the new dependencies but modifies the code to be compatible with version three.

### Dependencies

Installing the plugin upgrades the packages `vue`, `vuex`, `vue-router`, `eslint-plugin-vue` and `@vue/test-utils` to the next major version. Also, a new package named `@vue/compiler-sfc` appears among the development dependencies. What is it good for? It compiles the new Vue single file components into runnable Javascript code.

### Code modifications

Let's look at what has changed in the code. The first thing you notice is that the main Vue package no longer has a default export.

<content-img src="the-vue-3-upgrade-guide/entrypoint-upgrade.jpeg" alt="Entrypoint Upgrade" class="img-fluid"></content-img>

The named export `createApp` creates a new Vue application as it did with the constructor in Vue 2. The plugin setup moves to the application instance with the `use` method instead of the constructor's parameter. The `$mount` method loses its dollar sign but behaves the same way.

<content-img src="the-vue-3-upgrade-guide/store-upgrade.jpeg" alt="Store Upgrade" class="img-fluid"></content-img>

As you have seen with the application, plugins adopt the factory pattern: no more constructor with the `new` keyword. Instead of calling `new Vuex.Store`, the `createStore` factory method is needed. Passing the store's default export as a plugin is no longer possible.

<content-img src="the-vue-3-upgrade-guide/router-upgrade.jpeg" alt="Router Upgrade" class="img-fluid"></content-img>

The router plugin follows the same pattern: `new VueRouter` becomes a call to `createRouter`, and the global plugin setup must be left. In the new version, you always have to define the type of history. You can choose from `createWebHashHistory`, `createMemoryHistory` and `createWebHistory`.

And basically, this is it, the application can be started and runs on the new Vue version. Everything with a single bash command. Anything else should work with the old syntax, as the old APIs are still intact.

### Size matters

If you check the output size of the `build` command, you can notice a slight drop: 43.75 KiB -> 40.57 KiB. It's the result of leaving the default Vue instance in favor of named exports. Build tools like Webpack and Rollup can do tree-shaking (removing unused code) on named exports, but not on default exports.

### Without the CLI

Without the CLI, you have to upgrade `vue-loader` or `rollup-plugin-vue` to the next major version and add the `@vue/compiler-sfc` package. No more magic here, you have to do everything manually. You have to do code modifications also manually, and there is no tool here that searches the codebase and updates the syntax.

### Online playground

If you don't want to modify your project but interested in trying out the new version, just try [this online playground](https://github.com/blacksonic/vue-3-playground).

### Summary

We've reached the end of the modifications that you have to do during the upgrade process. These modifications are done automatically by the Vue CLI. All you have to do now is to start experimenting with all the new features that Vue 3 offers: the new reactivity system, Composition API, Fragments, Teleport and Suspense.
