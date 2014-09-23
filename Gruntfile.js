'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  require('time-grunt')(grunt);

  var appConfig = {
    dist: 'dist'
  };

  grunt.initConfig({

    yeoman: appConfig,

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          'src/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      }
    },

    uglify: {
       dist: {
         files: {
           '<%= yeoman.dist %>/js/britney.min.js': [
             'src/britney.js',
             'src/notification-service.js',
             'src/notification-controller.js',
             'src/britney-flasher.js'
           ]
         }
       }
    },

    less: {
      development: {
        files: {
          '<%= yeoman.dist %>/css/britney.css': ' styles/britney.less'
        }
      }
    },

    cssmin: {
      default: {
        files: {
          '<%= yeoman.dist %>/css/britney.min.css': '<%= yeoman.dist %>/css/britney.css'
        }
      }
    },

    concat: {
      dist: {
        src: ['src/britney.js', 'src/notification-service.js', 'src/notification-controller.js', 'src/britney-flasher.js'],
        dest: '<%= yeoman.dist %>/js/britney.js'
      }
    },

    copy: {
      less: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: 'styles/',
            dest: '<%= yeoman.dist %>/less',
            src: [
              'britney.less'
            ]
          }
        ]
      }
    },

    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    }
  });

  grunt.registerTask('test', [
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'less',
    'cssmin',
    'uglify',
    'concat',
    'copy:less'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
