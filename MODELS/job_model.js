require('dotenv').config();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const jobSchema = new Schema({
    name:{
        type:String,
        required: [true, 'Vui lòng nhập tên nghề nghiệp']
    }
   
});


module.exports = mongoose.model('job',jobSchema);
