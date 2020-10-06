---
title: Dom manipulation
description: Edit and manipulate the DOM
lang: en-US
---
# {{ $page.title }}
:::tip
```typescript
type ElementOrLightquery = DomElementType|LightqueryCollection;
type ElementsOrLightquery = DomElements|LightqueryCollection;

declare function append(elements: ElementsOrLightquery): this;
declare function appendTo(element: ElementOrLightquery|string): this;
declare function prepend(elements: ElementsOrLightquery): this;
declare function prependTo(element: ElementOrLightquery|string): this;
declare function before(elements: ElementsOrLightquery): this;
declare function insertBefore(element: ElementOrLightquery|string): this;
declare function after(elements: ElementsOrLightquery): this;
declare function insertAfter(element: ElementOrLightquery|string): this;
declare function remove(): LightqueryCollection;
declare function empty(): this;
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
        
        <div id="delta">
            <div class="ref"></div>
        </div>
        <!-- [...] -->
    </body>
</html>
```

## LightqueryCollection#append

Append the given elements to the first result:
```javascript
µ("#delta").append(".even"); //-> this LightqueryCollection
/*
<div id="delta">
    <div class="ref"></div>
    <span id="s2" class="even"></span>
    <span id="s4" class="even"></span>
    <span id="s6" class="even"></span>
</div>
*/
// Note that it moved the elements
```

## LightqueryCollection#appendTo

Append to the given element (dual of `LightqueryCollection#appendTo`):
```javascript
µ(".even").appendTo("#delta"); //-> this LightqueryCollection
// same effect as above

µ.create("<div class='custom'></div>")
.appendTo("#delta"); //-> LightqueryCollection[ div.custom ]
/*
<div id="delta">
    <div class="ref"></div>
    <div class="custom"></div>
</div>
*/
```

## LightqueryCollection#prepend

Prepend the given elements to the first item:
```javascript
µ("#delta").append(".even"); //-> this LightqueryCollection
/*
<div id="delta">
    <span id="s2" class="even"></span>
    <span id="s4" class="even"></span>
    <span id="s6" class="even"></span>
    <div class="ref"></div>
</div>
*/
// Note that it moved the elements
```

## LightqueryCollection#prependTo
Prepend to the given element (dual of `LightqueryCollection#prependTo`):
```javascript
µ(".even").prependTo("#delta"); //-> this LightqueryCollection
// same effect as above

µ.create("<div class='custom'></div>")
.prependTo("#delta"); //-> LightqueryCollection[ div.custom ]
/*
<div id="delta">
    <div class="custom"></div>
    <div class="ref"></div>
</div>
*/
```

## LightqueryCollection#before

Insert the given elements before the first item:
```javascript
µ("#s2").before(µ.create("<div class='custom'></div>")); //-> this LightqueryCollection
// div.custom will be before div#s2 and after div#s1
```

## LightqueryCollection#insertBefore

Insert before the given element (dual of `LightqueryCollection#before`):
```javascript
µ.create("<div class='custom'></div>")
.insertBefore("#s2"); //-> this LightqueryCollection
// Same result as above
```

## LightqueryCollection#after

Insert the given elements after the first item:
```javascript
µ("#s1").before(µ.create("<div class='custom'></div>")); //-> this LightqueryCollection
// div.custom will be after div#s1 and before div#s2
```

## LightqueryCollection#insertAfter

Insert after the given element (dual of `LightqueryCollection#after`):
```javascript
µ.create("<div class='custom'></div>")
.insertAfter("#s1"); //-> this LightqueryCollection
// Same result as above
```

## LightqueryCollection#remove

Remove each element from the DOM:
```javascript
µ("#delta > *").remove(); //-> LightqueryCollection[  ]
// div#delta is now empty
```

## LightqueryCollection#empty

Empty the content of each element:
```javascript
µ("#delta").empty(); //-> this LightqueryCollection
// div#delta is now empty
```

