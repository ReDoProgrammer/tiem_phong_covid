require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const provinceSchema = new Schema({
    name:{
        type:String,
        required: [true, 'Vui lòng nhập tên tỉnh, thành phố!']
    },
    nationality:{
        type:Schema.Types.ObjectId,
        ref:'nationality'
    }  

});


module.exports = mongoose.model('province',provinceSchema);
