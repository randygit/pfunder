/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    _ = require('underscore'),
    States = mongoose.model('State8'),
    Colors = mongoose.model('Color8'),
    Countries = mongoose.model('Nation6'),
    Languages = mongoose.model('Language6'),
    Timezones = mongoose.model('Timezone6');

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
            // console.log("JSON.stringify.Colors: <" + JSON.stringify(objs[0].colors) +">"); 
            res.json(objs[0].colors);
        
        }
    });
};

exports.getCountries = function(req,res) {

    // if part of the URL, use req.params.email    
    console.log('Inside getCountries');  

    Countries.find({},{_id:0,countries:1},function(err, objs){
        if(err) 
            done(err);
        else {
            //console.log("JSON.stringify.Countries: <" + JSON.stringify(objs[0].countries ) +">"); 
            res.json(objs[0].countries);
        }
    });
};

exports.getLanguages = function(req,res) {

    // if part of the URL, use req.params.email    
    console.log('Inside getLanguages');  

    Languages.find({},{_id:0,languages:1},function(err, objs){
        if(err) 
            done(err);
        else {
            //console.log("JSON.stringify.Languages: <" + JSON.stringify(objs[0].languages ) +">"); 
            res.json(objs[0].languages);
        }
    });
};

exports.getTimezones = function(req,res) {

    // if part of the URL, use req.params.email    
    console.log('Inside getTimezones');  

    Timezones.find({},{_id:0,timezones:1},function(err, objs){
        if(err) 
            done(err);
        else {
            //console.log("JSON.stringify.Timezones: <" + JSON.stringify(objs[0].timezones ) +">"); 
            res.json(objs[0].timezones);
        }
    });
};


