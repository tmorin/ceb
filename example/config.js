window.define = System.amdDefine;
window.require = window.requirejs = System.amdRequire;

System.config({
    baseURL: '.',
    transpiler: 'babel',
    map: {
        'bacon': 'node_modules/baconjs/dist/Bacon.min.js',
        'jquery': 'node_modules/jquery/dist/jquery.min.js',
        'incremental-dom': 'node_modules/incremental-dom/dist/incremental-dom.js',
        'htmlparser2': 'dist/vendors/htmlparser2.js',
        'redux': 'node_modules/redux/dist/redux.js',
        'immutable': 'node_modules/immutable/dist/immutable.min.js',
        'immutable-reducers': 'node_modules/immutable-reducers/dist/immutable-reducers.js',
        'handlebars': 'node_modules/handlebars/dist/handlebars.min.js'
    }
});
