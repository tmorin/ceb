const CHECKABLE_INPUT_TYPES = ['checkbox', 'radio'];

const SELECTABLE_FORM_CONTROLS = ['select'];

export const RULES = [{
    name: 'required',
    filter(el) {
        return el.hasAttribute('required');
    },
    apply(el) {
        if (CHECKABLE_INPUT_TYPES.indexOf((el.type || '').toLowerCase()) > -1) {
            return !(el.checked);
        }
        if (SELECTABLE_FORM_CONTROLS.indexOf((el.tagname || '').toLowerCase()) > -1) {
            return el.selectedOptions.length < 1;
        }
        if ('value' in el) {
            return el.value.trim().length < 1;
        }
        return false;
    }
}, {
    name: 'minlength',
    filter(el) {
        return el.hasAttribute('minlength');
    },
    apply(el) {
        var minlength = parseInt(el.getAttribute('minlength')) || 0;
        if ('value' in el && el.value) {
            return el.value.trim().length < minlength ? {minlength} : false;
        }
        return false;
    }
}, {
    name: 'maxlength',
    filter(el) {
        return el.hasAttribute('maxlength');
    },
    apply(el) {
        var maxlength = parseInt(el.getAttribute('maxlength')) || 0;
        if ('value' in el && el.value) {
            return el.value.trim().length > maxlength ? {maxlength} : false;
        }
        return false;
    }
}];
