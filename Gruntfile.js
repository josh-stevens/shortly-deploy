module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: ['public/client/*.js'],
        dest: 'public/dist/production.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'nyan' //nyan, xunit, html-cov, dot, min, markdown
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      build: {
        src:'public/dist/production.js',
        dest: 'public/dist/production.min.js'
      }
    },

    jshint: {
      files: [
        'public/client/*.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      build: {
        src:'public/style.css',
        dest: 'public/dist/style.min.css'
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      },
      server: {
        files: 'server.js',
        tasks:
        ['test',
        'deploy']
      }
    },

    shell: {
      prodServer: {
        command: ['git commit -am "Automated deploy"', 'git push heroku master', 'heroku open'].join('&&'),
        options: {
          callback: function(err, stdout, stderr, cb) {
            grunt.log.write(stdout);
          }
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('default', ['build']);

  grunt.registerTask('test', [
    'mochaTest'
    //your code here
  ]);

  grunt.registerTask('build', [
    'jshint', 'concat', 'uglify', 'cssmin'
  ]);

  //can be used to auto-deploy.
  grunt.registerTask('upload', function(n) {
    //Grunt options are ways to customize tasks.  Research ways to use them.
    if(grunt.option('prod')) {
      grunt.task.run(['shell']);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    'shell'
  ]);


};
