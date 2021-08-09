require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const wardSchema = new Schema({
    code:{
        type:String,
        required: [true, 'Vui lòng nhập mã xã phường']
    },
    name:{
        type:String,
        required: [true, 'Vui lòng nhập tên xã, phường!']
    },
    dist:{
        type:Schema.Types.ObjectId,
        ref:'district'
    }  

});


module.exports = mongoose.model('ward',wardSchema);
