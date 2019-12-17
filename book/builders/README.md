# The builders

`<ceb/>` provides several built-in builders handling the common requirements.

First, the custom element has to be registered using the builder [ElementBuilder](./ElementBuilder.md).

Then, other builders can be used to enhance it:

- [AttributeBuilder](./AttributeBuilder.md): to define attributes and react on changes
- [FieldBuilder](./FieldBuilder.md): to define fields (property/attribute) and react on changes
- [OnBuilder](./OnBuilder.md): to listen to DOM events
- [TemplateBuilder](./TemplateBuilder.md): to initialize the light or shadow DOM
- [ReferenceBuilder](./ReferenceBuilder.md): to get reference of children nodes
- [AttributeDelegateBuilder](./AttributeDelegateBuilder.md): to delegate attribute mutations to child nodes
