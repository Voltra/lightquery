---
title: Classes
description: Manipulate the classes of the set of results   
lang: en-US
---
# {{ $page.title }}
:::tip
```typescript
declare function addClass(classNames: string): this;
declare function removeClass(classNames: string): this;
declare function toggleClass(classNames: string): this;
```
:::

Each of these methods accepts a [spaced separated string](/design#spaced-separated-strings) to manipulate multiple classes at once (just like using jQuery).

## LightqueryCollection#addClass

Add classes to each element.
```javascript
µ(/**/).addClass("btn");  //-> this LightqueryCollection
// every item has now the class `btn`

µ(/**/).addClass("btn btn-primary"); //-> this LightqueryCollection
// every item has now both classes (`btn` and `btn-primary`)
```

## LightqueryCollection#removeClass

Remove classes for each element.
```javascript
µ(/**/).removeClass("btn btn-primary"); //-> this LightqueryCollection
// now none of the items have any of these classes
```

## LightqueryCollection#toggleClass

Toggle classes for each element.
:::warning
Toggling is on a per item basis (i.e. [has, doesn't have, has] toggled will give [doesn't have, has, doesn't have]).
:::

```javascript
µ(/**/).toggleClass("active"); //-> this LightqueryCollection
```
