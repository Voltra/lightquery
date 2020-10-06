---
title: LightqueryCollection#map
description: Map each element
lang: en-US
---
# {{ $page.title }}

:::tip
```typescript
type MapperFunction<T = any, U = any> = GenericCallback<T, U>;
type ElementMapper<R = any> = MapperFunction<Element, R>;
declare function map<U = any>(mapper: string|ElementMapper<U>, ...args: any[]): U[]|any[];
```
:::

This method allows to map each element. Note that you can make use of method-string invokables (cf. [design](/design#method-string-invokables)).

```javascript
µ(":input")
.map("attr", "value"); //-> string[]

µ(":input")
.map(e => extractStuffOr(e, null));
```

:::warning
Note that it does not return an instance of `LightqueryCollection` but an array.
:::
