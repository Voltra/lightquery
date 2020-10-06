---
title: Removal
description: Remove things from each element
lang: en-US
---
# {{ $page.title }}
:::tip
```typescript
declare function removeAttr(attr: string): this;
declare function removeProp(prop: string): this;
declare function removeData(data: string): this;
```
:::

## LightqueryCollection#removeAttr

Remove an attribute from each element.
```javascript
µ(":checkbox").removeAttr("checked"); //-> this LightqueryCollection
// all checkboxes will be unchecked
```

## LightqueryCollection#removeProp

Remove a property from each element
```javascript
const $e = µ(/**/);
$e.prop("myProp", 42); // kind of "secret"
// Later
$e.removeProp("myProp"); //-> this LightqueryCollection
```

## LightqueryCollection#removeData

Remove a data attribute from each element.
```javascript
µ("[data-src]")
.filter(enteredViewport)
.forEach(loadImageSync)
.removeData("src"); //-> this LightqueryCollection
// none will have the data-src attribute
```
