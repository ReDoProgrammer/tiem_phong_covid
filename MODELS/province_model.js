require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const provinceSchema = new Schema({
    code:{
        type:String,
        required: [true, 'Vui lòng nhập mã tỉnh thành']
    },
    name:{
        type:String,
        required: [true, 'Vui lòng nhập tên tỉnh, thành phố!']
    },
    nation:{
        type:Schema.Types.ObjectId,
        ref:'nationality'
    }  

});


module.exports = mongoose.model('province',provinceSchema);
