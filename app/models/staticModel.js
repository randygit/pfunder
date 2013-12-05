/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StateSchema = new Schema({
        "states": [ {name: String, capital: String, abbreviation: String}]       
});

var ColorSchema = new Schema({
        "colors": [ {id:Number, text: String, color: String}]       
});


var NationSchema = new Schema({
        "countries": [ {name: String, code: String}]       
});
    
var LanguageSchema = new Schema({
        "languages": [ {code: String, name: String}]       
});

var TimezoneSchema = new Schema({
        "timezones": [ {timeZoneId: String, DST: String, GMT: String}]       
});

mongoose.model('State9', StateSchema);
mongoose.model('Color9', ColorSchema);

mongoose.model('Nation6', NationSchema);
mongoose.model('Language6', LanguageSchema);
mongoose.model('Timezone6', TimezoneSchema); 

 
