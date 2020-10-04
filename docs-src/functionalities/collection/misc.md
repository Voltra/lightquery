---
title: Misc
description: Miscellaneous methods on LightqueryCollection 
lang: en-US
---
# {{ $page.title }}
:::tip
```typescript
declare function add(selector: Selector, context?: DomElementType): LightqueryCollection;
declare function css(properties: string|string[]|Record<string, string|number>, value?: string|number): this|string|number|null;
declare function cssVar(variable: string, value?: string|number): this|string|number|null;
declare function animate(keyframes?: Keyframe[]|PropertyIndexedKeyframes, options?: KeyframeAnimationOptions|number
```
:::

```html
<html>
    <head>
        <!-- [...] -->
    </head>

    <body>
        <!-- [...] -->
        <div id="alpha">
            <span class="alert alert-danger">Alert lmao</span>
            <form id="beta" class="form">
                <div id="fieldA" class="form-control">
                    <input id="yesiam" type="text" name="yesiam"/>
                </div>
                <div id="fieldB" class="form-control">
                    <div class="js-form">
                        <div class="js-form__file"></div>
                        <input id="myfile" type="file" name="myfile"/>
                    </div>
                </div>
            </form>
        </div>

        <div id="gamma">
            <span id="s1" class="odd"></span>
            <span id="s2" class="even"></span>
            <span id="s3" class="odd"></span>
            <span id="s4" class="even"></span>
            <span id="s5" class="odd"></span>
            <span id="s6" class="even"></span>
            <span id="s7" class="odd"></span>
        </div>
        
        <div id="delta" style="background-color: red;">
            <div class="ref"></div>
        </div>
        <!-- [...] -->
    </body>
</html>
```

## Lightquery#add

Add elements to the current set of results:
```javascript
µ("#delta > *").add("#gamma > .even");
//-> LightqueryCollection[ div.ref, div#s2, div#s4, div#s6 ]
```

:::warning
If you used a `context` on the first selection (or the `add` selection), it won't be retained
for the result set. Thus there is no `context` on the result.
:::

## LightqueryCollection#css

Get/set css properties:
```javascript
const $delta = µ("#delta");

// Get the value
$delta.css("backgroundColor"); //-> "red"
$delta.css("background-color"); //-> "red"

// Set the value
$delta.css("backgroundColor", "blue"); //-> $delta

// Get multiple values
$delta.css(["backgroundColor"]); //-> { backgroundColor: "blue" }

// Set multiple values
$delta.css({
    backgroundColor: "white",
    width: "10px",
}); //-> $delta

$delta.css(["width", "backgroundColor"]); //-> { width: "10px", backgroundColor: "white" }
```

:::warning
Note that the results are the computed styles, not the stylsheet properties.
:::

## LightqueryCollection#cssVar

Get/set a CSS3 variable locally for each element:
```javascript
const $document = µ(document);
const $gamma = µ("#gamma");

$document.cssVar("color", "red"); //-> $document
$document.cssVar("color"); //-> "red"
$document.cssVar("--color"); //-> "red"

$gamma.cssVar("color"); //-> "red"
$gamma.cssVar("--color", "blue"); //-> $gamma
$gamma.cssVar("color"); //-> "blue"
$document.cssVar("color"); //-> "red"
```

:::warning
Getting a value will only retrieve the value of the first element.
:::

## LightqueryCollection#animate

A wrapper around [`Element#animate`](https://developer.mozilla.org/docs/Web/API/Element/animate).
```javascript
const $delta = µ("#delta");

$delta.animate([
    { // from
        opacity: 0,
    },
    { // to
        opacity: 1,
    },
], 350);

$delta.animate({
    opacity: [0, 1], // [from, to]
}, 350);
```
