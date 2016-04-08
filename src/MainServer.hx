package;
import js.node.Http;
import js.node.net.Socket;
import js.npm.Express;
import js.npm.Request;
import js.npm.express.Response;
import js.npm.socketio.Server;

/**
 * ...
 * @author Urs Stutz
 */
class MainServer {

	static var PORT = 3000;
	var socketServer:Server;
	var usernames:Array<String>;
	var userNameOfSocket:Map<Socket, String>;
	
    static public function main() {
        var mainServer = new MainServer();
	}
	
	public function new() {
		
		usernames = new Array<String>();
		userNameOfSocket = new Map<Socket, String>();
		
		var expressApp:Dynamic = new Express();
		var httpServer = Http.createServer( expressApp );
		socketServer = new Server( httpServer );
		
		expressApp.get( '/', sendIndex );
		expressApp.get( '/client.js', sendClientJS );
		
		socketServer.on( 'connection', onConnection );
		
		trace( 'Listening on port ' + PORT );
		httpServer.listen( PORT );
	}
	
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	
	function sendIndex( request:Request, response:Response ) {
		response.sendfile( 'index.html' );
	}
	
	function sendClientJS( request:Request, response:Response ) {
		response.sendfile( 'client.js' );
	}
	
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	
	function onConnection( socket:Socket ):Void {
		
		socket.on( 'adduser', function ( username:String ):Void {
			// we store the username in the socket session for this client
			userNameOfSocket.set( socket, username ); // socket.username = username;
			// add the client's username to the global list
			usernames.push( username );
			// echo to client they've connected
			socket.emit( 'updatechat', 'SERVER', 'you have connected' );
			// echo globally (all clients) that a person has connected
			socket.emit( 'updatechat', 'SERVER', username + ' has connected');
			// update the list of users in chat, client-side
			socketServer.sockets.emit('updateusers', usernames);
		});
		
		socket.on( 'sendchat',	function ( data:String ):Void {
			socketServer.emit( 'updatechat', userNameOfSocket.get( socket ), data );
		});
		
		socket.on( 'disconnect', onDisconnect );
	}
	
	// - - - - - - - - - - - - - - - - - - - - - - - - 
	
	function onDisconnect( socket:Socket ):Void {
		var disconnectMessage = 'A User disconnected.';
		trace( disconnectMessage );
		socketServer.emit( 'user disconnected', disconnectMessage );
	}
	
}