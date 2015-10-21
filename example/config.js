(function (g) {
    g.define = g.System.amdDefine;
    g.require = g.requirejs = g.System.amdRequire;
    g.System.config({
        baseURL: '.',
        transpiler: 'babel',
        map: {
            'bacon': 'node_modules/baconjs/dist/Bacon.min.js',
            'jquery': 'node_modules/jquery/dist/jquery.min.js',
            'bootstrap': 'node_modules/bootstrap/dist/js/bootstrap.min.js',
            'incremental-dom': 'node_modules/incremental-dom/dist/incremental-dom.js',
            'idomizer': 'node_modules/idomizer/dist/idomizer.js',
            'redux': 'node_modules/redux/dist/redux.js',
            'immutable': 'node_modules/immutable/dist/immutable.min.js',
            'immutable-reducers': 'node_modules/immutable-reducers/dist/immutable-reducers.js',
            'handlebars': 'node_modules/handlebars/dist/handlebars.min.js'
        }
    });
}(this));
