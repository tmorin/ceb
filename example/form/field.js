import {ceb, attribute, delegate, template} from 'es6/lib/ceb.js';

export default ceb().augment(
    template(`
        <div class="form-group">
            <label></label>
            <span ceb-content></span>
            <span class="help-block"></span>
        </div>
    `),
    delegate(attribute('label')).to('label').property('textContent'),
    delegate(attribute('help')).to('.help-block').property('textContent')
).register('wui-field');
