import './form/index.js';

var form = document.getElementById('theForm');

form.valueAsObject = {
    identity: {
        firstname: 'John',
        lastname: 'Doe',
        sex: 'female',
        birthdate: new Date('1970-01-01'),
        weight: 75,
        height: 170
    },
    address: {
        street: 'Avenue de la gare, 20',
        city: 'Lausanne',
        postalCode: '1018',
        country: 'CH'
    }
};

form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    console.log(evt.target.valueAsObject);
    var json = JSON.stringify(evt.target.valueAsObject, null, '  ');
    window.alert('jsonified object:\n' + json + '\n\nThe object value is also displayed into the console.');
});
