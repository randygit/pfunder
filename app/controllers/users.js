/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    _ = require('underscore'),
    VerificationTokenModel = mongoose.model('ZerificationToken'),
    User = mongoose.model('Xuser'); 

/**
 * Auth callback. what is this here
 */
exports.authCallback = function(req, res, next) {
    res.redirect('/');
};

exports.login = function(req, res) {
    res.render('users/login', {
        // 'error' is used by failureFlash
        message: req.flash('error'),
        title: 'Login',
        user: req.user  
    });
};

exports.signup = function(req, res) {
    res.render('users/signup', {
        // initially used info but did not work, used 'error' instead
        // 'info' is set by exports.create
        message: req.flash('error'),
        title: 'Signup',
        user: req.user  
    });
};

exports.forgot = function(req, res) {
    res.render('users/forgot', {
        title: 'Forgot',
        user: req.user  
    });
};

exports.reset = function(req, res) {
    res.render('users/reset', {
        title: 'Reset',
        user: req.user  
    });
};

exports.welcome = function(req, res) {
    res.render('welcome', {
        title: 'Welcome',
        //user: req.user ? JSON.stringify(req.user) : "null"
        user: req.user
    });
};

exports.create = function(req, res) {

    User.findOne({'email' : req.body.email}, function(err,user ) {
      
      if(user) { 
        console.log("Email " + user.email + " exists in the database. isEmailTaken" );
        var message = 'Email ' + user.email + ' is already used.';
        req.flash('error', 'Email is already used');
        // redirect to new http
        return res.redirect('/signup');
      }
      else {
        User.findOne({'username': req.body.username}, function(err,user) {
          if (user) {
            console.log('Username '+ user.username + ' is taken');
            // var message = 'Username '+ user.username + ' is already taken';
            req.flash('error', 'Username is already taken');
            return res.redirect('/signup');
          }
          else {

            // create new user

            var newUser = new User(req.body);
            newUser.provider = 'local';
            newUser.createdAt = Date.now();
            newUser.save(function(err) {
              if(err) {
                  console.log('error in user.create ' + err);
                  // render an html
                  return res.render('users/signup', {
                    errors: err.errors,
                    user: user
                  });
              }
              else {
                console.log("no problem in user.create ");   
                // return res.redirect('/welcome');
                /* should be used **/

                //create token here and email
              
                var verificationToken = new VerificationTokenModel(
                    {_userId: newUser._id, purpose: 'new account'});

                verificationToken.createVerificationToken(function(err, token) {
                    if (err) return console.log("Couldn't create verification token", err);
                    /*
                    var message = {
                        email: newUser.email,
                        name: newUser.username;
                        verifyURL: req.protocol + "://" + req.get('host') + "/verify" + token
                    };
                    sendVerificationEmail(message, function(error, success) {
                        if (error) {
                            console.error("Unable to send verification email " + error.message);
                            return;
                        }
                        console.log("Verification email sent for delivery");
                    });
                    */

                });
                

                req.flash('error', 'Account has been created but needs to be verified. Please check your email for instructions');
                return res.redirect('/signup');

                // passport.authenticate automatically calls
                // new users should automatically be logged in

                /*
                // new user will not be allowed to login. must see email
                req.login(newUser, function(err) {
                    if (err) return next(err);
                    return res.redirect('/welcome');
                });
                */ 
              }
            });
          }      
        });
      }
    });
   
};

/*** Session ***/

exports.session = function(req, res) {
    // check if user is validated, account is disabled or account is deactivated
    // if yes, redirect back to /login
    var email = req.body.email;
    console.log('user.sessions. req.body.email is ' + email);
    console.log('user.sesionss. req.user.email is ' + req.user.email);

    var user = req.user;

    if (!user.verified) {
        req.flash('error', 'User is not verified. Please check email for instructions.');
        return res.redirect('/login');
    }
    if (user.disabled) {
        req.flash('error', 'User is disabled. Please check email for instructions.');
        return res.redirect('/login');
    }
    if (user.deactivated) {
        req.flash('error', 'User has deactivated this account.');
        return res.redirect('/login');
    }
    // OK if: {verified: true, disabled: false, deactivated: false}
    res.redirect('/welcome');

    /*
    // this should not be done since passport.local will return user if email/password is ok. how?
    User.findOne({ email: email }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            console.log('after findOne ' + user.email);
            console.log('Verified: ' + user.verified + ' Disabled: ' + user.disabled + ' Deactivated: '+ user.deactivated);

            if (!user.verified) {
                req.flash('error', 'User is not verified. Please check email for instructions.');
                return res.redirect('/login');
            }
            if (user.disabled) {
                req.flash('error', 'User is disabled. Please check email for instructions.');
                return res.redirect('/login');
            }
            if (user.deactivated) {
                req.flash('error', 'User has deactivated this account.');
                return res.redirect('/login');
            }
            // OK if: {verified: true, disabled: false, deactivated: false}
            res.redirect('/welcome');
        
        }   // if user
        
    });
    */
          
};

/** Logout  */
exports.signout = function(req, res) {
    console.log('Logging out');
    req.logout();
    res.redirect('/');
};

 

