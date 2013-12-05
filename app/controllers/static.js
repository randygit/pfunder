/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    _ = require('underscore'),
    States = mongoose.model('State4'),
    Colors = mongoose.model('Color4');

/**
 * Auth callback. what is this here
 */
exports.authCallback = function(req, res, next) {
    res.redirect('/');
};



exports.getStates = function(req,res) {

    // if part of the URL, use req.params.email    
    console.log('Inside getStates');  

    States.find({},{_id:0,states:1},function(err, objs){
        if(err) 
            done(err);
        else {
            // console.log("JSON.stringify.States: <" + JSON.stringify(objs[0].states ) +">"); 
            res.json(objs[0].states);
        }
    });
};

exports.getColors = function(req,res) {

    // if part of the URL, use req.params.email    
    console.log('Inside getStates'); 
 

    Colors.find({},{_id:0,colors:1 },function(err, objs){
        if(err) 
            done(err);
        else {  
            console.log("JSON.stringify.Colors: <" + JSON.stringify(objs[0].colors) +">"); 
            res.json(objs[0].colors);
        
        }
    });
};


