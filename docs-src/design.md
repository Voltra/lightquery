---
title: About the design
description: Stay close to the original, but don't make it a carbon copy
lang: en-US
---

# About the design

Although one of the main concerns is to have the same mindset and philosophy as jQuery, Lightquery is not a drop-in replacement.
One of the major changes from in-dev to v1.0.0 is that Lightquery is now purely about DOM manipulation, no longer can you
use it as a fancy wrapper around arrays (like `µ([1,2,3])` used to be valid).

Many things jQuery does bug me, for instance the `$.each` that allow for traversing array-like and objects is nice but
is it really needed? Does it make sense with how it's designed? If you used `$("mySelector).each` you know how painful it
is to see the index come first and the element second, it's one of the drawbacks of `$.each`: the key (or index for arrays)
comes first.

There are also things I refused to do either because it would create confusion or because it didn't suit the vision I had
for this library. For instance `$("<div class='btn'>CTA</div>")` creates a DOM node waiting to be attached, this creates confusion
because it is a string (virtually indistinguishable from a CSS selector). For this specific instance I opted for the alternative
`µ.create("<div class='btn'>CTA</div>")` which is designed to work with HTML strings and leaves `µ("some string")`
to be a CSS selector.

## The classes

`µ` (or `lq`, or `$`, or `lightquery`) is an instance of `LightqueryFactory` which is a callable type.
The result of a call of `µ` is a `LightqueryCollection` which is iterable and an array-like type (it has 0-based integer indexing and a length).

There are two implementation details classes: `LightqueryFactoryImplDetails` and `LightqueryCollectionImplDetails`.
The two main classes have a property `__` that is an instance of their respective implementation details class.

## Strict mode

There's this new thing called strict mode, it's enabled by default and what that means is that if you do anything,
and I do mean *anything* wrong, it will blow up on you (either by throwing an exception or, on some rare occasion, return null or undefined).

There's an API to play with it if you want (on `LightqueryFactory`):
* `isStrictModeOn`
* `setStrictMode`
* `turnStrictModeOn`
* `turnStrictModeOff`

If you develop plugins please do use this API to provide consistency in error handling. You also have `µ.__.ifStrict` that
can execute a callback if strict mode is on (useful for throwing exceptions for instance), there's also `µ("any selector").__.ifStrict`
that serves the same purpose.

## The plugin system

Oh boy did I not want to let this baby go. Recently, using mostly dynamically typed languages, I've had a bit of fun with
magic/runtime defined methods. It's truly a shame there is not much support for typing those things (or proper extension methods)
because it often becomes hell to add type information about these.

Anyway, the plugin system works just like before, except I removed the aliases we now only have `registerPlugin`,
`hasPlugin` and `removePlugin` all defined on `LightqueryFactory`.

## Compatibilities with jQuery

I maintained the function signatures for most methods where it made sense and did not bug me in any way. Some methods are missing,
some have somewhat different meanings, some have been renamed, some have been replaced by similar features but differently designed.