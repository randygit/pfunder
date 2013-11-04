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
                    subject: 'Welcome to Patak',
                    supportURL: req.protocol + "://" + req.get('host') + "/support"

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


