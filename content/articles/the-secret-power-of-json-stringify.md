---
title: The secret power of JSON stringify
published_at: 2019-10-22
description: There are many functions in Javascript that just work. We use them daily, but we don't know about their extra features. At one day, we look at its documentation and realize it has many more features then we have imagined.
tags: javascript, webdev, beginner
cover_image: the-secret-power-of-json-stringify/header.png
canonical_url: https://sonicoder.com/blog/the-secret-power-of-json-stringify
---

There are many functions in Javascript that do their job. We use them daily, but we don't know about their extra features. At one day, we look at its documentation and realize it has many more features then we have imagined. The same thing has happened with `JSON.stringify` and me. In this short tutorial, I'll show you what I've learned.

### Basics

The `JSON.stringify` method takes a variable and transforms it into its JSON representation.

```javascript
const firstItem = {
  title: 'Transformers',
  year: 2007,
}

JSON.stringify(firstItem)
// {'title':'Transformers','year':2007}
```

The problem comes when there is an element that can not serialize to JSON.

```javascript
const secondItem = {
  title: 'Transformers',
  year: 2007,
  starring: new Map([
    [0, 'Shia LaBeouf'],
    [1, 'Megan Fox'],
  ]),
}

JSON.stringify(secondItem)
// {'title':'Transformers','year':2007,'starring':{}}
```

### The second argument

JSON.stringify has a second argument, which is called the replacer argument.

You can pass an array of strings that act as a whitelist for properties of the object to be included.

```javascript
JSON.stringify(secondItem, ['title'])
// {'title':'Transformers'}
```

We can filter out values that we don't want to display. These values can be too large items (like an Error object) or something that doesn't have a readable JSON representation.

The replacer argument can also be a function. This function receives the actual key and value on which the `JSON.stringify` method is iterating. You can alter the representation of the value with the function's return value. If you don't return anything from this function or return undefined, that item will not be present in the result.

```javascript
JSON.stringify(secondItem, (key, value) => {
  if (value instanceof Set) {
    return [...value.values()]
  }
  return value
})
// {'title':'Transformers','year':2007,'starring':['Shia LaBeouf','Megan Fox']}
```

By returning undefined in the function, we can remove those items from the result.

```javascript
JSON.stringify(secondItem, (key, value) => {
  if (typeof value === 'string') {
    return undefined
  }
  return value
})
// {"year":2007,"starring":{}}
```

### Third argument

The third argument controls the spacing in the final string. If the argument is a number, each level in the stringification will be indented with this number of space characters.

```javascript
JSON.stringify(secondItem, null, 2)
//{
//  "title": "Transformers",
//  "year": 2007,
//  "starring": {}
//}
```

If the third argument is a string, it will be used instead of the space character.

```javascript
JSON.stringify(secondItem, null, '🦄')
//{
//🦄"title": "Transformers",
//🦄"year": 2007,
//🦄"starring": {}
//}
```

### The toJSON method

If the object what we stringify has a property `toJSON`, it will customize the stringification process. Instead of serializing the object, you can return a new value from the method, and this value will be serialized instead of the original object.

```javascript
const thirdItem = {
  title: 'Transformers',
  year: 2007,
  starring: new Map([
    [0, 'Shia LaBeouf'],
    [1, 'Megan Fox'],
  ]),
  toJSON() {
    return {
      name: `${this.title} (${this.year})`,
      actors: [...this.starring.values()],
    }
  },
}

console.log(JSON.stringify(thirdItem))
// {"name":"Transformers (2007)","actors":["Shia LaBeouf","Megan Fox"]}
```

## Demo time

Here is a [Codepen](https://codepen.io/twhite96/pen/WNNRvKX) where I included the above examples, and you can fiddle with it.

### Final thoughts

It can be rewarding sometimes to look at the documentation of those functions we use daily. They might surprise us, and we learn something.
