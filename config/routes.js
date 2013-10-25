var async = require('async');

module.exports = function(app) {

    //Front End Routes
   
    var about = require('../app/controllers/about');
    app.get('/about', about.render);

    var contact = require('../app/controllers/contact');
    app.get('/contact', contact.render);

    //User Routes
    var users = require('../app/controllers/users');

    app.get('/login', users.login);
    app.get('/signup', users.signup);
    app.get('/forgot', users.forgot);
    app.get('/reset',  users.reset);

    //app.get('/signout', users.signout);

    //Home route
    var index = require('../app/controllers/index');
    app.get('/', index.render);
};



