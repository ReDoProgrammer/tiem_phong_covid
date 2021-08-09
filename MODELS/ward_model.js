require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const wardSchema = new Schema({
    name:{
        type:String,
        required: [true, 'Vui lòng nhập tên xã, phường!']
    },
    district:{
        type:Schema.Types.ObjectId,
        ref:'district'
    }  

});


module.exports = mongoose.model('ward',wardSchema);
