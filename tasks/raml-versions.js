/*
 * grunt-raml-versions
 * https://github.com/hallmark/grunt-raml-versions
 *
 * Copyright (c) 2016 Mark Ture
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash');
var async = require('async');
var raml = require('raml-parser');

module.exports = function(grunt) {
  // From https://github.com/gruntjs/grunt/blob/master/lib/grunt/task.js
  // Multi task targets can't start with _ or be a reserved property (options).
  function isValidMultiTaskTarget(target) {
    return !/^_|^options$/.test(target);
  }

  // From https://github.com/gruntjs/grunt/blob/master/lib/grunt/task.js
  function getAllTargets(taskname) {
    var targets = Object.keys(grunt.config.getRaw(taskname) || {});
    targets = targets.filter(isValidMultiTaskTarget);
    return targets;
  }

  grunt.template.addDelimiters('rv_cashCurlyDelimiters', '${', '}');

  grunt.registerTask('raml_versions', 'Make versioned copies of docs generated from RAML.', function(target) {
    // Merge task-specific options with these defaults.
    var options = this.options({
      relatedTask: 'raml2html'
    });

    grunt.log.ok('Making versioned copies of output files for related RAML task: ' + options.relatedTask);

    var targets = target || getAllTargets(options.relatedTask);
    if (grunt.util.kindOf(targets) === 'string') {
      targets = [targets];
    }

    if (grunt.util.kindOf(targets) !== 'array') {
      grunt.log.error('Invalid type: ' + grunt.util.kindOf(targets));
      grunt.fail.warn('Unexpected type for target.');
    }

    if (targets.length === 0) {
      grunt.fail.warn('No target specified or none found for related task: ' + options.relatedTask);
    }

    grunt.verbose.ok('Versioning HTML for targets: ' + grunt.log.wordlist(targets));

    var allFiles = _.reduce(targets, function(result, target) {
      var fileData = grunt.config.get([options.relatedTask, target]);
      var files = grunt.task.normalizeMultiTaskFiles(fileData);
      return result.concat(files);
    }, []);

    var done = this.async();

    async.eachSeries(allFiles, function(file, callback) {

      if (file.src.length === 0) {
        grunt.verbose.ok('No src file(s) for dest: ' + grunt.log.wordlist([file.dest]) + '. Skipping.');
        return callback();
      }

      if (file.src.length > 1) {
        grunt.verbose.ok('Only one src file supported: ' + grunt.log.wordlist(file.src) + '. Skipping.');
        return callback();
      }

      if (!grunt.file.isMatch({matchBase: true}, '*.raml', file.src)) {
        grunt.verbose.ok('Only .raml src files are supported: ' + grunt.log.wordlist(file.src) + '. Skipping.');
        return callback();
      }

      if (!_.has(options.patterns, file.dest)) {
        grunt.verbose.ok('No matching versioned pattern found for: ' + grunt.log.wordlist([file.dest]) + '. Skipping.');
        return callback();
      }

      if (!grunt.file.isFile(file.dest)) {
        grunt.verbose.ok('Destination file does not exist: ' + grunt.log.wordlist([file.dest]) + '. Skipping.');
        return callback();
      }

      var definition = grunt.file.read(file.src[0]);
      raml.load(definition).then(function(data) {
        grunt.verbose.ok('Version from ' + grunt.log.wordlist(file.src) + ': ' + data.version);
        var pattern = _.get(options.patterns, file.dest);
        var copyDest = grunt.template.process(pattern, {delimiters: 'rv_cashCurlyDelimiters', data: {version: data.version}});

        grunt.log.ok('Copying: ' + grunt.log.wordlist([file.dest]) + ' -> ' + grunt.log.wordlist([copyDest]) + '');
        grunt.file.copy(file.dest, copyDest);

        callback();
      }, function(error) {
        grunt.log.error('Error parsing ' + grunt.log.wordlist(file.src) + ': ' + error);
        callback(error);
      });
    }, function(err) {
      done(err);
    });

  });

};
