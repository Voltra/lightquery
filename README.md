# **LIGHTQUERY** #
![](logo/logo.png)
## What is lightquery ? ##
Lightquery is a ~~big~~ library for javascript that tends to follow the mindset, patterns and philosophy behind jQuery and propose a lighter alternative to it.

Just like jQuery it is mainly designed around DOM manipulations but also gives a lot of tools for other aspects of javascript.

## Why lightquery ? ##
**NAME**<br/>
The name is, let's be honest, not original and has been used many many times.
This library tend to be the one that is truly lighter than jQuery : as light as a feather on your workflow.

**USE**<br/>
You should consider using lightquery because it tends to be lighter, easier to use and has several sets of protection which can be really handy when trying to understand what goes wrong in your code.

## How do I get this library fam ? ##
Well I'm glad you asked, you can grab this library easily, either by downloading it directly from the GitHub&copy; repository or by downloading it from NPM (*light_query*).

***WARNING*** Don't use require yet, it's not ready for it, it's still in a in-dev state !


Once you grabbed the library, you just need to use it either by using a `<script>` tag or `require`'in it :

***NPM***
```bash
npm install light_query
```

***In HTML***
```html
<!DOCTYPE html>
<html>
	<head>
		<!-- [...] -->
		<script src="/the/path/to/the/lightquery/js/file"></script>
		<!-- [...] -->
	</head>

	<body>
		<!-- [...] -->
	</body>
</html>
```

***In JS (require)***
```javascript
const lightquery = require("path/to/lightquery");
```

## jQuery vs lightquery ? $ vs µ ? ##
It is true that jQuery is way more "battle-tested" than lightquery. It has been around for ages and is probably the most used library in javascript.

However, lightquery tends to have some advantages over jQuery.

***Plugin System***
```javascript
//Just to explain some words I use:

lightquery("*").cs() //cs is an INSTANCE plugin
lightquery.go() //go is a GLOBAL plugin
```

Here's the feature that I am the most proud of : the plugin system.
There are two main methods to lightquery that are used for 3rd-party plugins : `registerPlugin` (has many aliases) and `removePlugin`.

Unlike jQuery, lightquery has a built-in plugin system, let me explain :
`$.fn.myPlugin =` is (sadly) strictly equivalent to `$.prototype.myPlugin =`. This is the **only** way to add *instance* plugins in jQuery. There's no protection whatsoever, and you might accidentally override another library that could use the same name.

That is where lightquery's plugin system is handy : by using only `registerPlugin` and `removePlugin` there is absolutely **NO WAY** for you to :
- Override an already existing plugin
- Override a core functionality of lightquery

Of course you could still use `lightquery.prototype.myPlugin =` but let's not do unsafe things, there are methods for that let's use them ;) !

Another interesting point in lightquery's plugin system is that you use the same method to register/remove a *global* plugin or an *instance* plugin :
```javascript
µ.registerPlugin("cs", x=>"cs"); //shorthand for instance plugin declaration
µ.registerPlugin("go", x=>"go", "global"); //global plugin declaration
µ.registerPlugin("cod", x=>"cod", "instance"); //instance plugin declaration

µ.removePlugin("cs"); //shorthand for removing an instance plugin
µ.removePlugin("go", "global"); //remove a global plugin
µ.removePlugin("cod", "instance"); //remove an instane plugin
```
Whereas, with jQuery, *instance* plugins are declared using `$.fn.myPlugin = ` and *global* plugins using `$.myPlugin =`.

***Completely Array-ish***<br/>
When you use jQuery, the result is an Array-like set but it doesn't have the enormous advantages of being an Array-ish object :

lightquery uses a "class" that inherits from Array, which means that you can use all the methods available for Arrays on you lightquery object (**warning**, those methods aren't overloaded which means that you'll not get a lightquery object out of their calls) :
```javascript
µ([1,2,3]).filter(x=>x%2!=0); // returns [1, 3] (a regular Array, not a lightquery object)
```

Therefore, you can use `map`, `reduce`, `filter`, `forEach`, etc... and get arrays from your lightquery objects ; in fact, those methods are heavily used in the development of this library :D !

Just like jQuery kinda does, you can now use `Map`, `Reduce`, `Filter` and `each` to get a lightquery object back (where `map`, `reduce`, `filter` and `forEach` would return an Array).

***CSS variables***<br/>
jQuery doesn't support CSS variables handling, that's a fact.
Before shouting
>"HEY ! That's not true, there's a plugin for it !"

well firstly it's a plugin, therefore not built-in, and secondly you are probably referring to [`jq-cssvar`](https://www.npmjs.com/package/jq-cssvar) and there's a detail you might not be aware of : I'm the developer behind the jQuery plugin called `jq-cssvar` (at least that's how I named it for NPM, I mostly call it cssVar, much more stylish, dem fookin camelCase :3).

The jQuery plugin `jq-cssvar` is simply a ported version of lightquery's built-in `cssVar` global and instance methods (made using the jQuery's terrific plugin system :3).

***Lightquery Instances***<br/>
Don't get me wrong, I'm not referring to instances like `µ("*")` I'm actually referring to copies of lightquery you can actually make.
The name might change in the future (I'll remind myself to update it here, or keep a legacy name idk), but for now let's keep our lovely global method `createOtherLightquery`.

This is for creating an independent copy of the lightquery you apply the method on.

That means that, you can register a plugin on one version (x), copy this version (to y), register a plugin on the previous version (x) and the latter (y) will not be able to use it.

You might cry and tell me *"Muh what if I wan't make a copy of the original lightquery, the one without any plugin :'( &nbsp;&nbsp;?"*. Fear no more ! There's an already existing instance of lightquery called `immutableLightQuery` which, just like the name suggests, is **completely** immutable.

Therefore `const x = immutableLightQuery.createOtherLightquery("x")` guarantees you to get a copy of the original lightquery, a copy which you can modify and add plugins to (unlinke `immutableLightQuery`).

Those are strictly airtight copies, there will be no interference whatsoever.

This is, to my knowledge, impossible to do easily using jQuery (noConflict doesn't achieve it).


## Okay thanks fam but I need more details about lightquery ##
Fear no more! Just read the [official wiki](https://github.com/Voltra/lightquery/wiki).