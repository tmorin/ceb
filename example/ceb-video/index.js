import step0 from './step0.html';
import step0Desc from './step0.md';
import step1 from './step1.html';
import step1Desc from './step1.md';
import step2 from './step2.html';
import step2Desc from './step2.md';
import step3 from './step3.html';
import step3Desc from './step3.md';
import step4 from './step4.html';
import step4Desc from './step4.md';
import step5 from './step5.html';
import step5Desc from './step5.md';
import step6 from './step6.html';
import step6Desc from './step6.md';

export default {
    name: 'ceb-video - advanced usage of the ceb\'s API',
    steps: [
        {name: 'Step0 - all in one', content: step0, desc: step0Desc},
        {name: 'Step1 - register a dummy ceb-video', content: step1, desc: step1Desc},
        {name: 'Step2 - manage the controls bar', content: step2, desc: step2Desc},
        {name: 'Step3 - manage the play/pause/stop controls', content: step3, desc: step3Desc},
        {name: 'Step4 - manage the volume controls', content: step4, desc: step4Desc},
        {name: 'Step5 - manage the video progress control', content: step5, desc: step5Desc},
        {name: 'Step6 - expose the video API', content: step6, desc: step6Desc}
    ]
};
