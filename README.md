# grunt-raml-versions

> Make versioned copies of docs generated from RAML.

## WARNING
:heavy_exclamation_mark::heavy_exclamation_mark: This plugin is experimental quality! Use with caution, until it has gone through additional testing and reached v1.0.0.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-raml-versions --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-raml-versions');
```

## The "raml_versions" task

### Overview
In your project's Gruntfile, add a section named `raml_versions` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  raml_versions: {
    options: {
      // Task-specific options go here.
    }
  },
});
```

### Options

#### options.patterns
Type: `Object`
Default value: `{}`

A set of patterns. For each pattern:
1. The key should match the destination for a raml2[nnn] task.
2. The value should represent the _versioned_ file path. The version will be read from the original
RAML file (i.e. the source in the original task). Then, the version will be inserted
into the _versioned_ file path, in the place specified by the pattern: `${=version}`

#### options.relatedTask
Type: `String`
Default value: `'raml2html'`

The name of the initial raml2[nnn] task.

### Usage Examples

#### Node.js API Versioned Docs
The Node.js Foundation hosts its API documentation using the
following pattern:
* The latest API docs are hosted at:
  * https://nodejs.org/api/
* A given version of the API docs can always be directly specified. For example:
  * https://nodejs.org/docs/v0.12.13/api/

In this example, the `raml2html` task will generate the HTML documentation at the default, "latest" location. Then, the `raml_versions` task will make a copy to the versioned path, matching the Node.js versioning scheme.

```js
grunt.initConfig({
  raml2html: {
    all: {
      files: {
        './build/api/index.html': ['./my-api.raml']
      }
    }
  },

  raml_versions: {
    options: {
      patterns: {
        './build/api/index.html': './build/docs/${=version}/api/index.html'
      }
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
