# Templating

`<ceb/>` provides a built-in solution for templating which can be directly used with the [TemplateBuilder].

The solution relies on a built-in engine which _patches_ the DOM incrementally.
The implementation and the underlying APItemplating is similar to [incremental-dom].
The main difference is the full support of Custom Elements, especially the handling of a [Grey DOM].

Its main API is a [Tagged Templates].
Its usage is cover in the [Template literal] section.

[TemplateBuilder]: ../builders-and-decorators/TemplateBuilder.md
[incremental-dom]: https://google.github.io/incremental-dom
[Grey DOM]: grey_dom.md
[Tagged Templates]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates
[Template literal]: template_literal.md
