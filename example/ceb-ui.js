/*globals ceb:false, cebFeatureTemplate:false*/
ceb()
    .name('ceb-ui-field')
    .feature(cebFeatureTemplate, {
        template: '<label><span class="label"></span><span ceb-content></span></label>'
    })
    .properties({
        label: {
            attribute: true,
            delegate: {
                target: '.label',
                property: 'textContent'
            }
        }
    })
    .register();
ceb()
    .name('ceb-ui-action')
    .feature(cebFeatureTemplate, {
        template: '<button ceb-content></button>'
    })
    .properties({
        type: {
            attribute: true,
            delegate: {
                target: 'button'
            }
        }
    })
    .listen('click', function (el, evt) {
        evt.preventDefault();
        evt.stopPropagation();
        // el.sendCommand('action-');
    })
    .register();
ceb()
    .name('ceb-ui-form')
    .feature(cebFeatureTemplate, {
        template: '<form ceb-content></form>'
    })
    .register();
