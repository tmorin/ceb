var cebBoundEmbeddedTpl = '';
cebBoundEmbeddedTpl = '<span>embedded {{nameEmbedded}}</span>';
cebBoundEmbeddedTpl = '<div bd-stop ceb-content></div>';
ceb().name('ceb-bound-embedded').feature(cebFeatureTemplate, {
    template: cebBoundEmbeddedTpl
}).feature(cebFeatureBind, {}).properties({
    nameEmbedded: {
        attribute: true,
        setter: function (el, propName, value) {
            cebFeatureBind(el).scope().nameEmbedded = value;
            return value;
        }
    }
}).register();

var cebBoundTpl = '';
cebBoundTpl += '<input type="text" bd-value="name">';
cebBoundTpl += '<span>{{name}}</span>';
cebBoundTpl += '<ceb-bound-embedded bd-stop ceb-content bd-name-embedded="name"></ceb-bound-embedded>';
ceb().name('ceb-bound').feature(cebFeatureTemplate, {
    template: cebBoundTpl
}).feature(cebFeatureBind, {}).properties({
    value: {
        attribute: true,
        value: 'name1',
        setter: function (el, propName, value) {
            cebFeatureBind(el).scope().name = value;
            return value;
        }
    }
}).register();
