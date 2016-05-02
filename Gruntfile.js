/*
 * grunt-raml-versions
 * https://github.com/hallmark/grunt-raml-versions
 *
 * Copyright (c) 2016 Mark Ture
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    raml2html: {
      all: {
        files: {
          './tmp/docs/index.html': ['test/fixtures/test.raml']
        }
      }
    },

    // Configuration to be run (and then tested).
    raml_versions: {
      options: {
        patterns: {
          './tmp/docs/index.html': './tmp/docs/${=version}/api/index.html'
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*.test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-raml2html');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'raml2html', 'raml_versions', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
