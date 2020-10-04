---
title: Dom traversal
description: Go through the DOM in any direction with any depth limit
lang: en-US
---
# {{ $page.title }}
:::tip
```typescript
declare function closest(selector: string): LightqueryCollection;
declare function children(selector?: string): LightqueryCollection;
declare function parent(selector?: string): LightqueryCollection;
declare function parents(selector?: string): LightqueryCollection;
declare function find(selector?: string): LightqueryCollection;
declare function has(selector: string): LightqueryCollection;
declare function prevAll(selector?: string): LightqueryCollection;
declare function nextAll(selector?: string): LightqueryCollection;
declare function siblings(selector?: string): LightqueryCollection;
declare function prev(): LightqueryCollection;
declare function next(): LightqueryCollection;
```
:::

All of these allow to optionally pass a CSS selector to restrict the matching.

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
        <!-- [...] -->
    </body>
</html>
```

## LightqueryCollection#closest

Get the [closest](https://developer.mozilla.org/docs/Web/API/Element/closest) sibling of each element.
```javascript
µ("#myfile").closest("div"); //-> LightqueryCollection[ div.js-form ]
µ(".js-form__file").closest("div"); //-> LightqueryCollection[ div.js-form ]
µ("#yesiam").closest("form"); //-> LightqueryCollection[ form#beta ]
```

## LightqueryCollection#children

Get the children (i.e. direct descendants) of each element.
```javascript
µ("#alpha").children(); //-> LightqueryCollection[ span.alert.alert-danger, form#beta ]
µ("#alpha").children("span"); //-> LightqueryCollection[ span.alert.alert-danger ]
µ("#alpha").children("div"); //-> LightqueryCollection[ ]
```

## LightqueryCollection#parent

Get the parent (i.e. direct ancestor) of each element.
```javascript
µ(".form-control").parent(); //-> LightqueryCollection[ form#beta ]
µ(".form-control").parent("div"); //-> LightqueryCollection[ ]
```

## LightqueryCollection#parents

Get the ancestors of each elements.
```javascript
µ("#yesiam").parents(); //-> LightqueryCollection[ div.form-control, form#beta, div#alpha, body, html ]
µ("#yesiam").parents("div"); //-> LightqueryCollection[ div.form-control, div#alpha ]
µ(document.documentElement).parents(); //-> LightqueryCollection[ ]
```

## LightqueryCollection#find

Get the descendants of each elements.
```javascript
µ("#beta").find(); //-> LightqueryCollection[ div#fieldA, div#fieldB, input#yesiam, div.js-form, div.js-form__file, input#myfile ]
µ("#beta").find("input"); //-> LightqueryCollection[ input#yesiam, input#myfile ]
µ("#beta").find("a"); //-> LightqueryCollection[ ]
```

## LightqueryCollection#has

Filter the result set to elements that have a descendant that match the given selector.
```javascript
µ(".alert").has("input"); //-> LightqueryCollection[ ]
µ(".form-control").has("div"); //-> LightqueryCollection[ div#fieldB ]
```

## LightqueryCollection#prevAll

Get all the previous siblings of each element.
```javascript
µ("#s3").prevAll(); //-> LightqueryCollection[ span#s2, span#s1 ]
µ("#s3").prevAll(".odd"); //-> LightqueryCollection[ span#s1 ]
µ("#s1").prevAll(); //-> LightqueryCollection[ ]
```

## LightqueryCollection#nextAll

Get all the next siblings of each element.
```javascript
µ("#s5").nextAll(); //-> LightqueryCollection[ span#s6, span#s7 ]
µ("#s5").nextAll(".odd"); //-> LightqueryCollection[ span#s7 ]
µ("#s7").nextAll(); //-> LightqueryCollection[ ]
```

## LightqueryCollection#siblings

Get all the siblings of each element.
```javascript
µ("#s4").siblings(); //-> LightqueryCollection[ span#s1, span#s2, span#s3, span#s5, span#s6, span#s7 ]
µ("#s4").siblings(".even"); //-> LightqueryCollection[ span#s2, span#s6 ]
```

## LightqueryCollection#prev

Get the previous sibling (i.e. previous neighbor) of each element.
```javascript
µ("#s4").prev(); //-> LightqueryCollection[ span#s3 ]
µ("#s1").prev(); //-> LightqueryCollection[ ]
```

## LightqueryCollection#next

Get the next sibling (i.e. next neighbor) of each element.
```javascript
µ("#s4").next(); //-> LightqueryCollection[ span#s5 ]
µ("#s7").next(); //-> LightqueryCollection[ ]
```
