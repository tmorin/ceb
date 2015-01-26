'use strict';
module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    process.env.SLIMERJS_BIN = 'node_modules/.bin/slimerjs';

    var customLaunchers = {
        slChrome: {
            base: 'SauceLabs',
            browserName: 'chrome'
        },
        slFirefox: {
            base: 'SauceLabs',
            browserName: 'firefox'
        },
        slIe11: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '11'
        },
        slIe10: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '10'
        },
        slIe9: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '9'
        },
        slAndroid4: {
            base: 'SauceLabs',
            browserName: 'android',
            version: '4.4'
        }
        /*,
                slAndroid5: {
                    base: 'SauceLabs',
                    browserName: 'android',
                    version: '5.0'
                },
                slIPhone: {
                    base: 'SauceLabs',
                    browserName: 'iPhone'
                },
                slIPad: {
                    base: 'SauceLabs',
                    browserName: 'iPad'
                }*/
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            js: {
                files: ['Gruntfile.js', 'karma.conf.js', 'src/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            jssite: {
                files: ['site/**/*.js'],
                tasks: ['jshint', 'docco'],
                options: {
                    livereload: true
                }
            },
            jstest: {
                files: ['specs/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            livereload: {
                options: {
                    livereload: 35729
                },
                files: ['demos/**/*.{html,css}']
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
                            connect.static('demos'),
                            connect().use('/', connect.static('./node_modules')),
                            connect().use('/site', connect.static('./build/site'))
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
            all: ['Gruntfile.js', 'karma.conf.js', 'src/**/*.js', 'specs/**/*.js', 'demos/**/*.js']
        },

        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            dev: {
                singleRun: false,
                autoWatch: true
            },
            'build-local': {
                singleRun: true,
                autoWatch: false
            },
            'build-ci': {
                sauceLabs: {
                    testName: 'Custom Element Builder Test',
                    recordVideo: false,
                    recordScreenshots: false
                },
                // 3 minutes
                captureTimeout: 3 * 60 * 1000,
                customLaunchers: customLaunchers,
                browsers: Object.keys(customLaunchers),
                reporters: ['dots', 'saucelabs', 'coverage'],
                singleRun: true,
                autoWatch: false
            }
        },

        coveralls: {
            options: {
                coverageDir: 'build/coverage',
                force: true,
                recursive: true
            },
            'build-local': {
                debug: true,
                dryRun: true
            },
            'build-ci': {
                debug: false,
                dryRun: false
            }
        },

        copy: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['ceb.js'],
                    dest: 'dist'
                }]
            },
            'specs-to-suite': {
                files: [{
                    expand: true,
                    cwd: '.',
                    src: ['specs/**/*'],
                    dest: 'build/site'
                }]
            }
        },

        clean: ['build'],

        uglify: {
            options: {
                banner: '/* <%= pkg.name %> - <%= pkg.description %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */',
                sourceMap: true,
                sourceMapIncludeSources: true
            },
            noshims: {
                files: {
                    'dist/ceb.min.js': ['src/ceb.js']
                }
            },
            shims: {
                files: {
                    'dist/ceb.shims.min.js': [
                        'node_modules/document-register-element/build/document-register-element.max.js',
                        'node_modules/es6-shim/es6-shim.js',
                        'src/ceb.js'
                    ]
                }
            }
        },

        sync: {
            build: {
                options: {
                    sync: ['name', 'description', 'keywords', 'homepage', 'authors', 'repository'],
                }
            }
        },

        release: {
            options: {
                additionalFiles: ['bower.json']
            }
        },

        docco: {
            site: {
                src: ['site/**/*.js'],
                options: {
                    output: 'build/site'
                }
            }
        },

        'gh-pages': {
            options: {
                base: 'build/site'
            },
            src: ['**/*']
        }
    });

    grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function () {
        if (grunt.option('allow-remote')) {
            grunt.config.set('connect.options.hostname', '0.0.0.0');
        }
        grunt.task.run(['connect:livereload', 'watch']);
    });

    grunt.registerTask('dev', ['clean', 'jshint', 'karma:dev']);

    grunt.registerTask('build', [
        'clean',
        'jshint',
        'karma:build-local',
        'uglify',
        'copy:build',
        'sync:build',
        'coveralls:build-local'
    ]);

    grunt.registerTask('build-ci', [
        'clean',
        'jshint',
        'karma:build-ci',
        'uglify',
        'copy:build',
        'sync:build',
        'coveralls:build-ci'
    ]);

    grunt.registerTask('build-site', [
        'clean',
        'jshint',
        'docco',
        'copy:specs-to-suite',
        'karma:build-local'
    ]);

    grunt.registerTask('push-site', [
        'clean',
        'build-site',
        'gh-pages'
    ]);

    grunt.registerTask('default', ['serve']);

};
