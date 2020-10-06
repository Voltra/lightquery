---
title: Strict mode
description: Be safe, or mimick jQuery
lang: en-US
---
# {{ $page.title }}

By default, strict mode is enabled to have a safer, predictable and reproducible experience.

## Checking for strict mode
:::tip
```typescript
declare function isStrictModeOn(): boolean;
```
:::

By using `µ.isStrictModeOn()` you can determine whether or not strict mode is on.

## Setting strict mode
:::tip
```typescript
declare function setStrictMode(strict: boolean): this;
declare function turnStrictModeOn(): this;
declare function turnStrictModeOff(): this;
```
:::

You can either manually set strict mode using `µ.setStrictMode` or use the specialized `µ.turnStrictModeOn()`
and `µ.turnStrictModeOff()`.

## Execute maybe unsafe code
:::tip
```typescript
declare function doWithoutStrictMode<R>(callback: Callback<R>): this;
```
:::

Sometimes you may want to temporarily execute code without strict mode, for instance you want to try to register plugins
and don't care about failure if it's already registered. You can do that with `µ.doWithoutStrictMode`.

```javascript
µ.registerPlugin("life", 42);

µ.doWithoutStrictMode(() => {
    µ.registerPlugin("stuff", () => {});
    µ.registerPlugin("life", 42);
}); // No exception thrown
```
