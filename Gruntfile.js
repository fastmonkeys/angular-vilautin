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
          'src/vilautin.module.js',
          'src/vilautin.constants.js',
          'src/vilautin.factory.js',
          'src/vilautin.controller.js',
          'src/vilautin.directive.js'
        ],
        dest: '<%= yeoman.dist %>/js/vilautin.js'
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
            src: ['vilautin.less']
          }
        ]
      }
    },

    cssmin: {
      default: {
        files: {
          '<%= yeoman.dist %>/css/vilautin.min.css': '<%= yeoman.dist %>/css/vilautin.css'
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
          '<%= yeoman.dist %>/css/vilautin.css': ' styles/vilautin.less'
        }
      }
    },

    ngAnnotate: {
      dist: {
        files: {
          '<%= yeoman.dist %>/js/vilautin.js': [
             '<%= yeoman.dist %>/js/vilautin.js'
           ]
        }
      }
    },

    uglify: {
       dist: {
         files: {
           '<%= yeoman.dist %>/js/vilautin.min.js': [
             'src/vilautin.module.js',
             'src/vilautin.constants.js',
             'src/vilautin.factory.js',
             'src/vilautin.controller.js',
             'src/vilautin.directive.js'
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
