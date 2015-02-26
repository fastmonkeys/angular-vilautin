'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);


  grunt.initConfig({
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

    concat: {
      dist: {
        src: [
          'src/britney.module.js',
          'src/britney.factory.js',
          'src/britney.controller.js',
          'src/britney.directive.js'
        ],
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
            src: ['britney.less']
          }
        ]
      }
    },

    cssmin: {
      default: {
        files: {
          '<%= yeoman.dist %>/css/britney.min.css': '<%= yeoman.dist %>/css/britney.css'
        }
      }
    },

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

    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },

    less: {
      development: {
        files: {
          '<%= yeoman.dist %>/css/britney.css': ' styles/britney.less'
        }
      }
    },

    ngAnnotate: {
      dist: {
        files: {
          '<%= yeoman.dist %>/js/britney.js': [
             '<%= yeoman.dist %>/js/britney.js'
           ]
        }
      }
    },

    uglify: {
       dist: {
         files: {
           '<%= yeoman.dist %>/js/britney.min.js': [
             'src/britney.module.js',
             'src/britney.factory.js',
             'src/britney.controller.js',
             'src/britney.directive.js'
           ]
         }
       }
    },

    yeoman: {
      dist: 'dist'
    }
  });

  grunt.registerTask('test', [
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean',
    'less',
    'cssmin',
    'concat',
    'ngAnnotate',
    'uglify',
    'copy'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);
};
