
const express= require('express');
const bodyparser=require('body-parser');
const app= express();
const path= require('path');
var fs = require('fs');



// const GuiderList=require('./server/routes/GuiderList');

app.use('/pictures',express.static('pictures'));

app.use(bodyparser.urlencoded({extended : false}));

app.set('view engine', 'ejs');
app.set('views','views'); 


// app.use(GuiderList.route);

const util = require('util');
const readFileAsync = util.promisify(fs.readFile);

app.get('/home', async (req, res, next) => {
  var comment = [];
  var link = [];
  var count;

  try {
    count = await readFileAsync('./Number.txt', 'utf8');

    for (let i = 1; i <= count; i++) {
      var commentData = await readFileAsync('./quesComment/quesNumber' + i + '.txt', 'utf8');
      comment.push(commentData);

      var linkData = await readFileAsync('./qLinks/quesNumber' + i + '.txt', 'utf8');
      link.push(linkData);
    }
     res.render('index', { qComment: comment, qLink: link, countt: count });
  } catch (err) {
    throw err;
  }
});


app.post('/addData',(req,res,next)=>{
    var count;
    fs.readFile('./Number.txt','utf8',function (err,data) {
        if (err) throw err;
        
        count=Number(data);
        console.log(count);

         count=count+1;
    fs.writeFile('./Number.txt', count.toString() , function (err) {
        if (err) throw err;
        console.log('Saved Count!');
      });
    fs.appendFile('./quesComment/quesNumber'+count+'.txt', req.body.qComment , function (err) {
        if (err) throw err;
        console.log('Saved Comment!');
      });
      fs.appendFile('./pictures/quesNumber'+count+'.jpg', req.body.qImage , function (err) {
        if (err) throw err;
        console.log('Saved Image!');
      });
      fs.appendFile('./qLinks/quesNumber'+count+'.txt', req.body.qLink , function (err) {
        if (err) throw err;
        console.log('Saved Link!');
        res.redirect('/home');  
    });
    
    });
   
   
});

    app.get('/add',(req,res,next)=>{
        res.sendFile(path.join(__dirname,'solvedQuestions.html'));

        });
  
app.use((req,res,next)=>{
    res.status(404).send('<html><body><h1>Page not found</h1></body></html>');
});


app.listen(3000);



