module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          ui: 'bdd',
          reporter: 'spec',
          colors: true,
          ignoreLeaks: false,
          timeout: 120000
        },
        src: [
          'test/specs/*'
        ]
      }
    }
  });
grunt.registerTask('default', ['mochaTest']);
};