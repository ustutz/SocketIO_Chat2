package;
import js.Browser;
import js.Lib;
import js.browser.socketio.Client;
import js.html.Element;
import js.html.Event;
import js.html.FormElement;
import js.html.InputElement;

/**
 * ...
 * @author Urs Stutz
 */
class MainClient {
	
	var form:FormElement;
	var socket:Client;
	var inputField:InputElement;
	var messages:Element;
	var sendButton:Element;
	var conversationNode:Element;
	var usersNode:Element;
	var dataSend:Element;
	var data:InputElement;

    static public function main() {
		new MainClient();
	}
	
	public function new() { //trace( "new MainClient" );
		
		var doc = Browser.document;
		
		conversationNode = doc.getElementById( 'conversation' );
		usersNode = doc.getElementById( 'users' );
		dataSend = doc.getElementById( 'datasend' );
		data = cast( doc.getElementById( 'data' ), InputElement );
		
		dataSend.addEventListener( 'click', onSend );
		data.addEventListener( 'keypress', onKeyPress );
		
		socket = new Client( 'http://localhost:3000' );
		socket.on( 'connect', onConnect );
		socket.on( 'updatechat', onUpdateChat );
		socket.on( 'updateusers', onUpdateUsers );
		
	}
	
  // on connection to server, ask for user's name with an anonymous callback
	function onConnect( message:String ):Void { //trace( 'onConnect' );
		// call the server-side function 'adduser' and send one parameter (value of prompt)
		socket.emit( 'adduser', untyped prompt( "What's your name?" ));
	}
	
	// listener, whenever the server emits 'updatechat', this updates the chat body
	function onUpdateChat( username:String, data:String ):Void {
		conversationNode.innerHTML += '<b>' + username + ':</b> ' + data + '<br>';
	}
  
	// listener, whenever the server emits 'updateusers', this updates the username list
	function onUpdateUsers( usernames:Array<String> ):Void {
		
		HTMLTools.empty( usersNode );
		for ( username in usernames ) {
			var userNode = Browser.document.createDivElement();
			userNode.innerHTML = username;
			usersNode.appendChild( userNode );
		}
	}
	
	function onSend( e ):Void {
		var message = data.value;
		data.value = '';
		socket.emit( 'sendchat', message );
	}
	
	function onKeyPress( e ):Void {
		if ( e.which == 13 ) {
			data.blur();
			dataSend.focus();
			onSend( e );
		}
	}
}