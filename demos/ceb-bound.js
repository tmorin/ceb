(function(g) {
    var rivets = g.rivets;

    var options = {
        prefix: 'bd'
    };

    rivets.binders.stop = {
        block: true
    };

    function feature(el) {
        var view;
        if (!el.__cebBindScope) {
            el.__cebBindScope = {};
        }
        return {
            scope: function() {
                return el.__cebBindScope;
            },
            bind: function() {
                view = rivets.bind(el, el.__cebBindScope, options);
            },
            unbind: function() {
                view.unbind();
            }
        };
    }

    feature.setup = function(struct, builder, options) {

        builder.properties({
            bdStop: {
                attribute: {
                    boolean: true
                },
                value: true
            }
        });

        builder.wrap('attachedCallback', function(next, el) {
            next(arguments);
            feature(el).bind();
        }, Number.MAX_VALUE);

        builder.wrap('detachedCallback', function(next, el) {
            next(arguments);
            feature(el).unbind();
        }, Number.MAX_VALUE);

    };

    g.cebFeatureBind = feature;
}(this));

var tpl = '';
tpl += '<input type="text" bd-value="name">';
tpl += '<span></span>';

ceb().name('ceb-bound').feature(cebFeatureTemplate, {
    template: tpl
}).feature(cebFeatureBind, {}).properties({
    value: {
        attribute: true,
        value: 'name1',
        setter: function(el, propName, value) {
            cebFeatureBind(el).scope().name = value;
            return value;
        }
    }
}).register();
