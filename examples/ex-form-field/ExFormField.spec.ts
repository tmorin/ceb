import './ExFormField'
import {ExFormField} from './ExFormField'
import {assert} from 'chai'

const template = `
<form name="a-sample-form">
    <ex-form-field label="Firstname" helper="The firstname of your name.">
        <input type="text" name="firstname" value="foo" required="" />
    </ex-form-field>
    <ex-form-field label="Lastname" helper="The lastname of your name.">
        <div>
            <input type="text" name="lastname" required="" />
        </div>
    </ex-form-field>
    <p>
        <button type="submit">submit</button>
    </p>
</form>
`

describe('ExFormField', () => {
    let sandbox: HTMLDivElement
    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'))
        sandbox.innerHTML = template
    })
    it('should get reference from public DOM', () => {
        const exFormFields: Array<ExFormField> = Array.from(sandbox.querySelectorAll('ex-form-field'))
        assert.strictEqual(exFormFields[0].label, 'Firstname')
        assert.equal(exFormFields[0].shadowRoot?.innerHTML?.indexOf('<label id="label">Firstname</label>'), 146)
        assert.strictEqual(exFormFields[1].label, 'Lastname')
        assert.equal(exFormFields[1].shadowRoot?.innerHTML?.indexOf('<label id="label">Lastname</label>'), 146)
    })

    it('should change the label', () => {
        const exFormFields: Array<ExFormField> = Array.from(sandbox.querySelectorAll('ex-form-field'))
        exFormFields[0].label = 'Firstname bis'
        assert.strictEqual(exFormFields[0].getAttribute('label'), 'Firstname bis')
        assert.strictEqual(exFormFields[0].shadowRoot?.innerHTML?.indexOf('<label id="label">Firstname bis</label>'), 146)
    })

    it('should change the helper', () => {
        const exFormFields: Array<ExFormField> = Array.from(sandbox.querySelectorAll('ex-form-field'))
        exFormFields[0].helper = 'the new helper value'
        assert.strictEqual(exFormFields[0].getAttribute('helper'), 'the new helper value')
        assert.strictEqual(exFormFields[0].shadowRoot?.innerHTML?.indexOf('<div id="helper">the new helper value</div>'), 221)
    })

})
