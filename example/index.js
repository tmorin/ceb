import 'document-register-element/build/document-register-element.js';
import {element, method, attribute, property, template, on, dispatchCustomEvent} from '../src/ceb.js';
import './index.less';
import 'codemirror-minified/lib/codemirror.css';
import CodeMirror from 'codemirror-minified/lib/codemirror.js';
import 'codemirror-minified/mode/javascript/javascript.js';
import 'codemirror-minified/mode/htmlmixed/htmlmixed.js';
import cebInput from './ceb-input';
import amd from './amd';

const tutorials = {cebInput, amd};

element().builders(
    template(`
      <select class="tutorials"></select>
      <select class="steps"></select>
    `),
    property('tutorials')
        .setter((el, value) => {
            el._tutorials = value;
            el.querySelector('select.tutorials').innerHTML = Object.keys(value).map(k => `<option value="${k}">${value[k].name}</option>`).join('');
            el.tutorial = Object.keys(value)[0];
        })
        .getter(el => el._tutorials),
    attribute('tutorial').listen((el, oldVal, newVal) => {
        el.step = '';
        el.querySelector('select.steps').innerHTML = el.tutorials[newVal].steps.map((step, index) => `<option value="${index}">${step.name}</option>`);
        el.step = 0;
    }),
    attribute('step').listen((el, oldVal, newVal) => {
        if (newVal) {
            const step = el.tutorials[el.tutorial].steps[parseInt(newVal)];
            dispatchCustomEvent(el, 'select-step', {detail: step});
        }
    }),
    on('change').delegate('select.tutorials').invoke((el, evt, select) => {
        el.tutorial = select.value;
    }),
    on('change').delegate('select.steps').invoke((el, evt, select) => {
        el.step = select.value;
    })
).register('ceb-playground-tutorials');

element().builders(
    method('createdCallback').invoke(el => {
        el.editor = CodeMirror(el, {
            lineNumbers: true,
            tabSize: true,
            autofocus: true,
            mode: 'htmlmixed',
            viewportMargin: Infinity
        });
        el.editor.on('change', evt => dispatchCustomEvent(el, 'update-input', {detail: el.editor.getValue()}));
    }),
    property('value')
        .setter((el, value) => {
            el.editor.setValue(value);
        })
        .getter(el => el.editor.getValue())
).register('ceb-playground-input');

element().builders(
    template(`<iframe></iframe>`),
    property('value')
        .setter((el, value) => {
            el._example = value;
            const iframe = el.querySelector('iframe');
            iframe.src = 'about:blank';
            iframe.onload = () => {
                const iframeDocument = iframe.contentWindow || iframe.contentDocument.document || iframe.contentDocument;
                iframeDocument.document.open();
                iframeDocument.document.write(value);
                iframeDocument.document.close();
            };
        })
        .getter(el => el._example)
).register('ceb-playground-output');

function resize() {
    const windowHeight = window.innerHeight;
    const headerHeight = document.querySelector('body > header').getBoundingClientRect().height;
    const asideHeight = document.querySelector('body > aside').getBoundingClientRect().height;
    const height = windowHeight - headerHeight - asideHeight;
    document.querySelector('ceb-playground-input .CodeMirror').style.height = height + 'px';
    document.querySelector('ceb-playground-output iframe').style.height = height + 'px';
}

window.addEventListener('load', () => {
    window.addEventListener('resize', resize);
    document.addEventListener('update-input', evt => {
        document.querySelector('ceb-playground-output').value = evt.detail;
    });
    document.addEventListener('select-step', evt => {
        if (evt.detail) {
            document.querySelector('ceb-playground-input').value = evt.detail.content;
            document.querySelector('aside').innerHTML = evt.detail.desc || '';
        } else {
            document.querySelector('ceb-playground-input').value = '';
            document.querySelector('aside').innerHTML = '';
        }
    });
    document.querySelector('ceb-playground-tutorials').tutorials = tutorials;
    setTimeout(() => resize(), 0);
});
