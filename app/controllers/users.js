/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    _ = require('underscore');



exports.login = function(req, res) {
    res.render('users/login', {
        title: 'Login',
        user: req.user ? JSON.stringify(req.user) : "null"
    });
};

exports.signup = function(req, res) {
    res.render('users/signup', {
        title: 'Signup',
        user: req.user ? JSON.stringify(req.user) : "null"
    });
};

exports.forgot = function(req, res) {
    res.render('users/forgot', {
        title: 'Forgot',
        user: req.user ? JSON.stringify(req.user) : "null"
    });
};

exports.reset = function(req, res) {
    res.render('users/reset', {
        title: 'Reset',
        user: req.user ? JSON.stringify(req.user) : "null"
    });
};

/**
 * Logout
 */
exports.signout = function(req, res) {
    //req.logout();
    res.redirect('/');
};



