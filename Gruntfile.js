'use strict';

module.exports = function (grunt) {

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    folders: {
      app: 'app',
      dist: 'dist'
    },
    watch: {
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
           '<%= folders.app %>/**/*.{html,yml,md,mkd,markdown}',
          '!<%= folders.app %>/.jekyll/**/*',
          '!<%= folders.app %>/_bower_components/**/*',
          '_config*yml',
          '{.tmp,<%= folders.app %>}/css/**/*.css',
          '{.tmp,<%= folders.app %>}/sass/**/*.scss',
          '{.tmp,<%= folders.app %>}/<%= js %>/**/*.js',
          '<%= folders.app %>/img/**/*.{gif,jpg,jpeg,png,svg,webp}'
        ],
        tasks: ['compass','jekyll:server']
      }
    },
    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '.jekyll',
            '<%= folders.app %>'
          ]
        }
      },
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= folders.dist %>/*',
            '!<%= folders.dist %>/.git*'
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
        src: '<%= folders.app %>'
      },
      dist: {
        options: {
          dest: '<%= folders.dist %>',
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
        dest: '<%= folders.dist %>'
      },
      html: '<%= folders.dist %>/index.html'
    },
    usemin: {
      options: {
        assetsDirs: '<%= folders.dist %>'
      },
      html: ['<%= folders.dist %>/**/*.html', '<%= folders.dist %>/feed.xml'],
      css: ['<%= folders.dist %>/css/**/*.css']
    },
    replace: {
      absoluteUrl: {
        src: ['<%= folders.dist %>/feed.xml'],
        dest: '<%= folders.dist %>/',
        replacements: [{
          from: 'src=&quot;/',
          to: 'src=&quot;http://developerabroad.com/'
        }]
      }
    },
    concat: {},
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
          cwd: '<%= folders.dist %>',
          src: '**/*.{jpg,jpeg,png}',
          dest: '<%= folders.dist %>'
        }]
      }
    },
    copy: {
      dist: {
         files: [{
          expand: true,
          dot: true,
          cwd: '<%= folders.app %>',
          src: [
            'img/**/*',
            'fonts/**/*',
            'css/**/*',
            // Like Jekyll, exclude files & folders prefixed with an underscore.
            '!**/_*{,/**}',
            '_bower_components/jquery/jquery.min.js',
            '_bower_components/bootstrap/dist/js/bootstrap.min.js',
            '_bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
            '_bower_components/requirejs/require.js',
            '_bower_components/ekko-lightbox/dist/ekko-lightbox.min.js',
            '_bower_components/ekko-lightbox/dist/ekko-lightbox.min.css',
            '_bower_components/mapbox.js/mapbox.js',
            '_bower_components/mapbox.js/mapbox.css',
            '_bower_components/knockout/dist/knockout.js',
            'favicon.ico',
            'apple-touch*.png'
          ],
          dest: '<%= folders.dist %>'
        },
        {
          expand: true,
          dot: true,
          cwd: '<%= folders.app %>/_bower_components/font-awesome',
          src: 'fonts/fontawesome-webfont.*',
          dest: '<%= folders.dist %>'
        },
        {
          expand: true,
          dot: true,
          cwd: '<%= folders.app %>',
          src: '.nojekyll',
          dest: '<%= folders.dist %>/',
        },
        {
          expand: true,
          dot: true,
          cwd: '<%= folders.app %>',
          src: 'CNAME',
          dest: '<%= folders.dist %>/',
        }]
      }
    },
    buildcontrol: {
      dist: {
        options: {
          remote: 'git@github.com:jmalczak/jmalczak.github.io.git',
          branch: 'master',
          commit: true,
          push: true,
          shallowFetch: true
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
        '<%= folders.app %>/js/**/*.js',
        'test/spec/**/*.js'
      ]
    },
    uglify: {
      dist: {
        files: [{
              '<%= folders.dist %>/_bower_components/requirejs/require.js' : '<%= folders.dist %>/_bower_components/requirejs/require.js'
            }, {
              expand: true,
              cwd: '<%= folders.app %>/js',
              src: '**/*.js',
              dest: '<%= folders.dist %>/js'
          }]
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: '<%= folders.app %>/sass',
          cssDir: '<%= folders.app %>/css'
        }
      }
    },
  });

  grunt.registerTask('serve', function (target) {
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
    'compass',
    'jekyll:dist',
    'copy:dist',
    'useminPrepare',
    'concat',
    'cssmin',
    'uglify',
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
