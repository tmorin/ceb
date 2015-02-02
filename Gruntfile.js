'use strict';
require('es6-shim');

var gruntKarmaTargetFactory = require('./Gruntfile.misc.js').gruntKarmaTargetFactory;

var banner = [
     '//',
     '//     <%= pkg.name %> <%= nextVersion %> http://tmorin.github.io/custom-elements-builder',
     '//     <%= pkg.description %>',
     '//     Buil date: <%= grunt.template.today("yyyy-mm-dd") %>',
     '//     Copyright 2015-2015 Thibault Morin',
     '//     Available under MIT license',
     '//',
     ''
 ].join('\n');

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        nextVersion: '0.2.0-master.0',

        watch: {
            js: {
                files: [
                    'Gruntfile.js',
                    'karma.conf.js',
                    'src/**/*.js',
                    'site/pages/**/*.js',
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
                tasks: ['karma:dev:run', 'concat', 'docco'],
                options: {
                    livereload: true
                }
            },
            site: {
                files: ['site/**/*'],
                tasks: ['docco', 'copy'],
                options: {
                    livereload: true
                }
            },
            specs: {
                files: ['specs/**/*'],
                tasks: ['karma:dev:run', 'copy'],
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
                open: true,
                livereload: 35729,
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            connect.static('src'),
                            connect.static('specs'),
                            connect().use('/', connect.static('./node_modules')),
                            connect().use('/demos', connect.static('./demos')),
                            connect().use('/site', connect.static('./build/site')),
                            connect().use('/cov', connect.static('./build/cov/html'))
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
            all: ['Gruntfile.js', 'karma.conf.js', 'src/**/*.js', 'specs/**/*.js', 'demos/**/*.js'],
            site: {
                files: {
                    src: ['site/**/*.js']
                }
            }
        },

        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            dev: {
                singleRun: false,
                autoWatch: true,
                background: true
            },
            'build-local': {
                singleRun: true,
                autoWatch: false
            },
            'build-ci-ie': gruntKarmaTargetFactory(['slIe11', 'slIe10', 'slIe9']),
            'build-ci-evergreen': gruntKarmaTargetFactory(['slChrome', 'slFirefox']),
            'build-ci-safari': gruntKarmaTargetFactory(['slSafari7', 'slSafari8']),
            'build-ci-android': gruntKarmaTargetFactory(['slAndroid4', 'slAndroid5'])
        },

        coveralls: {
            options: {
                coverageDir: 'build/cov/lcov',
                force: true,
                recursive: true
            },
            'build-ci': {
                debug: false,
                dryRun: false
            }
        },

        copy: {
            'site': {
                files: [{
                    expand: true,
                    cwd: 'site/template',
                    src: ['public/**/*'],
                    dest: 'build/site'
                }, {
                    expand: true,
                    cwd: 'specs',
                    src: ['**/*'],
                    dest: 'build/site/testsuite'
                }]
            }
        },

        concat: {
            options: {
                banner: banner
            },
            site: {
                files: {
                    'build/site/testsuite/ceb.js': ['src/ceb.js'],
                    'build/site/testsuite/ceb-feature-template.js': ['src/ceb-feature-template.js'],
                    'build/site/testsuite/ceb-feature-frp.js': ['src/ceb-feature-frp.js']
                }
            },
            dist: {
                files: {
                    'dist/ceb.js': ['src/ceb.js'],
                    'dist/ceb-feature-template.js': ['src/ceb-feature-template.js'],
                    'dist/ceb-feature-frp.js': ['src/ceb-feature-frp.js']
                }
            }
        },

        clean: ['build'],

        uglify: {
            options: {
                banner: banner
            },
            noshims: {
                options: {
                    sourceMap: true,
                    sourceMapIncludeSources: true
                },
                files: {
                    'dist/ceb.min.js': ['src/ceb.js'],
                    'dist/ceb-feature-template.min.js': ['src/ceb-feature-template.js'],
                    'dist/ceb-feature-frp.min.js': ['src/ceb-feature-frp.js']
                }
            },
            shims: {
                options: {
                    sourceMap: true,
                    sourceMapIncludeSources: true
                },
                files: {
                    'dist/ceb.legacy.min.js': [
                        'node_modules/document-register-element/build/document-register-element.max.js',
                        'node_modules/es6-shim/es6-shim.js',
                        'src/ceb.js'
                    ]
                }
            }
        },

        release: {
            options: {
                additionalFiles: ['bower.json', 'component.json']
            }
        },

        docco: {
            site: {
                src: [
                    'site/pages/**/*.js',
                    'build/site/testsuite/*.js',
                    '!build/site/testsuite/*.spec.js'
                ],
                options: {
                    'template': __dirname + '/site/template/page.jst',
                    'css': __dirname + '/site/template/page.css',
                    'output': 'build/site'
                }
            },
            '0.1.x': {
                src: ['site/0.1.x/**/*.js'],
                options: {
                    'template': __dirname + '/site/template/doc.jst',
                    'css': __dirname + '/site/template/doc.css',
                    'output': 'build/site/0.1.x'
                }
            },
            '0.2.x': {
                src: ['site/0.2.x/**/*.js'],
                options: {
                    'template': __dirname + '/site/template/doc.jst',
                    'css': __dirname + '/site/template/doc.css',
                    'output': 'build/site/0.2.x'
                }
            }
        },

        'gh-pages': {
            options: {
                base: 'build/site'
            },
            src: ['**/*']
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
            },
            component: {
                dest: 'component.json',
                fields: {
                    name: function () {
                        return 'ceb';
                    },
                    repository: function () {
                        return 'tmorin/custom-elements-builder';
                    },
                    description: null,
                    version: null,
                    keywords: null,
                    main: null,
                    scripts: function (src) {
                        return [src.main];
                    }
                }
            }
        }

    });

    grunt.registerTask('sync-json', 'sync an input json file with output json files', function (givenTargetName) {
        var targets = Object.assign({}, grunt.config.get('sync-json'));
        if (targets.options) {
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
                if (typeof field.value === 'string') {
                    prop.value = input[field.value];
                }
                if (typeof field.value === 'function') {
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

        if (targets.hasOwnProperty(givenTargetName)) {
            syncTarget(givenTargetName);
        } else {
            Object.getOwnPropertyNames(targets).forEach(syncTarget);
        }
    });

    grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function () {
        if (grunt.option('allow-remote')) {
            grunt.config.set('connect.options.hostname', '0.0.0.0');
        }
        grunt.task.run([
            'clean',
            'jshint',
            'concat',
            'copy',
            'docco',
            'karma:dev:start watch',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        'clean',
        'jshint',
        'karma:build-local',
        'uglify',
        'concat',
        'copy',
        'docco',
        'sync-json'
    ]);

    grunt.registerTask('build-ci', [
        'clean',
        'jshint',
        'karma:build-ci-ie',
        'karma:build-ci-evergreen',
        'karma:build-ci-safari',
        'karma:build-ci-android',
        'uglify',
        'concat',
        'copy',
        'docco',
        'sync-json',
        'coveralls:build-ci'
    ]);

    grunt.registerTask('push-site', [
        'build',
        'gh-pages'
    ]);

    grunt.registerTask('default', ['serve']);

};
