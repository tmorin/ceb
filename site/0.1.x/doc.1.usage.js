// The builder's method **name**, taking the name of the future custom element's name, returned a builder.
var builder = ceb().name('demo-custom-element');

// A builder provides several methods helping to defined the structure of a custom element.
// A structure is composed of the following elements:
// - extends and prototype values
// - properties
// - methods
// - interceptors catching the set and get of properties
// - wrappers wrapping the call of methods
// - DOM event listeners
// - features enhancing the structure with reusable logic

// ## Add stuff to the structure

// [Set extends and prototype values](doc.2.inheritance.html)
builder.extends( /* the tag to extend*/ ).prototype( /* the prototype to inherit */ );

// [Add properties](doc.3.properties.html)
builder.properties( /* a hash of properties */ );

// [Add interceptors](doc.4.interceptors.html)
builder.intercept( /* the property's name, [the write callback], [the read callback], [the level] */ );

// [Add methods](doc.5.methods.html)
builder.methods( /* a hash of methods */ );

// [Add wrappers](doc.6.wrappers.html)
builder.wrap( /* the method's name, the callback, [the level] */ );

// [Add listeners](doc.7.listeners.html)
builder.listen( /* a mix of html selectors and events' name, the callback */ );

// [Add features](doc.8.features.html)
builder.feature( /* the feature's function, [the feature's options], [the level] */ );

// ## Make it works

// When the setup of the structure is done,
// the builder’s method **register** will register the corresponding custom element.
var DemoCustomElement = builder.register();

// The returned value is the JavaScript class of the registered custom element.
// It can be used as prototype of another one.
ceb().name('proto-demo-custom-element').prototype(Object.create(DemoCustomElement.prototype));

// ## Make it alive

// *demo-custom-element* is available from JavaScript as another HTML element.
var aDemoCustomElementFromJs = document.createElement('demo-custom-element');
document.body.appendChild(aDemoCustomElementFromJs);

// *demo-custom-element* is available from HTML as another HTML element.
document.body.innerHTML = '<demo-custom-element></demo-custom-element>';
var aDemoCustomElementFromHTML = document.body.querySelector('demo-custom-element');

// In both cases aDemoCustomElementFromJs and aDemoCustomElementFromHTML are HTML elements.
console.assert(aDemoCustomElementFromJs.nodeType === aDemoCustomElementFromHTML.nodeType === HTMLElement.ELEMENT_NODE);

// ## Reuse a structure

// The builder's structure can be retrieved using the builder's method **get**.
// However, the structure object contains objects which are not sharable accross builders.
// A good way is to implement the creation of the structure into a function.
// Then call the function each time we need a structure.
function structureFactory() {
    var protectedBuilder = ceb().name('base-structure');
    /* do stuff with protectedBuilder */
    return protectedBuilder.get();
}

// *based-custom-element1* and *based-custom-element1* builders share, conceptually, the same base structure.
ceb({
    struct: structureFactory()
}).name('based-custom-element1').register();

ceb({
    struct: structureFactory()
}).name('based-custom-element2').register();
