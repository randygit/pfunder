/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    _ = require('underscore'),
    VerificationTokenModel = mongoose.model('ZerificationToken'),
    UserModel = mongoose.model('Xuser'); 
 

exports.checkNewUserToken = function(req, res) {

    var token = req.params.token;

    VerificationTokenModel.findOne({token:token}, function(err,doc){
        if (err) return done(err);
        
        // check if token has expired
        // if (doc.createdAt)

        // this account has already been verified or the link has expired.
        // what happens when the link has expired and user has not verified?
        // should he create a new account using the same email address?
        // will have to check verified flag

        UserModel.findOne({_id: doc._userId}, function(err, user) {
            if (err) return done(err);
            if (user.verified) {
                return res.redirect('/');
            
            }
            else {
                console.log('export.checkToken ' + req.params.token);
                res.render('verify/newuser', {
                    title: 'Confirm new user',
                    //user: req.user ? JSON.stringify(req.user) : "null"
                    confirmNewUserURL: '/verify/newuser/' + token
                });
            }
        });
    });
 
 
};

exports.verifyNewUser = function(req,res) {
    // token is passed by verify/newuser on submit to router '/verify/newuser'

    var token = req.params.token;

    console.log('exports.verifyUser. token = ' + token);

    VerificationTokenModel.findOne({token:token}, function(err,doc){
        if (err) return done(err);
        // find user and update verified flag = true;
        UserModel.findOne({_id: doc._userId}, function(err, user) {
            if (err) return done(err);

            // check if token has expired or at exports.checkToken above
            // if yes, skip the 

            // update verified flag to allow user to login
            console.log('verifyUser ' + user.email);
            user.verified = true;
            user.save(function(err){

                // send thank you email
                var message = {
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    subject: 'Welcome to Patak'
                };

                mailer.sendTemplate('tynewuser', message, function(error, response, html, text) { 
                    if (error) {
                       req.flash('error', 'Unable to send verification email ' + error.message);
                       return res.redirect('/signup');
                    }
                    else {
                      console.log("Verification email sent for delivery");
                      console.log('Reponse ' + response);
                      console.log('HTML ' + html);
                      console.log('TEXT ' + text);
                    }
                });
                if (err) done(err);
                else return res.redirect('/login');
            });
        });
    });
};

// app.get('/verify/forgotpassword/confirm/:token', verificationtoken.checkForgotPasswordToken);  
exports.checkForgotPasswordToken = function(req, res) {

    console.log('Inside checkForgotPasswordToken:' + req.params.token);
    

    var token = req.params.token;

    VerificationTokenModel.findOne({token:token}, function(err,doc){
        if (err) return done(err);
        
        // check if token has expired
        // if (doc.createdAt)

        // this account has already been verified or the link has expired.
        // what happens when the link has expired and user has not verified?
        // should he create a new account using the same email address?
        // will have to check verified flag

        if (doc) {
            console.log('About to find UserModel.findOne ' + doc._userId);

            UserModel.findOne({_id: doc._userId}, function(err, user) {
        
                if (err) return done(err);
                // ask for a new password for user.username
                if (user) {
                    console.log('export.checkToken.user ' + user.username);
                    res.render('users/reset', {
                        title: 'Change password',
                        user: user,
                        confirmNewUserURL: '/verify/password/' + token 
                    });
                }
            });
        
        } // if doc
        else {
            console.log('Could not find doc for token '+ token);
            res.redirect('/');
        }
    });
 
 
};

// app.post('/verify/password', verificationtoken.verifyForgotPassword); 
exports.verifyForgotPassword = function(req,res) {
    // token is passed by verify/newuser on submit to router '/verify/newuser'
    // since user is already established

     
    console.log('Inside verifyForgotPassword req.body.password :' + req.body.password);  
    // console.log('Inside verifyForgotPassword req.body.email    :' + req.body.email);

    //
    //console.log('Inside verifyForgotPassword req.body.pass  :' + req.body.password);
    
    //console.log('Changing password for ' + req.body.email);
    //console.log('New password ' + req.body.password);

    /*
    // find user for given email
    UserModel.findOne({email: req.body.email}, function(err,user) {
        if (err) return done(err);
        if (user) {
            console.log('User name from mongo:' + user.username);
            user.password = req.body.password;
            user.save(function(err){
                if (err) done(err);
                
                // send thank you email
                var message = {
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    subject: 'Your Patak password has been changed'
                };

                mailer.sendTemplate('passwordchangereminder', message, function(error, response, html, text) { 
                    if (error) {
                       req.flash('error', 'Unable to send verification email ' + error.message);
                       return res.redirect('/reset');
                    }
                    else {
                      console.log("Verification email sent for delivery");
                      console.log('Reponse ' + response);
                      console.log('HTML ' + html);
                      console.log('TEXT ' + text);
                    }
                });
                return res.redirect('/login');
            }); 

        
        } // end if (user)
    
    }); // end UserModel.findOne
    */
  
    return res.redirect('/');
};

    

