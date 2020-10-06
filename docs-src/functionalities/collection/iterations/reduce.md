---
title: LightqueryCollection#reduce
description: Apply a reduction of the set of matched elements
lang: en-US
---
# {{ $page.title }}

:::tip
```typescript
type GenericReducer<Acc = any, El = any> = (acc: Acc, el: El) => Acc;
type ElementReducer<R = any> = GenericReducer<R, Element>;
declare function reduce<Acc = any>(reducer: ElementReducer<Acc>, acc?: Acc): Acc|undefined;
```
:::

Apply a [functional fold](https://en.wikipedia.org/wiki/Fold_(higher-order_function)) over the set of matched results. This is especially useful when trying to do several collection
manipulation in a row and you do not want to add more cyclomatic complexity.

```javascript
const validationSettings = {
    // [...]
};
const fields = Object.keys(validationSettings);



µ("#myForm :input")
.reduce((formBuilder, el) => {
    if(el.name in fields)
        formBuilder.addField(el);

    return formBuilder;
}, new FormBuilder()) // here equivalent to `filter` then `each`
.build()
.validateOrFail(validationSettings)
.getAllAsObject();
```
