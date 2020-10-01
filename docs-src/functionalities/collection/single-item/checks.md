---
title: Checks
description: Check for the existence of information on the first result
lang: en-US
---
# {{ $page.title }}
:::tip
```typescript
declare function hasAttr(name: string): boolean;
declare function hasProp(name: string): boolean;
declare function hasData(name: string): boolean;
declare function hasClass(classNames: string): boolean;
declare function matches(selector: string): boolean;
```
:::

If you try to check on an empty collection and strict mode is on, then a `NotEnoughElementsError` will be thrown.
Without strict mode, it will default to `false`.

## LightqueryCollection#hasAttr

Determine whether or not the first item has the given attribute:
```javascript
µ([]).hasAttr("checked");
//-> throws NotEnoughElementsError (w/ strict mode)
//-> false (w/o strict mode)

µ(":checkbox").hasAttr("checked"); //-> true or false
```
:::tip
`hasAttr()` is for the HTML attributes (thus visible on the DOM).
:::

## LightqueryCollection#hasProp

Determine whether or not the first item has the given prop:
```javascript
µ(/**/).hasProp("length"); //-> true or false
```
:::tip
`hasProp()` is for JS properties of the DOM nodes/elements (usually not visible on the DOM).
:::

## LightqueryCollection#hasData

Determine whether or not the first item has the data attribute:
```javascript
µ(/**/).hasData("src"); //-> true or false
```

## LightqueryCollection#hasClass

Determine whether or not the first item has the given class:
```javascript
µ(/**/).hasClass("my-class"); //-> true or false
```

:::tip
Like many methods, `hasClass` accepts a [spaced-separated string](/design#spaced-separated-strings) as its argument.
:::

## LightqueryCollection#matches

Determine whether or not the first item matches the given CSS selector:
```javascript
µ(/**/).matches(".my > .selector"); //-> true or false
```
