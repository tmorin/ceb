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
<form name="a-sample-form">
    <ex-form-field label="Firstname">
        <input type="text" name="firstname" value="foo" required="" />
    </ex-form-field>
    <ex-form-field label="Lastname">
        <input type="text" name="lastname" required="" />
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
