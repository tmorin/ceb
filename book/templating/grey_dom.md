# The Light, Grey and Shadow DOMs

When a Custom Element is responsible for a part of its child nodes, the usage of [Shadow DOM] is welcoming.
Shadow DOM handles the [HTMLSlotElement] elements which can be used as placeholders.
However, Shadow DOM brings a level of isolation which is not always welcome.
Especially for the _shadowified_ markup which relies on common stylesheets.

[Shadow DOM]: https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM
[HTMLSlotElement]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot

The built-in template engine provides a solution to handle Grey DOM.
The purpose is to keep the concept of _slot_ coming from Shadow DOM but in the Light DOM.
Therefore, the DOM tree between the Custom Element node, and the _slot node_ becomes a Grey DOM.

Basically, a Grey DOM can only be mutated from its Custom Element and, the Custom Element can only mutate its Grey DOM.
Moreover, like for the Shadow DOM, the Grey DOM handles kind of `<slot>` elements to manage the placeholders.
However, the Grey DOM is not isolated from the Light DOM context (javascript, styles ...).
For senior JS developers :), it is similar to the [transclude] concept implemented in [AngularJS].

[AngularJS]: https://angularjs.org
[transclude]: https://code.angularjs.org/1.8.2/docs/guide/directive#creating-a-directive-that-wraps-other-elements
