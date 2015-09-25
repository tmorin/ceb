import {ceb, attribute, delegate, template, on} from '../lib/ceb.js';

export default ceb().augment(
    template(`
        <button>
            <span x-ref="icon"></span>
            <span x-ref="label"></span>
        </button>
    `),
    delegate(attribute('name')).to('button'),
    delegate(attribute('disabled').boolean()).to('button').property(),
    delegate(attribute('label').value('click me')).to('button [x-ref=label]').property('textContent'),
    delegate(attribute('icon').value('X')).to('button [x-ref=icon]').property('textContent'),
    on('click button').invoke((el, evt) => el.label = (el.label === 'click me' ? 'clicked' : 'click me'))
).register('ceb-button');
