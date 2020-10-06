---
title: Info
description: Retrieve information from the first result
lang: en-US
---
# {{ $page.title }}
:::tip
```typescript
type LightqueryCollection_setValueFactory<T = any, U = any, V = any> = (oldValue: T, destObject: U, key: string) => V;
type LightquerySetValueFactory = LightqueryCollection_setValueFactory<string, DomElementType, string>;

declare function text(value?: LightquerySetValueFactory|string|number|null): this|string|null;
declare function val(value?: LightquerySetValueFactory|string|number|null): this|string|null;
declare function html(value?: LightquerySetValueFactory|string|number|null): this|string|null;
declare function attr(name: string, value?: LightqueryCollection_setValueFactory<string, NamedNodeMap, string>|string|number|null): this|string|null;
declare function prop(name: string, value?: LightquerySetValueFactory|string|number|null): this|string|number|null|undefined;
declare function data(name: string, value?: LightqueryCollection_setValueFactory<string, DOMStringMap, string>|string|number|null): this|string|null;
```
:::

Note that trying to get something from an empty collection will result in `null` while trying to set will just be a noop
(in strict mode).

## LightqueryCollection#text
Get or set the text content of the first item.

```javascript
µ([]).text();
//-> null (w/ strict mode)
//-> an empty string (w/o strict mode)

µ(/**/).text(); //-> a string

µ(/**/).text(""); //-> the same LightqueryCollection

µ(/**/).text((oldText, el, property) => {
    // property will always be "textContent"
    // Generate and return your new text
}); //-> this LightqueryCollection
```

## LightqueryCollection#val
Get or set the value of the first item (for form fields).

```javascript
µ(/**/).val(); //-> value as a string

µ(/**/).val(42); //-> this LightqueryCollection

µ(/**/).val((oldText, el, property) => {
    // property will always be "value"
    // Generate and return your new value
}); //-> this LightqueryCollection
```

## LightqueryCollection#html
Get or set the inner HTML of the first item.

```javascript
µ([]).html();
//-> null (w/ strict mode)
//-> an empty string (w/o strict mode)

µ(/**/).html(); //-> a string

µ(/**/).html(""); //-> the same LightqueryCollection

µ(/**/).html((oldHtml, el, property) => {
    // property will always be "innerHTML"
    // Generate and return your new HTML content
}); //-> this LightqueryCollection
```

## LightqueryCollection#attr
Get or set an attribute of the first item.

```javascript
µ([]).attr("value");
//-> null (w/ strict mode)
//-> an empty string (w/o strict mode)

µ(/**/).attr("value", 42); //-> this LightqueryCollection

µ(/**/).attr("value", (oldValue, attributes, attribute) => {
    // attributes is the Element's `attribute` property (see https://developer.mozilla.org/docs/Web/API/Element/attributes)
    // Generate and return your new attribute value
}); //-> this LightqueryCollection
```

:::tip
`attr()` is for the HTML attributes (thus visible on the DOM).
:::

## LightqueryCollection#prop

Get or set a property of the first item

```javascript
µ([]).prop("key");
//-> null (w/ strict mode)
//-> an empty string (w/o strict mode)

µ(/**/).prop("key"); //-> its value

µ(/**/).props("key", "value"); //-> this LightqueryCollection

µ(/**/).prop("key", (oldValue, el, propName) => {
    // Generate and return your new property value
}); //-> this LightqueryCollection
```

:::tip
`prop()` is for JS properties of the DOM nodes/elements (usually not visible on the DOM).
:::

## LightqueryCollection#data
Get or set a data attribute of the first item

```javascript
µ([]).data("key");
//-> null (w/ strict mode)
//-> an empty string (w/o strict mode)

µ(/**/).data("key"); //-> its value as a string

µ(/**/).data("key", "value"); //-> this LightqueryCollection

µ(/**/).data("key", (oldValue, dataset, dataName) => {
    // dataset is the Element's `dataset` property (see https://developer.mozilla.org/docs/Web/API/HTMLElement/dataset)
    // Generate and return your new data attribute value
}); //-> this LightqueryCollection
```
