import './elements/ceb-templator.js';

var data = {
    items: [{
        name: 'item1'
    }, {
        name: 'item2'
    }, {
        name: 'item3'
    }]
};

var withHandlebars = document.getElementById('withHandlebars');
var withHandlebarsFrom = document.getElementById('withHandlebarsFrom');
var withHandlebarsTo = document.getElementById('withHandlebarsTo');
var withHandlebarsLive = document.getElementById('withHandlebarsLive');

withHandlebarsFrom.textContent = withHandlebars.outerHTML;
withHandlebarsTo.textContent = withHandlebars.render(data);
withHandlebarsLive.innerHTML = withHandlebars.render(data);
