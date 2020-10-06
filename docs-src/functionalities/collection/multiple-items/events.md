---
title: Event handling
description: Handle events
lang: en-US
---
# {{ $page.title }}
:::tip
```typescript
declare function on(eventNames: string, listener: EventListener): this;
declare function off(eventNames: string, listener: EventListener): this;
declare function trigger(eventNames: string, options?: Object): this;
```
:::

Each method accepts a [space-separated string](/design#space-separated-strings) for event names.
This API can be used w/ custom event names (as `trigger()` allows custom events).

## LightqueryCollection#on

Attach an event listener to multiple events. Note that `this` will be bound to the element in the listener,
thus try to avoid the use of arrow functions.

```javascript
const onClick = function(e){
    e.preventDefault();
    doStuffWith(this);
};

µ(/**/).on("click touch", onClick); //-> this LightqueryCollection
```

## LightqueryCollection#off

Detach an event listener for multiple events. Note that the listener must be the ***exact*** same function.

```javascript
µ(/**/).off("click touch", onClick); //-> this LightqueryCollection
```

## LightqueryCollection#trigger

Trigger multiple events. Note that you can pass [custom options](https://developer.mozilla.org/docs/Web/API/CustomEvent/CustomEvent#Parameters).
These options will be on the event instance. There will always be a `target` property that corresponds to the element on
which the event is triggered.

```javascript
µ(/**/).trigger("click"); //-> this LightqueryCollection
```

:::tip
This method uses the [Custom events API](https://developer.mozilla.org/docs/Web/API/CustomEvent).
:::
