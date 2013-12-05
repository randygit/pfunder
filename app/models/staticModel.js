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

    
mongoose.model('State4', StateSchema);
mongoose.model('Color4', ColorSchema);
 
