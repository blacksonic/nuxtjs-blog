---
title: Write Vue like you write React
published_at: 2021-02-01
description: With the Vue 3 Composition API, you can write functional components. What happens if we write them with JSX templates? Are they similar to React functional components?
tags: react, vue, javascript
cover_image: write-vue-like-you-write-react/header.png
canonical_url: https://dev.to/blacksonic/write-vue-like-you-write-react-23p9
---

With the Vue 3 Composition API, you can write functional components. It's possible also with React, but React has different templating: JSX. What happens if we write Vue functional components with JSX templates? Are they similar to React functional components?

Let's look at how both frameworks functional components work and how similar/different they're through. The component we'll use for this purpose is a counter, which counts clicks on a button. Additionally it receives a limit parameter: when this limit is reached the component notifies its parent.

We'll create the React component first and then look at the Vue equivalent.

### React

```javascript
import { useState, useEffect } from 'react'

export const Counter = ({ limit, onLimit }) => {
  const [count, setCount] = useState(0)
  const handler = () => setCount(count + 1)

  useEffect(() => (count >= limit ? onLimit() : null), [count])

  return (
    <button type="button" onClick={handler}>
      Count: {count}
    </button>
  )
}
```

React requires a plain Javascript function that returns a JSX template to create a component. This function reruns whenever the component's state changes. You can create such state with the `useState` method. State variables are plain Javascript constructs that persist value between reruns. Every other variable is lost between state changes. You can test it with a `console.log` statement at the top of the function.

The component has a limit and a method which can be used to notify the parent component. We want to check the current value whenever it is incremented. The `useEffect` function serves as a checker and runs the callback whenever the dependencies in the second argument change.

In a nutshell: React component is a plain function with plain Javascript state values that reruns on every state change and returns JSX.

### Vue

```javascript
import { defineComponent, ref, watchEffect } from 'vue'

export const Counter = defineComponent({
  props: ['limit', 'onLimit'],
  setup(props) {
    const count = ref(0)
    const handler = () => count.value++

    watchEffect(() => (count.value >= props.limit ? props.onLimit() : null))

    return () => (
      <button type="button" onClick={handler}>
        Count: {count.value}
      </button>
    )
  },
})
```

The plain function equivalent in Vue is the `setup` method within the component object. The `setup` method also receives `props` as an input parameter, but instead of JSX, it returns a function that returns JSX. You may wonder why.

The reason is because the `setup` function only runs once and only the returned function runs on state change. If the `setup` function only runs once, how can Vue detect changes? The trick lies in Vue's reactivity system. The `ref` function wraps the original value inside a Javascript `Proxy` object. Every modification runs through this proxy which notifies Vue to rerender that component. If we modify the original value directly that change will be ignored by the framework.

The limit and notifier function come as a function parameter, but in Vue we haven't used destructuring. The reason is that `props` is also a Proxy object and if we destructure it, we lose its reactivity (if it changes, nothing would happen). To check value changes, we have to use the `useEffect` function. In contrary to React, we don't have to define the watched dependencies, Vue does it automatically as it knows about which state variables (`Proxies`) we use inside the callback.

For Vue developers using a function instead of an event to notify the parent might be unusual. Some say it's an anti-pattern in Vue, but to make it as close to React as possible I've chosen this way.

### Summary

Both framework can create a component with a single function. The Vue functional component is a function with state values wrapped inside Proxies that only runs once and only the returned function reruns and returns JSX. The React functional component is a function with state values as plain Javascript constructs that reruns on every state change and returns JSX directly.

The difference lies in the way how each framework solves the problem of reactivity: React is the stateless reference comparing solution, Vue is the stateful Proxy based solution.

It was an interesting and fun experiment to try to write the same component in different frameworks with similar approach as identically as possible. I hope you find it also interesting. You can also give it a try in my [Vue 3 Vite playground](https://github.com/blacksonic/vue-3-playground).
