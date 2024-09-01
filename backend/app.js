//shree ganeshay namah
const express =require('express');
const app=express();
const port=2000;
const  user=require('./Routes/user');
const cors=require('cors');
const mongoose=require('mongoose');
const { register } = require('module');


app.use(express.json());
app.use(cors());


app.use('/user',user);



app.listen(port,(req,res)=>{
    console.log(`server is running on port ${port}`);
});