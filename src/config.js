const mongoose=require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((err) => {
    console.log("Database CANNOT connect");
    console.error(err);
  });

//schema

const user_scheme=new mongoose.Schema({
    username:{
        type :String,
        required: true

    },
    password:{
        type: String,
        required: true
    },
    email:{
        type : String, 
        required : true
    },
    net_balance:{
        type : Number,
        required : true
    },
    earning: [{
        amount: {
          type: Number,
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }],
      spent: [{
        amount: {
          type: Number,
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }],
    quiz_index:{
        type: Number,
        require : true
    }

});


//model
const collection=new mongoose.model("users",user_scheme);
module.exports=collection;