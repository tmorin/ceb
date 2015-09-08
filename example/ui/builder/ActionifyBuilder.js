import {Builder, attribute, method} from 'es6/lib/ceb.js';
import {attributesAggregator} from './AttributesAggregatorBuilder.js';
import {noop, wrap} from 'es6/lib/utils.js';
import {trigger} from '../utils.js';

export class ActionifyBuilder extends Builder {

    constructor(builder) {
        super();
        this.data = {builder, name: 'UI-EXECUTE'};
    }

    name(name) {
        this.data.name = name;
        return this;
    }

    build(proto, on) {
        let name = this.data.name,
            builder = this.data.builder;

        // the name of the action
        attribute('name').build(proto, on);

        // the eventual action's parameters
        attributesAggregator('params').build(proto, on);

        // to trigger the action manually
        method('trigger').invoke(el => {
            if (el.name) {
                trigger(el, {
                    name: name,
                    bubbles: true,
                    cancellable: true
                }, {
                    name: el.name,
                    params: el.params
                });
            }
        }).build(proto, on);

        // to trigger the action on an event/method
        if (builder && builder.data.invoke) {
            let invoke = builder.data.invoke || noop();
            builder.data.invoke = wrap(invoke, (next, el, evt, target) => {
                el.trigger();
                return next(el, evt, target);
            });
            builder.build(proto, on);
        }
    }
}

export function actionify(prefix) {
    return new ActionifyBuilder(prefix);
}

