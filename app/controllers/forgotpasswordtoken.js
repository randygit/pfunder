/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    _ = require('underscore'),
    VerificationTokenModel = mongoose.model('WverificationToken'),
    UserModel = mongoose.model('Yuser'); 
 

// app.get('/verify/forgotpassword/confirm/:token', verificationtoken.checkForgotPasswordToken);  
exports.checkForgotPasswordToken = function(req, res) {

    console.log('Inside checkForgotPasswordToken:' + req.params.token);
    

    var token = req.params.token;

    VerificationTokenModel.findOne({token:token}, function(err,doc){
        if (err) return done(err);
        
        //  token.used should updated below after the data entry of the new password

        
        if (doc) {

            if (doc.used) {
                console.log('Token has already been used');
                req.flash('error','This link is already used. Forgot your password again? Click on the link below.');
                res.redirect('/login');
            }

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
                        token: token
                    });
                }
            });

        }  
        else {
            console.log('Could not find doc for token '+ token);

            // critical error, used be redirected to '/help/tokennotfound'

            res.redirect('/');
        }
    });
 
 
};

// app.post('/verify/password', verificationtoken.verifyForgotPassword); 
exports.verifyForgotPassword = function(req,res) {

    // if part of the URL, use req.params.email    
    console.log('Inside verifyForgotPassword req.params.email    :' + req.params.email);
    console.log('Inside verifyForgotPassword req.params.token    :' + req.params.token);

    // if a parameter, use req.body.password
    console.log('Inside verifyForgotPassword req.body.password :' + req.body.password);  

    // find user for given email
    UserModel.findOne({email: req.params.email}, function(err,user) {
        if (err) return done(err);
        if (user) {
            console.log('User name from mongo:' + user.username);
            user.password = req.body.password;
            user.save(function(err){
                if (err) done(err);
                
                // update forgot.token.used = true;
                    VerificationTokenModel.findOne({token:req.params.token}, function(err,doc){
                        if (err) return done(err);
                        if (doc) {
                            doc.used = true;
                            doc.save(function(err) {
                                if (err) return done(err);
                            });
                        }
                
                    });

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
                  
                          // use this to return to controller
                          res.json(response);
                        }
                    });
            }); // user.save

        
        } // end if (user)
    
    }); // end UserModel.findOne
    
};

    

