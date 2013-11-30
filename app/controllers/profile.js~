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


