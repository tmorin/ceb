/*jshint -W030 */

import {ceb, template} from '../lib/ceb';

describe('ceb.template()', ()=> {
    var sandbox, builder;
    beforeEach(() => {
        if (sandbox) {
            sandbox.parentNode.removeChild(sandbox);
        }
        document.body.appendChild((sandbox = document.createElement('div')));
        builder = ceb();
    });

    afterEach(() => {
        sandbox.innerHTML = '';
    });

    it('should apply a string template', () => {
        builder.augment(template(`<button></button>`)).register('ceb-template-string');
        var el = document.createElement('ceb-template-string');
        expect(el.innerHTML).to.be.eq('<button></button>');
    });

    it('should apply a function template', () => {
        builder.augment(template(el => `<button>${el.tagName.toLowerCase()}</button>`)).register('ceb-template-function');
        var el = document.createElement('ceb-template-function');
        expect(el.innerHTML).to.be.eq('<button>ceb-template-function</button>');
    });

});
