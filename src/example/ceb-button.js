import {ceb, property, method} from '../lib/ceb';

var builder = ceb();

builder.augment(
    property('action').setter()
);

builder.augment(
    method('execute').call(el => console.log(el.tagName, 'execute'))
);


var CebButton = builder.register('ceb-button');
