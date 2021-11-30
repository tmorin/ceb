# Elements

`<ceb/>` relies on the [Builder Pattern] and also [Decorators] to define, enhance and finally register Custom Elements.

[Builder Pattern]: https://en.wikipedia.org/wiki/Builder_pattern
[Decorators]: https://www.typescriptlang.org/docs/handbook/decorators.html

The main builder [ElementBuilder](ElementBuilder.md) handles the definition and registration of Custom Elements.

Then, other builders can be used to enhance it:

- [AttributeBuilder](AttributeBuilder.md): to define attributes and react on changes
- [FieldBuilder](FieldBuilder.md): to define fields (property/attribute) and react on changes
- [OnBuilder](OnBuilder.md): to listen to DOM events
- [ContentBuilder](ContentBuilder.md): to initialize the light or shadow DOM
- [TemplateBuilder](TemplateBuilder.md): to path the DOM of the custom element
- [ReferenceBuilder](ReferenceBuilder.md): to get reference of children nodes
- [AttributePropagationBuilder](AttributePropagationBuilder.md): to delegate attribute mutations to child nodes
- [PropertyDelegationBuilder](PropertyDelegationBuilder.md): to delegate the property accesses to a single child node

For convenience, the package [@tmorin/ceb-bundle-web](https://www.npmjs.com/package/@tmorin/ceb-bundle-web) provides all built-in artifacts for the Custom Elements authoring.
