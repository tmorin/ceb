import {ceb, attribute, delegate, template, on} from '../lib/ceb';

export default ceb().augment(
    template(`
        <button>
            <span x-ref="icon"></span>
            <span x-ref="label"></span>
        </button>
    `),
    delegate(attribute('name')).to('button'),
    delegate(attribute('disabled').boolean()).to('button'),
    delegate(attribute('label')).to('button [x-ref=label]').property('textContent'),
    delegate(attribute('icon')).to('button [x-ref=icon]').property('textContent'),
    on('click').prevent().invoke((el, evt) => el.label = (el.label === 'clicked' ? 'label' : 'clicked'))
).register('ceb-button');
