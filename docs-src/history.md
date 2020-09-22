---
title: A bit of history
description: From the first draft to the latest release
lang: en-US
---
# A bit of history

This project is one of my first projects, if not my very first actual project.
As such, it reflects my growth in terms of web development and library design.

It first started as a sort of experimental clone of jQuery using my, at the time, quite limited understanding of the whole
JavaScript ecosystem and the possibilities it provides. As such, it was designed as a ~~almost~~ pure ES5 single file library.
Everything was stuck together, poorly documented, using a few ES6 features without care for browser compatibility.

One of the big improvements over time is how the dichotomy between the "factory" (i.e. `µ` or `$`) and the actual result object.
In the very first version the factory was basically a class that inherits from the native `Function` with a few added properties ;
the result objects were a class that inherits from the native `Array` (to make it iterable). As a result a lot of things were
a bit weird with a lot of undesired functionalities.

As of v1.0.0 the design is a lot cleaner using a somewhat clever trick to be able to create callable objects and actually
 making use of `Symbol.iterator` for the result objects.
 
 A very significant example of how things have changed is how cloning works:
 
 ```javascript
//// NEW
class LightqueryFactory extends Callable{ // µ is an instance of that class
    // [...]

    cloneLightquery(){
	    return new LightqueryFactory(this.__.collectionClass, this.__.strictMode);
    }

    // [...]
}

//// OLD
Function.prototype.clone4lightquery = function() {
    // Function.prototype.clone4lightquery is a hack to clone a function properly
    var newfun = new Function('return ' + this.toString())();

    for(var key in this)
        newfun[key] = this[key];

    Object.assign(newfun.prototype, this.prototype);
    return newfun;
};

lightquery.createOtherLightquery = function(newName){ // here µ was lightquery
    // [...]
    var newConstructorName = /**/;

    window.lightqueryCreators[newConstructorName] = this.createLightqueryObject.clone4lightquery();
    let func = this.createLightqueryObject.prototype.lightqueryID.clone4lightquery();

     Object.defineProperty(window.lightqueryCreators[newConstructorName].prototype, "lightqueryID", {
        value: func,
        enumerable: false,
        configurable: false,
        writable: false
    });

    Object.defineProperty(func, "createLightqueryObject", {
        value: window.lightqueryCreators[newConstructorName],
        enumerable: false,
        configurable: false,
        writable: false
    });

    //setup constructor's constructor signature
    window.lightqueryCreators[newConstructorName].prototype.constructor = window.lightqueryCreators[newConstructorName];

    //setup function's name
    func.fname = ( (newLightqueryName) ? ""+newLightqueryName : newConstructorName );

    //finally return the function
    return func;
}
```

In addition to code quality, the overall development experience is way better.
I use my usual toolchain to build down to ES5 and have a semi-separate toolchain to build clean ESM.
