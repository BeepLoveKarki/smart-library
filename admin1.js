var bcrypt=require('bcrypt');
var extra=require('./extra ') ;

function adlog(req,res,con,pass){
  var sql="SELECT `Admin password` FROM `admin_tbl`";
  con.query(sql,function(err,result){
	checkpass(pass,result[0]["Admin password"],req,res);
  });
}

function checkpass(p1,p2,req,res){
bcrypt.compare(p1,p2).then(function(result){
     if(result==true){
	   req.session.admin="active";
	   res.redirect(extra.urlbuild1('admin'));
	 }else{
       res.render('error-login', {
		   text:"Admin password you enter didn't matched with the stored credential!!! Please try again!!!"
	   }); 
	 }
   });
}

function enterstud(name,roll,res,con){
	var sql="SELECT * FROM `student_tbl` WHERE `Username`=?";
	con.query(sql,[roll],function(err,result){
	   if(result.length!=0){
	     res.end("Already");
	   }else{
          hashin(name,roll,con,res);
	   }
	});
}

function hashin(name,roll,con,res) {
  var sql="INSERT INTO `student_tbl` (`Name`,`Username`,`Uid`,`Password`,`Book Table`,`Fine amount`,`Account Amount`) VALUES(?,?,?,?,?,?,?);\
           ALTER TABLE `student_tbl` DROP COLUMN `S.No.`;\
		   ALTER TABLE `student_tbl` ADD `S.No.` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;\
		   CREATE TABLE `book_"+roll+"_tbl`(`S.No.` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,`Book Name` VARCHAR(1000),`Issue Date` date,`Return date` date,`Fine amount` INT(11));"
  var a=Math.floor(Math.random()*10000)+1000;
  bcrypt.hash(name.split(" ")[0].toLowerCase().concat(a.toString()),10, function(err, hash) {
       if(err) extra.error(res);
	  con.query(sql,[name,roll,a,hash,"book_"+roll+"_tbl","0","1000"],function(err,result){
	    if(err) extra.error(res);
		res.end("Inserted");
	  });
  });
}

function studentry(res,con){
  var name=new Array(),roll=new Array();
  var sql="SELECT `Name`,`Username` FROM `student_tbl`";
  con.query(sql,function(err,result){
    if(err) extra.error(res);
	for(var i=0;i<result.length;i++){
	  name.push(result[i]["Name"]);
	  roll.push(result[i]["Username"]);
	}
	res.render('stud.ejs',{
	  name:name,
	  roll:roll
	});
  });
}

function editentry(res,con,name,roll,exroll){
  var sql="SELECT `Uid` FROM `student_tbl` WHERE `Username`=?"
  con.query(sql,[exroll],function(err,result){
	if(result.length!=0){
      bcrypt.hash(name.split(" ")[0].toLowerCase().concat(result[0]["Uid"].toString()),10,function(err,hash){
	    if(err) extra.error(res);
	    supporteditentry(res,con,name,roll,exroll,hash);
	  });
	}
   });
}

function supporteditentry(res,con,name,roll,exroll,hash){
  var sql="UPDATE `student_tbl` SET `Name`=?,`Username`=?,`Password`=? WHERE `Username`=?";
  var sql1="SELECT 1 FROM `book_"+roll+"_tbl` LIMIT 1;"
  var sql2="RENAME TABLE `book_"+exroll+"_tbl` TO `book_"+roll+"_tbl`";
  con.query(sql,[name,roll,hash,exroll],function(err,result){
		 if(result){
			 con.query(sql1,function(err,result){
			   if(err){
			     con.query(sql2,function(err,result){
				    if(err) extra.error(res);
					res.end("Done");
				 });
			   }else{
			     res.end("Done");
			   }
			 });
		 }
	});
}

function addeditentry(res,con,new_name,roll){
  var sql="SELECT `Uid` FROM `student_tbl` WHERE `Username`=?"
  con.query(sql,[roll],function(err,result){
	if(result.length!=0){
      hashagain(res,con,new_name,result[0]["Uid"],roll);
	}
  });
}

function hashagain(res,con,new_name,uid,roll){
    var sql1="UPDATE `student_tbl` SET `Name`=?,`Password`=? WHERE `Username`=?";
    bcrypt.hash(new_name.split(" ")[0].toLowerCase().concat(uid.toString()),10,function(err,hash){
     if(err) extra.error(res);
	 con.query(sql1,[new_name,hash,roll],function(err,result){
	     if(result) res.end("Done");
	  });
    });
}

function deletentry(res,con,roll){
	var sql="DELETE FROM `student_tbl` WHERE `Username`=?;\
	         DROP TABLE `book_"+roll+"_tbl`;"
	con.query(sql,[roll],function(err,result){
	  if(result) res.end("Done");
	});
}

function viewreq(res,con){
  var book=new Array(),writer=new Array(),publication=new Array(),student=new Array();
  var sql="SELECT * FROM `request_tbl`";
  con.query(sql,function(err,result){
     if(err) extra.error(res);
	 for(var i=0;i<result.length;i++){
	   book.push(result[i]["Book Name"]);
	   writer.push(result[i]["Writers"]);
	   publication.push(result[i]["Publication"]);
	   student.push(result[i]["Student Id"]);
	 }
	 res.render('view-req.ejs',{
	   book:book,
	   writer:writer,
	   publication:publication,
	   student:student
	 });
  });
}

function viewfeed(res,con){
  var feedback=new Array(),student=new Array();
  var sql="SELECT * FROM `feedback_tbl`";
  con.query(sql,function(err,result){
	for(var i=0;i<result.length;i++){
	   feedback.push(result[i]["Feedback"]);
	   student.push(result[i]["Student Id"]);
	}
	res.render("view-feed.ejs",{
	  feedback:feedback,
	  student:student
	});
  });
}

function addnewbookcheck(a,res,con){
 var sql="SELECT * FROM `lbbook_tbl` WHERE `Book Name`=? AND `Writers`=? AND `Publication`=?";
 con.query(sql,[a[0],a[1],a[2]],function(err,result){
   if(result.length==0){
     addnewbook(a,res,con);
   }else{
    res.end("Already");
   }
 });
}

function addnewbook(a,res,con){
 var sql="INSERT INTO `lbbook_tbl` (`Book Name`,`Writers`,`Publication`,`RFID tag`,`Shelf No.`,`Row No.`,`Column No.`,`Total Available Number`,`Available Number on Shelf`,`Available Number on Desk`,`Status`) VALUES(?,?,?,?,?,?,?,?,?,?,?);\
          ALTER TABLE `lbbook_tbl` DROP COLUMN `S.No.`;\
		  ALTER TABLE `lbbook_tbl` ADD `S.No.` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;"
 a.push(a[7],"0","Available");
 con.query(sql,a,function(err,result){
   res.end("Inserted");
 }); 
}

function updatebook(a,res,con){
 var sql="UPDATE `lbbook_tbl` SET `RFID tag`=?,`Shelf No.`=?,`Row No.`=?,`Column No.`=?,`Total Available Number`=?,`Available Number on Shelf`=? WHERE `Book Name`=? AND `Writers`=? AND `Publication`=?";
 con.query(sql,[a[3],a[4],a[5],a[6],a[7],a[7],a[0],a[1],a[2]],function(err,result){
   if(result.affectedRows!=0){
     res.end("Done");
   }
 });
}

function showbookname(res,con){
 var bname=new Array(),writer=new Array(),publication=new Array();
 var sql="SELECT `Book Name`, `Writers`,`Publication` FROM `lbbook_tbl`";
 con.query(sql,function(err,result){
   for(var i=0;i<result.length;i++){
     bname.push(result[i]["Book Name"]);
	 writer.push(result[i]["Writers"]);
	 publication.push(result[i]["Publication"]);
   }
   res.render('booker.ejs',{
     bname:bname,
	 writer:writer,
	 publication:publication
   });
 });
}

function getdatas(res,con,name,writer,publication){
  var sql="SELECT * FROM `lbbook_tbl` WHERE `Book Name`=? AND `Writers`=? AND `Publication`=?";
  con.query(sql,[name,writer,publication],function(err,result){
	res.end(JSON.stringify({tag:result[0]["RFID tag"],shelf:result[0]["Shelf No."],row:result[0]["Row No."],col:result[0]["Column No."],stat:result[0]["Status"],num:result[0]["Total Available Number"],numshelf:result[0]["Available Number on Shelf"],numdesk:result[0]["Available Number on Desk"]}));
  });
}

function newbookedit(a,res,con){
   var sql="UPDATE `lbbook_tbl` SET `Book Name`=?,`Writers`=?,`Publication`=?,`RFID tag`=?,`Shelf No.`=?,`Row No.`=?,`Column No.`=?,`Status`=?,`Total Available Number`=?,`Available Number on Shelf`=?,`Available Number on Desk`=? WHERE `Book Name`=? AND `Writers`=? AND`Publication`=?";
   con.query(sql,[a[0],a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8],a[9],a[10],a[11],a[12],a[13]],function(err,result){
    res.end("Done");
   });
}

function bookdel(book,writer,publication,res,con){
	var sql="DELETE FROM `lbbook_tbl` WHERE `Publication`=? AND `Book Name`=? AND `Writers`=?";
	con.query(sql,[publication.toString(),book.toString(),writer.toString()],function(err,result){
	 res.end("Done");
	});
}

function changepass(newpass,req,res,con){
var sql="UPDATE `admin_tbl` SET `Admin Password`=?";
bcrypt.hash(newpass,10,function(err, hash) {
 con.query(sql,[hash],function(err,result){
   if(err) extra.error(res);
   req.session.admin='';
   res.redirect('/admin');
 });
});
}

function getondesk(res,con){
 var book=new Array(),writer=new Array(),publication=new Array(),shelf=new Array(),row=new Array(),col=new Array();
 var sql="SELECT `Book Name`,`Shelf No.`,`Row No.`,`Column No.` FROM `lbbook_tbl` WHERE NOT `Available Number on Desk`=0";
 con.query(sql,function(err,result){
   for(var i=0;i<result.length;i++){
     book.push(result[i]["Book Name"]);
	 shelf.push(result[i]["Shelf No."]);
	 row.push(result[i]["Row No."]);
	 col.push(result[i]["Column No."]);
   }
   res.render('manage.ejs',{
	   book:book,
	   shelf:shelf,
	   row:row,
	   col:col
   });
 });
}

function getuseruid(res,user,con){
 var sql="SELECT `Uid` FROM `student_tbl` WHERE `Username`=?";
 con.query(sql,[user],function(err,result){
   if(result.length!=0){
     res.end(result[0]["Uid"].toString());
   }else{
     res.end("No");
   }
 });
}

function getpass(res,pass,con){
var sql="SELECT `Admin password` FROM `admin_tbl`";
  con.query(sql,function(err,result){
	console.log(result);
	bcrypt.compare(pass,result[0]["Admin password"]).then(function(result){
     if(result==true){
	   res.end("True");
	 }else{
       res.end("False");
	 }
   });
  });
}

function bookmanaged(res,con,b){
 var sql="UPDATE `lbbook_tbl` SET `Available Number on Shelf`=`Available Number on Shelf`+1,`Available Number on Desk`=`Available Number on Desk`-1 WHERE `Book Name` IN (?)";
 con.query(sql,[b],function(err,result){
   res.end("Done");
 });
}

module.exports={
 adlog:adlog,
 enterstud:enterstud,
 studentry:studentry,
 editentry:editentry,
 addeditentry:addeditentry,
 deletentry:deletentry,
 viewreq:viewreq,
 viewfeed:viewfeed,
 addnewbookcheck:addnewbookcheck,
 updatebook:updatebook,
 showbookname:showbookname,
 getdatas:getdatas,
 newbookedit:newbookedit,
 bookdel:bookdel,
 changepass:changepass,
 getondesk:getondesk,
 getuseruid:getuseruid,
 bookmanaged:bookmanaged,
 getpass:getpass
};
