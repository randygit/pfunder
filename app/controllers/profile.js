/**
 * Module dependencies.

var mongoose = require('mongoose'),
    async = require('async'),
    _ = require('underscore'),
    mailer = require('../../config/mailer');
*/

var async = require('async'),
    _ = require('underscore');
    mailer = require('../../config/mailer');


exports.view = function(req, res) {
    console.log('profile');

    res.render('profile/profile', {
        message: req.flash('error'),
        title: 'Profile',
        user: req.user  
    });
};

exports.mobile = function(req, res) {
    console.log('mobile');

    res.render('profile/mobile', {
        message: req.flash('error'),
        title: 'Mobile',
        user: req.user  
    });
};

exports.account = function(req, res) {
    console.log('account');

    res.render('profile/account', {
        message: req.flash('error'),
        title: 'Account',
        user: req.user  
    });
};


