/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    _ = require('underscore'),
    mailer = require('../../config/mailer'),
    VerificationTokenModel = mongoose.model('WverificationToken'),
    User = mongoose.model('Yuser'); 

/**
 * Auth callback. what is this here
 */
exports.authCallback = function(req, res, next) {
    res.redirect('/');
};



exports.reset = function(req, res) {
    res.render('users/reset', {
        message: req.flash('error'),
        title: 'Reset',
        user: req.user  
    });
};

// FORGOT PASSWORD PROCESS

exports.forgot = function(req, res) {
    res.render('users/forgot', {
        // initially used info but did not work, used 'error' instead
        // 'info' is set by exports.create
        message: req.flash('error'),
        title: 'Forgot password',
        user: req.user  
    });
};


exports.passwordForgotRequest = function(req,res) {
    
    // check if email entered is in database
    User.findOne({'email': req.body.email}, function(err, user) {
        if(!user) {

           
            var message = 'Email ' + req.body.email + ' does not belong to any Patak account.';
            console.log(message);
            req.flash('error', 'Email is not used');
            return res.redirect('/forgot');
            
        } else {
            var verificationToken = new VerificationTokenModel(
                    {_userId:user._id, purpose: 'forgot password'});

                verificationToken.createVerificationToken(function(err,token) {
                    if (err) {
                        req.flash('error', 'Error in creating verification token');
                        return res.redirect('/users/forgot');
                    }
                    if (token) {
                        console.log('Verification token created');
                        var message = {
                            name: user.name,
                            email: user.email,
                            username: user.username,
                            subject: 'Reset your Patak password',
                            verifyURL: req.protocol + "://" + req.get('host') + "/verify/forgotpassword/confirm/" + token,
                            supportURL: req.protocol + "://" + req.get('host') + "/support/", 
                            notMyAccountURL: req.protocol + "://" + req.get('host') + "/support/notmyaccount" 
                        };

                        mailer.sendTemplate('forgotpassword', message, function(error, response, html, text) { 
                            if (error) {
                               req.flash('error', 'Unable to send verification email ' + error.message);
                               return res.redirect('/signup');
                            }
                            else {
                              console.log("Verification email sent for delivery");
                              //console.log('Reponse ' + response);
                              //console.log('HTML ' + html);
                              //console.log('TEXT ' + text);
                            }
                        });

                    }
              });

                

              //user will not be allowed to check in until verification process is completed
              //
              req.flash('error', 'Please check your email for instructions on how to change your password.');
              return res.redirect('forgot');

        } // end else
        
    
    });

};


// SIGNUP PROCESS exports.signup and exports.create  

exports.signup = function(req, res) {
    res.render('users/signup', {
        // initially used info but did not work, used 'error' instead
        // 'info' is set by exports.create
        message: req.flash('error'),
        title: 'Signup',
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
                  return res.render('/signup', {
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

                verificationToken.createVerificationToken(function(err,token) {
                    if (err) {
                        req.flash('error', 'Error in creating verification token');
                        return res.redirect('/signup');
                    }
                    if (token) {
                        console.log('Verification token created');
                        var message = {
                            name: newUser.name,
                            email: newUser.email,
                            username: newUser.username,
                            subject: 'Confirm your account on Patak',
                            verifyURL: req.protocol + "://" + req.get('host') + "/verify/user/confirm/" + token,
                            supportURL: req.protocol + "://" + req.get('host') + "/support"
                        };

                        mailer.sendTemplate('newuser', message, function(error, response, html, text) { 
                            if (error) {
                               req.flash('error', 'Unable to send verification email ' + error.message);
                               return res.redirect('/signup');
                            }
                            else {
                              console.log("Verification email sent for delivery");
                              //console.log('Reponse ' + response);
                              //console.log('HTML ' + html);
                              //console.log('TEXT ' + text);
                            }
                        });

                        
                    }
                });

                

                //user will not be allowed to check in until verification process is completed
                //
                req.flash('error', 'Your account has been created but needs to be verified. Please check your email for instructions.');
                return res.redirect('/signup');

              }
            });
          }      
        });
      }
    });
   
};

// LOGIN PROCESS: exports.login, exports.session and exports.welcome

exports.login = function(req, res) {
    res.render('users/login', {
        // 'error' is used by failureFlash
        message: req.flash('error'),
        title: 'Login',
        user: req.user  
    });
};

exports.session = function(req, res) {

    // user has successfully logged in by passport.local
    // must reverse if conditions below are true
    // check if user is validated, account is disabled or account is deactivated
    // if yes, redirect back to /login

    var email = req.body.email;
    console.log('user.sessions. req.body.email is ' + email);
    console.log('user.sessions. req.user.email is ' + req.user.email);
    console.log('user.sessions. req.isAuthenticated ' + req.isAuthenticated());


    var user = req.user;

    if (!user.verified) {
        req.flash('error', 'User is not verified. Please check email for instructions.');
        // is this a security hole?         
        if (req.isAuthenticated()) req.logout();
        
        return res.redirect('/login');
    }
    if (user.disabled) {
        req.flash('error', 'User is disabled. Please check email for instructions.'); 
        if (req.isAuthenticated()) req.logout();
        return res.redirect('/login');
    }
    if (user.deactivated) {
        req.flash('error', 'User has deactivated this account.'); 
        if (req.isAuthenticated()) req.logout();
        return res.redirect('/login');
    }
    // OK if: {verified: true, disabled: false, deactivated: false}
    //res.redirect('/welcome');
    res.redirect('/');    
};

exports.welcome = function(req, res) {
    res.render('welcome', {
        title: 'Welcome',
        user: req.user
    });
};



/** Logout  */
exports.signout = function(req, res) {
    console.log('Logging out');
    req.logout();
    res.redirect('/');
};

