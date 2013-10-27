/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    _ = require('underscore'),
    User = mongoose.model('Xuser'); 



var pass = require('pwd');

exports.login = function(req, res) {
    res.render('users/login', {
        title: 'Login',
        user: req.user ? JSON.stringify(req.user) : "null"
    });
};

exports.signup = function(req, res) {
    res.render('users/signup', {
        messages: req.flash('info'),
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

exports.welcome = function(req, res) {
    res.render('welcome', {
        title: 'Welcome',
        user: req.user ? JSON.stringify(req.user) : "null"
    });
};

exports.validateUsername = function(req, res) {
    var username = req.body.username;
    // check if username contains non-url-safe characters
    if (username !== encodeURIComponent(username)) {
        res.json(403, {
            invalidChars: true
        });
        return;
    }
    // check if username is already taken - query your db here
    var usernameTaken = false;
    for (var i = 0; i < dummyDb.length; i++) {
        if (dummyDb[i].username === username) {
            usernameTaken = true;
            break;
        }
    }
    if (usernameTaken) {
        res.json(403, {
            isTaken: true
        });
        return;
    }
    // looks like everything is fine
    res.send(200);
};

exports.validateEmail = function(req,res) {
    var email = req.body.email;
    var isEmailTaken = false;
    // var isTaken = false;

    // check if username is already taken - query your db here
  
    
    User.findOne({'email' : email}, function(err,user ) {
      
      if(user !== null) {
        isEmailTaken = true;
        console.log("Email " + user.email + " exists in the database. isEmailTaken = " + isEmailTaken);
        res.json(403,{isTaken:true});
        return;
      }
      console.log('Inside findOne after user !== null');
      
    });

    
    console.log("After findOne. Returning isEmailTaken " + isEmailTaken);
     

    if (isEmailTaken) {
        
        res.json(403, {
          isTaken: true
      });
      return;
    }

    console.log("Before 200. Returning isTaken " + isEmailTaken);
    // looks like everything is fine
    res.send(200);
};
 


exports.create = function(req, res) {

    User.findOne({'email' : req.body.email}, function(err,user ) {
      
      if(user) { 
        console.log("Email " + user.email + " exists in the database. isEmailTaken" );
        var message = 'Email ' + user.email + ' is already used.';
        req.flash('info', 'Email is already used');
        // redirect to new http
        return res.redirect('/signup');
      }
      else {
        User.findOne({'username': req.body.username}, function(err,user) {
          if (user) {
            console.log('Username '+ user.username + ' is taken');
            var message = 'Username '+ user.username + ' is already taken';
            req.flash('info', message);
            return res.redirect('/signup');
          }
          else {
            var newUser = new User(req.body);
            newUser.provider = 'local';
            newUser.createdAt = Date.now();
            newUser.save(function(err) {
              if(err) {
                  console.log('error in user.create ' + err);
                  // render an html
                  return res.render('users/signup', {
                    errors: err.errors,
                    user: user
                  });
              }
              else {
                console.log("no problem in user.create ");
                return res.redirect('/welcome');
              }
            });
          }      
        });
      }
    });
   
};

function validateEmail(email) {
     
    // check if username is already taken - query your db here
    var retValue = 0;

    User.findOne({'email' : email}, function(err,user ) {
      
      if(user !== null) {
        console.log("Email " + user.email + " exists in the database"); 
        retValue = 1;
        return retValue;
      }
    });
    return retValue;
}
 
exports.session = function(req,res) {
  // check if username or email and password matches record in database
  // if successful redirect to 

  User.findOne({'email' : req.body.email}, function(err,user) {
    if(err) {
      return done(err);
    }
    if (!user) {
      // email does not exist
      console.log("Email does not exist");
      return res.render('users/login');
    }
    else {
      if (!user.authenticate(req.body.password)) {
        // invalid password
        console.log("Password is not correct");
        return res.render('users/login');
      }
      else {
        // correct password. login successful
        console.log('Login successful');
        return res.redirect('/welcome');
      }   
    }
  });
};

/** Logout  */
exports.signout = function(req, res) {
    //req.logout();
    res.redirect('/');
};



