---
title: The tale of three dots in Javascript
published_at: 2019-10-10
description: One upon a time, there was a significant upgrade to the Javascript language called ES6/ES2015. It introduced many different new features. One of them was the three consecutive dots that we can write in front of any compatible container (objects, arrays, strings, sets, maps).
tags: javascript, webdev, beginner
cover_image: the-tale-of-three-dots-in-javascript/header.png
canonical_url: https://sonicoder.com/blog/the-tale-of-three-dots-in-javascript
---

One upon a time, there was a significant upgrade to the Javascript language called ES6/ES2015. It introduced many different new features. One of them was the three consecutive dots that we can write in front of any compatible container (objects, arrays, strings, sets, maps). These tiny little dots enable us to write a more elegant and concise code. I'll explain how the three dots work and show the most common use-cases.

The three consecutive dots have two meanings: the spread operator and the rest operator.

## Spread operator

The spread operator allows an iterable to spread or expand individually inside a receiver. The iterable and the receiver can be anything that can be looped over like arrays, objects, sets, maps. You can put parts of a container individually into another container.

```javascript
const newArray = ['first', ...anotherArray]
```

## Rest parameters

The rest parameter syntax allows us to represent an indefinite number of arguments as an array. Named parameters can be in front of rest parameters.

```javascript
const func = (first, second, ...rest) => {}
```

## Use-cases

Definitions can be useful, but it is hard to understand the concept just from them. I think everyday use-cases can bring the missing understanding of definitions.

### Copying an array

When we have to mutate an array but don't want to touch the original one (others might use it), we have to copy it.

```javascript
const fruits = ['apple', 'orange', 'banana']
const fruitsCopied = [...fruits] // ['apple', 'orange', 'banana']

console.log(fruits === fruitsCopied) // false

// old way
fruits.map((fruit) => fruit)
```

It is selecting each element inside the array and placing each of those elements in a new array structure. We can achieve the copying of the array with the `map` operator and making an identity mapping.

### Unique array

We want to sort out duplicate elements from an array. What is the simplest solution?

The `Set` object only stores unique elements and can be populated with an array. It is also iterable so we can spread it back to a new array, and what we receive is an array with unique values.

```javascript
const fruits = ['apple', 'orange', 'banana', 'banana']
const uniqueFruits = [...new Set(fruits)] // ['apple', 'orange', 'banana']

// old way
fruits.filter((fruit, index, arr) => arr.indexOf(fruit) === index)
```

### Concatenate arrays

We can concatenate two separate arrays with the `concat` method, but why not use the spread operator again?

```javascript
const fruits = ['apple', 'orange', 'banana']
const vegetables = ['carrot']
const fruitsAndVegetables = [...fruits, ...vegetables] // ['apple', 'orange', 'banana', 'carrot']
const fruitsAndVegetables = ['carrot', ...fruits] // ['carrot', 'apple', 'orange', 'banana']

// old way
const fruitsAndVegetables = fruits.concat(vegetables)
fruits.unshift('carrot')
```

### Pass arguments as arrays

When passing arguments is where the spread operator starts making our code more readable. Before ES6, we had to apply the function to the `arguments`. Now we can just spread the parameters to the function, which results in much cleaner code.

```javascript
const mixer = (x, y, z) => console.log(x, y, z)
const fruits = ['apple', 'orange', 'banana']

mixer(...fruits) // 'apple', 'orange', 'banana'

// old way
mixer.apply(null, fruits)
```

### Slicing an array

Slicing is more straightforward with the `slice` method, but if we want it, the spread operator can be used for this use-case also. We have to name the remaining elements one-by-one, so it is not a great way to slice from the middle of a big array.

```javascript
const fruits = ['apple', 'orange', 'banana']
const [apple, ...remainingFruits] = fruits // ['orange', 'banana']

// old way
const remainingFruits = fruits.slice(1)
```

### Convert arguments to an array

Arguments in Javascript are array-like objects. You can access it with indices, but you can't call array methods on it like `map`, `filter`. Arguments are an iterable object, so what can we do with it? Put three dots in front of them and access them as an array!

```javascript
const mixer = (...args) => console.log(args)
mixer('apple') // ['apple']
```

### Convert NodeList to an array

Arguments are like a `NodeList` returned from a `querySelectorAll` function. They also behave a bit like an array but don't have the appropriate methods.

```javascript
;[...document.querySelectorAll('div')]

// old way
Array.prototype.slice.call(document.querySelectorAll('div'))
```

### Copying an object

Finally, we get to object manipulations. Copying works the same way as with arrays. Earlier it was doable with `Object.assign` and an empty object literal.

```javascript
const todo = { name: 'Clean the dishes' }
const todoCopied = { ...todo } // { name: 'Clean the dishes' }
console.log(todo === todoCopied) // false

// old way
Object.assign({}, todo)
```

### Merge objects

The only difference in merging is that properties with the same key get overwritten. The rightmost property has the highest precedence.

```javascript
const todo = { name: 'Clean the dishes' }
const state = { completed: false }
const nextTodo = { name: 'Ironing' }
const merged = { ...todo, ...state, ...nextTodo } // { name: 'Ironing', completed: false }

// old way
Object.assign({}, todo, state, nextTodo)
```

It is important to note, that merging creates copies only on the first level in the hierarchy. Deeper levels in the hierarchy will be the same reference.

### Splitting a string into characters

One last with strings. You can split a string into characters with the spread operator. Of course, it is the same if you would call the split method with an empty string.

```javascript
const country = 'USA'
console.log([...country]) // ['U', 'S', 'A']

// old way
country.split('')
```

## And that's it

We looked at many different use-cases for the three dots in Javascript. As you can see ES6 not only made it more efficient to write code but also introduced some fun ways to solve long-existing problems. Now all the major browsers support the new syntax; all the above examples can be tried in browser console while reading this article. Either way, you start using the spread operator and the rest parameters. It is an excellent addition to the language that you should be aware of.
