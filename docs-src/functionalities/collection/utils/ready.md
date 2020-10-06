---
title: LightqueryCollection#ready
description: Execute code on DOM load
lang: en-US
---
# {{ $page.title }}

:::tip
```typescript
declare function ready<R>(callback: Callback<R>): this;
```
:::

This is an alias for `µ.ready()` that allows you to write it just as in jQuery:
```javascript
const callback = /**/;
µ(document).ready(callback);
µ.ready(callback);
µ(callback);
```

:::warning
You can only call `LightqueryColection#ready` if the following predicates are satisfied:
```javascript
$e = µ(/* [...] */); // your instance
$e[0] === document;
$e.first() === µ(document);
```

For instance, `µ("form").ready(callback)` is not accepted. In strict mode it would throw an exception.
Without strict mode this would be a noop.
:::
