var async = require('async');

module.exports = function(app, passport) {

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

    app.get('/signout', users.signout);

    

    // user saving. triggered by signup.jade
    app.post('/signup', users.create);

    // login
    // app.post('/users/session', users.session);

    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: 'Invalid email or password.'
    }), users.session);

    //successfule user creation or login
    app.get('/welcome', users.welcome);

    //Home route
    var index = require('../app/controllers/index');
    app.get('/', index.render);
};



