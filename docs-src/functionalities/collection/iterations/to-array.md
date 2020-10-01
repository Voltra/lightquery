---
title: LightqueryCollection#toArray
description: Convert the set of results to an array
lang: en-US
---
# {{ $page.title }}
:::tip
```typescript
declare function toArray(): DomElementType[];
```
:::

Convert the result set to an array:
```javascript
const arr = document.querySelectorAll("body");

µ(arr)
.toArray(); //-> [body]
```
