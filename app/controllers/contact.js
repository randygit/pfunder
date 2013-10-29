/**
 * Module dependencies.

var mongoose = require('mongoose'),
    async = require('async'),
    _ = require('underscore');
*/

var nodemailer = require('nodemailer'),
    async = require('async'),
    _ = require('underscore');


exports.render = function(req, res) {
    console.log('contact.render');

    res.render('contact/contact', {
        message: req.flash('error'),
        title: 'Contact',
        user: req.user  
    });
};

exports.sendemail = function(req,res) {
    

    var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'Gmail',
        auth: {
          user: "mintlifesavers@gmail.com",
          pass: "19mint12"
        }
    });

    var mailOptions = {
      from: req.body.username,
      to: 'randy.gonzales@gmail.com',
      subject: 'message from ' + req.body.username + ' <' + req.body.email + '>' ,
      text: req.body.msg
    };

    console.log("about to sendemail " + req.body.username);
    smtpTransport.sendMail(mailOptions, function(error, response) {
    
      if(!error) {
        console.log("Email sent " + response.message);
        req.flash('error', 'Email sent');              
        res.json(req.body);
      }
      
    });
    console.log("end of exports.sendemail " + req.body.email);
    // res.json(req.body);
};


