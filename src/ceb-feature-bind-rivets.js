(function (g, factory) {
    'use strict';

    // Export the **ceb-feature-bind-rivets** function according the detected loader.

    /* istanbul ignore next */
    if (typeof exports === 'object') {
        module.exports = factory(require('ceb-feature-bind'), require('rivets'));
    } else if (typeof define === 'function' && define.amd) {
        define('ceb-feature-bind-rivets', ['ceb-feature-bind', 'rivets'], factory);
    } else {
        g.cebFeatureBind = factory(g.cebFeatureBind, g.rivets);
    }

}(this, function (cebFeatureBind, rivets) {
    'use strict';

    rivets.binders.stop = {
        block: true
    };

    cebFeatureBind.options = {
        prefix: 'bd',
        templateDelimiters: ['{{', '}}']
    };

    cebFeatureBind.bindEl = function defaultBindEl(el, scope, options) {
        return rivets.bind(el, scope, options);
    };

    cebFeatureBind.unbindEl = function defaultUnbindEl(el, view) {
        view.unbind();
    };

    return cebFeatureBind;
}));
