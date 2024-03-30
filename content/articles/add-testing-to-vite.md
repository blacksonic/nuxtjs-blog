---
title: Add testing to Vite
published_at: 2021-02-23
description: Making Vite, the brand new incredibly fast development server for Vue 3, whole with unit and end-to-end testing
tags: vue, testing, javascript
cover_image: add-testing-to-vite/header.jpg
cover_image_author: Liam Shaw
cover_image_link: https://unsplash.com/@churrbroskii
canonical_url: https://sonicoder.com/blog/add-testing-to-vite
---

[Vite](https://vitejs.dev/) is the brand new development server created by [Evan You](https://twitter.com/youyuxi). It's framework agnostic and incredibly fast thanks to native [ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) instead of bundling. Vite has a starter template for Vue applications. The template has the tooling for development and production deployment; only one is missing: testing. This tutorial shows you how to add unit and end-to-end testing to a newly generated Vue 3 Vite project.

### Project setup

Let's start by creating a Vite project from scratch.

```bash
npm init @vitejs/app my-vite-app --template vue-ts
```

The above command creates a Vue 3 Typescript application into the `my-vite-app` folder. The folder structure will look like this.

<content-img src="add-testing-to-vite/folder-structure.png" alt="Folder Structure"></content-img>

We have a `HelloWorld` component in the `src/components/HelloWorld.vue` file that displays the header on the page "Hello Vue 3 + TypeScript + Vite". This component receives the header text a `prop` input named `msg`. We'll write a test against this component whether it displays the same message as what we give as input.

<content-img src="add-testing-to-vite/application.png" alt="Application"></content-img>

### Unit test

As mentioned in the headline, the Vite template doesn't include any test runner; we have to choose one. The [Jest](https://jestjs.io/) test runner is a good choice if we want a simple and fast setup as it gives us everything that we need: a test runner that executes the tests, an assertion library with which we can assert for the outcome and a DOM implementation where Vue components can be mounted.

Here is our first unit test placed next to the `HelloWorld.vue` component file.

```typescript
// src/components/HelloWorld.spec.ts
import { mount } from '@vue/test-utils'
import HelloWorld from './HelloWorld.vue'

describe('HelloWorld', () => {
  it('should display header text', () => {
    const msg = 'Hello Vue 3'
    const wrapper = mount(HelloWorld, { props: { msg } })

    expect(wrapper.find('h1').text()).toEqual(msg)
  })
})
```

The test uses the [Vue Test Utils](https://vue-test-utils.vuejs.org/) library, the official unit test helper library. With its help, we can mount a single component to the DOM and fill the input parameters, like its `props`.

We feed the "Hello Vue 3" text to the component and check the outcome through the components wrapper object. If the header element has the same text as the input, the test passes. But how do we run this test?

I've mentioned Jest and Vue Test Utils, but we haven't installed any packages.

```bash
npm install jest @types/jest ts-jest vue-jest@next @vue/test-utils@next --save-dev
```

By default, Jest doesn't understand Vue and Typescript files, so we need to transpile them before and pass the transpilation step as configuration (`jest.config.js`). We need the `next` version for multiple packages because they are the only ones that support Vue 3.

```javascript
// jest.config.js
module.exports = {
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.vue$': 'vue-jest',
  },
}
```

We are two little steps away from running and seeing passing tests. First, we have to add the type definition of Jest to the config.

```json
// tsconfig.json
{
  "compilerOptions": {
    ...
    "types": ["vite/client", "@types/jest"],
    ...
  },
  ...
}
```

Finally, add the script to `package.json`, and after that, we can run the tests with `npm test`.

```json
// package.json
{
  ...
  "scripts": {
    ...
    "test": "jest src"
  },
  ...
}
```

And here it is the result of our first unit test, beautiful green, and passing.

<content-img src="add-testing-to-vite/jest-output.png" alt="Jest Output"></content-img>

### E2E test

While unit tests are good for checking smaller bits of code, end-to-end tests are really good at checking the application as a whole in the browser. Vue CLI comes with built-in support for [Cypress](https://www.cypress.io/), an end-to-end test runner. We'll also use Cypress for this purpose.

```typescript
// e2e/main.spec.ts
describe('Main', () => {
  it('should display header text', () => {
    cy.visit('/')
    cy.contains('h1', 'Hello Vue 3 + TypeScript + Vite')
  })
})
```

Cypress provides a global object `cy` that can interact with the browser. It can visit certain pages (`visit`) and check the content of elements defined by a selector (`contains`). In the above test, we navigate to the main page and check for the correct header text.

It's time to install the necessary packages to run the test.

```bash
npm install cypress start-server-and-test --save-dev
```

Next to Cypress, we've installed a utility library called [start-server-and-test](https://github.com/bahmutov/start-server-and-test). This utility library can start the development server, wait until it responds to the given URL, and then runs the Cypress tests. In the end, it stops all running processes during the cleanup phase.

Cypress doesn't know where the test files are located and the base URL of the application, we have to tell it with a configuration file.

```json
// cypress.json
{
  "baseUrl": "http://localhost:3000",
  "integrationFolder": "e2e",
  "pluginsFile": false,
  "supportFile": false,
  "video": false
}
```

Manually declared `types` within our Typescript configuration needs manual work again: add Cypress types to the list.

```json
// tsconfig.json
{
  "compilerOptions": {
    ...
    "types": ["vite/client", "@types/jest", "cypress"],
    ...
  },
  ...
}
```

One piece is left to create the script command in `package.json` to run the tests. We use the `start-server-and-test` package with three command-line arguments:

- `dev`: the npm script name which runs the development server
- `http-get://localhost:3000`: the URL where the development server is available
- `cypress`: the npm script name which runs the end-to-end tests

```json
// package.json
{
  ...
  "scripts": {
    ...
    "test:e2e": "start-server-and-test dev http-get://localhost:3000 cypress",
    "cypress": "cypress run"
  },
  ...
}
```

If we run the above script, we get passing shiny green end-to-end test results.

<content-img src="add-testing-to-vite/cypress-output.png" alt="Cypress Output"></content-img>

### Summary

Vite is a great development server, but its templates lack testing solutions. We have to add them manually. Jest and Cypress offer straightforward scenarios to fill in this gap. We can also swap them to similar libraries like Mocha, Jasmine, and Puppeteer. After this article, I hope the lack of out-of-the-box testing with Vite doesn't hold back anyone from using it.

If you don't want to set up everything manually, you can use my [Vue 3 Playground](https://github.com/vuesomedev/vue-3-playground) as a starter.
