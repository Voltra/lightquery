---
title: LightqueryCollection#forEach
description: Execute code on each element
lang: en-US
---
# {{ $page.title }}

:::tip
```typescript
type ElementCallback<R = any> = GenericCallback<Element, R>;
declare function forEach(callback: ElementCallback): this;
```
:::

This method enables you to execute a function on each element (e.g. to observe each element using an `IntersectionObserver`).

```javascript
const observer = new IntersectionObserver(/* [...] */);
const $e = µ(/* [...] */);
$e.forEach(e => observer.observe(e));
```

NOTE:
This is a replacement of jQuery's `each` method.

:::tip
If your callback returns a value, it will be ignored.
:::
