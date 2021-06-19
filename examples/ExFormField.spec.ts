import '../test/fix_global';
import './ExFormField';
import {ExFormField} from './ExFormField';
import {toArray} from '../src/utilities';
import * as assert from 'assert';

describe('ExFormField', () => {
    let sandbox;

    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'));
    });

    it('should get reference from public DOM', () => {
        sandbox.innerHTML = `
<style>
ex-form-field {
}
</style>
<form name="a-sample-form">
    <ex-form-field label="Firstname" helper="The firstname of your name.">
        <input type="text" name="firstname" value="foo" required="" />
    </ex-form-field>
    <ex-form-field label="Lastname">
        <div>
            <input type="text" name="lastname" required="" />
        </div>
    </ex-form-field>
    <p>
        <button type="submit">submit</button>
    </p>
</form>
`;
        const exFormFields: Array<ExFormField> = toArray(sandbox.querySelectorAll('ex-form-field'));
        assert.strictEqual(exFormFields[0].label, 'Firstname');
        assert.ok(exFormFields[0].shadowRoot.innerHTML.indexOf('<label id="label">Firstname</label>') > -1);
        assert.strictEqual(exFormFields[1].label, 'Lastname');
        assert.ok(exFormFields[1].shadowRoot.innerHTML.indexOf('<label id="label">Lastname</label>') > -1);
    });

});
