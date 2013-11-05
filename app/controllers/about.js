/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    _ = require('underscore');


exports.render = function(req, res) {
    console.log("Inside about.render");
    res.render('about/about', {
        user: req.user  
    });
};
