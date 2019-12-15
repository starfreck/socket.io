var app 	= require('express')();
var http 	= require('http').createServer(app);
var io 		= require('socket.io')(http);
const jwt 	= require('jwt-simple');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


console.log("Token : "+genToken("1997"))

io.on('connection', function(socket){

  console.log('a user connected');

  /**
   * [Auth User]
   * @author Vasu Ratanpara
   * @Created Date     2019-12-15T04:23:40+0530
   */
	socket.on('auth', function(token,userId){

		if(checkJWTToken(token,userId))
		{

			io.emit('on_auth_success')

      socket.on('sendCommandToServerFromPi', function(msg){

          // Emit normal Message
          //io.emit('reciveCommandFromServerToPi',msg)
          console.log(msg);
          // Send [CLOSE] command to add devices
          if(msg == "[CLOSE]")
          {
          	io.emit('reciveCommandFromServerToPi',"[CLOSE]")
          }
          // Send [REBOOT] command to add devices
          else if(msg == "[REBOOT]")
          {
          	io.emit('reciveCommandFromServerToPi',"[REBOOT]")
          }
          // senf any other commands
          else
          {
          	io.emit('reciveCommandFromServerToPi','['+msg+']')
          }

      });

			//io.emit('disconnect')

		}
		else
		{
			console.log("else")
			io.emit('on_auth_fail');
		}

	});

	/**
	 * [Disconnect]
	 * @author Vasu Ratanpara
	 * @Created Date     2019-12-15T14:40:22+0530
	 */
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});


});

http.listen(8034, function(){
  console.log('listening on *:8034');
});



function genToken(userId) {

    var expires = expiresIn(15); // 15 days
    var token = jwt.encode({
        exp: expires,
        user_id: userId
    }, require('./config/secret')());

    return token;
}


function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}



function checkJWTToken(token, key) {

    if (token && key) {

        try {

            var decoded = jwt.decode(token, require('./config/secret.js')());

            if (decoded.exp <= Date.now())
            {

                console.log("message : Token expired");
            	return false;
            }

            if (decoded.user_id != key)
            {
                console.log("message : Invalid Token or Key");
            	return false;

            } else {

                return true;
            }

        } catch (err) {

            console.log("message : "+err.message);
            return false;
        }

    } else {
        console.log("message : Token or Key is missing");
    	return false
    }

}
