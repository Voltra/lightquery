---
title: Events
description: Global events handling
lang: en-US
---
# {{ $page.title }}

## After the DOM is loaded
:::tip
```typescript
declare function ready<R>(callback: Callback<R>): LightqueryCollection;
```
:::

Just like jQuery, you can use `µ.ready` to execute a callback on DOM load (or immediately if it's already loaded).

## On resize
:::tip
```typescript
declare function resize(listener: EventListener): LightqueryCollection;
```
:::

You can use `µ.resize` to listen to both resizing events and orientation change events.
