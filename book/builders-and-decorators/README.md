# The builders and decorators

`<ceb/>` provides several built-in builders handling the common requirements.
For each builder, decorators counter-parts are available.

First, the custom element has to be registered using the builder [ElementBuilder](ElementBuilder.md).

Then, other builders can be used to enhance it:

- [AttributeBuilder](AttributeBuilder.md): to define attributes and react on changes
- [FieldBuilder](FieldBuilder.md): to define fields (property/attribute) and react on changes
- [OnBuilder](OnBuilder.md): to listen to DOM events
- [ContentBuilder](book/builders-and-decorators/ContentBuilder.md): to initialize the light or shadow DOM
- [TemplateBuilder](book/builders-and-decorators/TemplateBuilder.md): to path the DOM of the custom element
- [ReferenceBuilder](ReferenceBuilder.md): to get reference of children nodes
- [AttributePropagationBuilder](AttributePropagationBuilder.md): to delegate attribute mutations to child nodes
- [PropertyDelegateBuilder](PropertyDelegateBuilder.md): to delegate the property accesses to a single child node
