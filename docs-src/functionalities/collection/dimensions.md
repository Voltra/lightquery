---
title: Dimensions
description: Manipulate the dimensions (width, height)
lang: en-US
---
# {{ $page.title }}
:::tip
```typescript
declare function width(value?: string|number): this|number|null;
declare function height(value?: string|number): this|number|null;
declare function borderBoxWidth(): number|null;
declare function borderBoxHeight(): number|null;
declare function marginBoxWidth(): number|null;
declare function marginBoxHeight(): number|null;
```
:::

//TODO: Schéma (largeur de base + padding + border + margin)

## LightqueryCollection#width

Get/set the width:
```javascript
const $e = µ(/**/);

$e.width(); //-> 1920
$e.width("100vw"); //-> $e
$e.width(); //-> 1920 (on a 1920x1080 screen for instance)

$e.width(960); //-> $e
$e.width(); //-> 960
```

## LightqueryCollection#height

Get/set the height:
```javascript
const $e = µ(/**/);

$e.height(); //-> 100
$e.height("100vh"); //-> 1030
$e.height(); //-> 1030 (on a 1920x1080 screen with about 50px of topbar for instance)

$e.height(960); //-> $e
$e.height(); //-> 960
```

## LightqueryCollection#borderBoxWidth

Get the width including the borders:
```javascript
const $e = µ(/**/);

$e.width(500).css("border-width", "5px"); //-> $e
$e.borderBoxWidth(); //-> 510
```

## LightqueryCollection#borderBoxHeight

Get the height including up to the borders:
```javascript
const $e = µ(/**/);

$e.height(300).css({
    borderTopWidth: "2px",
    borderBottomWidth: "8px",
}); //-> $e

$e.borderBoxHeight(); //-> 310
```

## LightqueryCollection#marginBoxWidth

Get the height including up to the margins:
```javascript
const $e = µ(/**/);

$e.width(300).css({
    borderLeftWidth: "2px",
    borderRightWidth: "8px",
    marginLeft: "5px",
    marginRight: "5px",
}); //-> $e

$e.marginBoxWidth(); //-> 320
```

## LightqueryCollection#marginBoxHeight

Get the height including up to the margins:
```javascript
const $e = µ(/**/);

$e.height(800).css({
    borderTopWidth: "2px",
    borderBottomWidth: "8px",
    marginTop: "5px",
    marginBottom: "5px",
}); //-> $e

$e.marginBoxHeight(); //-> 820
```
