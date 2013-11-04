var async = require('async');

module.exports = function(app, passport, auth) {

    //Front End Routes
   
    var about = require('../app/controllers/about');
    app.get('/about', about.render);

    var contact = require('../app/controllers/contact');
    app.get('/contact', auth.requiresLogout, contact.render);

    //User Routes
    var users = require('../app/controllers/users');

    // user must not be logged in for the following operations
    // if logged in they will be redirected to '/'

    app.get('/login',  auth.requiresLogout, users.login);
    app.get('/signup', auth.requiresLogout, users.signup);
    app.get('/forgot', auth.requiresLogout, users.forgot);

    app.get('/reset',   auth.requiresLogin, users.reset);    
    app.get('/signout', auth.requiresLogin, users.signout);

    

    // CONTACT MESSAGE
    // 1. app.get('/contact', auth.requiresLogout, contact.render);
    // 2. app.post('/contact/sendemail', contact.sendemail);

    
    // send contact message to admin. triggered by contact.jade and controller
    app.post('/contact/sendemail', contact.sendemail);


    // LOGIN
    // 1. app.get('/login',  auth.requiresLogout, users.login);
    // 2. app.post('/user/sessions', passport.authenticate('local', {}))
    // 3.  app.get('/welcome', auth.requiresLogin, users.welcome);
    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: 'Invalid email or password.'
    }), users.session);

    
    app.get('/welcome', auth.requiresLogin, users.welcome);

    
  
    // SIGNUP PROCESS
    // 1. on click signup,                        app.get('/signup', auth.requiresLogout, users.signup);
    //      render views/users/signup.jade
    // 2. on submit from views/users/signup.jade  app.post('/signup', users.create);
    //    send error message if any username or email is already used
    //    create a new user, save
    //    create token
    //    send email
    // 3. on click from email,                    app.get('/verify/user/confirm/:token', verificationtoken.checkNewUserToken);
    //    check if user is not verified
    //    check if token has not expired?
    //    render views/verify/newuser
    // 4. on submit from views/verify/newuser      app.get('/verify/newuser/:token', verificationtoken.verifyNewUser);
    //    update user.verified = true;
    //    send thank you email
    //    redirect to '/login'

    app.post('/signup', users.create);

  
    //Verify token route from email link
    var verificationtoken = require('../app/controllers/verificationtoken');
    //app.get('/verify/:token', verificationtoken.checkNewUserToken);
    app.get('/verify/user/confirm/:token', verificationtoken.checkNewUserToken);

    
    // from view/verify/newuser
    app.get('/verify/newuser/:token', verificationtoken.verifyNewUser);
    
  
    // FORGOT PASSWORD PROCESS
    // 1. on click forgot,                        app.get('/forgot', auth.requiresLogout, users.forgot);
    //      render views/users/forgot.jade
    // 2. on submit from views/users/forgot.jade  app.post('/forgot', users.passwordRequest);
    //    send email is not in database
    //    create token
    //    send email
    // 3. on click from email,                    app.get('/verify/forgotpassword/confirm/:token', verificationtoken.checkToken);
    //    check if token has not been used
    //    check if token has not expired?
    //    render views/verify/newpassword -- see views/users/reset.jade
    // 4. on submit from views/verify/newpassword      app.get('/verify/password/:token', verificationtoken.verifyUser);
    //    save password user.save
    //    update token.used = true;
    //    send thank you email


    
    // 2. from views/user/forgot.jade
    app.post('/forgot', users.passwordForgotRequest);

   
    // 3. Verify token route from email link
    var verificationtoken = require('../app/controllers/forgotpasswordtoken');
    app.get('/verify/forgotpassword/confirm/:token', verificationtoken.checkForgotPasswordToken);

    
    // 4. from view/verify/forgotpassword for the given user
    // is it safe to pass the password without being encrypted
    app.post('/verify/password/:email', verificationtoken.verifyForgotPassword);
 

    //support
    var support = require('../app/controllers/support');
    app.get('/support',              support.general);
    app.get('/support/notmyaccount', support.notmyaccount);
    app.get('/support/compromised',  support.compromised);

    //Home route
    var index = require('../app/controllers/index');
    app.get('/', index.render);
};



