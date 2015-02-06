(function(g, factory) {
    'use strict';

    // Export the **ceb-feature-template-ractive** function according the detected loader.

    /* istanbul ignore next */
    if (typeof exports === 'object') {
        module.exports = factory(require('ceb-feature-template'), require('ractive'));
    } else if (typeof define === 'function' && define.amd) {
        define('ceb-feature-template-ractive', ['ceb-feature-template', 'ractive'], factory);
    } else {
        g.cebFeatureTemplate = factory(g.cebFeatureTemplate, g.Ractive);
    }

}(this, function(cebFeatureTemplate, Ractive) {
    'use strict';

    cebFeatureTemplate.renderTemplate = function renderTemplate(el, template, boundProperties) {
        el.ractive = new Ractive({
            el: el,
            template: template,
            data: {}
        });

        boundProperties.forEach(function (propName) {
            el.ractive.observe(propName, function (newValue) {
                el.value = propName;
            });
        });

    };

    return cebFeatureTemplate;
}));
