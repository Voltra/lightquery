---
title: LightqueryCollection#resize
description: Execute code when the viewport is resized
lang: en-US
---
# {{ $page.title }}

:::tip
```typescript
declare function resize(listener: EventListener): this;
```
:::

This is an alias for `µ.resize` that allows you to write it just as in jQuery:
```javascript
const listener = /**/;
µ(window).resize(listener);
µ.resize(listener);
```

:::warning
You can only call `LightqueryColection#resize` if the following predicates are satisfied:
```javascript
$e = µ(/* [...] */); // your instance
$e[0] === window;
$e.first() === µ(window);
```

For instance, `µ("form").resize(listener)` is not accepted. In strict mode it would throw an exception.
Without strict mode this would be a noop.
:::
