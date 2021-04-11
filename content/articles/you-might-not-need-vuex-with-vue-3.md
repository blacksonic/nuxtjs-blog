---
title: You Might Not Need Vuex with Vue 3
published_at: 2020-07-13
description: Vuex is an awesome state management library. It's simple and integrates well with Vue. Why would anyone leave Vuex in Vue 3?
tags: vue, javascript, webdev
cover_image: you-might-not-need-vuex-with-vue-3/header.png
canonical_url: https://dev.to/vuesomedev/you-might-not-need-vuex-with-vue-3-52e4
---

Vuex is an awesome state management library. It's simple and integrates well with Vue. Why would anyone leave Vuex? The reason can be that the upcoming Vue 3 release exposes the underlying reactivity system and introduces new ways of how you can structure your application. The new reactivity system is so powerful that it can be used for centralized state management.

## Do You need a shared state?

There are circumstances when data flow between multiple components becomes so hard that you need centralized state management. These circumstances include:

- Multiple components that use the same data
- Multiple roots with data access
- Deep nesting of components

If none of the above cases are true, the answer is easy, whether you need it or not. You don't need it.

But what about if you have one of these cases? The straightforward answer would be to use Vuex. It's a battle-tested solution and does a decent job.

But what if you don't want to add another dependency or find the setup overly complicated? The new Vue 3 version, together with the Composition API can solve these problems with its built-in methods.

## The new solution

A shared state must fit two criteria:

- reactivity: when the state changes, the components using them should update also
- availability: the state can be accessed in any of the components

### Reactivity

Vue 3 exposes its reactivity system through numerous functions. You can create a reactive variable with the `reactive` function (an alternative would be the `ref` function).

```javascript
import { reactive } from 'vue'

export const state = reactive({ counter: 0 })
```

The object returned from the `reactive` function is a `Proxy` object that can track changes on its properties. When used in a component's template, the component re-renders itself whenever the reactive value changes.

```vue
<template>
  <div>{{ state.counter }}</div>
  <button type="button" @click="state.counter++">Increment</button>
</template>

<script>
import { reactive } from 'vue'

export default {
  setup() {
    const state = reactive({ counter: 0 })
    return { state }
  },
}
</script>
```

### Availability

The above example is excellent for a single component, but other components can't access the state. To overcome this, you can make any value available inside a Vue 3 application with the `provide` and `inject` methods.

```javascript
import { reactive, provide, inject } from 'vue'

export const stateSymbol = Symbol('state')
export const createState = () => reactive({ counter: 0 })

export const useState = () => inject(stateSymbol)
export const provideState = () => provide(stateSymbol, createState())
```

When you pass a `Symbol` as key and a value to the `provide` method, that value will be available for any child component through the `inject` method. The key is using the same `Symbol` name when providing and retrieving the value.

<content-img src="you-might-not-need-vuex-with-vue-3/provide-inject.png" alt="Provide Inject"></content-img>

This way, if you provide the value on the uppermost component, it'll be available in all the components. Alternatively, you can also call `provide` on the main application instance.

```javascript
import { createApp, reactive } from 'vue'
import App from './App.vue'
import { stateSymbol, createState } from './store'

const app = createApp(App)
app.provide(stateSymbol, createState())
app.mount('#app')
```

```vue
<script>
import { useState } from './state'

export default {
  setup() {
    return { state: useState() }
  },
}
</script>
```

### Making it robust

The above solution works but has a drawback: you don't know who modifies what. The state can be changed directly, and there is no restriction.

You can make your state protected by wrapping it with the `readonly` function. It covers the passed variable in a `Proxy` object that prevents any modification (emits a warning when you try it). The mutations can be handled by separate functions that have access to the writable store.

```javascript
import { reactive, readonly } from 'vue'

export const createStore = () => {
  const state = reactive({ counter: 0 })
  const increment = () => state.counter++

  return { increment, state: readonly(state) }
}
```

The outside world will have access only to a readonly state, and only the exported functions can modify the writable state.

By protecting the state from unwanted modifications, the new solution is relatively close to Vuex.

### Summary

By using the reactivity system and the dependency injection mechanism of Vue 3, we've gone from a local state to centralized state management that can replace Vuex in smaller applications.

We have a state object that is readonly and is reactive to changes in templates. The state can only be modified through specific methods like actions/mutations in Vuex. You can define additional getters with the `computed` function.

Vuex has more features like module handling, but sometimes we don't need that.

If You want to have a look at Vue 3 and try out this state management approach, take a look at my [Vue 3 Playground](https://github.com/vuesomedev/vue-3-playground).
