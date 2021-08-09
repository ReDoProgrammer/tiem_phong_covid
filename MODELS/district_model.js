require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const districtSchema = new Schema({
    code:{
        type:String,
        required: [true, 'Vui lòng nhập mã quận huyện']
    },
    name:{
        type:String,
        required: [true, 'Vui lòng nhập tên quận huyện']
    },
    prov:{
        type:Schema.Types.ObjectId,
        ref:'province'
    }  

});


module.exports = mongoose.model('district',districtSchema);
