---
title: Calling the factory
description: Get LightqueryCollection instances
lang: en-US
---
# Calling the factory

:::tip
```typescript
type Callback<R = any> = () => R;
type DomElementType = Element|DocumentFragment|Document|Window;
type DomElements = DomElementType|NodeList|HTMLCollection|Iterable<DomElementType>;
type Selector<R = any> = string|DomElements|Callback<R>;
declare function µ(selector: Selector, context?: DomElementType, previousResults?: Iterable<DomElementType>): LightqueryCollection;
```
:::

Calling the factory is very similar to jQuery, I even kept the context part intact despite not liking it.
Under the hood it uses [Sizzle](https://github.com/jquery/sizzle/wiki) for CSS selectors which has a lot of usefule additional pseudo selectors (the ones in jQuery).

## Using a CSS selector

Just like jQuery you can use any sizzle-compatible CSS selector to get a result:
```javascript
µ("form :text"); // all the text fields in a form
µ("*"); //-> LightqueryCollection[ ... ]
```

## Using an DOM Element

You can also wrap actual DOM elements:
```javascript
µ(document); //-> LightqueryCollection[ document, ]
µ(window); //-> LightqueryCollection[ window, ]
µ(document.body); //-> LightqueryCollection[ body, ]
µ(document.createElement("span")); //-> LightqueryCollection[ span, ]
```

## Using a NodeList

You can also wrap the result of `document.querySelectorAll` for instance:
```javascript
const inputs = document.querySelectorAll("input");
µ(inputs); //-> LightqueryCollection[ input, input, ... ]
```

:::tip
You can actually use any kind of iterable of `DomElementType`. For instance `[document, document.body]` is accepted.
:::

## Using a `LightqueryCollection` instance

In order to have a monadic design, you can even use a `LightqueryCollection` instance:
```javascript
const $all = µ("*");
µ($all); //-> $all
```

## With context

You can restrict the root of the query by giving a context:
```javascript
µ("*", document.body.lastElementChild); // All the children of the last element of the body 
```

:::warning
Although you can pass a `previousResults` parameter, you should prefer `µ("mySelector").add(previousResults)` or `$previousResults.add("mySelector")`;
:::
