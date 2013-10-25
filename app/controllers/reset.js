/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    _ = require('underscore');


exports.render = function(req, res) {
    res.render('users/reset', {
        user: req.user ? JSON.stringify(req.user) : "null"
    });
};
