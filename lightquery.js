/////////////////////////HELPERS//////////////////////////
Function.prototype.clone4lightquery = function() {
    var newfun = new Function('return ' + this.toString())();

    for(var key in this)
        newfun[key] = this[key];

    Object.assign(newfun.prototype, this.prototype);
    return newfun;
};


const lqHelpers = {
    spacedListString: {
        regex: /(\S)\s+(\S)/g,
        replacement: "$1 $2",
        splitter: " "
    },
    css_variables: {
        regex: {
            trailing: /^--\w+(?:\w|-)*$/,
            no_trailing: /^\w+(?:\w|-)*$/
        }
    },
    functions: {
        valid_name_regex: /^[$µA-Z_][0-9A-Z_$µ]*$/i,
        valid_firstChar_regex: /^[$A-Z_]$/i,
        invalid_otherChar_regex: /[^0-9A-Z_$]/ig
    },
    plugin: {},
    constructorLQ: {
        baseName: "lightqueryObject",
        nameRegex: /^lightqueryObject(\d*)$/
    },
    arrayLike: {},
    array: {}
};

lqHelpers.spacedListString.toArray = (str)=>{
    return str
        .replace(lqHelpers.spacedListString.regex, lqHelpers.spacedListString.replacement)
        .split(lqHelpers.spacedListString.splitter);
};

lqHelpers.functions.newName = (str)=>{
    if(lqHelpers.functions.valid_name_regex.test(str))
        return str;

    if(! (lqHelpers.functions.valid_firstChar_regex.test("" + str.charAt(0))))
        return lqHelpers.functions.newName("$"+str);

    return str.replace(lqHelpers.functions.invalid_otherChar_regex, "_");
};


lqHelpers.plugin.isValidPluginType = (str)=>{
    return (typeof str == typeof "abc42") && (str==="instance" || str==="global");
};

lqHelpers.arrayLike.toArray = (arrlike)=>Array.prototype.slice.call(arrlike);

lqHelpers.array.empty = (arr)=>(arr.length==0 ||  arr==[] || arr==new Array());
///////////////////////////////////////////////////////////


//// CONSTRUCTOR
/**@class lightqueryObject
*Instantiate a lightqueryObject
*@param {string | object | function} selector - the selector
*@return {lightqueryObject | lightquery | object}
*/
const lightqueryObject = function obj(selector){
    if(obj.caller === this.lightqueryID){
        if(typeof selector != typeof (x=>x*x)){
            this.selector = selector;

            this.asNode = this.lightqueryID.getNode(selector);


            this.length = ( ((this.asNode && this.asNode!=this.selector) || (typeof this.asNode == typeof [])) && (this.asNode.length || this.asNode instanceof NodeList) )
                ? this.asNode.length
                : (this.selector ? 1 : 0);



            for(let i = 0 ; i < this.length ; i+=1)
                if(this.asNode)
                this[i] = (this.asNode[i] || this.selector);


        }else
            return this.lightqueryID(document).ready(selector);
    }else{
//        return null;
        return Object.create(null);
    }
};

//// ARRAYLIKE HANDLING
lightqueryObject.prototype = Object.create( Array.prototype );
lightqueryObject.prototype.constructor = lightqueryObject;

//// METHODS
/**@memberof lightqueryObject @method eq
*Restrict the selection set to the item at the given index
*@param {int} index - the given index
*@return {lightqueryObject | null}
*/
lightqueryObject.prototype.eq = function(index){
    if(index >= 0 && index < this.length)
        return this[index] ? this.lightqueryID(this[index]) : null;
    else
        return null;
};



/**@memberof lightqueryObject @method val
*Retrieves the value property of the first element (or set the value of all of them)
*@param {string} [optional] value - the new value of the value property
*@return {value | lightqueryObject | null}
*/
lightqueryObject.prototype.val = function(value){
    if(value)
        this.forEach((e)=>{
            e.value = value;
        });
    else
        if(this[0])
            return this[0].value;
        else
            return null;


    return this.lightqueryID(this.selector);
};



/**@memberof lightqueryObject @method add
*Adds elements to the selection set based on a selector
*@param {string | HTMLelement | DOMelement | etc} Aselector - the selector to the elements to add to the set
*@return {lightqueryObject}
*/
lightqueryObject.prototype.add = function(Aselector){
    if(typeof Aselector == typeof "abc42"){
        this.selector += `, ${Aselector}`;
        return this.lightqueryID(this.selector);
    }else{
        this.unshift(Aselector);
        return this.lightqueryID(this.selector);
    }
};



/**@memberof lightqueryObject @method hasClass
*Tests whether or not the first element of the set has a certain class in its class list
*@param {string} className - the class to test
*@return {bool}
*/
lightqueryObject.prototype.hasClass = function(className){//unique class
    return this[0].classList.contains(className) || undefined;
};



/**@memberof lightqueryObject @method addClass
*Adds classes to elements of the set that didn't already had them
*@param {string} classNames - a string containing all class names ("hover   classe undeux  trois" is valid example)
*@return {lightqueryObject}
*/
lightqueryObject.prototype.addClass = function(classNames){//multiple classes
    const classes = lqHelpers.spacedListString.toArray(classNames);
    const that = this;

    classes.forEach((classe)=>{
            that.forEach((elem)=>{
                if(! lightquery(elem).hasClass(classe))
                    elem.classList.add(classe);
            });
    });

    return this.lightqueryID(that.selector);
};



/**@memberof lightqueryObject @method removeClass
*Removes classes from elements of the set that  had them
*@param {string} classNames - a string containing all class names ("hover   classe undeux  trois" is a valid example)
*@return {lightqueryObject}
*/
lightqueryObject.prototype.removeClass = function(classNames){//multiple classes
    const classes = lqHelpers.spacedListString.toArray(classNames);
    const that = this;

    classes.forEach((classe)=>{
        that.forEach((elem)=>{
            if(lightquery(elem).hasClass(classe))
                elem.classList.remove(classe);
        });
    });

    return this.lightqueryID(that.selector);
};



/**@memberof lightqueryObect @method toggleClass
*Toggles classes on all the elements of the set
*@param {string} classNames - a string containing all class names ("hover   classe undeux  trois" is a valid example)
*@return {lightqueryObject}
*/
lightqueryObject.prototype.toggleClass = function(classNames){//multiple classes
    const classes = lqHelpers.spacedListString.toArray(classNames);
    const that = this;

    classes.forEach((classe)=>{
        that.forEach((e)=>{
            const µe = that.lightqueryID(e);
            if(µe.hasClass(classe))
                µe.removeClass(classe);
            else
                µe.addClass(classe);
        });
    });

    return that.lightqueryID(that.selector);
};



/**@memberof lightqueryObject @method html
*Getter/Setter of the HTML content of the selected element
*@param {string} [optional] HTMLstring - being the string to which the HTML content will be set
*@return if HTMLstring is provided: the lightquery object the method was called on
*else: the HTML content of the first element
*/
lightqueryObject.prototype.html = function(HTMLstring){
    if(HTMLstring)
        this.asNode.forEach((e)=>e.innerHTML = HTMLstring);
    else
        if(this[0])
            return this[0].innerHTML;
        else
            return null;
    return this.lightqueryID(this.selector);
};



/**@memberof lightqueryObject @method each
*Apply a functions to each element of the set
*@param {function} func - the functions to apply (will receive current index, current element and full array)
*@return {lightqueryObject}
*
*@warning the 'this' keyword is bound to the current item at each call
*/
lightqueryObject.prototype.each = function(func){
    if(func){
        const list = this;
        for(let i = 0 ; i < list.length ; i+=1)
            func.call(list[i], i, list[i], list);
    }
    return this.lightqueryID(this.selector);

    // calls the functions with :  index, element, array
};



/**@memberof lightqueryObject @method on
*Add a listener to the given event(s)
*@param {string} eventName - a string containing all events's names (//!\\ 'onclick' is passed as 'click', etc...)
*@param {function} func [default: null] - the functions to bind to the event
*@return {lightqueryObject}
*
*@warning the 'this' keyword is bound to the selection set during the functions call (as Nodes, not a lightqueryObject)
*/
lightqueryObject.prototype.on = function(eventName, func){
    if(typeof func == typeof (x=>x))
        this.forEach((e)=>{
            for(  let event of lqHelpers.spacedListString.toArray(eventName)  ){
                if(e.addEventListener)
                    e.addEventListener(event, func.bind(e));
                else if(e.attachEvent) //Because "sometimes", Microsoft feels the need to be a bitch
                    e.attachEvent(`on${event}`, func.bind(e));
            }
        });

    return this.lightqueryID(this.selector);
};



/**@memberof lightqueryObject @method off
*Remove a listener from the given event(s)
*@param {string} eventName - a string containing all events's names (//!\\ 'onclick' is passed as 'click', etc...)
*@param {function} func - the functions that was bound to the event using one of lightquery's event binding methods
*@return {lightqueryObject}
*
*@warning the 'this' keyword is bound to the selection set during the functions call (as Nodes, not a lightqueryObject)
*/
lightqueryObject.prototype.off = function(eventName, func){
    if(typeof func == typeof (x=>x))
        this.forEach((e)=>{
            for( let event of lqHelpers.spacedListString.toArray(eventName) ){
                if(e.removeEventListener)
                    e.removeEventListener(event, func.bind(e));
                else if(e.detachEvent) //Because "sometimes", Microsoft feels the need to be a bitch
                    e.detachEvent(`on${event}`, func.bind(e));
            }
        });

    return this.lightqueryID(this.selector);
};



/**@memberof lightqueryObject @method trigger
*Trigger the given event(s) (and the listeners bound to it)
*@param {string} eventName - a string containing all events's names (//!\\ 'onclick' is passed as 'click', etc...)
*@param {object} options - the custom options used for triggering the event
*
*@return {lightqueryObject}
*/
lightqueryObject.prototype.trigger = function(eventName, options){
    const that = this;
    if(typeof eventName == typeof "abc42"){
        this.forEach((e)=>{
            for( let event of lqHelpers.spacedListString.toArray(eventName) ){
                let eventObject;
                const eventOptions = that.lightqueryID.extend({target: e}, options);

                if(window.CustomEvent)
                    eventObject = new window.CustomEvent(event, eventOptions);
                else{
                    eventObject = document.createEvent("CustomEvent");
                    eventObject.initCustomEvent(event, true, true, eventOptions);
                }

                e.dispatchEvent(eventObject);
            }
        });
    }

    return this.lightqueryID(this.selector);
};



/**@memberof lightqueryObject @method click
*Shorthand syntax to add an event listener to the onclik event
*@param {function} [func=null] - the functions to bind to the event
*@return {lightqueryObject}
*
*@warning the 'this' keyword is bound to the selection set during the functions call (as Nodes, not a lightqueryObject)
*/
lightqueryObject.prototype.click = function(func){
    if(func)
        return this.on("click", func.bind(this.asNode));
    else
        return this.trigger("click");
};



/**@memberof lightqueryObject @method hover
*Shorthand syntax to handle the hover events (onmouseenter and onmouseleave)
*@param {function} funcEnter [default: null] - the functions for the onmouseenter event
*@param {function} funcLeav [default: null] - the functions for the onmouseleave event
*
*@return {lightqueryObject}
*
*@warning the 'this' keyword is bound to the selection set during the functions call (as Nodes, not a lightqueryObject)
*/
lightqueryObject.prototype.hover = function(funcEnter, funcLeave){
    return this
        .on("mouseleave", funcLeave.bind(this.asNode) || null)
        .on("mouseenter", funcEnter.bind(this.asNode) || null);
};



/**@memberof lightqueryObject @method css
*Getter/Setter for css properties
*@param {string | object} propertyNames - a string containing all properties' names/object
*ex: "background  color  backgroundColor    boxShadow" is valid
*@param {value} [optionnal] value - the value to which set each CSSproperty of each element of the set
*
*@return {value | lightqueryObject | null}
*/
lightqueryObject.prototype.css = function(propertyNames, value){
    const that = this;

    if(typeof propertyNames == typeof {}){
        that.forEach((e)=>{
            for(let key in propertyNames){
                e.style[key] = propertyNames[key];
            }
        });
    }else{
        const properties = lqHelpers.spacedListString.toArray(propertyNames);
        if(value)
            properties.forEach((property)=>{
                that.forEach((e)=>{
                    e.style[property] = value;
                });
            });
        else
            if(this[0])
                return window.getComputedStyle(this[0])[properties[0]];
            else
                return null;
    }


    return that.lightqueryID(that.selector);
};



/**@memberof lightqueryObject @method cssVar
*Get/set instance CSS variables
*@param {string} variable - name of the CSS variable
*@param {string | number} val [optional] - new value for the CSS variable
*
*@return {lightqueryObject | string}
*/
lightqueryObject.prototype.cssVar = function(variable, val){
    let varname = variable;
    if(lqHelpers.css_variables.regex.no_trailing.test(varname))
        varname = `--${varname}`;
    if(lqHelpers.css_variables.regex.trailing.test(varname))
        if(val==val && (typeof val == typeof "abc"  ||  typeof val == typeof 42)){//undefined, null and NaN check  +  allow only string or numbers
            this.forEach(e=>e.style.setProperty(varname, val));
        }else{
            return window.getComputedStyle(this[0]).getPropertyValue(varname);
        }

    return this.lightqueryID(this.selector);
};



/**@memberof lightqueryObject @method attr
*Getter/setter for HTML attributes
*@param {string} attrNames - a string containing all attributes' names
*ex: "id   class  src  alt placeholder" is valid
*@param {value} [optional] value - the value to which set all of these attributes (for every elements)
*
*@return {value | lightqueryObject | null}
*/
lightqueryObject.prototype.attr = function(attrNames, value){
    const names = lqHelpers.spacedListString.toArray(attrNames);
    const that = this;

    if(value)
        names.forEach((name)=>{
           that.forEach((e)=>{
                e.attributes[name].value = value;
            });
        });
    else
        if(this[0])
            return this[0].attributes[names[0]].value;
        else
            return null;

    return that.lightqueryID(that.selector);
};



/**@memberof lightqueryObjet @method prop
*Getter/setter for DOM/custom properties
*@param {string} propNames - a string containing all properties' names
*ex: "innerHTML  my_custom_prop   length" is valid
*@param {value} [optional] value - the value to which set all of these properties (for every elements)
*
*@return {value | lightqueryObject | null}
*/
lightqueryObject.prototype.prop = function(propNames, value){
    const names = lqHelpers.spacedListString.toArray(propNames);
    const that = this;

    if(value)
        names.forEach((name)=>{
            that.forEach((e)=>{
                e[name] = value;
            });
        });
    else
        if(this[0])
            return this[0][names[0]];
        else
            return null;

    return that.lightqueryID(that.selector);
};



/**@memberof lightqueryObjet @method data
*Getter/setter for custom data attributes
*@param {string} dataNames - a string containing all data attributes' names
*ex: "head  link   img" is valid (data-head, data-link and data-img)
*@param {value} [optional] value - the value to which set all of these data attributes (for every elements)
*
*@return {value | lightqueryObject | null}
*/
lightqueryObject.prototype.data = function(dataNames, value){
    const names = lqHelpers.spacedListString.toArray(dataNames);
    const that = this;

    if(value)
        names.forEach((name)=>{
            that.forEach((e)=>{
                e.dataset[name] = value;
            });
        });
    else
        if(this[0])
            return this[0].dataset[name];
        else
            return null;

    return that.lightqueryID(that.selector);
};



/**@memberof lightqueryObject @method hasProp
*Determines whether the first element of the set has the said property
*@param {string} name - the name of that property
*
*@return {boolean}
*/
lightqueryObject.prototype.hasProp = function(name){
    if(this[0])
        return this[0].hasOwnProperty(name);
    else
        return false;
};



/**@memberof lightqueryObject @method hasAttr
*Determines whether the first element of the set has the said attribute
*@param {string} name - the name of that attribute
*
*@return {boolean}
*/
lightqueryObject.prototype.hasAttr = function(name){
    return this[0] && this[0].hasAttribute(name);
};



/**@memberof lightqueryObject @method hasData
*Determines whether the first element of the set has the said data
*@param {string} name - the name of that data
*
*@return {boolean}
*/
lightqueryObject.prototype.hasData = function(name){
    return this[0] && (name in this[0].dataset);
};



/**@memberof lightqueryObject @method removeProp
*Removes properties from all the elements of the set
*@param {string} propNames - a string containing all properties' names
*ex: "innerHTML  dataset   length"
*
*@return {lightqueryObject}
*/
lightqueryObject.prototype.removeProp = function(propNames){
    const props = lqHelpers.spacedListString.toArray(propNames);
    const that = this;

    props.forEach((prop)=>{
        that.forEach((e)=>{
            if(that.lightqueryID(e).hasProp(prop))
                delete e[prop];
        });
    });

    return that.lightqueryID(that.selector);
};



/**@memberof lightqueryObject @method removeAttr
*Removes attributes from all the elements of the set
*@param {string} attrNames - a string containing all attributes' names
*ex: "id   class  src alt"
*
*@return {lightqueryObject}
*/
lightqueryObject.prototype.removeAttr = function(attrNames){
    const attrs = lqHelpers.spacedListString.toArray(attrNames);
    const that = this;

    attrs.forEach((attr)=>{
        that.forEach((e)=>{
            if(that.lightqueryID(e).hasAttr(attr))
                e.attributes.removeNamedItem(attr);
        });
    });

    return that.lightqueryID(that.selector);
};



/**@memberof lightqueryObject @method removeData
*Removes datas from all the elements of the set
*@param {string} dataNames - a string containing all datas' names
*ex: "high  low  medium thin" for data-high, data-low, data-medium and data-thin
*
*@return {lightqueryObject}
*/
lightqueryObject.prototype.removeData = function(dataNames){
    const names = lqHelpers.spacedListString.toArray(dataNames);
    const that = this;

    names.forEach((name)=>{
        that.forEach((e)=>{
            if(that.lightqueryID(e).hasData(name))
                delete e.dataset[name];
        });
    });

    return that.lightqueryID(that.selector);
};



/**@memberof lightqueryObject @method closest
*Get the closest element matching the selector for each element of the matched set
*@param {string} selector - a string selector
*
*@return {lightqueryObject}
*/
lightqueryObject.prototype.closest = function(selector){
    if(typeof selector == typeof "abc42"){
        const closestArr = this.map(e=>e.closest(selector));
        return this.lightqueryID(closestArr);
    }

    return this.lightqueryID(this.selector);
};



/**@memberof lightqueryObject @method children
*Get all the children (that match the selector, if given one) from each node
*@param {string} [selector=undefined] - a CSS selector to restrict the children
*
*@return {lightqueryObject | null}
*/
lightqueryObject.prototype.children = function(selector){
    let res = this.reduce((acc, elem)=>{
        //get children
        if(elem.children)
            acc.push.apply(acc, lqHelpers.arrayLike.toArray(elem.children));
        return acc;
    }, []).reduce((elem, index, arr)=>{ //NOTE: should have been filter
        //only get distinct elements
        return arr.indexOf(elem) == index;
    });

    if(lqHelpers.array.empty(res))
        return null;

    if(selector)
        res = res.filter(e=>e.matches(selector));

    if(lqHelpers.array.empty(res))
        return null;

    return this.lightqueryID(res);
};



/**@memberof lightqueryObject @method parent
*Get the parent of each element of the matched set
*
*@return {lightqueryObject}
*/
lightqueryObject.prototype.parent = function(){
    //get all parents(if none get null) and remove null values
    let parentArr = this.map(elem=>(elem.parentNode)?elem.parentNode:null)
                        .filter(elem=>elem!=null);

    //return early if there were absolutely no parents
    if(lqHelpers.array.empty(parentArr))
        return null;

    //keep distinct elements
    parentArr = parentArr.filter((elem, index, arr)=>{
        return arr.indexOf(elem) == index;
    });

    //return early if there were absolutely no parents
    if(lqHelpers.array.empty(parentArr))
        return this.lightqueryID([]);

    return this.lightqueryID(parentArr);
};



/**@memberof lightqueryObject @method parents
*Get all predecessors(parents) of each element of the matched set (filtered by selector if one is given)
*@param {string} [selector=undefined] - the selector used for filtering
*
*@return {lightqueryObject}
*/
lightqueryObject.prototype.parents = function(selector){
    let parentsArr = this.map(e=>{
        //grab all predecessors
        let curr = e;
        let res = [];

        while(curr.parentElement){
            res.push(curr.parentElement);
            curr = curr.parentElement;
        }

        return res;
    }).reduce((acc, elem)=>{
        //array of arrays of elements -> array of elements
        acc.push(...elem);
        return acc;
    }, []).filter((elem, index, arr)=>{
        //keep'em distinct
        return arr.indexOf(elem) == index;
    });

    //null handling
    if(lqHelpers.array.empty(parentsArr))
        return null;

    //filter handling
    if(selector)
        parentsArr = parentsArr.filter(e=>e.matches(selector));

    //null handling
    if(lqHelpers.array.empty(parentsArr))
        return this.lightqueryID([]);

    return this.lightqueryID(parentsArr);
};



/**@memberof lightqueryObject @method find
*Get all descendants (filtered by selector if one is given) of each elements of the matched set
*@param {string} [selector=undefined] - the selector used to filter
*
*@return {lightqueryObject}
*/
lightqueryObject.prototype.find = function(selector){
    selector = selector || "*";
    desc = [];
    if(typeof selector === "string")
        desc = this
                .map(e=>e.querySelectorAll(selector))//get descendants
                .reduce((acc, e)=>{//Array(Array(Element)) -> Array(Element)
                    acc.push(...e);
                    return acc;
                }, [])
                .filter(//keep distinct elements
                    (e,i,a)=>a.indexOf(e)==i
                );
    return this.lightqueryID(desc);
};



/**@memberof lightqueryObject @method first
*Get the first element of the matched set
*
*@return {lightqueryObject}
*/
lightqueryObject.prototype.first = function(){
    return this.eq(0);
};


/**@memberof lightqueryObject @method last
*Get the last element of the matched set
*
*@return {lightqueryObject}
*/
lightqueryObject.prototype.last = function(){
    return this.eq( this.length - 1 );
};



/**@memberof lightqueryObject @method has
*Reduce the set to the elements that have at least one descendant that matches the selector
*@param {string} selector - the selector used to reduce the set
*
*@return {lightqueryObject | null}
*/
lightqueryObject.prototype.has = function(selector){
    if(typeof selector != typeof "abc42")
        return null;

    const l = this.lightqueryID;
    const arr = this.filter(e=>l(e).children(selector)); //NOTE: Should have been find

    if(lqHelpers.array.empty(arr))
        return null;

    return this.lightqueryID(arr);
};



/**@memberof lightqueryObject @method ready
*Add an event listener that will be triggered when the DOM is fully loaded
*@param {function} func - the function passed as the event handler
*
*@return {lightqueryObject}
*/
lightqueryObject.prototype.ready = function(func){
    if(this.selector == window.document){
        if(document.addEventListener)
            document.addEventListener("DOMContentLoaded", func, false);
        else if(window.addEventListener)
            window.addEventListener("load", func, false);
        else if(document.attachEvent)
            document.attachEvent("onreadystatechange", func);
        else if(window.attachEvent)
            window.attachEvent("onload", func);
        else
            throw new Error("Why the heck is this computer still working anyway ? (no support for DOM loaded events ...)");
    }

    return this.lightqueryID(this.selector);
};




/**@memberof lightqueryObject @method Filter
*Filter the set of matched elements according to a predicate
*@param {function} func - the predicate used to filter
*
*@return {lightqueryObject}
*/
lightqueryObject.prototype.Filter = function(func){
    if(typeof func != typeof (x=>x))
        throw new TypeError(`${this.lightqueryID.fname}().Filter expected a function as its parameter`);

    return this.lightqueryID( this.filter(func) );
};



/**@memberof lightqueryObject @method Map
*Map the set of matched elements according to a function
*@param {function} func - the funciton used to map
*
*@return {lightqueryObject}
*/
lightqueryObject.prototype.Map = function(func){
    if(typeof func != typeof(x=>x))
        throw new TypeError(`${this.lightqueryID.fname}().Map expected a function as its parameter`);

    return this.lightqueryID( this.map(func) );
};




/**@memberof lightqueryObject @method Reduce
*Performs a reduction on the set of matched elements according to the reducer
*@param {function} reducer - the function used for the reduction
*@param {?} accumulator - the initial value of the accumulator
*/
lightqueryObject.prototype.Reduce = function(reducer, accumulator){
    if(typeof reducer != typeof(x=>x))
        throw new TypeError(`${this.lightqueryID.fname}().Reduce expected a function as its first parameter`);

    return this.lightqueryID( this.reduce(reducer, accumulator) );
};



//// THE OG LightQuery
/**@function lightquery
*Get a lightquery object from a selector / add an event listener that will be triggered when the DOM is fully loaded
*@param {string | function | object} selector - the selector/function
*
*@return {lightqueryObject | lightquery | Object}
*/
const lightquery = function f(selector){
    return new f.createLightqueryObject(selector);
};
lightquery.fname = "lightquery";



//// CLASS METHOD
/**@memberof lightquery @method appendNode
*Append an HTML node to a set of DOM nodes from a selector
*@param {string | object} targetSelector - the selector of the parent(s) to append the content to
*@param {string} AppendedElementType - a string representing the HTML tag of the appended node (ex: to append a <p>, pass "p")
*@param {string | other} content - the content of the appended tag
*
*@return {lightqueryObject | undefined}
*/
lightquery.appendNode = function(targetSelector, AppendedElementType, content){
    if(targetSelector && AppendedElementType && content){
        const parent = document.querySelectorAll(targetSelector);
        for(let elem of parent){
            const node = document.createElement(AppendedElementType);
            node.innerHTML = content;
            elem.appendChild(node);
        }

        return this(targetSelector);
    }

    return undefined;
};



/**@memberof lightquery @method getNode
*get nodes from a selector
*@param {string | object} targetSelector - the selector
*
*@return {NodeList | selector}
*/
lightquery.getNode = function(targetSelector){
    if(typeof targetSelector != typeof "abc123")
        return targetSelector;
    else
        return document.querySelectorAll(targetSelector);
};



/**@memberof lightquery @method cssVar
*Get/set global CSS variables
*@param {string} variable - name of the CSS variable
*@param {string | number} val [optional] - new value for the CSS variable
*
*@return {lightquery | string}
*/
lightquery.cssVar = function(variable, val){
    let varname = variable;
    if(lqHelpers.css_variables.regex.no_trailing.test(varname))
        varname = `--${varname}`;
    if(lqHelpers.css_variables.regex.trailing.test(varname))
        if(val==val && (typeof val == typeof "abc"  ||  typeof val == typeof 42)){//undefined, null and NaN check  +  allow only string or numbers
            document.body.style.setProperty(varname, val);
        }else{
            return window.getComputedStyle(document.body).getPropertyValue(varname);
        }

    return this;
};



/**@memberof lightquery @method extend
*Extend the initial object by attributing (override) the properties of the other objects to it
*@param {object} initialObject - The initial object
*@param {objects} otherObjects - any amount of other objects to use for the assignment
*(ex: lightquery.extend({}, {}, {}, {}))
*
*@return {object}
*/
lightquery.extend = function(initialObject, ...otherObjects){
    return Object.assign(initialObject, ...otherObjects);
};



/**@memberof lightquery @method ready
*Add an event listener that will be triggered when the DOM is fully loaded
*@param {function} func - the event handler function
*
*@return {lightquery}
*/
lightquery.ready = function(func){
    return this(document).ready(func);
};



/**@memberof lightquery @method hasPlugin
*Check if the lightquery instance has a certain plugin
*@param {string} pluginName - the name of the plugin
*@param {string} [pluginType="instance"] - the type of the plugin (must be either "instance" or "global")
*
*@return {bool | lightquery}
*/
lightquery.hasPlugin = function(pluginName, pluginType="instance"){
    if(lqHelpers.plugin.isValidPluginType(pluginType)){
        if(pluginType === "global"){
            const globalPlugins = Object.keys(this).filter(key=>!(key in Object.keys(immutableLightQuery)));
            return globalPlugins.includes(pluginName);
        }

        if(pluginType === "instance"){
            const instancePlugins = Object.keys(this.createLightqueryObject.prototype)
                                        .filter(key=>!(key in Object.keys(immutableLightQuery.createLightqueryObject.prototype)));
            return instancePlugins.includes(pluginName);
        }
    }

    return this;
}



/**@memberof lightquery @method usePlugin
*Add a plugin to the lightquery instance
*@param {string} pluginName - the name of the new plugin
*@param {function} pluginFunction - the plugin's function
*@param {string} [pluginType="instance"] - the type of the plugin (must be either "instance" or "global")
*
*@return {lightquery}
*/
lightquery.usePlugin = function(pluginName="", pluginFunction=(x=>x), pluginType="instance"){
    if(
        (typeof pluginName == typeof "abc42")
        && (typeof pluginFunction == typeof(x=>x))
        && (typeof pluginType == typeof "abc42")
        && (lqHelpers.plugin.isValidPluginType(pluginType))
      ){
        const finalPluginName = lqHelpers.functions.newName(pluginName); //TODO

        if(pluginType === "instance"){
            if(finalPluginName in this.createLightqueryObject.prototype)
                throw new Error(`${this.fname}: The name passed for the ${pluginType} plugin (${pluginName}) is already in use, please choose another one`);

            this.createLightqueryObject.prototype[finalPluginName] = pluginFunction;
        }

        if(pluginType === "global"){
            if(finalPluginName in this)
                throw new Error(`${this.fname}: The name passed for the ${pluginType} plugin (${pluginName}) is already in use, please choose another one`);
            this[finalPluginName] = pluginFunction;
        }

        console.log(`${this.fname}: A new ${pluginType} plugin has been registered as '${finalPluginName}'`);
        return this;
    }else{
        if(typeof pluginName != typeof "abc42")
            throw new TypeError("The plugin's name MUST be a STRING");

        if(typeof pluginFunction != typeof(x=>x))
            throw new TypeError("The plugin's method MUST be a FUNCTION");

        if(typeof pluginType != typeof "abc42")
            throw new TypeError("The plugin's type MUST be a STRING");

        if(!lqHelpers.plugin.isValidPluginType(pluginType))
            throw new Error("The plugin's type MUST be EITHER 'instance' OR 'global'");
    }

};
/**@memberof lightquery @method registerPlugin
*Add a plugin to the lightquery instance
*@param {string} pluginName - the name of the new plugin
*@param {function} pluginFunction - the plugin's function
*@param {string} [pluginType="instance"] - the type of the plugin (must be either "instance" or "global")
*
*@return {lightquery}
*/
lightquery.registerPlugin = lightquery.usePlugin;
/**@memberof lightquery @method addPlugin
*Add a plugin to the lightquery instance
*@param {string} pluginName - the name of the new plugin
*@param {function} pluginFunction - the plugin's function
*@param {string} [pluginType="instance"] - the type of the plugin (must be either "instance" or "global")
*
*@return {lightquery}
*/
lightquery.addPlugin = lightquery.usePlugin;




/**@memberof lightquery @method createOtherLightquery
*Create an independent instance of lightquery (from the current one)
*@param {string} newLightqueryName - the name of the new lightquery instance (for console messages)
*
*@return {lightquery}
*/
lightquery.createOtherLightquery = function(newLightqueryName){
    const baseConstructorName = lqHelpers.constructorLQ.baseName;
    const constructorNameRegex = lqHelpers.constructorLQ.nameRegex;

    //get all registered construtors
    const alreadyExistingLightquery = Object.keys(window.lightqueryCreators)
                                            .filter(key=>constructorNameRegex.test(`${key}`))
                                            .sort((a,b)=>(a>b));

    //get the last one
    const lastOne = alreadyExistingLightquery.slice(-1)[0];

    //create a new name
    let newConstructorName = "";
    if(lastOne === baseConstructorName)
        newConstructorName = `${baseConstructorName}0`;
    else{
        let last_number = parseInt(  lastOne.replace(constructorNameRegex, "$1")  );
        newConstructorName = `${baseConstructorName}${last_number+1}`;
    }

    //define the constructor
    window.lightqueryCreators[newConstructorName] = this.createLightqueryObject.clone4lightquery();

    //define the new lightquery functions
    let func = this.createLightqueryObject.prototype.lightqueryID.clone4lightquery();


    //do the ID INJECTIONS
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
};

/**@memberof lightquery @method removePlugin
*Remove a plugin to the lightquery instance
*@param {string} pluginName - the name of the new plugin
*@param {function} pluginFunction - the plugin's function
*@param {string} [pluginType="instance"] - the type of the plugin (must be either "instance" or "global")
*
*@return {lightquery}
*/
lightquery.removePlugin = function(pluginName="", pluginType="instance"){
    //usual type checking
    if(typeof pluginName == typeof "abc42" && lqHelpers.plugin.isValidPluginType(pluginType)){
        const truePluginName = "" + lqHelpers.functions.newName(pluginName);
        //const constructorRegex = lqHelpers.constructorLQ.nameRegex;

        if(pluginType === "instance"){
            if(truePluginName in this.createLightqueryObject.prototype){
                if(truePluginName in immutableLightQuery.createLightqueryObject.prototype)
                    throw new Error(`There was an attempt to remove a core functionnality of lightquery (for ${this.fname})`);
                else{//TODO: Fix this part
                    delete this.createLightqueryObject.prototype[truePluginName];
                }
            }else
                throw new Error(`${this.fname} has no ${pluginType} plugin designated by "${pluginName}"`);
        }

        if(pluginType === "global"){
            if(truePluginName in this){
                if(truePluginName in immutableLightQuery.createLightqueryObject.prototype.lightqueryID)
                   throw new Error(`There was an attempt to remove a core functionnality of lightquery (for ${this.fname})`);
                else
                    delete this[truePluginName];
            }else
                throw new Error(`${this.fname} has no ${pluginType} plugin designated by "${pluginName}"`);
        }

        console.log(`The ${pluginType} plugin "${truePluginName}" has been successfully removed from ${this.fname}`);
        return this;
    }else{
        if(typeof pluginName != typeof "abc42")
            throw new TypeError("The plugin's name MUST be a STRING");
        if(! lqHelpers.plugin.isValidPluginType(pluginType))
            throw new Error("The plugin's type MUST be a STRING that is EITHER 'instance' OR 'global'");
    }
};

//// ID INJECTION
Object.defineProperty(lightqueryObject.prototype, "lightqueryID", {
    value: lightquery,
    enumerable: false,
    configurable: false,
    writable: false
});

Object.defineProperty(lightquery, "createLightqueryObject", {
    value: lightqueryObject,
    enumerable: false,
    configurable: false,
    writable: false
});

//constructors registering
window.lightqueryCreators = {
    "lightqueryObject": lightqueryObject
};

//Create a totally immutable version of lightquery (as a reference)
const immutableLightQuery = Object.freeze( lightquery.createOtherLightquery("immutableLightQuery") );
immutableLightQuery.createLightqueryObject = Object.freeze( immutableLightQuery.createLightqueryObject );
immutableLightQuery.createLightqueryObject.prototype = Object.freeze( immutableLightQuery.createLightqueryObject.prototype );


//// ALIASES
const lq = lightquery,
      lQuery = lightquery,
      lightQuery = lightquery,
      LightQuery = lightquery,
      µ = lightquery;
