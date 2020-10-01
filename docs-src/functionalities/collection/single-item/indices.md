---
title: Indices
description: Retrieve a single item from its index
lang: en-US
---
# {{ $page.title }}
:::tip
```typescript
declare function eq(index: number): LightqueryCollection|null;
declare function first(): LightqueryCollection|null;
declare function last(): LightqueryCollection|null;
```
:::

## LightqueryCollection#eq

Retrieve the nth result. In strict mode, if the index is invalid, it will return null. If strict mode is off,
it would return an empty collection instead.

```javascript
const input = [document, document.body];

µ(input)
.eq(1); //-> LightqueryCollection[ body ]

µ(input)
.eq(-1); // .eq(2), etc...
//-> null (w/ strict mode)
//-> LightqueryCollection[ ] (w/o strict mode)
```

## LightqueryCollection#first

Retrieve the first result. If the result set is empty it will return `null` (strict mode) or an empty collection.

```javascript
µ([])
.first();
//-> null (w/ strict mode)
//-> LightqueryCollection[ ] (w/o strict mode)
```

:::tip
It is strictly equivalent to `.eq(0)`.
:::

## LightqueryCollection#last

Retrieve the last result. If the result set is empty it will return `null` (strict mode) or an empty collection.

```javascript
µ([])
.last();
//-> null (w/ strict mode)
//-> LightqueryCollection[ ] (w/o strict mode)


µ([document, document.body, document.head])
.last(); //-> LightqueryCollection[ head ]
```

:::tip
It is strictly equivalent to:
```javascript
const $e = µ([document, document.body, document.head]);
$e.eq($e.length - 1);
```
:::
