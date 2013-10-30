// called by app/controller/contacts.js
// called by app/controller/verificationtoken

'use strict';

var config = require('./config');
var nodemailer = require('nodemailer');
var path = require('path');
var templatesDir = path.resolve(__dirname, '..', 'views/mailer');
var emailTemplates = require('email-templates');

var EmailAddressRequiredError = new Error('email address required');

//create a default transport using what is defined ./config/all.js
var defaultTransport = nodemailer.createTransport('SMTP', {
    service: 'Gmail',
    auth: {
        user: config.mailer.auth.user,
        pass: config.mailer.auth.pass
    }
});

exports.sendSimple = function(mailOptions, fn) {
    console.log("sendSimple");
    console.log("From: " + mailOptions.from);
    console.log("To: " + mailOptions.to);
    console.log("Subject: " + mailOptions.subject);
    console.log("Text: " + mailOptions.text);

    // make sure that we have an user email
    if (!mailOptions.to) {
        return fn(EmailAddressRequiredError);
    }

    if(!mailOptions.subject) {
        return fn(EmailAddressRequiredError);
    }

    var transport = defaultTransport;
    transport.sendMail(mailOptions, function(error, response){
        if (error) {
            console.log(response.message);
            console.log(response.messageId);
            return fn(error);
        
        } else {
            console.log('Email sent' + response.message);
            return fn(null, response.message);
        }
    });
};

exports.sendTemplate = function(templateName, locals, fn) {

    console.log("sendone, locals");
    console.log("Email: " + locals.email);
    console.log("Subject: " + locals.subject);

    // make sure that we have an user email
    if (!locals.email) {
        return fn(EmailAddressRequiredError);
    }

    if(!locals.subject) {
        return fn(EmailAddressRequiredError);
    }
     
    
    emailTemplates(templatesDir, function(err, template) {
        if(err) {
            console.log('Error in emailTemplates');
            console.log(err)
            return fn(err);
        }
        // send a single email
    
        template(templateName, locals, function(err, html, text) {
            if (err) {
                console.log('Error in template');
                console.log(err);
                return fn(err);
            }

            var transport = defaultTransport;

            transport.sendMail({
                from: config.mailer.defaultFormAddress,
                to: locals.email,
                subject: locals.subject,
                html: html,
                // generateTextFromHTML: true,
                text: text
            }, function(err, responseStatus) {
                if (err) {
                    console.log(responseStatus.message);
                    console.log(responseStatus.messageId);
                    return fn(err);
                }
                return fn(null, responseStatus.message, html, text);
            });
        });
    });

}


