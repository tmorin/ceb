import '../../test/fix_global';
import './ExGreeting';
import {ExGreeting} from './ExGreeting';
import {strict as assert} from 'assert';

describe('ExGreeting', () => {
    let sandbox;

    beforeEach(function () {
        sandbox = document.body.appendChild(document.createElement('div'));
    });

    it('should display the greeting text', () => {
        sandbox.innerHTML = `<ex-greeting />`;
        const exGreeting: ExGreeting = sandbox.querySelector('ex-greeting')
        assert.equal(exGreeting.name, 'World')
        assert.equal(exGreeting.shadowRoot.firstElementChild.outerHTML, `<p>Hello, <span id="name">World</span>!</p>`)
    });

    it('should handle the name mutations', () => {
        sandbox.innerHTML = `<ex-greeting name="World"></ex-greeting>`;
        const exGreeting: ExGreeting = sandbox.querySelector('ex-greeting')
        assert.equal(exGreeting.name, 'World')
        exGreeting.name = 'You'
        assert.equal(exGreeting.name, 'You')
        assert.equal(exGreeting.shadowRoot.firstElementChild.outerHTML, `<p>Hello, <span id="name">You</span>!</p>`)
    });
});
