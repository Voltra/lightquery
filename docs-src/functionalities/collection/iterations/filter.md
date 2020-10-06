---
title: LightqueryCollection#filter
description: Filter elements using a predicate
lang: en-US
---
# {{ $page.title }}

:::tip
```typescript
type Predicate<T = any> = GenericCallback<T, boolean>;
declare function filter(predicate: string|Predicate<DomElementType>, ...args: any[]): LightqueryCollection;
```
:::

This method allows to restrict the set of matched elements using the given predicate (you can also use a [method-string invokable](/design#method-string-invokables)).

```javascript
µ("*")
.filter("hasData", "src"); //-> LightqueryCollection[ ... ]

µ(":checkbox")
.filter(e => e.checked); //-> LightqueryCollection[ ... ]
```
