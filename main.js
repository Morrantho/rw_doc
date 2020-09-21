/******************************************************************************
Dep
******************************************************************************/
path=require("path");
mongoose=require("mongoose");
express=require("express");
bp=require("body-parser");
/******************************************************************************
Cfg
******************************************************************************/
PORT=8080;
DB="rw_doc";
SCHEMA=mongoose.Schema;
MODEL=mongoose.model;
STATIC=__dirname+"\\client\\build";
CLIENT=STATIC+"\\index.html";
/******************************************************************************
Init
******************************************************************************/
rw_doc=express();
rw_doc.use(bp.urlencoded({extended: true}));
rw_doc.use(express.json());
rw_doc.use(express.static(STATIC));
mongoose.connect("mongodb://localhost:27017/"+DB,{
	useNewUrlParser:true,
	useUnifiedTopology:true
});

m_method=require("./server/models/method");
c_method=require("./server/controllers/method");
require("./server/routes/method");
/*
IMPORTANT BEFORE GOING LIVE:
To fix /doc prefix, edit client/build/index.html and replace
all "/ with "/doc/ and replace these calls:

rw_doc.get("/doc",(req,res)=>res.sendFile(CLIENT));
rw_doc.get("/*",(req,res)=>res.redirect("/doc"));
*/
/******************************************************************************
main
******************************************************************************/
rw_doc.listen(PORT,()=>
{
	console.log("rw_doc:",PORT);
});