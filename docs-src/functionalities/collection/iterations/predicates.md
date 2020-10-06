---
title: Predicate based methods
description: Check for predicate satisfaction
lang: en-US
---
# {{ $page.title }}
:::tip
```typescript
declare function all(predicate: string|Predicate<DomElementType>, ...args: any[]): boolean;
declare function any(predicate: string|Predicate<DomElementType>, ...args: any[]): boolean;
declare function none(predicate: string|Predicate<DomElementType>, ...args: any[]): boolean;
declare function notAll(predicate: string|Predicate<DomElementType>, ...args: any[]): boolean;
```
:::

The methods help "counting" the items that satisfy the given predicate. You can use a method-string invokable as your predicate
(cf. [design](/design#method-string-invokables)). They all support [short-circuiting](https://en.wikipedia.org/wiki/Short-circuit_evaluation).

## all

Allows determining whether or not all the elements satisfy the given predicate. It is analog to `Array#every`.
```javascript
µ(":input")
.map(el => getFormFieldHandle(el))
.all(e => e.valid());
```

## any

Allows determining whether or not at least one of the elements satisfy the given predicate. It is analog to `Array#some`.
```javascript
µ(":checkbox[required]")
.any(e => !e.checked);
```

## none

Allows determining whether or not none of the elements satisfy the given predicate.
```javascript
µ(":input")
.map(el => getFormFieldHandle(el))
.none(e => e.hasErrors());
```

## notAll

Allows determining whether or not some of the elements do not satisfy the given predicate.
```javascript
µ("[data-alternative]")
.map(el => getFormFieldHandle(el))
.notAll(e => e.hasErrors());
```
