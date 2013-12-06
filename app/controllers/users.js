/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    _ = require('underscore'),
    mailer = require('../../config/mailer'),
    VerificationTokenModel = mongoose.model('VerificationToken8'),

    User = mongoose.model('User9'); 

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
    User.find({ 'email': req.body.email, verified: true },{name:1, email:1, username:1}, function(err,user) {
    // User.findOne({'email': req.body.email}, function(err, user) {
        console.log('exports.passwordForgotRequest');
        console.log('user        ' + JSON.stringify(user));
        console.log('typeof user ' + typeof user);
        console.log('user length ' + user.length);

      
        if(user.length === 0) {

            
            req.flash('error', 'Email is not used');
            return res.redirect('/forgot');
            
        } 

        if(user.length == 1){

            var verificationToken = new VerificationTokenModel(
                    {_userId:user[0]._id, purpose: 'forgot password'});

                verificationToken.createVerificationToken(function(err,token) {
                    if (err) {
                        req.flash('error', 'Error in creating verification token');
                        return res.redirect('/users/forgot');
                    }
                    if (token) {
                        console.log('Verification token created');
                        var message = {
                            name: user[0].name,
                            email: user[0].email,
                            username: user[0].username,
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

// after input at /app/views/signup.jade
// verify that
// 1. no records of the email that has been verified
// 2. no records of the username that has been verified

// if OK
// 1. create user record
// 2. create token
// 3. send email


exports.create = function(req, res) {

    // find a verified user with this email
    console.log("app.create email    " + req.body.email );
    console.log("app.create username " + req.body.username );

    // user.find returns an array
    User.find({ 'email': req.body.email, verified: true },{email:1, verified:1}, function(err,user) {
      if(err) done(err);

      console.log('user        ' + JSON.stringify(user));
      console.log('typeof user ' + typeof user);
      console.log('user length ' + user.length);

      if(user.length > 0) { 

        console.log("Email " + req.body.email + " exists in the database. isEmailTaken" );
        req.flash('error', 'The email ' + req.body.email + ' is already used.');
        return res.redirect('/signup');
      }

      
      if (user.length === 0) {

        // find a verified user with this usernam
        User.find({ 'username': req.body.username, verified: true },{username:1, verified:1}, function(err,user) {
           
          console.log('Username checking');
          console.log('user        ' + JSON.stringify(user));
          console.log('typeof user ' + typeof user);
          console.log('user length ' + user.length);

          if (user.length > 0) {
              console.log('The username '+ req.body.username + ' is taken');
            
              req.flash('error', 'The username '+ req.body.username + ' is already used.');
              return res.redirect('/signup');
          }

          
          if(user.length === 0) {

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

// /app/view/profile/profile.jade as called by main menu
// called by controller. you have to return else it will wait forever
// /public/js/controllers/profileFormController
//  $scope.updateProfile
// app.post('/user/profile', users.updateProfile); 

exports.getProfile = function(req,res) {

    // if part of the URL, use req.params.email    
    console.log('Inside updateProfile req.params.email    :' + req.params.email); 
 
    var profile = {};

    // find user for given email
    
    // User.findOne({email: req.params.email}, function(err,user) {
    User.find({ 'email': req.params.email, verified: true }, function(err,user) {
        if (err) return done(err);

        if (user.length == 1) {

            validUser = user[0];

            console.log('User name from mongo:' + validUser.username);
            var profile = {
                name: validUser.name,
                birthdate: validUser.birthdate,
                location: validUser.location,
                website: validUser.website,
                bio: validUser.bio
            };

            res.json(profile);
        
        } // end if (user)
    
    }); // end User.findOne
    
};

exports.updateProfile = function(req,res) {

    // if part of the URL, use req.params.email    
    console.log('Inside updateProfile req.params.email    :' + req.params.email); 

    // if a parameter, use req.body.name/location/website
    console.log('Inside verifyForgotPassword req.body.password :' + req.body.name);  

    // find user for given email
    
    // User.findOne({email: req.params.email}, function(err,user) {
    User.find({ 'email': req.params.email, verified: true }, function(err,user) {
        if (err) return done(err);

        if (user.length == 1) {

            validUser = user[0];

            console.log('User name from mongo:' + validUser.username);
            validUser.name      = req.body.name;
            validUser.birthdate = req.body.birthdate;
            validUser.location  = req.body.location;
            validUser.website   = req.body.website;
            validUser.bio       = req.body.bio;

            validUser.save(function(err){
                if (err) done(err);
                else { 
                    // use this to return to controller
                    res.json(200);
                }
            }); // user.save
            
        
        } // end if (user)
    
    }); // end User.findOne
    
};

exports.getAccount = function(req,res) {

    // if part of the URL, use req.params.email    
    console.log('Inside getAccount req.params.email    :' + req.params.email); 
 
    var profile = {};

    // find user for given email
    
   
    User.find({ 'email': req.params.email, verified: true }, function(err,user) {
        if (err) return done(err);

        if (user.length == 1) {

            validUser = user[0];

            console.log('User name from mongo:' + validUser.username + " " + validUser.language + " " + validUser.timezone);
            var account = {
                username: validUser.username,
                language: validUser.language,
                timezone: validUser.timezone
            };

            res.json(account);
        
        } // end if (user)
    
    }); // end User.findOne
    
};

exports.updateAccount = function(req,res) {

    // if part of the URL, use req.params.email    
    console.log('Inside updateProfile req.params.email    :' + req.params.email); 

    // if a parameter, use req.body.name/location/website
    console.log('Inside updateAccount req.body.password :' + req.body.username + " " + req.body.language + " " + req.body.timezone);  

    // find user for given email
    
    // User.findOne({email: req.params.email}, function(err,user) {
    User.find({ 'email': req.params.email, verified: true }, function(err,user) {
        if (err) return done(err);

        if (user.length == 1) {

            validUser = user[0];

            console.log('User name from mongo:' + validUser.username);
            validUser.username = req.body.username;
            validUser.language = req.body.language;
            validUser.timezone = req.body.timezone;
            validUser.save(function(err){
                if (err) done(err);
                else { 
                    // use this to return to controller
                    res.json(200);
                }
            }); // user.save
            
        
        } // end if (user)
    
    }); // end User.findOne
    
};

exports.getMobile = function(req,res) {

    // if part of the URL, use req.params.email    
    console.log('Inside updateProfile req.params.email    :' + req.params.email); 
 
    var profile = {};

    // find user for given email
    
   
    User.find({ 'email': req.params.email, verified: true }, function(err,user) {
        if (err) return done(err);

        if (user.length == 1) {

            validUser = user[0];

            console.log('User name from mongo:' + validUser.username);
            var mobile = {
                country: validUser.mobile_country,
                number:  validUser.mobile_number,
                carrier: validUser.mobile_carrier
            };

            res.json(mobile);
        
        } // end if (user)
    
    }); // end User.findOne
    
};


exports.updateMobile = function(req,res) {

    // if part of the URL, use req.params.email    
    console.log('Inside updateMobile req.params.email    :' + req.params.email); 

    // if a parameter, use req.body.name/location/website
    console.log('Inside updateMobile req.body.password :' + req.body.country + ' ' + req.body.number + ' ' + req.body.carrier);  

    // find user for given email
    
    // User.findOne({email: req.params.email}, function(err,user) {
    User.find({ 'email': req.params.email, verified: true }, function(err,user) {
        if (err) return done(err);

        if (user.length == 1) {

            validUser = user[0];

            console.log('User name from mongo:' + validUser.username);
            validUser.mobile_country  = req.body.country;
            validUser.mobile_number   = req.body.number;
            validUser.mobile_carrier  = req.body.carrier;
            validUser.save(function(err){
                if (err) done(err);
                else { 
                    // use this to return to controller
                    res.json(200);
                }
            }); // user.save
            
        
        } // end if (user)
    
    }); // end User.findOne
    
};

exports.getPassword = function(req,res) {

    // if part of the URL, use req.params.email    
    console.log('Inside updateProfile req.params.email    :' + req.params.email); 
 
    var profile = {};

    // find user for given email
    
   
    User.find({ 'email': req.params.email, verified: true }, function(err,user) {
        if (err) return done(err);

        if (user.length == 1) {

            validUser = user[0];

            console.log('User name from mongo:' + validUser.username);
            var password = validUser.password;

            res.json(password);
        
        } // end if (user)
    
    }); // end User.findOne
    
};

exports.updatePassword = function(req,res) {

    // if part of the URL, use req.params.email    
    console.log('Inside updatePassword req.params.email    :' + req.params.email); 

    // if a parameter, use req.body.name/location/website
    console.log('Inside updatePassword req.body.password :' + req.body.newpassword);  

    // find user for given email
    
    // User.findOne({email: req.params.email}, function(err,user) {
    User.find({ 'email': req.params.email, verified: true }, function(err,user) {
        if (err) return done(err);

        if (user.length == 1) {

            validUser = user[0];

            console.log('User name from mongo:' + validUser.username);
            validUser.password  = req.body.newpassword;
            validUser.save(function(err){
                if (err) done(err);
                else { 
                    // use this to return to controller
                    res.json(200);
                }
            }); // user.save
            
        
        } // end if (user)
    
    }); // end User.findOne
    
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
    res.redirect('/');
};


exports.validateUsername = function(req,res) {  
    // if part of the URL, use req.params.email    
    console.log('Inside validateUserName req.params.email: ' + req.params.email); 
    console.log("verify username " + req.body.username );

    var username = req.body.username;
    var email = req.params.email;

    User.find({ 'username': username, verified: true },{username:1, email:1, verified:1}, function(err,user) {
        if (user.length == 1) {
            console.log("User[0] " + user[0].username + " email " + user[0].email);
            if (user[0].email == email) {
                console.log("User name no change " + user[0].username);
                res.send(200);
            
            }
            else {
                console.log("User name is already used " + user[0].username);
                res.send(401);
                
            }
        }
        else {
            console.log("Username is available ");
            res.send(200);
        }

    });
};


exports.resetpassword = function(req, res) {
    res.render('profile/resetpassword', {
        message: req.flash('error'),
        title: 'Reset',
        user: req.user  
    });
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



