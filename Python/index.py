from socketIO_client_nexus import SocketIO
from time import sleep

socketIO = ""

def on_connect():
	global socketIO
	jwt_token ="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1Nzc3MDAxNTE2OTQsInVzZXJfaWQiOiIxOTk3In0.am1f_9V61b-So1qCE5wh5oV1VauTRZrNkOGKBjJEDQo"
	# pass JWT token and userId
	socketIO.emit('auth',jwt_token,'1997')
	socketIO.on('on_auth_success', on_auth_success)
	while True:
		userInput = input("Enter a Message : ")
		#socketIO.on('on_auth_fail', on_auth_fail())
		#socketIO.on('on_print', on_print())
		#socketIO.on('disconnect', on_disconnect())
		#socketIO.on('reconnect', on_reconnect())
		socketIO.emit('sendCommandToServerFromPi',userInput)
		socketIO.on('reciveCommandFromServerToPi',on_print)
		socketIO.wait(seconds=1)

	socketIO.wait()

def on_disconnect():
	global socketIO
	print("in disconnect")
	print('disconnect')
	socketIO.off('connection')
	#import os
	#os.system('reboot')
	exit(0)

def on_auth_success():
	global socketIO
	print('Auth completed successfully...')

def on_auth_fail():
	global socketIO
	print("in on_auth_fail")
	print('Auth failed try again...')
	#sleep(10)
	# reconnect code
	main()

def on_print(*args):
	global socketIO

	if(args[0] == "[CLOSE]"):
		print('disconnect')
		socketIO.off('connection')
		exit(0)
	elif(args[0] == "[REBOOT]"):
		print('disconnect')
		socketIO.off('connection')
		import os
		os.system('reboot')
		exit(0)
	else:
		print('From Server:',args[0])
		print()

def on_reconnect():
	global socketIO
	print("in reconnect")
	print('reconnect')
    #socketIO.on('connection', on_connect(socketIO))
	#socketIO.on('reconnect', on_reconnect)
	#socketIO.wait()

def main():
	global socketIO
	socketIO = SocketIO('localhost', 8034)
	socketIO.on('connection', on_connect())

if __name__ == "__main__":
    main()
