var tag,rtag,wtag,rentag,bookis,f,g,m,danger;
var gbook=new Array(),gwriter=new Array(),gpublication=new Array() ;
var notifier = require('node-notifier');
var queryString=require('querystring');
var bcrypt=require('bcrypt');
var buildURL=require('build-url');
var sleep=require('system-sleep');

var query=(x)=>queryString.escape(x);
var dequery=(y)=>queryString.unescape(y);
var urlbuild=(path,params)=>buildURL("/static/main",{path:path,queryParams:params});
var urlbuild1=(path,params)=>buildURL("",{path:path,queryParams:params});

function signin(data,res,req,con){
  var sql="SELECT * FROM `student_tbl` WHERE `Username`=?";
   var sql1="SELECT `Password` FROM `student_tbl` WHERE `Username`=?";
     con.query(sql,[data.username],function(err,result){
		 if(result.length==0){
		   res.render('error-login',{
		     text:"No any account found with the entered credentials!!!",
              a:"0"			 
	      });   
		 }else{
			con.query(sql1,[data.username],function(err,result){
	           checkpass(data.password,result[0].Password,req,res,data.username);
	       });
	     }
  });
}

function checkpass(p1,p2,req,res,name){
  bcrypt.compare(p1,p2).then(function(result){
     if(result==true){
	   req.session.user=name;
	   res.redirect(urlbuild1('action',{user:req.session.user}));
	 }else{
       res.render('error-login',{
		 text:"No any account found with the entered credentials!!!", 
		 a:"0"
	   }); 
	 }
   });
}
function error(res){
  res.redirect(urlbuild('error'));
}

function bookinfo(name,res,con){
   var sql="SELECT `S.No.`,`Shelf No.`,`Row No.`,`Column No.`,`Available Number on Shelf`,`Available Number on Desk` FROM `lbbook_tbl` WHERE `Book Name`=?";
   con.query(sql,[name],function(err,result){
	    res.end(JSON.stringify({shelf:result[0]["Available Number on Shelf"],desk:result[0]["Available Number on Desk"],table:result[0]["Shelf No."],row:result[0]["Row No."],col:result[0]["Column No."]}));
   });
}

function bookiinfo(name,res,con){
  var sql="SELECT `Shelf No.`,`Row No.`,`Column No.`,`Status`,`Available Number on Shelf`,`Available Number on Desk` FROM `lbbook_tbl` WHERE `Book Name`=?";
  con.query(sql,[name],function(err,result){
	  res.end(JSON.stringify({shelf:result[0]["Available Number on Shelf"],desk:result[0]["Available Number on Desk"],table:result[0]["Shelf No."],row:result[0]["Row No."],col:result[0]["Column No."]}));
   });
}

function bookserve(name,res,con,){
   var sql="SELECT `S.No.` FROM `lbbook_tbl` WHERE `Book Name`=?";
   con.query(sql,[name],function(err,result){
	  pys(ls,res,result);
   });
}

function bookiserve(name,res,con){
   var sql="SELECT `RFID tag` FROM `lbbook_tbl` WHERE `Book Name`=?";
   con.query(sql,[name],function(err,result){
		tag=result[0]["RFID tag"];
	    res.end("IsServed");
   });
}

function displaybook(res,con){
var name=new Array(),writer=new Array(),publication=new Array();
var sql="SELECT `Book Name`,`Writers`,`Publication` FROM `lbbook_tbl` WHERE `Status`=?";
  con.query(sql,["Available"],function(err,result){
	for(i=0;i<result.length;i++){
	  name.push(result[i]["Book Name"]);
	  writer.push(result[i]["Writers"]);
	  publication.push(result[i]["Publication"]);
	}
     res.render('book-list.ejs',{
	   name:name,
	   writer:writer,
	   publication:publication
    });
  });
}

function returnlist(req,res,con){
  var name=new Array(),idate=new Array(),rdate=new Array();
  var sql="SELECT `Book Name`,`Issue Date`,`Return Date` FROM `book_"+req.session.user+"_tbl`";
  con.query(sql,function(err,result){
	for(i=0;i<result.length;i++){
	  name.push(result[i]["Book Name"]);
	  idate.push(result[i]["Issue Date"]);
	  rdate.push(result[i]["Return Date"]);
	}
	res.render('return.ejs',{
	   name:name,
	   idate:idate,
	   rdate:rdate
    });
  });
}

function bookbreturn(name,req,res,con,){
  var sql="SELECT `S.No.` FROM `lbbook_tbl` WHERE `Book Name`=?";
  con.query(sql,[name],function(err,result){
    pybreturn(name,req,res,result,con);
  });
}

function pybreturn(name,req,res,result,con,by){
     returned1(name,req,res,con);
}

function returned1(name,req,res,con){
  var sql="DELETE FROM `book_"+req.session.user+"_tbl` WHERE `Book Name`=?;\
           UPDATE `lbbook_tbl` SET `Status`=?,`Available Number on Desk`=`Available Number on Desk`+1,`Total Available Number`=`Total Available Number`+1 WHERE `Book Name`=?;"
  con.query(sql,[name,"Available",name],function(err,result){
	if(result){
	  res.end("IbReturned");
	}
  });
}

function checkrtag(name,res,ls,con){
 var sql="SELECT `RFID tag`,`Shelf No.`,`Row No.`,`Column No.` FROM `lbbook_tbl` WHERE `Book Name`=?";
  con.query(sql,[name],function(err,resul){
	  rtag=resul[0]["RFID tag"];
	  pyr(res,ls,con,resul);
  });
}

function pyr(res,ls,con,result){
	var sql="UPDATE `bg_tbl` SET `Busy`=?";
	  ls.stdin.write("rfid");
	  ls.stdin.end();
	  ls.stdout.on('data',function(data){
	    var b=data.toString();
	   con.query(sql,[false],function(err,result){
		  if(b=="Error"){
		    res.end(JSON.stringify({status:"Error"}));
		   }
           if(rtag.split(",").includes(b)){
		     res.end(JSON.stringify({status:"Matched"}));
	       }else{
		     res.end(JSON.stringify({status:"Not-Matched"}));
		    }
	   });
	  });
}

function pys(ls,res,result){
	     res.end("Served");
}

function checkdbissue(req,res,uid,con,way){
  wtag=uid;
  if(way=="shelf"){
    var sql1="INSERT INTO `book_"+req.session.user+"_tbl` (`Book Name`,`Issue Date`,`Return Date`,`Fine amount`) VALUES(?,CURDATE(),DATE_ADD(CURDATE(),INTERVAL 3 MONTH),'0');\
              ALTER TABLE `book_"+req.session.user+"_tbl` DROP COLUMN `S.No.`;\
		      ALTER TABLE `book_"+req.session.user+"_tbl` ADD `S.No.` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;\
              UPDATE `lbbook_tbl` SET `Total Available Number`=`Total Available Number`-1,`Available Number on Shelf`=`Available Number on Shelf`-1 WHERE `Book Name`=?;"
     q(uid,res,sql1,con);
  }
  if(way=="desk"){
    var sql1="INSERT INTO `book_"+req.session.user+"_tbl` (`Book Name`,`Issue Date`,`Return Date`,`Fine amount`) VALUES(?,CURDATE(),DATE_ADD(CURDATE(),INTERVAL 3 MONTH),'0');\
              ALTER TABLE `book_"+req.session.user+"_tbl` DROP COLUMN `S.No.`;\
		      ALTER TABLE `book_"+req.session.user+"_tbl` ADD `S.No.` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;\
              UPDATE `lbbook_tbl` SET `Total Available Number`=`Total Available Number`-1,`Available Number on Desk`=`Available Number on Desk`-1 WHERE `Book Name`=?;"
     q(uid,res,sql1,con);
  }
  if(way=="any"){
    res.end("how");
  }
}

function way(req,res,how,con){
	if(how=="1"){
	  var sql1="INSERT INTO `book_"+req.session.user+"_tbl` (`Book Name`,`Issue Date`,`Return Date`,`Fine amount`) VALUES(?,CURDATE(),DATE_ADD(CURDATE(),INTERVAL 3 MONTH),'0');\
                ALTER TABLE `book_"+req.session.user+"_tbl` DROP COLUMN `S.No.`;\
		        ALTER TABLE `book_"+req.session.user+"_tbl` ADD `S.No.` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;\
                UPDATE `lbbook_tbl` SET `Total Available Number`=`Total Available Number`-1,`Available Number on Shelf`=`Available Number on Shelf`-1 WHERE `Book Name`=?;"
	}
	if(how=="2"){
	  var sql1="INSERT INTO `book_"+req.session.user+"_tbl` (`Book Name`,`Issue Date`,`Return Date`,`Fine amount`) VALUES(?,CURDATE(),DATE_ADD(CURDATE(),INTERVAL 3 MONTH),'0');\
                ALTER TABLE `book_"+req.session.user+"_tbl` DROP COLUMN `S.No.`;\
		        ALTER TABLE `book_"+req.session.user+"_tbl` ADD `S.No.` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;\
                UPDATE `lbbook_tbl` SET `Total Available Number`=`Total Available Number`-1,`Available Number on Desk`=`Available Number on Desk`-1 WHERE `Book Name`=?;"
	}
	q(wtag,res,sql1,con);
}

function q(uid,res,sql1,con){
 var sql="SELECT `Book Name` FROM `lbbook_tbl` WHERE `RFID tag` LIKE CONCAT('%',?,'%')";
  con.query(sql,[uid],function(err,result){
	var bname=result[0]["Book Name"];
	con.query(sql1,[result[0]["Book Name"],result[0]["Book Name"]],function(err,result){
		 checknumber(res,con,bname);
	});
  });
}

function checknumber(res,con,bname){
   var sql="SELECT `Total Available Number` FROM `lbbook_tbl` WHERE `Book Name`=?";
   var sql1="UPDATE `lbbook_tbl` SET `Status`=? WHERE `Book Name`=?";
   con.query(sql,[bname],function(err,result){
      if(result[0]["Total Available Number"]==0){
	   con.query(sql1,["Unavailable",bname],function(err,result){
		 if(result.affectedRows!=0){
		   res.end("Issued");
		 }
	   });
	  }else{
	    res.end("Issued");
	  }
   });
}

function checkrfissue(req,res,con,way){
     var sql="UPDATE `bg_tbl` SET `Busy`=?";
     var ls=python1();
     ls.stdin.write("rfid");
	 ls.stdin.end();
     ls.stdout.on('data',function(data){
      var b=data.toString();
	  con.query(sql,[false],function(err,result){
		if(b=="Error"){
		  res.end("Error");
	  }else{
	    if(tag.split(",").includes(b)){
           checkdbissue(req,res,b,con,way);
	     }else{
	       res.end("No-Match");
	     }
	   }
	  });
   });
}


function postfeed(feedback,req,res,con){
  var sql="INSERT INTO `feedback_tbl` (`Student Id`,`Feedback`) VALUES (?,?);\
           ALTER TABLE `feedback_tbl` DROP COLUMN `S.No.`;\
		   ALTER TABLE `feedback_tbl` ADD `S.No.` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;"
  con.query(sql,[req.session.user,feedback],function(err,result){
	if(result){
	   res.redirect('/');
	}
  });
}

function addrequest(req,res,data,con){
	var sql="INSERT INTO `request_tbl` (`Book Name`,`Writers`,`Publication`,`Student Id`) VALUES(?,?,?,?);\
	         ALTER TABLE `request_tbl` DROP COLUMN `S.No.`;\
		     ALTER TABLE `request_tbl` ADD `S.No.` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;"
	con.query(sql,[data.bname,data.aname,data.pname,req.session.user],function(err,result){
	  if(result){
	   res.send("Done");
	 }
	});
}
function bookresponse(req,res,con){
  var book=new Array(),writer=new Array(),publication=new Array();
  var sql="SELECT `Book Name`,`Writers`,`Publication` FROM `request_tbl` WHERE `Student Id`=?";
  con.query(sql,[req.session.user],function(err,result){
	;
	if(result.length!=0){
	 for(var i=0;i<result.length;i++){
	   book.push(result[i]["Book Name"]);
	   writer.push(result[i]["Writers"]);
	   publication.push(result[i]["Publication"]);
	 }
	 var book1=book.join(",");
	 var writer1=writer.join(",");
	 var publication1=publication.join(",");
	 bookcompare(req,res,con,book,writer,publication);
	}else{
	     res.end(JSON.stringify({status:"Arrived1",book:gbook,writer:gwriter,publication:gpublication}));
	}
  });
}

function bookcompare(req,res,con,book,writer,publication){
  var book2=new Array(),writer2=new Array(),publication2=new Array();
  var sql="SELECT `Book Name`,`Writers`,`Publication` FROM `lbbook_tbl` WHERE `Book Name` IN (?) OR `Writers` IN (?) OR `Publication` IN (?)";
  con.query(sql,[book,writer,publication],function(err,result){
	 for(var i=0;i<result.length;i++){
	   book2.push(result[i]["Book Name"]);
	   writer2.push(result[i]["Writers"]);
	   publication2.push(result[i]["Publication"]);
	 }
	 if(book2.length!=0||writer2.length!=0||publication2.length!=0){
	   gbook=book2;
	   gwriter=writer2;
	   gpublication=publication2;
	   emptytbl(req,res,con,book2,writer2,publication2);
	 }else{
	   res.end(JSON.stringify({status:"Arrived1",book:gbook,writer:gwriter,publication:gpublication}));
	 }
  });
}

function emptytbl(req,res,con,book3,writer3,publication3){
  var sql="DELETE FROM `request_tbl` WHERE `Student Id`=? AND `Book Name` IN (?) OR `Writers` IN (?) OR `Publication` IN (?)";
  con.query(sql,[req.session.user,book3,writer3,publication3],function(err,result){
   if(result){
	notifier.notify("New Book Responses Have Arrived!!! Please Check Out!!!");
	res.end(JSON.stringify({status:"Arrived",book:book3,writer:writer3,publication:publication3}));
   }
  });
}

function gettrans(req,res,con){
  var bname=new Array(),idate=new Array(),rdate=new Array(),fine=new Array();
  var sql="SELECT * FROM `book_"+req.session.user+"_tbl`"; 
  con.query(sql,function(err,result){
    for(var i=0;i<result.length;i++){
	  bname.push(result[i]["Book Name"]);
	  idate.push(result[i]["Issue Date"]);
	  rdate.push(result[i]["Return date"]);
	  fine.push(result[i]["Fine amount"]);
	}
	res.render('transaction.ejs',{
	  book:bname,
	  issued:idate,
	  returnd:rdate,
	  famt:fine
	});
  });
}

function finecheck(con){
 var a=new Array(),name=new Array();
 var sql="SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME REGEXP '(^book_)'";
 con.query(sql,function(err,result){
   for(var i=0;i<result.length;i++){
	 var sql1="SELECT `Return Date` FROM "+result[i]["TABLE_NAME"]+";"
	  name.push(result[i]["TABLE_NAME"]);
	 con.query(sql1,function(err,result){
		for(var i=0;i<result.length;i++){
	        a.push(Math.ceil((result[i]["Return Date"]-new Date())/(1000*60*60*24)));
			 if(a[i]<0){
			    fineit(con,name[i]);
			 }
		}
	 });
   }
 });
}

function fineit(con,name){
  var sql="UPDATE "+name+" SET `Fine amount`=`Fine amount`+1;\
           UPDATE `student_tbl SET `Fine amount`=`Fine amount`+1 WHERE `Book Table`=?;"
  con.query(sql,[name],function(err,result){
  });
}

function check7(req,res,con){
  var sql="SELECT * FROM `book_"+req.session.user+"_tbl`";
  con.query(sql,function(err,result){
   if(result.length==7){
     res.end("Yes");
   }else{
     res.end("No");
   }
  });
}

function showfine(req,res,con){
 var sql="SELECT `Fine amount`,`Account amount` FROM `student_tbl` WHERE `Username`=?";
 con.query(sql,[req.session.user],function(err,result){
  f=result[0]["Fine amount"];
  g=result[0]["Account amount"];
  res.render('fine-pay.ejs',{
   fine:result[0]["Fine amount"],
   amt:result[0]["Account amount"]
  });
 });
}

function clearfine(req,res,con){
 var sql="UPDATE `student_tbl` SET `Fine amount`=?,`Account amount`=? WHERE `Username`=?;\
          UPDATE `book_"+req.session.user+"_tbl` SET `Fine amount`=?;"
 con.query(sql,[0,g-f,req.session.user,parseInt("0")],function(err,result){
	res.end("Done");
 });
}

function bookrenew(req,res,con){
  var sql="UPDATE `book_"+req.session.user+"_tbl` SET `Issue Date`=CURDATE(),`Return Date`=DATE_ADD(CURDATE(),INTERVAL 3 MONTH)";
  con.query(sql,function(err,result){
   res.end("renewed");
  });
}

function pyrenew(req,res,con,ls,ftag){
	  var sql="UPDATE `bg_tbl` SET `Busy`=?";
	  ls.stdin.write("rfid");
	  ls.stdin.end();
	  ls.stdout.on('data',function(data){
	    var b=data.toString();
		con.query(sql,[false],function(err,result){
		if(b=="Error"){
		  res.end("Error");
		}
         if(ftag.split(",").includes(b)){
		    bookrenew(req,res,con);
	     }else{
		    res.end("Not-Matched");
		 }
	   });
	  });
}


function pyren(name,req,res,con,ls){
  var sql="SELECT `RFID tag` FROM `lbbook_tbl` WHERE `Book Name`=?";
  con.query(sql,[name],function(err,result){
	rentag=result[0]["RFID tag"];
	pyrenew(req,res,con,ls,result[0]["RFID tag"]);
  });
}

function alreadybook(req,res,con,ls){
	  var sql="UPDATE `bg_tbl` SET `Busy`=?";
	  ls.stdin.write("rfid");
	  ls.stdin.end();
	  ls.stdout.on('data',function(data){
	    var b=data.toString();
		con.query(sql,[false],function(err,result){
		  if(b=="Error"){
		    res.end(JSON.stringify({stat:"Error"}));
		   }else{
	        checkt(req,res,con,b);
		   }
	  });
	 });
}

function checkt(req,res,con,b){
 var sql="SELECT * FROM `lbbook_tbl` WHERE `RFID tag` LIKE CONCAT('%',?,'%')";
 con.query(sql,[b],function(err,result){
      if(result.length!=0){
		    bookrfid(req,res,con,b);
		  }else{
		    res.end(JSON.stringify({stat:"No-Match"}));
		  }
   });
}
function bookrfid(req,res,con,b){
 var sql="SELECT `Book Name`,`Available Number on Shelf`,`Available Number on Desk` FROM `lbbook_tbl` WHERE `RFID tag` LIKE CONCAT('%',?,'%')";
 con.query(sql,[b],function(err,result){
	bookis=result[0]["Book Name"];
	 res.end(JSON.stringify({stat:"Found",shelf:result[0]["Available Number on Shelf"],desk:result[0]["Available Number on Desk"]}));
 });
}

function updatedb(req,res,con,by){
   if(by==1){
	  var sql="INSERT INTO `book_"+req.session.user+"_tbl` (`Book Name`,`Issue Date`,`Return Date`,`Fine amount`) VALUES(?,CURDATE(),DATE_ADD(CURDATE(),INTERVAL 3 MONTH),'0');\
                ALTER TABLE `book_"+req.session.user+"_tbl` DROP COLUMN `S.No.`;\
		        ALTER TABLE `book_"+req.session.user+"_tbl` ADD `S.No.` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;\
                UPDATE `lbbook_tbl` SET `Total Available Number`=`Total Available Number`-1,`Available Number on Shelf`=`Available Number on Shelf`-1 WHERE `Book Name`=?;"
	}
	if(by==2){
	  var sql="INSERT INTO `book_"+req.session.user+"_tbl` (`Book Name`,`Issue Date`,`Return Date`,`Fine amount`) VALUES(?,CURDATE(),DATE_ADD(CURDATE(),INTERVAL 3 MONTH),'0');\
                ALTER TABLE `book_"+req.session.user+"_tbl` DROP COLUMN `S.No.`;\
		        ALTER TABLE `book_"+req.session.user+"_tbl` ADD `S.No.` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;\
                UPDATE `lbbook_tbl` SET `Total Available Number`=`Total Available Number`-1,`Available Number on Desk`=`Available Number on Desk`-1 WHERE `Book Name`=?;"
	}
	con.query(sql,[bookis,bookis],function(err,result){
	  checkn(res,con,bookis);
	});
}

function checkn(res,con){
   var sql="SELECT `Total Available Number` FROM `lbbook_tbl` WHERE `Book Name`=?";
   var sql1="UPDATE `lbbook_tbl` SET `Status`=? WHERE `Book Name`=?";
   con.query(sql,[bookis],function(err,result){
      if(result[0]["Total Available Number"]==0){
	   con.query(sql1,["Unavailable",bookis],function(err,result){
		 if(result.affectedRows!=0){
		   res.end("Done");
		 }
	   });
	  }else{
	    res.end("Done");
	  }
   });
}

function checkbookdelay(req,res,con){
  var sql="SELECT `Return Date` FROM `book_"+req.session.user+"_tbl`";
  con.query(sql,function(err,result){
  var a=result.length;
  if(a.length!=0){
   for(var i=0;i<result.length;i++){
     if(Math.ceil((result[i]["Return Date"]-new Date())/(1000*60*60*24))<=5){
	  danger='yes';
	 }
   }
  }
  });
}

function makefree(con){
 var sql="UPDATE `bg_tbl` SET `Busy`=?";
 con.query(sql,[false],function(err,result){
 });
}

function m(){
  return danger;
}

function checkbg(res,con){
	var sql="SELECT `Busy` FROM `bg_tbl`";
	con.query(sql,function(err,result){
	  if(result[0]["Busy"]==true){
	    res.end("Busy");
	  }else{
	    res.end("Not-Busy");
	  }
	});
}

function setbg(res,con){
  var sql="UPDATE `bg_tbl` SET `Busy`=?";
  con.query(sql,[true],function(err,result){
    console.log(err);
	console.log(result);
	res.end("Ok");
  });
}

function python1(){
   var spawn=require('child_process').spawn;
   return spawn('python',['py/rfid.py']);
}

module.exports={
	query:query,
	dequery:dequery,
	signin:signin,
	urlbuild:urlbuild,
	urlbuild1:urlbuild1,
	bookinfo:bookinfo,
	bookiinfo:bookiinfo,
	bookserve:bookserve,
	bookiserve:bookiserve,
	displaybook:displaybook,
	python1:python1,
	checkrfissue:checkrfissue,
	checkrtag:checkrtag,
	returnlist:returnlist,
	bookbreturn:bookbreturn,
	way:way,
	postfeed:postfeed,
	addrequest:addrequest,
	bookresponse:bookresponse,
	gettrans:gettrans,
	finecheck:finecheck,
	check7:check7,
	showfine:showfine,
	clearfine:clearfine,
	pyren:pyren,
	alreadybook:alreadybook,
	bookrfid:bookrfid,
	updatedb:updatedb,
	checkbookdelay:checkbookdelay,
	checkbg:checkbg,
	setbg:setbg,
	m:m,
	makefree:makefree,
	error:error
};
