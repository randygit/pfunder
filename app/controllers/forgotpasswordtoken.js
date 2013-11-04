/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    _ = require('underscore'),
    VerificationTokenModel = mongoose.model('ZerificationToken'),
    UserModel = mongoose.model('Xuser'); 
 

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
                    console.log('export.checkToken.user ' + user.email);
                    console.log('about to render users/reset');
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

     
    
    console.log('Inside verifyForgotPassword req.params.email    :' + req.params.email);
    console.log('Inside verifyForgotPassword req.body.password :' + req.body.password);  

    //
    //console.log('Inside verifyForgotPassword req.body.pass  :' + req.body.password);
    
    //console.log('Changing password for ' + req.body.email);
    //console.log('New password ' + req.body.password);

    
    // find user for given email
    UserModel.findOne({email: req.params.email}, function(err,user) {
        if (err) return done(err);
        if (user) {
            console.log('User name from mongo:' + user.username);
            user.password = req.body.password;
            user.save(function(err){
                if (err) done(err);
                
                console.log('user password updated');
                // send thank you email
                var message = {
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    subject: 'Your Patak password has been changed',
                    supportURL: req.protocol + "://" + req.get('host') + "/support",
                    notMyAccountURL: req.protocol + "://" + req.get('host') + "/support/notmyaccount",
                    compromisedURL: req.protocol + "://" + req.get('host') + "/support/compromised"
                };

                mailer.sendTemplate('passchange', message, function(error, response, html, text) { 
                    if (error) {
                       req.flash('error', 'Unable to send verification email ' + error.message);
                       res.json(response);
                    }
                    else {
                      console.log("Verification email sent for delivery");
                      //console.log('Reponse ' + response);
                      //console.log('HTML ' + html);
                      //console.log('TEXT ' + text);
                      //return res.redirect('/login');
              
                      // use this to return to controller
                      res.json(response);
                    }
                });
            }); 

        
        } // end if (user)
    
    }); // end UserModel.findOne
    
};

    

