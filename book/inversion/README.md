# Inversion

`<ceb/>` provides a built-in implementation of the [Inversion Of Control] principle.
Its purpose is to help the implementation of the application logic.

The IoC implementation relies on three main concepts.
The first one is the _registry_.
Its purpose is to provide services to register and resolve items.
The second concept, the _module_, interacts with the registry in order to configure items to register.
Finally, the last one, the _container_, manages the lifecycle of the modules and, therefore, the lifecycle of the registry's items too.

The implementation is part of the [@tmorin/ceb-inversion-core](https://www.npmjs.com/package/@tmorin/ceb-inversion-core) package.
Its usage is cover by the reference documentation: [@tmorin/ceb-inversion-core](../api/modules/_tmorin_ceb_inversion_core.html).

[Inversion Of Control]: https://en.wikipedia.org/wiki/Inversion_of_control
