# Templating

`<ceb/>` provides a built-in solution for templating which relies on three main components.

The first component is the template engine.
Its purpose is to _patch_ the DOM incrementally.
The implementation and the underlying API is similar to [incremental-dom].
The main difference is the full support of Custom Elements, especially the handling of a [Grey DOM], or _scope_.
This component is part of the [@tmorin/ceb-templating-engine](https://www.npmjs.com/package/@tmorin/ceb-templating-engine) package.

The second component is a user-friendly interface which operates the command.
Presently, the library provides an interface leveraging on the [Tagged Templates].
Its usage is cover in the [Template literal] section.
This component is part of the [@tmorin/ceb-templating-literal](https://www.npmjs.com/package/@tmorin/ceb-templating-literal) package.

Finally, the third component is a builder which enhances a method of the Custom Element: [TemplateBuilder].
So that, when the enhanced method is invoked, the Custom Element's content is dynamically updated.
This component is part of the [@tmorin/ceb-templating-builder](https://www.npmjs.com/package/@tmorin/ceb-templating-builder) package.

[TemplateBuilder]: book/custom_elements_authoring/TemplateBuilder.md
[incremental-dom]: https://google.github.io/incremental-dom
[Grey DOM]: grey_dom.md
[Tagged Templates]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates
[Template literal]: template_literal.md
