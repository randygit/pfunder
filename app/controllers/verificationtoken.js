/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    _ = require('underscore'),
    VerificationToken = mongoose.model('VerificationToken'); 

exports.verifyUser = function(token,done) {
    verificationTokenModel.findOne({token:token}, function(err,doc){
        if (err) return done(err);
        // find user and update verified flag = true;
        User.findOne({_id: doc._userId}, function(err, user) {
            if (err) return done(err);
            user.verified = true;
            user.save(function(err){
                done(err);
            });
        });
    });
};

exports.checkToken = function(req, res, next) {
    var token = req.params.token;
    verifyUser(token, function(err) {
        if (err) return res.redirect("verification failure");
        res.redirect("verification success");
    });
};
    

