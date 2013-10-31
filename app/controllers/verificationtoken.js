/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    _ = require('underscore'),
    VerificationTokenModel = mongoose.model('ZerificationToken'),
    UserModel = mongoose.model('Xuser'); 
 

function verifyUser(token,done) {
    VerificationTokenModel.findOne({token:token}, function(err,doc){
        if (err) return done(err);
        // find user and update verified flag = true;
        UserModel.findOne({_id: doc._userId}, function(err, user) {
            if (err) return done(err);

            // update verified flag to allow user to login
            console.log('verifyUser ' + user.email);
            user.verified = true;
            user.save(function(err){
                done(err);
            });
        });
    });
};

exports.checkToken = function(req, res, next) {
    // render a page
    // on submit call verifyUser..

    var token = req.params.token;
    console.log('checkToken ' + token);

    verifyUser(token, function(err) {
        if (err) return res.redirect("verification failure");
        res.redirect('/login');
    });
};
    

