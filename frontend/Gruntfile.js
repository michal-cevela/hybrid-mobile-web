// Generated on 2014-03-05 using generator-angular 0.7.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Define the configuration for all the tasks
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/** \n' +
			' * <%= pkg.name %> v<%= pkg.version %> \n' +
			' * Author: <%= pkg.author %> \n' +
			' * (c) Copyright - <%= grunt.template.today("yyyy") %> \n' +
			' */ \n',

		// Project settings
		yeoman: {
			// configurable paths
			app: require('./bower.json').appPath || 'assets',
			dist: '../mobile/www'
		},

		// Watches files for changes and runs tasks based on the changed files
		watch: {
			js: {
				files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
				tasks: ['newer:jshint:all'],
				options: {
					livereload: true
				}
			},
			jsTest: {
				files: ['test/spec/{,*/}*.js'],
				tasks: ['newer:jshint:test', 'karma']
			},
			styles: {
				files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
				tasks: ['newer:copy:styles', 'autoprefixer']
			},
			gruntfile: {
				files: ['Gruntfile.js']
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'<%= yeoman.app %>/{,*/}*.html',
					'.tmp/styles/{,*/}*.css',
					'{.tmp, <%= yeoman.app %>}/scripts/{,*/}*.js',
					'<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		},

		// The actual grunt server settings
		connect: {
			options: {
				port: 9000,
				hostname: 'localhost', // Change this to '0.0.0.0' to access the server from outside.
				livereload: 35729
			},
			proxies: [
				{
					context: ['/angular-workshop'], // The context(s) to match requests against. Matching requests will be proxied.
					host: 'localhost' ,
					port: 8080 ,
					https: false ,
					timeout: 5000,        // The connection timeout in milliseconds.
					changeOrigin: false,  // Change the origin on the request to the proxy, or keep the original origin?
					headers: {            // A map of headers to be added to proxied requests.
						"x-custom-header": "Angular-Cordova-Workshop"
					},
					xforward: false,
					ws: false,            // Set to true to proxy websockets.
					rewrite: {
						// The key '^/api' is a regex for the path to be rewritten.
						// The value is the context of the data service.
						'^/angular-workshop': '/angular-workshop'
					}
				}
			],
			livereload: {
				options: {
					open: true,
					base: [
						'.tmp',
						'<%= yeoman.app %>'
					],
					middleware: function (connect, options) {
						if (!Array.isArray(options.base)) {
							options.base = [options.base];
						}

						// Setup the proxy
						var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];

						// Serve static files.
						options.base.forEach(function(base) {
							middlewares.push(connect.static(base));
						});

						// Make directory browse-able.
						var directory = options.directory || options.base[options.base.length - 1];
						middlewares.push(connect.directory(directory));

						return middlewares;
					}
				}
			},
			test: {
				options: {
					port: 9001,
					base: [
						'.tmp',
						'test',
						'<%= yeoman.app %>'
					]
				}
			},
			dist: {
				options: {
					base: '<%= yeoman.dist %>'
				}
			}
		},

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: [
				'Gruntfile.js',
				'<%= yeoman.app %>/scripts/{,*/}*.js'
			],
			test: {
				options: {
					jshintrc: 'test/.jshintrc'
				},
				src: ['test/spec/{,*/}*.js']
			}
		},

		// Empties folders to start fresh
		clean: {
			dist: {
				files: [
					{
						dot: true,
						src: [
							'.tmp',
							'<%= yeoman.dist %>/*',
							'!<%= yeoman.dist %>/.git*'
						]
					}
				]
			},
			server: '.tmp'
		},

		// Add vendor prefixed styles
		autoprefixer: {
			options: {
				browsers: ['last 1 version']
			},
			dist: {
				files: [
					{
						expand: true,
						cwd: '.tmp/styles/',
						src: '{,*/}*.css',
						dest: '.tmp/styles/'
					}
				]
			}
		},

		// Automatically inject Bower components into the app
		bowerInstall: {
			target: {
				// Point to the files that should be updated when you run `grunt bowerInstall`
				src: [
					'<%= yeoman.app %>/index.html'
//					'assets/views/**/*.html', // .html support...
//					'assets/styles/main.scss',       // .scss & .sass support...
				],

				cwd: '',
				dependencies: true,
//				devDependencies: false,
//				exclude: [],
//				fileTypes: {},
				ignorePath: '<%= yeoman.app %>/'
			}
		},
/*
		'bower-install': {
			app: {
				src: '<%= yeoman.app %>/index.html',
				ignorePath: '<%= yeoman.app %>/'
			}
		},
*/
		// Renames files for browser caching purposes
		rev: {
			dist: {
				files: {
					src: [
						'<%= yeoman.dist %>/scripts/{,*/}*.js',
						'<%= yeoman.dist %>/styles/{,*/}*.css',
						'<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
						'<%= yeoman.dist %>/fonts/*'
					]
				}
			}
		},

		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates configurations in memory so
		// additional tasks can operate on them
		useminPrepare: {
			html: '<%= yeoman.app %>/index.html',
			options: {
				dest: '<%= yeoman.dist %>'
			}
		},

		// Performs rewrites based on rev and the useminPrepare configuration
		usemin: {
			html: ['<%= yeoman.dist %>/{,*/}*.html'],
			css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
			options: {
				assetsDirs: ['<%= yeoman.dist %>']
			}
		},

		// The following *-min tasks produce minified files in the dist folder
		imagemin: {
			dist: {
				files: [
					{
						expand: true,
						cwd: '<%= yeoman.app %>/images',
						src: '{,*/}*.{png,jpg,jpeg,gif}',
						dest: '<%= yeoman.dist %>/images'
					}
				]
			}
		},
		svgmin: {
			dist: {
				files: [
					{
						expand: true,
						cwd: '<%= yeoman.app %>/images',
						src: '{,*/}*.svg',
						dest: '<%= yeoman.dist %>/images'
					}
				]
			}
		},
		htmlmin: {
			dist: {
				options: {
					collapseWhitespace: true,
					collapseBooleanAttributes: true,
					removeCommentsFromCDATA: true,
					removeOptionalTags: true
				},
				files: [
					{
						expand: true,
						cwd: '<%= yeoman.dist %>',
						src: ['*.html', 'views/{,*/}*.html'],
						dest: '<%= yeoman.dist %>'
					}
				]
			}
		},

		// Allow the use of non-minsafe AngularJS files. Automatically makes it
		// minsafe compatible so Uglify does not destroy the ng references
		ngmin: {
			dist: {
				files: [
					{
						expand: true,
						cwd: '.tmp/concat/scripts',
						src: '*.js',
						dest: '.tmp/concat/scripts'
					}
				]
			}
		},

		// Replace Google CDN references
		cdnify: {
			dist: {
				html: ['<%= yeoman.dist %>/*.html']
			}
		},

		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: '<%= yeoman.app %>',
						dest: '<%= yeoman.dist %>',
						src: [
//							'.htaccess',
							'*.{ico,png,txt}',
							'*.html',
							'fonts/*',
							'images/{,*/}*.{webp}',
							'views/{,*/}*.html',
							'scripts/*.json',
							'scripts/**/lazy/*.js',
							'scripts/vendor/messaging/mqtt-ws-3.1.js',
							'vendor/stomp-websocket/lib/stomp.min.js'
						]
					},
					{
						expand: true,
						cwd: '.tmp/images',
						dest: '<%= yeoman.dist %>/images',
						src: ['generated/*']
					}
				]
			},
			styles: {
				expand: true,
				cwd: '<%= yeoman.app %>/styles',
				dest: '.tmp/styles/',
				src: '{,*/}*.css'
			}
		},

		// Run some tasks in parallel to speed up the build process
		concurrent: {
			server: [
				'copy:styles'
			],
			test: [
				'copy:styles'
			],
			dist: [
				'copy:styles',
				'imagemin',
				'svgmin'
			]
		},

		// By default, your `index.html`'s <!-- Usemin block --> will take care of
		// minification. These next options are pre-configured if you do not wish
		// to use the Usemin blocks.
//		cssmin: {
//			dist: {
//				files: {
//					'<%= yeoman.dist %>/styles/app.min.css': [
//						'.tmp/styles/{,*/}*.css',
//						'<%= yeoman.app %>/styles/{,*/}*.css'
//					]
//				}
//			}
//		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			}
//			dist: {
//				files: {
//					'<%= yeoman.dist %>/scripts/app.min.js': [
//						'<%= yeoman.dist %>/scripts/**/*.js'
//					]
//				}
//			}
		},
//		concat: {
//			js: {
//				dist: 'path/to/app.min.js',
//				src: [
//					'path/to/file1.js'
//				]
//			},
//			css: {
//				dist: 'path/to/file.css',
//				src: [
//					'path/to/file1.js'
//				]
//			},
//			dist: {}
//		},

		// Test settings
		karma: {
			unit: {
				configFile: 'karma.conf.js',
				singleRun: true
			}
		}
	});

//	grunt.loadNpmTasks('grunt-connect-proxy');

	grunt.registerTask('serve', function (target) {
		if (target === 'dist') {
			return grunt.task.run(['build', 'connect:dist:keepalive']);
		}

		grunt.task.run([
			'clean:server',
			'bowerInstall',
			'concurrent:server',
			'autoprefixer',
			'configureProxies:server',
			'connect:livereload',
			'watch'
		]);
	});

	grunt.registerTask('server', function () {
		grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
		grunt.task.run(['serve']);
	});

	grunt.registerTask('test', [
		'clean:server',
		'concurrent:test',
		'autoprefixer',
		'connect:test',
		'karma'
	]);

	grunt.registerTask('build', [
		'clean:dist',
		'bowerInstall',
		'useminPrepare',
		'concurrent:dist',
		'autoprefixer',
		'concat',
		'ngmin',
		'copy:dist',
		'cdnify',
		'cssmin',
		'uglify',
//		'rev',
		'usemin',
		'htmlmin'
	]);

	grunt.registerTask('default', [
		'newer:jshint',
		'test',
		'build'
	]);
};
