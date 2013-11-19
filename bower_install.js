var bower = require('node_modules/bower/bin/bower'),
    path = require('path');

bower.commands
.install([path.resolve(".")])
.on('end', function (installed) {
    console.log(installed);
});
