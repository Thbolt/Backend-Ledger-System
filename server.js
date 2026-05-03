require("dotenv").config();

const { connect } = require("mongoose");
const app = require("./src/app"); //Require is used for older companies and import is used for newer companies
const connectToDB = require("./src/config/db");


connectToDB();

app.listen(3000,()=>{

    console.log("Server is running on port 3000");

})