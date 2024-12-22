const mongoose=require("mongoose");
const connect=mongoose.connect("mongodb+srv://moonglow:JD18E6H55gZZ7jKS@finacoaster-final.oxkrr.mongodb.net/user_info?retryWrites=true&w=majority&appName=finacoaster-final")
connect.then(()=>{
    console.log("Database Connected Successfully");
})
.catch(()=>{
    console.log("Database CANNOT connect");
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