import step1 from './step1.html';
import step1Desc from './step1.md';
import step2 from './step2.html';
import step2Desc from './step2.md';
import step3 from './step3.html';
import step3Desc from './step3.md';

export default {
    name: 'ceb-input - quick overview of ceb usages',
    steps: [
        {name: 'Step1 - register the custom element', content: step1, desc: step1Desc},
        {name: 'Step2 - handle the ceb-case attribute', content: step2, desc: step2Desc},
        {name: 'Step3 - manage user input', content: step3, desc: step3Desc}
    ]
};
