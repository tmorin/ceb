import step1 from './step1.html';
import step1Desc from './step1.md';
import step2 from './step2.html';
import step2Desc from './step2.md';

export default {
    name: 'amd - load ceb over AMD',
    steps: [
        {name: 'Step1 - load ceb from require.js', content: step1, desc: step1Desc},
        {name: 'Step2 - register a custom element', content: step2, desc: step2Desc},
    ]
};
