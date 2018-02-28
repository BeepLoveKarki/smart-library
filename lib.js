var ls,id,sock;
var express=require('express');
var path=require('path');
var bodyparser=require('body-parser');
var app=express();
var mysql=require('mysql');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var schedule = require('node-schedule');
var extra=require('./extra');
var admin=require('./admin1');

var config={
   host:"127.0.0.1",
   user:"root",
   pass:"",
   database:"library_db",
   port:"3306"
};

var options = {
	host: '127.0.0.1',
	port: 3306,
	user: 'root',
	password: '',
	database: 'library_db'
};

/*var config={
   socketPath:"/var/run/mysqld/mysqld.sock",
   user:"biplab",
   password:"Nikista",
   database:"library_db",
};

var options = {
    socketPath: '/var/run/mysqld/mysqld.sock',
	user: 'biplab',
	password: 'Nikista',
	database: 'library_db'
};*/


var sessionStore = new MySQLStore(options);

var con=mysql.createConnection({
   host:config.host,
   user:config.user,
   password:config.pass,
   database:config.database,
   multipleStatements:true
});


app.use(session({
	key: 'library_session',
    secret: '2C44-4D44-WppQ38S',
	store: sessionStore,
    resave: true,
    saveUninitialized: true
}));

app.set('views','./public/main');
app.set('view engine', 'ejs');
app.use('/static',express.static(path.join(__dirname, 'public'),{index:false,extensions:['html']}));
app.use(bodyparser.urlencoded({extended:false}));

con.connect(function(err){
  if(err) console.log(err);
});

extra.makefree(con);

var j = schedule.scheduleJob({hour:24, minute:0, second:0}, extra.finecheck,con);

app.get('/uid',function(req,res){
  res.render("uid.ejs");
});

app.post('/uidlog',function(req,res){
 var data={
    pass:req.body.adpass
 };
 admin.getpass(res,data.pass,con);
});

app.get('/wrong',function(req,res){
  res.render('error-login',{
		 text:"No admin privileges found with the entered password!!!",
         a:"1"		 
	   });
});

app.post('/getuid',function(req,res){
 var data={
   user:req.body.user
 };
 admin.getuseruid(res,data.user,con);
});

app.post('/log_in',function(req,res){
   var data={
     username:extra.query(req.body.roll),
	 password:extra.query(req.body.password.toLowerCase())
  };
  extra.signin(data,res,req,con);
});

app.get("/check7",function(req,res){
  extra.check7(req,res,con);
});

app.get("/booker",function(req,res){
  admin.showbookname(res,con);
});

app.get("/view-req",function(req,res){
  admin.viewreq(res,con);
});

app.get("/view-feed",function(req,res){
  admin.viewfeed(res,con);
});

app.post("/edelete",function(req,res){
	var data={
	  roll:req.body.roll
	};
	admin.deletentry(res,con,data.roll);
});

app.post("/getdatas",function(req,res){
var data={
  name:req.body.bname,
  writer:req.body.bwriter,
  publication:req.body.bpublication
};
admin.getdatas(res,con,data.name,data.writer,data.publication);
});

app.get('/action',function(req,res){
  if(req.session.user && req.session.user!=''){
   extra.checkbookdelay(req,res,con);
   res.render('action.ejs');
  }
  else{
   res.redirect('/');
  }
});

app.post("/newedits",function(req,res){
 var a=JSON.parse(Object.keys(req.body)[0]);
 admin.newbookedit(a,res,con);
});

app.post("/bookdel",function(req,res){
 var data={
  book:req.body.book,
  writer:req.body.writer,
  publication:req.body.publication
 };
 admin.bookdel(data.book,data.writer,data.publication,res,con);
});

app.post("/changeadlog",function(req,res){
 var data={
   newpass:req.body.adpassnew
 };
 console.log(data);
 admin.changepass(data.newpass,req,res,con);
});

app.post('/fbook',function(req,res){
  var data={
    bookname:req.body.book
  };
  extra.bookinfo(data.bookname,res,con,);
});

app.post('/addbook_it',function(req,res){
  var a=JSON.parse(Object.keys(req.body)[0]);
  admin.addnewbookcheck(a,res,con);
});

app.post('/aebookedits',function(req,res){
 var a=JSON.parse(Object.keys(req.body)[0]);
 admin.updatebook(a,res,con);
});

app.post('/adlog',function(req,res){
  var data={
    adpass:req.body.adpass
  };
  admin.adlog(req,res,con,data.adpass);
});

app.post('/sbook',function(req,res){
  var data={
    bookname:req.body.book
  };
  extra.bookserve(data.bookname,res,con);
});

app.post('/ibook',function(req,res){
  var data={
    bookname:req.body.book
  };
  extra.bookiserve(data.bookname,res,con);
});

app.post('/iinfo',function(req,res){
  var data={
    bookname:req.body.book
  };
  extra.bookiinfo(data.bookname,res,con);
});

app.post('/ibreturn',function(req,res){
  var data={
    bookname:req.body.book
  };
  extra.bookbreturn(data.bookname,req,res,con);
});

app.post('/bookrenew',function(req,res){
  var data={
    bookname:req.body.book
  };
  extra.pyren(data.bookname,req,res,con,extra.python1());
});

app.post('/checkrfissue',function(req,res){
  var data={
	way:req.body.way
  };
  extra.checkrfissue(req,res,con,data.way);
});

app.post('/issueway',function(req,res){
 var data={
   way:req.body.way
 };
 extra.way(req,res,data.way,con);
});

app.post('/checkrtag',function(req,res){
 ls=extra.python1();
 var data={
   bookname:req.body.book,
 };
 extra.checkrtag(data.bookname,res,ls,con);
});

app.get('/issue',function(req,res){
  res.redirect(extra.urlbuild('issue'));
});

app.post("/updatedb",function(req,res){
 var data={
   by:req.body.by
 };
 extra.updatedb(req,res,con,data.by);
});

app.get('/return',function(req,res){
   extra.returnlist(req,res,con);
});

app.get("/stud",function(req,res){
  admin.studentry(res,con);
});

app.get("/booker",function(req,res){
  res.render('booker.ejs');
});

app.get('/',function(req,res){
   if(req.session.user && req.session.user!=''){
	   id=req.session.user;
	   res.redirect(extra.urlbuild1('action',{user:req.session.user}));
   }else if(req.session.admin && req.session.admin!=''){
       res.redirect(extra.urlbuild1('admin'));
   }
   else{
     res.redirect(extra.urlbuild('login'));
   }
});

app.post("/edits",function(req,res){
  var data={
    name:req.body.n,
	roll:req.body.r,
	proll:req.body.previous
  };
  admin.editentry(res,con,data.name,data.roll,data.proll);
});

app.post("/aedits",function(req,res){
  var data={
    name:req.body.name,
	roll:req.body.roll
  };
  admin.addeditentry(res,con,data.name,data.roll);
});

app.get('/danger',function(req,res){
  res.end(extra.m());
});

app.get('/logout',function(req,res){
  req.session.user='';
  res.end("Done");
});

app.get('/logout-admin',function(req,res){
  req.session.admin='';
  res.end("Done");
});

app.get('/admin',function(req,res){
  if(req.session.admin && req.session.admin!=''){	
    res.render('admin.ejs');
  }else{
    res.redirect('/');
  }
});

app.get('/book-list',function(req,res){
  extra.displaybook(res,con);
});

app.post('/feedback',function(req,res){
  var data={
    feedback:req.body.feedback
  };
  extra.postfeed(data.feedback,req,res,con);
});

app.post('/reqbook',function(req,res){
 var data={
   bname:req.body.bname,
   aname:req.body.aname,
   pname:req.body.pname
 };
 extra.addrequest(req,res,data,con);
});

app.get('/notify',function(req,res){
  extra.bookresponse(req,res,con);
});

app.get('/transaction',function(req,res){
  extra.gettrans(req,res,con);
});

app.post('/add_it',function(req,res){
 var data={
   fname:req.body.fname,
   roll:req.body.roll
 };
 admin.enterstud(data.fname,data.roll,res,con);
});

app.get('/manage',function(req,res){
  admin.getondesk(res,con);
});

app.post('/mbook',function(req,res){
 var b=JSON.parse(Object.keys(req.body)[0]);
 admin.bookmanaged(res,con,b);
});

app.get("/alreadybook",function(req,res){
  extra.alreadybook(req,res,con,extra.python1());
});

app.get('/test',function(req,res){
  res.redirect('/static/main/test');
});

app.get('/payfine',function(req,res){
  extra.showfine(req,res,con);
});

app.get("/clearf",function(req,res){
  extra.clearfine(req,res,con);
});

app.get('/error',function(req,res){
  extra.error(res);
});

app.get('/checkbg',function(req,res){
  extra.checkbg(res,con);
});

app.get('/setbg',function(req,res){
  extra.setbg(res,con);
});

app.listen(8081);

