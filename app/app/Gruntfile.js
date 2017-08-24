var grunt = require("grunt");
grunt.config.init({
    pkg: grunt.file.readJSON('package.json'),
    'create-windows-installer': {
        x64: {
            version:'1.0.0',
            authors: 'baifu-lyc',
            appDirectory: 'VisionTestingSystem-win32-x64',
            outputDirectory :'Output',
            exe: 'vison.exe',
            description:"VisionTestingSystem"
        }       
    }
});

grunt.loadNpmTasks('grunt-electron-installer');
grunt.registerTask('default', ['create-windows-installer']);