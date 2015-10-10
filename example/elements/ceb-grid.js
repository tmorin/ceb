import {ceb, method, property, attribute, on} from 'es6/lib/ceb.js';
import {toArray, assign, isFunction} from 'es6/lib/utils.js';
import $ from 'jquery';
import {idomify} from '../builders/idomify.js';

ceb().augment(
    property('data').value([]),
    method('query').invoke((el, queryRequest) => {
        let req = assign({
                pagination: {
                    from: 0,
                    size: 10
                }
            }, queryRequest),
            res = {
                req: req
            };

        if (el.data) {
            let resData = el.data;

            if (isFunction(req.filterBy)) {
                resData = resData.filter(req.filterBy);
            } else if (req.filterBy) {
                let clauses = Object.keys(req.filterBy).map(field => ([
                    field, new RegExp(req.filterBy[field].replace(/\*/gim, '.*'), 'gim')
                ]));
                resData = resData.filter((item) => {
                    return !!(clauses.filter(([field, pattern]) => pattern.test(item[field]))[0]);
                });
            }

            if (req.sortBy) {
                resData = resData.sort(req.filterBy);
            }

            let data = resData.slice(req.pagination.from, req.pagination.from + req.pagination.size);
            assign(res, {
                data,
                pagination: {
                    from: req.pagination.from,
                    size: data.length,
                    max: resData.length
                }
            });
        } else {
            assign(res, {
                data: [],
                pagination: {
                    from: 0,
                    size: 0,
                    max: 0
                }
            });
        }

        return new Promise((resolve) => {
            resolve(res);
        });
    })
).register('ceb-store-memory');

ceb().augment(
    property('toData').value(() => ( req => req.filterBy )),
    property('toResponse').value(() => ( payload => payload )),
    method('query').invoke((el, queryRequest) => {
        let req = assign({
                pagination: {
                    from: 0,
                    size: 10
                }
            }, queryRequest),
            res = {
                req: req
            },
            param = assign({}, el.options.ajax, {
                data: assign({}, el.options.ajax.data, el.toData(req))
            });
        return $.ajax(param).then(payload => assign(res, el.toResponse(payload, req) || {
                data: [],
                pagination: {
                    from: 0,
                    size: 0,
                    max: 0
                }
            }));
    })
).register('ceb-store-rest');

ceb().augment(
    idomify(`
        <table tpl-key="{{el.uuid}}-table-header" class="table" thead>
            <caption><tpl-text value="el.options.caption"/></caption>
            <thead>
                <tr>
                    <tpl-each items="el.options.columns" item="column" index="columnIndex">
                        <th tpl-key="{{el.uuid}}-theader-th-{{columnIndex}}" class="{{column.classes}}" id="{{column.id}}">
                            <span><tpl-text value="column.title" /></span>
                        </th>
                    </tpl-each>
                </tr>
            </thead>
        </table>

        <div tbody-wrapper>
            <table tpl-key="{{el.uuid}}-table-body" class="table table-hover" tbody>
                <tbody>
                    <tpl-if expression="el.data.length > 0">
                        <tpl-each items="el.data" item="row" index="rowIndex">
                            <tr tpl-key="{{el.uuid}}-tbody-{{rowIndex}}">
                                <tpl-each items="el.options.columns" item="column" index="columnIndex">
                                    <td tpl-key="{{el.uuid}}-tbody-{{rowIndex}}-{{columnIndex}}" class="{{column.classes}}">
                                        <tpl-text value="el.formatCell(row, column, row[column.field])" />
                                    </td>
                                </tpl-each>
                            </tr>
                        </tpl-each>
                    <tpl-else />
                        <tr>
                            <td class="empty" colspan="{{el.options.columns.length}}">
                                <p class="text-warning text-center lead">no items to display</p>
                            </td>
                        </tr>
                    </tpl-if>
                </tbody>
            </table>
        </div>

        <table tpl-key="{{el.uuid}}-table-footer" class="table" tfoot>
            <tfoot>
                <tpl-if expression="el.data.length > 0">
                    <tr>
                        <td colspan="{{el.options.columns.length}}">
                            <form class="form-inline row" onsubmit="return false;">
                                <div class="col-md-4 text-center">
                                    page
                                    <select name="pager.pages" class="form-control input-sm">
                                        {{ for (var i = 1; i < el.pager.pages.max + 1; i++) { }}
                                            <option value="{{i-1}}" selected="{{ el.pager.pages.current === i ? '' : null }}"><tpl-text value="i"/></option>
                                        {{ } }}
                                    </select>
                                    /
                                    <span class="badge"><tpl-text value="el.pager.pages.max" /></span>
                                </div>
                                <div class="col-md-4 text-center">
                                    display
                                    <select name="pager.rows" class="form-control input-sm">
                                        {{ for (var i = 1; i < el.pager.rows.steps + 1; i++) { }}
                                            {{ var value =  i * el.pager.rows.offset; }}
                                            <option value="{{value}}" selected="{{ el.pagination.size === value ? '' : null }}"><tpl-text value="value"/></option>
                                        {{ } }}
                                    </select>
                                    rows
                                </div>
                                <div class="col-md-4 text-center">
                                    <span class="badge"><tpl-text value="el.data.length" /></span>
                                    items
                                    /
                                    <span class="badge"><tpl-text value="el.pagination.max" /></span>
                                </div>
                            </form>
                        </td>
                    </tr>
                </tpl-if>
            </tfoot>
        </table>
    `).options({varDataName: 'el'}),

    attribute('store'),
    property('uuid').value(() => Date.now()),
    property('options'),
    property('pagination'),
    property('pager'),
    property('filterBy').setter((el, value) => {
        el._filterBy = value;
        el.pagination.from = 0;
    }).getter(el => el._filterBy),

    method('createdCallback').invoke(el => {
        el.setAttribute('class', (el.getAttribute('class') || '') + ' ');

        let pager = assign({
            pages: {
                current: 0,
                max: 0
            },
            rows: {
                steps: 5,
                offset: 5
            }
        }, el.pager);
        el.pager = pager;

        let options = assign({
            caption: null,
            columns: [],
            body: {
                height: undefined
            }
        }, el.options);
        el.options = options;

        let pagination = assign({
            from: 0,
            size: 5,
            max: 0
        }, el.pagination);
        el.pagination = pagination;


        let caption = el.querySelector('caption');
        if (caption) {
            options.caption = caption.textContent;
        }

        let ths = toArray(el.querySelectorAll('table thead tr th'));
        if (ths.length > 0) {
            options.columns = ths.map(th => ({
                classes: th['class'],
                title: th.textContent,
                id: th.getAttribute('id'),
                type: th.getAttribute('type'),
                field: th.field || th.id || th.textContent.trim()
            }));
        }

        el.options = options;

        let intAtts = ['pagination.from', 'pagination.size', 'pager.rows.steps', 'pager.rows.offset'];
        let strAtts = ['options.body.height'];
        let allAtts = intAtts.concat(strAtts);

        toArray(el.attributes)
            .filter(a => allAtts.indexOf(a.name) > -1)
            .forEach(a => {
                let c = el;
                let paths = a.name.split('.');
                let i = 0;
                for (i; i < paths.length - 1; i++) {
                    c = c[paths[i]];
                    if (!c) {
                        c = {};
                    }
                }
                if (intAtts.indexOf(a.name) > -1) {
                    c[paths[i]] = parseInt(a.value, 0);
                } else if (strAtts.indexOf(a.name) > -1) {
                    c[paths[i]] = a.value.trim();
                } else {
                    c[paths[i]] = a.value;
                }
            });
    }),

    method('formatCell').invoke((el, row, column, value) => {
        if (isFunction(column.formatCell)) {
            return column.formatCell(el, row, column, value);
        }
        switch (column.type) {
            case 'date':
                let date = value;
                if (typeof value === 'string') {
                    date = new Date(value);
                }
                return date.toISOString();
            default:
                return value;
        }
    }),

    method('refresh').invoke(el => {
        let store = document.getElementById(el.store),
            queryRequest = {
                pagination: {
                    from: el.pagination.from,
                    size: el.pagination.size
                },
                sortBy: el.sortBy,
                filterBy: el.filterBy
            },
            p;

        if (store) {
            p = store.query(queryRequest).then(queryResponse => {
                el.data = queryResponse.data;
                el.pagination = assign({}, queryResponse.pagination, {size: el.pagination.size});
                assign(el.pager, {
                    pages: {
                        current: el.pagination.from / el.pagination.size + 1,
                        max: Math.ceil(el.pagination.max / el.pagination.size)
                    }
                });
                return queryResponse;
            });
        } else {
            p = new Promise((resolve) => {
                let queryResponse = {
                    data: [],
                    pagination: {
                        from: 0,
                        size: 0,
                        max: 0
                    }
                };
                el.data = queryResponse.data;
                el.pagination = assign({}, queryResponse.pagination, {size: el.pagination.size});
                assign(el.pager, {
                    pages: {
                        current: el.pagination.from / el.pagination.size + 1,
                        max: Math.ceil(el.pagination.max / el.pagination.size)
                    }
                });
                resolve(queryResponse);
            });
        }

        return p.then(queryResponse => {
            el.render();
            return queryResponse;
        })
    }),

    method('render').wrap((next, el) => {
        next(el);
        el.resize();
    }),

    method('resize').invoke(function (el) {
        let thead = el.querySelector('table[thead=""]'),
            tbody = el.querySelector('table[tbody=""]'),
            tbodyWrapper = el.querySelector('[tbody-wrapper=""]'),
            bodyTds = toArray(tbody.querySelectorAll('tbody tr:nth-child(1) td:not(.empty)')).map(td => td);

        if (el.options.body.height) {
            assign(tbodyWrapper.style, {
                display: 'block',
                'max-height': el.options.body.height,
                overflow: 'auto'
            });
        } else {
            assign(tbodyWrapper.style, {
                display: 'table',
                'max-height': '',
                overflow: ''
            });
        }

        if (bodyTds.length > 0) {
            let rightExtraWidth = thead.offsetWidth - tbody.offsetWidth;
            toArray(thead.querySelectorAll('thead tr:nth-child(1) th')).forEach((th, i, a) => {
                let newWidth = i < a.length - 1 ? bodyTds[i].offsetWidth : bodyTds[i].offsetWidth + rightExtraWidth;
                th.style.width = newWidth + 'px';
            });
        }
    }),

    on('change').delegate('select[name="pager.pages"]').skip().invoke((el, evt) => {
        assign(el.pagination, {
            from: parseInt(evt.target.value, 0) * el.pagination.size
        });
        el.refresh();
    }),

    on('change').delegate('select[name="pager.rows"]').skip().invoke((el, evt) => {
        assign(el.pagination, {
            from: 0,
            size: parseInt(evt.target.value, 0)
        });
        el.refresh();
    })
).register('ceb-grid');

