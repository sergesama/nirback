var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var competencesSchema = new Schema({
   name: {
        type: String,
        required: true,
        unique: true
    },
    indicators:[{
        name:{
            type: String
        },
        procent:{
            type: String
        },
        description:{
            type: String
        }
        
 }]    
}, {
    timestamps: true
});

var Competences = mongoose.model('Competences', competencesSchema);

module.exports = Competences;