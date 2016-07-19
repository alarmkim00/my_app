var express = require("express");
var path = require("path");
var mongoose = require("mongoose");

var app = express();

//app.get("/", function(req, res){
//  res.send("Hello World!");
//});

//app.use(express.static(__dirname + "/public"));

mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;
db.once("open", function(){
  console.log("DB connected");
});
db.on("error", function(err){
  console.log("DB ERROR :" + err);
});

var dataSchema = mongoose.Schema({
  name:String,
  count:Number
});
var Data = mongoose.model("data", dataSchema);

Data.findOne({
  name : "myData"
},
function(err, data){
  if(err){
    return console.log("Data ERROR : " + err);
  }
  if(!data){
    Data.create({
      name : "myData",
      count : 0
    },
    function(err, data){
      if(err){
        return console.log("Data ERROR : " + err);
      }
      console.log("Counter initialized : ", data);
    });
  }
});
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));

//var data={count : 0};
app.get("/", function(req, res){
  Data.findOne({
    name : "myData"
  },
  function(err, data){
    if(err){
      return console.log("Data ERROR : " + err);
    }
    data.count++;
    data.save(function(err){
      if(err){
        return console.log("Data ERROR : " + err);
      }
      res.render("my_first_ejs", data);
    });
  });
});

app.get("/reset", function(req, res){
  setCounter(res, 0);
});
app.get("/set/count", function(req, res){
  if(req.query.count){
    setCounter(res, req.query.count);
  }else{
    getCounter(res);
  }
});
app.get("/set/:num", function(req, res){
  if(req.params.num){
    setCounter(res, req.params.num);
  }else{
    getCounter(res);
  }
});

app.listen(3000, function(){
  console.log("Server On!");
});

function setCounter(res, num){
  console.log("setCounter");
  Data.findOne({
    name : "myData"
  },
  function(err, data){
    if(err) return console.log("Data ERROR : " + err);
    data.count = num;
    data.save(function(err){
      if(err) return console.log("Data ERROR : " + err);
      res.render("my_first_ejs", data);
    });
  });
}

function getCounter(res){
  console.log("getCounter");
  Data.findOne({
    name : "myData"
  },
  function(err, data){
    if(err) return console.log("Data ERROR : " + err);
    res.rendor("my_first_ejs", data);
  });
}
