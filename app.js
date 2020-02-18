//jshint esversion:8
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// set up mongoose
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const articleSchema = new mongoose.Schema({
  title:String,
  content:String
});

const Article = mongoose.model("article",articleSchema);

////////////////////// GENERAL ARTICLES //////////////////////////
app.route("/")
.get(function(req,res){
  Article.find({},function(err,articles){
    if(!err){
      res.send(articles);
    }else{
      res.send(err);
    }
  });
})
.post(function(req,res){
  const article = new Article({
      title:req.body.title,
      content:req.body.content
  });

  article.save(function(err){
    if(!err){
      res.send("Added new article.");
    }else{
      res.send(err);
    }
  });
})
.delete(function(req,res){
  Article.deleteMany({},function(err){
    if(!err){
      res.send("Deleted all articles.");
    }else{
      res.send(err);
    }
  });
});

////////////////////// SPECIFIC ARTICLES //////////////////////////
app.route("/articles/:articleTitle")
.get(function(req,res){
  let requestedTitle = req.params.articleTitle;
  Article.findOne({title:requestedTitle},function(err,article){
    if(article){
      res.send(article);
    }else{
      res.send("No matching article.");
    }
  });
})
.put(function(req,res){
  let requestedTitle = req.params.articleTitle;
  Article.update({title:requestedTitle},{
    title:req.body.title,
    content:req.body.content
  },
  {overwrite: true}, // enables overwriting the existing article
  function(err){
    if(!err){
      res.send("Article updated.");
    }else{
      res.send(err);
    }
  });
})
.patch(function(req,res){
  let requestedTitle = req.params.articleTitle;
  Article.update({title:requestedTitle},{
    $set:req.body
  },
  function(err){
    if(!err){
      res.send("Article updated.");
    }else{
      res.send(err);
    }
  });
})
.delete(function(req,res){
  let requestedTitle = req.params.articleTitle;
  Article.deleteOne({title:requestedTitle},function(err){
    if(!err){
      res.send("Deleted the article.");
    }else{
      res.send(err);
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
