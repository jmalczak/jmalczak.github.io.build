'use strict';

module.exports = function (grunt) {
  // Show elapsed time after tasks run
  require('time-grunt')(grunt);
  // Load all Grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    // Configurable paths
    yeoman: {
      app: 'app',
      dist: 'dist'
    },
    watch: {
      jekyll: {
        files: [
          '<%= yeoman.app %>/**/*.{html,yml,md,mkd,markdown}',
          '!<%= yeoman.app %>/_bower_components/**/*'
        ],
        tasks: ['compass','jekyll:server']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '.jekyll/**/*.html',
          '{.tmp,<%= yeoman.app %>}/css/**/*.css',
          '{.tmp,<%= yeoman.app %>}/sass/**/*.scss',
          '{.tmp,<%= yeoman.app %>}/<%= js %>/**/*.js',
          '<%= yeoman.app %>/img/**/*.{gif,jpg,jpeg,png,svg,webp}'
        ],
        tasks: ['compass']
      }
    },
    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '.jekyll',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist: {
        options: {
          open: true,
          base: [
            '<%= yeoman.dist %>'
          ]
        }
      },
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: [
        '.tmp',
        '.jekyll'
      ]
    },
    jekyll: {
      options: {
        bundleExec: true,
        config: '_config.yml',
        src: '<%= yeoman.app %>'
      },
      dist: {
        options: {
          dest: '<%= yeoman.dist %>',
        }
      },
      server: {
        options: {
          config: ['_config.yml', '_config.dev.yml'],
          dest: '.jekyll'
        }
      },
      check: {
        options: {
          doctor: true
        }
      }
    },
    useminPrepare: {
      options: {
        dest: '<%= yeoman.dist %>'
      },
      html: '<%= yeoman.dist %>/index.html'
    },
    usemin: {
      options: {
        assetsDirs: '<%= yeoman.dist %>',
        replaceHtmlEncodedContent: ['<%= yeoman.dist %>/feed.xml']
      },
      html: ['<%= yeoman.dist %>/**/*.html', '<%= yeoman.dist %>/feed.xml'],
      css: ['<%= yeoman.dist %>/css/**/*.css']
    },
    replace: {
      absoluteUrl: {
        src: ['<%= yeoman.dist %>/feed.xml'],
        dest: '<%= yeoman.dist %>/',
        replacements: [{
          from: 'src=&quot;/',
          to: 'src=&quot;http://developerabroad.com/'
        }]
      }
    },
    // Usemin adds files to concat
    concat: {},
    // Usemin adds files to cssmin
    cssmin: {
      dist: {
        options: {
          check: 'gzip'
        }
      }
    },
    imagemin: {
      dist: {
        options: {
          progressive: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: '**/*.{jpg,jpeg,png}',
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: '**/*.svg',
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    copy: {
      dist: {
         files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          src: [
            // Jekyll processes and moves HTML and text files.
            // Usemin moves CSS and javascript inside of Usemin blocks.
            // Copy moves asset files and directories.
            'img/**/*',
            'fonts/**/*',
            // Like Jekyll, exclude files & folders prefixed with an underscore.
            '!**/_*{,/**}',
            '_bower_components/requirejs/require.js',
            'favicon.ico',
            'apple-touch*.png'
          ],
          dest: '<%= yeoman.dist %>'
        },
        {
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>/_bower_components/font-awesome',
          src: 'fonts/fontawesome-webfont.*',
          dest: '<%= yeoman.dist %>'
        },
        {
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          src: '.nojekyll',
          dest: '<%= yeoman.dist %>/',
        },
        {
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          src: 'CNAME',
          dest: '<%= yeoman.dist %>/',
        }]
      }
    },
    filerev: {
      options: {
        length: 4
      },
      dist: {
        files: [{
          src: [
            '<%= yeoman.dist %>/js/**/*.js',
            '<%= yeoman.dist %>/css/**/*.css',
            '<%= yeoman.dist %>/img/**/*.{gif,jpg,jpeg,png,svg,webp}',
            '<%= yeoman.dist %>/fonts/**/*.{eot*,otf,svg,ttf,woff}',
            '!<%= yeoman.dist %>/fonts/fontawesome-webfont.{eot*,otf,svg,ttf,woff}'
          ]
        }]
      }
    },
    buildcontrol: {
      dist: {
        options: {
          remote: 'origin',
          branch: 'master',
          commit: true,
          push: true
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
        '<%= yeoman.app %>/js/**/*.js',
        'test/spec/**/*.js'
      ]
    },
    requirejs: {
      compile: {
        options: {
          baseUrl: '<%= yeoman.app %>/js',
          name: 'main',
          mainConfigFile: '<%= yeoman.app %>/js/main.js',
          out: '<%= yeoman.dist %>/js/main.js'
        }
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/_bower_components/requirejs/require.js' : '<%= yeoman.dist %>/_bower_components/requirejs/require.js'
        }
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: '<%= yeoman.app %>/sass',
          cssDir: '<%= yeoman.app %>/css'
        }
      }
    },
  });

  // Define Tasks
  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist', 'watch']);
    }

    grunt.task.run([
      'clean:server',
      'jekyll:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('check', [
    'clean:server',
    'jekyll:check',
    'jshint:all',
  ]);

  grunt.registerTask('build', [
    'clean',
    // Jekyll cleans files from the target directory, so must run first
    'compass',
    'jekyll:dist',
    'copy:dist',
    'useminPrepare',
    'concat',
    'cssmin',
    'imagemin',
    'svgmin',
    'requirejs',
    'uglify',
    'filerev',
    'usemin',
    ]);

  grunt.registerTask('deploy', [
    'check',
    'build',
    'replace:absoluteUrl',
    'buildcontrol'
    ]);

  grunt.registerTask('default', [
    'check',
    'build'
  ]);
};
