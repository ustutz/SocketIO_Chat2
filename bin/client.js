(function (console, $global) { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HTMLTools = function() { };
HTMLTools.__name__ = true;
HTMLTools.empty = function(element) {
	while(element.hasChildNodes()) element.removeChild(element.lastChild);
};
var MainClient = function() {
	var doc = window.document;
	this.conversationNode = doc.getElementById("conversation");
	this.usersNode = doc.getElementById("users");
	this.dataSend = doc.getElementById("datasend");
	this.data = js_Boot.__cast(doc.getElementById("data") , HTMLInputElement);
	this.dataSend.addEventListener("click",$bind(this,this.onSend));
	this.data.addEventListener("keypress",$bind(this,this.onKeyPress));
	this.socket = new io("http://localhost:3000");
	this.socket.on("connect",$bind(this,this.onConnect));
	this.socket.on("updatechat",$bind(this,this.onUpdateChat));
	this.socket.on("updateusers",$bind(this,this.onUpdateUsers));
};
MainClient.__name__ = true;
MainClient.main = function() {
	new MainClient();
};
MainClient.prototype = {
	onConnect: function(message) {
		this.socket.emit("adduser",prompt("What's your name?"));
	}
	,onUpdateChat: function(username,data) {
		this.conversationNode.innerHTML += "<b>" + username + ":</b> " + data + "<br>";
	}
	,onUpdateUsers: function(usernames) {
		HTMLTools.empty(this.usersNode);
		var _g = 0;
		while(_g < usernames.length) {
			var username = usernames[_g];
			++_g;
			var userNode;
			var _this = window.document;
			userNode = _this.createElement("div");
			userNode.innerHTML = username;
			this.usersNode.appendChild(userNode);
		}
	}
	,onSend: function(e) {
		var message = this.data.value;
		this.data.value = "";
		this.socket.emit("sendchat",message);
	}
	,onKeyPress: function(e) {
		if(e.which == 13) {
			this.data.blur();
			this.dataSend.focus();
			this.onSend(e);
		}
	}
	,__class__: MainClient
};
Math.__name__ = true;
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
js__$Boot_HaxeError.__name__ = true;
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__cast = function(o,t) {
	if(js_Boot.__instanceof(o,t)) return o; else throw new js__$Boot_HaxeError("Cannot cast " + Std.string(o) + " to " + Std.string(t));
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var js_browser_socketio__$Client_ClientOptions_$Impl_$ = {};
js_browser_socketio__$Client_ClientOptions_$Impl_$.__name__ = true;
js_browser_socketio__$Client_ClientOptions_$Impl_$.fromT = function(val) {
	return (function($this) {
		var $r;
		var this1;
		this1 = { };
		this1["force new connection"] = val.forceNewConnection;
		this1.multiplex = val.multiplex;
		$r = this1;
		return $r;
	}(this));
};
js_browser_socketio__$Client_ClientOptions_$Impl_$.get_forceNewConnection = function(this1) {
	return this1["force new connection"];
};
js_browser_socketio__$Client_ClientOptions_$Impl_$.set_forceNewConnection = function(this1,val) {
	return this1["force new connection"] = val;
};
js_browser_socketio__$Client_ClientOptions_$Impl_$.get_multiplex = function(this1) {
	return this1.multiplex;
};
js_browser_socketio__$Client_ClientOptions_$Impl_$.set_multiplex = function(this1,val) {
	return this1.multiplex = val;
};
js_browser_socketio__$Client_ClientOptions_$Impl_$._new = function(val) {
	var this1;
	this1 = { };
	this1["force new connection"] = val.forceNewConnection;
	this1.multiplex = val.multiplex;
	return this1;
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
js_Boot.__toStr = {}.toString;
MainClient.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
