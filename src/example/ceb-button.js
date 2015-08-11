import {ceb, property, attribute, delegate} from '../lib/ceb';

var builder = ceb()
    .augment(
    delegate(attribute('disabled').boolean()).to('button').prop()
);

builder.register('test-super-button');
