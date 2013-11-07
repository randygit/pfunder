var mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    User = mongoose.model('User1'),
    config = require('./config');


module.exports = function(passport) {
    //Serialize sessions
    // have to modify this for the correct user

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({
            _id: id
        }, function(err, user) {
            done(err, user);
        });
    });

    //Use local strategy
    //modify since the db could have several records
    //of the same email but the only the verified account is valid

    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            console.log("passport.local ");
            User.find({ 'email': email, verified: true }, 
                function(err,user) {

                if(err) {
                    return done(err);
                }

                console.log('User             ' + JSON.stringify(user)); 
                console.log('User.length      ' + user.length);
                console.log('User.email       ' + user[0].email);
                console.log('User.disabled    ' + user[0].disabled);
                console.log('User.deactivated ' + user[0].deactivated);

                if(user.length == 0) {
                    console.log("passport.local unknown user");
                    return done(null, false, {
                        message: 'Passport.local: Unknown user'
                    });              
                }
                if(user.length == 1) {
                    console.log('passport.local check for password');
                     
                    // check for valid password
                    if (!user[0].authenticate(password)) {
                        console.log("passport.local invalid password");
                        return done(null, false, {
                            message: 'Passport.local: Invalid password.'
                        });
                    }
                    console.log('passport.local check if disabled ' + user[0].disabled);

                    //check if disabled is true
                    if (user[0].disabled) {
                        console.log("passport.local account is disabled");
                        return done(null, false, {
                            message: 'Passport.local: account is disabled.'
                        });
                    }
                    console.log('passport.local check if deactivated '+ user[0].deactivated);

                    //check if deactivated is true
                    if (user[0].deactivated) {
                        console.log("passport.local account is deactivated");
                        return done(null, false, {
                            message: 'Passport.local: account is deactivated.'
                        });
                    }

                }
                return done(null, user[0]);
            });
        }
    ));

};
