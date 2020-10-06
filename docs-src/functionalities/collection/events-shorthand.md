---
title: Events shorthand
description: Shorthand methods to trigger and listen to events
lang: en-US
---
# {{ $page.title }}
:::tip
```typescript
declare function click(listener?: EventListener): this;
declare function doubleClick(listener?: EventListener): this;
declare function mouseUp(listener?: EventListener): this;
declare function mouseDown(listener?: EventListener): this;
declare function mouseEnter(listener?: EventListener): this;
declare function mouseLeave(listener?: EventListener): this;
declare function hover(onEnter: EventListener, onLeave: EventListener): this;
declare function focus(listener?: EventListener): this;
declare function blur(listener?: EventListener): this;
declare function change(listener?: EventListener): this;
declare function input(listener?: EventListener): this;
declare function submit(listener?: EventListener): this;
declare function contextMenu(listener?: EventListener): this;
```
:::

All these methods (just like the [`LightqueryCollection#trigger`](/functionalities/collection/multiple-items/events/#lightquerycollection-trigger) use the [Custom event API](https://developer.mozilla.org/docs/Web/API/CustomEvent).
Triggering and listening is on each element. Just like regular `addEventListener`, the callback's `this` is bound to
the current element ; thus avoid arrow functions.

## LightqueryCollection#click

Trigger or listen for click events:
```javascript
µ(/**/).click(); //-> this LightqueryCollection
// Triggers click events

µ(/**/).click(onClick); //-> this LightqueryCollection
// Listen for click events
```

:::warning
Note that both a `mousedown` and a `mouseup` event are triggered before a `click` event.
:::

## LightqueryCollection#doubleClick

Trigger or listen for double clicks:
```javascript
µ(/**/).doubleClick(); //-> this LightqueryCollection
// Triggers dblclick events

µ(/**/).doubleClick(onDoubleClick); //-> this LightqueryCollection
// Listen for dblclick events
```

:::warning
Note that two `click` events are triggered before a single `dblclick`.
:::

## LightqueryCollection#mouseUp

Trigger or listen for mouse up events:
```javascript
µ(/**/).mouseUp(); //-> this LightqueryCollection
// Triggers mouseup events

µ(/**/).mouseUp(onMouseUp); //-> this LightqueryCollection
// Listen for mouseup events
```

:::tip
Useful in tandem with [`mouseDown`](#lightquerycollection-mousedown") to get a "longpress" event simulation.
:::

## LightqueryCollection#mouseDown

Trigger or listen for mouse down events:
```javascript
µ(/**/).mouseDown(); //-> this LightqueryCollection
// Triggers mousedown events

µ(/**/).mouseDown(onMouseDown); //-> this LightqueryCollection
// Listen for mousedown events
``` 

:::tip
Useful in tandem with [`mouseUp`](#lightquerycollection-mouseup) to get a "longpress" event simulation.
:::

## LightqueryCollection#mouseEnter

Trigger or listen for mouse entering (i.e. start hovering) events:

```javascript
µ(/**/).mouseEnter(); //-> this LightqueryCollection
// Triggers mouseenter events

µ(/**/).mouseEnter(onEnter); //-> this LightqueryCollection
// Listen for mouseenter events
```

## LightqueryCollection#mouseLeave

Trigger or listen for mouse leaving (i.e. end of hovering) events:

```javascript
µ(/**/).mouseLeave(); //-> this LightqueryCollection
// Triggers mouseenter events

µ(/**/).mouseLeave(onLeave); //-> this LightqueryCollection
// Listen for mouseenter events
```

## LightqueryCollection#hover

Handle hovering:

```javascript
const $e = µ(/**/);

$e.hover(onEnter, onLeave); //-> $e

// is equivalent to

$e.mouseEnter(onEnter).mouseLeave(onLeave); //-> $e
```

:::tip
Ideal for handling hovering state.
:::

## LightqueryCollection#focus

Give focus or listen for focus events:
```javascript
µ(/**/).focus(); //-> this LightqueryCollection
// Triggers focus events

µ(/**/).focus(onFocus); //-> this LightqueryCollection
// Listen for focus events
```

## LightqueryCollection#blur

Remove focus or listen for blur events:
```javascript
µ(/**/).blur(); //-> this LightqueryCollection
// Triggers blur events

µ(/**/).blur(onBlur); //-> this LightqueryCollection
// Listen for blur events
```

## LightqueryCollection#change

Trigger or listen for change events:
```javascript
µ(/**/).change(); //-> this LightqueryCollection
// Triggers change events

µ(/**/).change(onChange); //-> this LightqueryCollection
// Listen for change events
```

:::tip
Read [this stackoverflow answer](https://stackoverflow.com/a/17047607) for the difference between `input` and `change` events.
:::

## LightqueryCollection#input

Trigger or listen for input events:
```javascript
µ(/**/).input(); //-> this LightqueryCollection
// Triggers input events

µ(/**/).input(onInput); //-> this LightqueryCollection
// Listen for input events
```

:::tip
Read [this stackoverflow answer](https://stackoverflow.com/a/17047607) for the difference between `input` and `change` events.
:::


## LightqueryCollection#submit

Trigger or listen for submit events (on forms):
```javascript
const $form = µ("form");

$form.submit(); //-> this LightqueryCollection
// Triggers submit events

$form.submit(onSubmit); //-> this LightqueryCollection
// Listen for submit events
```

:::warning
This will only be useful on forms.
:::

## LightqueryCollection#contextMenu

Trigger or listen for context menu events:
```javascript
$form.contextMenu(); //-> this LightqueryCollection
// Triggers contextmenu events

$form.contextMenu(onOpenContextMenu); //-> this LightqueryCollection
// Listen for contextmenu events
```

:::warning
This is very handy for creating custom context menus
:::

