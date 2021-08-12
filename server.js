const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const layout = require("express-ejs-layouts");

app.set("view engine", "ejs"); //set view engine cho nodejs
app.set("views", "views"); //set thư mục view cho project
app.use(express.static("./public")); //set đường dẫn tới thư mục public gồm css,js,bootstrap...



//get data from form Express v4.16.0 and higher
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

mongoose.connect(
  process.env.mongoose,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => {
    console.log("connect database successfully");
  },
  (error) => console.log(error.message)
);


app.use(layout); //set layout



const home_controller = require('./CONTROLLERS/home_controller');

app.use('/', home_controller);

const account_controller = require('./CONTROLLERS/account_controller');
app.use('/account',account_controller);

const vaccination_controller = require('./CONTROLLERS/vaccination_controller');
app.use('/danh-sach-tiem-phong-covid-19',vaccination_controller);












//ADMIN CONTROLLERS
const admin_home_controller = require('./CONTROLLERS/admin/home_controller');
app.use('/admin',admin_home_controller);

const admin_authenticate_controller = require('./CONTROLLERS/admin/authenticate_controller');
app.use('/admin',admin_authenticate_controller);

const admin_account_controller = require('./CONTROLLERS/admin/account_controller');
app.use('/admin/account',admin_account_controller);

const admin_administrative_unit_controller = require('./CONTROLLERS/admin/administrative_unit_controller');
app.use('/admin/don-vi-hanh-chinh',admin_administrative_unit_controller);

const admin_dept_controller = require('./CONTROLLERS/admin/dept_controller');
app.use('/admin/dept',admin_dept_controller);

const admin_district_controller = require('./CONTROLLERS/admin/district_controller');
app.use('/admin/district',admin_district_controller);

const admin_doc_controller = require('./CONTROLLERS/admin/doc_controller');
app.use('/admin/doc',admin_doc_controller);

const admin_health_facility_controller = require('./CONTROLLERS/admin/health_facility_controller');
app.use('/admin/csyt',admin_health_facility_controller);

const admin_job_controller = require('./CONTROLLERS/admin/job_controller');
app.use('/admin/job',admin_job_controller);

const admin_priority_object_controller = require('./CONTROLLERS/admin/priority_object_controller');
app.use('/admin/doi-tuong-uu-tien',admin_priority_object_controller);


const admin_nation_controller = require('./CONTROLLERS/admin/nation_controller');
app.use('/admin/dan-toc',admin_nation_controller);

const admin_province_controller = require('./CONTROLLERS/admin/province_controller');
app.use('/admin/province',admin_province_controller);



const admin_unit_controller = require('./CONTROLLERS/admin/unit_controller');
app.use('/admin/unit',admin_unit_controller);

const admin_vaccin_controller = require('./CONTROLLERS/admin/vaccin_controller');
app.use('/admin/vaccin',admin_vaccin_controller);

const admin_ward_controller = require('./CONTROLLERS/admin/ward_controller');
app.use('/admin/ward',admin_ward_controller);







app.listen(process.env.PORT, (_) => {
  console.log(`server is running on port ${process.env.PORT}`);
});
