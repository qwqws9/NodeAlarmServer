var app = require('express')();
var server = require('http').createServer(app);
// http server를 socket.io server로 upgrade한다
var io = require('socket.io')(server);

app.get('/', function(req, res) {
  console.log('사용자가 접속함');
});

var userList = [];

// connection event handler
// connection이 수립되면 event handler function의 인자로 socket인 들어온다
io.on('connection', function(socket) {

  // 접속한 클라이언트의 정보가 수신되면
  socket.on('login', function(data) {
    console.log('Client logged-in:\n name:' + data.userCode);

    //로그인 한 유저의 소켓 아이디를 배열로 저장시킴
    userList[data.userCode] = socket.id;
    console.log(data.userCode+" - socket.Id : "+userList[data.userCode]);
    
    // socket에 클라이언트 정보를 저장한다
    socket.userCode = data.userCode;
    //console.log(socket.userCode);
    socket.nickname = data.nickname;
    //console.log(socket.nickname);
    socket.profileImg = data.profileImg;
    //console.log(socket.profileImg);

    // 접속된 모든 클라이언트에게 메시지를 전송한다 //나중에 관리자에서 보낼거 하나 만들기
    //io.emit('login', data.userCode );
  });
  
  
  
  socket.on('timeline',function(data) {
	 console.log("timeline input");
	 //프로필 사진
	 var img = socket.profileImg;
	 //보내는 사람 (nickname)
	 var from = socket.nickname;
	 //받는 사람 (userCode)
	 var to = data.To;
	 //받는사람에게 보낼 메시지 내용
	 var msg = data.msg;
	 
	 for_receiver_socket_id = userList[to];
	 io.to(for_receiver_socket_id).emit('timeline',{
		 sender : from,
		 image : img,
		 receiver : to,
		 message : msg
	 })
  });
  
  socket.on('currentUser',function(data) {
		 console.log("currentUser input");
		 
		 var search = data.search;
		 console.log('userCode :'+search);
		 var loc = data.loc;
		 var msg = false;
		 for_receiver_socket_id = userList[search];
		 console.log('current socket id : '+for_receiver_socket_id);
		 if(for_receiver_socket_id != undefined) {
			 msg = true;
			 
		 }
		 
		 socket.emit('currentUser',{
			 message : msg,
			 loc : loc
		 })
	  });

  // force client disconnect from server
  socket.on('forceDisconnect', function() {
	 console.log('disconnect 1111111')
    socket.disconnect();
  })

  socket.on('disconnect', function() {
    console.log('1 :: '+'user disconnected22222: ' + socket.userCode);
    console.log('2 :: '+userList[socket.userCode]);
    console.log(userList);
    var index = userList.indexOf(socket.id);
    console.log('위치 : '+index);
    userList.splice(index,1);
    userList.splice(index-1,1);
    console.log(userList);
    
  });
});

server.listen(3000, function() {
  console.log('Socket IO server listening on port 3000');
});