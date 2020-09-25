---
title: Exports
description: What the library exposes
lang: en-US
---
# {{ $page.title }}

This library exports the following items:

```javascript
// >ES6
import { µ, $, lq, lightquery, makePureLightquery } from "light_query"

// node
const { µ, $, lq, lightquery, makePureLightquery } = require("light_query");

// browser
const { µ, $, lq, lightquery, makePureLightquery } = window;
```

`$`, `lq` and `lightquery` are all aliases to the same `µ` (i.e. an instance of `LightqueryFactory`).

`makePureLightquery` is a simple function that allows to create a new blank copy of the default instance of `LightqueryFactory`.

:::tip
The function signature is the following

```typescript
declare function makePureLightquery(strict?: boolean);
```

Thus you can write:
* `makePureLightquery()` or `makePureLightquery(true)` to create a new instance with strict mode ON
* `makePureLightquery(false)` to create a new instance with strict mode OFF 
:::
