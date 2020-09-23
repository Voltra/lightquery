---
title: Misc
description: Miscellaneous helper methods 
lang: en-US
---
# Misc

## Context selection
:::tip
```typescript
type GenericCallback<T, R> = (arg: T) => R;
type LightqueryFactory_selectCallback = GenericCallback<string, LightqueryCollection>;
interface LightqueryFactorySelectObject{
    select: LightqueryFactory_selectCallback;
}

declare function from(context: DomElementType): LightqueryFactorySelectObject;
```
:::

You can restrict the scope from which the DOM is queried by using `µ.from`:
```javascript
µ.from(document.getElementById("footer")) //-> LightqueryFactorySelectObject
    .select("a[data-download]"); // -> LightqueryCollection[ ... ]
```

## Object extension/merging
:::tip
```typescript
declare function extend(target: Object, ...objects: Object[]): Object;
```
:::

Usual helper to merge defaults with user provided options (note that `target` is mutated and is what's returned).
```javascript
µ.extend({open: "source"}, {hello: "world"}); //-> {open: "source", hello: "world"}
```

## CSS Variables
:::tip
```typescript
declare function cssVar(variable: string, value: string|number|undefined): this|string|number|null;
```
:::

Get or set the value of a CSS variable in the `:root` context (i.e. global).

```javascript
µ.cssVar("color", "red"); //-> µ
µ.cssVar("--color"); //-> "red"
```

## Creating DOM parts
:::tip
```typescript
declare function create(htmlString: string): LightqueryCollection;
```
:::

You can mimick the DOM creation capability of jQuery using `µ.create`.
Let's say you have the following HTML structure:
```html
<html>
    <!-- [...] -->
    <body>
        <!-- [...] -->
        <div id="app">
            <!-- [...] -->
        </div>
        <!-- [...] -->
    </body>
</html>
```

You can therefore do:
```javascript
µ.create(`
    <div class="alert alert-danger">Hello World!</div>
    <div class="alert alert-success">Multiple items at once!</div>
`).appendTo(document.body);
```

And therefore end up with:
```html
<html>
    <!-- [...] -->
    <body>
        <!-- [...] -->
        <div id="app">
            <!-- [...] -->
        </div>
        <!-- [...] -->
        <div class="alert alert-danger">Hello World!</div>
    </body>
</html>
```
