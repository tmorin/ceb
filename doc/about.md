---
title: About
---
# About

The main goal of <code>&lt;ceb/&gt;</code> is to provide a user friendly way to enhance the prototype and the behavior of a Custom Element.

The enhancement of the prototype regards the definition of properties and methods.

The scope of the behavior part is a little bit more big. It occurs during the life cycle of the custom element.
For instance, it can be the binding between an attribute and a property or the handling of a template.

But, in fact ... <code>&lt;ceb/&gt;</code> doesn't provide a user friendly way to do it.
Its goal is to provide a user friendly way to do it by some else (i.e. dedicated builders).

That means, a builder to define a property working to the prototype.
And another one to bind an attribute to a property working on the prototype and the behavior too.
The second one being based on the first one.

Obviously, <code>&lt;ceb/&gt;</code> exposes dedicated builders to handle the common needs.
