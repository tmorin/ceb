import {ceb, property, attribute, method, on} from '../../lib/ceb.js';
import {toArray} from 'lodash/index';
import immutable from 'immutable';
import Bacon from 'baconjs';

export default ceb().augment(
    property('pages').getter(el => toArray(el.querySelectorAll('ceb-ui-page'))),

    property('displayedPage').getter(el => el.querySelector('ceb-ui-page:not([hidden])')),

    method('attachedCallback').invoke((el) => {
        el._cebAppContext = new immutable.fromJs({
            displayedPageId: undefined,
            pages: {},
            history: []
        });
        el._cebAppActionsStream = new Bacon.Bus();
        el._cebAppContextStream = new Bacon.Bus();

        this._cebAppActionsStream.filter(action => action.name === 'showPage').map(action => action.data).onValue(data => {
            let displayedPageId = el._cebAppContext.get('displayedPageId'),
                historyEntry;

            if (displayedPageId) {
                let displayedPageContext = el._cebAppContext.getIn(['pages', displayedPageId, 'context']);
                historyEntry = new immutable.fromJs({
                    id: displayedPageId,
                    context: displayedPageContext
                });
            }

            el._cebAppContextStream.withMutations(context => {
                context.updateIn('history', list => {
                    return list.push(historyEntry);
                });
                context.set('displayedPageId', data.pageId);
            });
        });
    }),

    method('displayPage').invoke((el, pageId) => {
        this._cebAppActionsStream.push({
            target: el,
            name: 'showPage',
            data: {
                pageId: pageId
            }
        });
    }),

    method('displayPreviousPage').invoke((el) => {
        el.history.pop();
        el.displayPage(el.history.pop());
    }),

    method('mergeContext').invoke((el, context) => {

    }),

    on('ceb-action').invoke((el, evt) => {
        this.streams.push({
            target: evt.target,
            name: evt.detail.name,
            data: evt.detail.data
        });
    })
).register('ceb-ui-app');
