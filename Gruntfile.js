'use strict';
require('es6-shim');

var gruntKarmaTargetFactory = require('./Gruntfile.misc.js').gruntKarmaTargetFactory;
var banner = require('./Gruntfile.misc.js').banner;

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        nextVersion: '0.3.3-alpha.0',

        watch: {
            js: {
                files: [
                    'Gruntfile.js',
                    'karma.conf.js',
                    'src/**/*.js',
                    'specs/**/*.js',
                    'demos/**/*.js'
                ],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            src: {
                files: ['src/**/*'],
                tasks: ['karma:serve:run', 'concat'],
                options: {
                    livereload: true
                }
            },
            demos: {
                files: ['demos/**/*'],
                tasks: ['copy'],
                options: {
                    livereload: true
                }
            },
            specs: {
                files: ['specs/**/*'],
                tasks: ['karma:serve:run', 'copy'],
                options: {
                    livereload: true
                }
            },
            livereload: {
                options: {
                    livereload: 35729
                },
                files: ['demos/**/*.html']
            }
        },

        connect: {
            options: {
                port: 9000,
                open: 'http://localhost:9000/specs',
                livereload: 35729,
                hostname: '*'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            connect.static('src'),
                            connect().use('/specs', connect.static('./specs')),
                            connect().use('/demos', connect.static('./demos')),
                            connect().use('/deps', connect.static('./.tmp/deps')),
                            connect().use('/cov', connect.static('./.tmp/cov/html'))
                        ];
                    }
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                'karma.conf.js',
                'src/**/*.js',
                'specs/**/*.js',
                'demos/**/*.js'
            ]
        },

        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            serve: {
                singleRun: false,
                autoWatch: false,
                background: true
            },
            'build-local': {
                singleRun: true,
                autoWatch: false,
                background: false
            },
            'build-ci-ie': gruntKarmaTargetFactory(['slIe11', 'slIe10', 'slIe9']),
            'build-ci-evergreen': gruntKarmaTargetFactory(['slChrome', 'slFirefox']),
            'build-ci-safari': gruntKarmaTargetFactory(['slSafari7', 'slSafari8']),
            'build-ci-android': gruntKarmaTargetFactory(['slAndroid4', 'slAndroid5'])
        },

        coveralls: {
            options: {
                coverageDir: '.tmp/cov/lcov',
                force: true,
                recursive: true,
                debug: false,
                dryRun: false
            }
        },

        copy: {
            site: {
                files: [{
                    expand: true,
                    flatten: true,
                    cwd: 'node_modules',
                    src: [
                        'webcomponents.js/webcomponents-lite.min.js',
                        'rx/dist/rx.lite.min.js',
                        'rx/dist/rx.lite.map',
                        'chai/chai.js',
                        'sinon/pkg/sinon-1.12.2.js',
                        'mocha/mocha.css',
                        'mocha/mocha.js',
                    ],
                    dest: '.tmp/deps'
                }]
            }
        },

        concat: {
            options: {
                banner: banner
            },
            dist: {
                files: {
                    'dist/ceb.js': ['src/ceb.js'],
                    'dist/ceb-feature-template.js': ['src/ceb-feature-template.js'],
                    'dist/ceb-feature-frp.js': ['src/ceb-feature-frp.js'],
                    'dist/ceb-feature-frp-rx.js': ['src/ceb-feature-frp-rx.js'],
                    'dist/ceb-feature-cqrs.js': ['src/ceb-feature-cqrs.js'],
                    'dist/ceb-feature-cqrs-rx.js': ['src/ceb-feature-cqrs-rx.js']
                }
            }
        },

        clean: ['.tmp'],

        uglify: {
            options: {
                banner: banner
            },
            dist: {
                options: {
                    sourceMap: true,
                    sourceMapIncludeSources: true
                },
                files: {
                    'dist/ceb.min.js': ['src/ceb.js'],
                    'dist/ceb-feature-template.min.js': ['src/ceb-feature-template.js'],
                    'dist/ceb-feature-frp.min.js': ['src/ceb-feature-frp.js'],
                    'dist/ceb-feature-frp-rx.min.js': ['src/ceb-feature-frp-rx.js'],
                    'dist/ceb-feature-cqrs.min.js': ['src/ceb-feature-cqrs.js'],
                    'dist/ceb-feature-cqrs-rx.min.js': ['src/ceb-feature-cqrs-rx.js']
                }
            }
        },

        release: {
            options: {
                additionalFiles: ['bower.json']
            }
        },

        'sync-json': {
            bower: {
                dest: 'bower.json',
                fields: {
                    'name': null,
                    'description': null,
                    'version': null,
                    'main': null,
                    'keywords': null,
                    'homepage': null,
                    'repository': null,
                    'license': null,
                    'authors': function (src) {
                        return [src.author];
                    }
                }
            }
        }

    });

    grunt.registerTask('sync-json', 'sync an input json file with output json files', function (givenTargetName) {
        var targets = Object.assign({}, grunt.config.get('sync-json'));
        if(targets.options) {
            delete targets.options;
        }

        var src = grunt.config('sync-json.options.src', 'package.json');
        var indent = grunt.config('sync-json.options.indent', 4);
        var originalInput = grunt.file.readJSON(src);

        function syncTarget(targetName) {
            var target = targets[targetName];
            var input = target.src && grunt.file.exists(target.src) ? grunt.file.readJSON(target.src) : originalInput;
            var originalOutput = target.dest && grunt.file.exists(target.dest) && grunt.file.readJSON(target.dest);
            var output = Object.getOwnPropertyNames(target.fields).map(function (name) {
                return {
                    name: name,
                    value: target.fields[name]
                };
            }).map(function (field) {
                var prop = {
                    name: field.name,
                    value: input[field.name]
                };
                if(typeof field.value === 'string') {
                    prop.value = input[field.value];
                }
                if(typeof field.value === 'function') {
                    prop.value = field.value(input);
                }
                return prop;
            }).reduce(function (a, b) {
                a[b.name] = b.value;
                return a;
            }, {});
            output = Object.assign({}, originalOutput, output);
            grunt.file.write(target.dest, JSON.stringify(output, null, indent));
            grunt.log.ok(target.dest, 'written');
        }

        if(targets.hasOwnProperty(givenTargetName)) {
            syncTarget(givenTargetName);
        } else {
            Object.getOwnPropertyNames(targets).forEach(syncTarget);
        }
    });

    grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function () {
        if(grunt.option('allow-remote')) {
            grunt.config.set('connect.options.hostname', '0.0.0.0');
        }
        if(grunt.option('livereload-only')) {
            grunt.task.run([
                'clean',
                'concat',
                'copy',
                'connect:livereload',
                'watch'
            ]);
        } else {
            grunt.task.run([
                'clean',
                'jshint',
                'concat',
                'copy',
                'karma:serve:start watch',
                'connect:livereload',
                'watch'
            ]);
        }
    });

    grunt.registerTask('build', [
        'clean',
        'jshint',
        'karma:build-local',
        'concat',
        'uglify',
        'copy',
        'sync-json'
    ]);

    grunt.registerTask('build-ci', [
        'clean',
        'jshint',
        'karma:build-ci-ie',
        'karma:build-ci-evergreen',
        'karma:build-ci-safari',
        'karma:build-ci-android',
        'concat',
        'uglify',
        'copy',
        'sync-json',
        'coveralls'
    ]);

    grunt.registerTask('default', ['serve']);

};
