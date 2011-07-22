package
{
	import flash.events.*;
	import flash.net.*;
	import flash.utils.*;

	public class MySocket extends EventDispatcher
	{
		public static const MYSOCKET_CONNECT_EVENT:String = "onMySocketConnectEvent";
		public static const MYSOCKET_DATA_EVENT:String = "onMySocketDataEvent";
		
		//Private variables
		private var _hostName:String;
        private var _port:uint;
        private var _socket:Socket;
		private var _enableTrace:Boolean;
		
		//Auto reconnection
		private var _timer:Timer;
		private var _autoReconnect:Boolean;
		private var _autoReconnectInterval:int;
		
		//Protocol
		private var _connectionType:String;
		
		//----------------------------------------------------------------------
		//-- Initialization ----------------------------------------------------
		//----------------------------------------------------------------------
		
		public function MySocket()
		{
			_socket = null;
			_hostName = null;
			_port = 0;
			_enableTrace = false;
			
			_timer = null;
			_autoReconnect = false;
			_autoReconnectInterval = 2000;
			
			_connectionType = "widget_engine";
		}
		
		//
		// Connect to a given hostname & port
		//
		public function connect(ip:String, port:int):void
		{
			_hostName = ip;
			_port = port;
			if (!_hostName || _port == 0) {
				trace("MySocket::connect(ip,port) - Please specify an IP address & port");
				return;
			}
			justConnect();
		}
			
		private function justConnect()
		{
			if (_socket == null)
			{
				_socket = new Socket();
				_socket.addEventListener(Event.CONNECT, onSocketConnectHandler);
				_socket.addEventListener(Event.CLOSE, onSocketCloseHandler);
				_socket.addEventListener(ErrorEvent.ERROR, onSocketErrorHandler);
				_socket.addEventListener(SecurityErrorEvent.SECURITY_ERROR, onSocketSecurityErrorHandler);
				_socket.addEventListener(IOErrorEvent.IO_ERROR,onSocketIOErrorHandler);
				_socket.addEventListener(ProgressEvent.SOCKET_DATA, onSocketDataHandler);
			}
			
			try
			{
				myTrace("Connecting to " + _hostName + ":" + _port);
				_socket.connect(_hostName, _port);
			}
			catch (error:Error)
			{
				myTrace(error.message + "\n");
				if (_socket.connected)
					_socket.close();
				_socket = null;
			}
		}
		
		//
		// An abstract function to print output
		//
		private function myTrace(txt:String):void
		{
			if (_enableTrace)
            	trace(txt);
        }
		
		//
		// Return whether the socket is in connected state
		//
		public function connected():Boolean
		{
			if (_socket == null)
				return false;
			return _socket.connected;
		}
		
		//
		// Set whether this class handles automatic reconnection when there is an error or disconnection
		// Default is Enabled
		//
		public function setAutoReconnect(isEnabled:Boolean):Boolean
		{
			_autoReconnect = isEnabled;
			if (_autoReconnect && _hostName != null)
				restartTimer();
			return _autoReconnect;
		}
		
		//
		// Set re-connection duration
		// Default is 2 seconds
		//
		public function setAutoReconnectInterval(interval:int):int
		{
			_autoReconnectInterval = interval;
			return _autoReconnectInterval;
		}
		
		//
		// Enable trace from this class
		//
		public function setEnableTrace(isEnabled:Boolean):Boolean
		{
			_enableTrace = isEnabled;
			return _enableTrace;
		}
		
		//----------------------------------------------------------------------
		//-- Events ------------------------------------------------------------
		//----------------------------------------------------------------------
		
		private function onSocketConnectHandler(event:Event):void
		{
			 if (_socket.connected)
			 {
			 	myTrace("MySocket::Socket connected");
				dispatchEvent(new MyCustomEventType(MYSOCKET_CONNECT_EVENT, false,false, "Socket connected"));
				
				//Remove timer from memory
				cleanupTimer();
				
				//Send a hello message for NeTVServer to identity the type of connection
				var dict:Dictionary = new Dictionary();
				dict["type"] = _connectionType;
				dict["version"] = "1.0";
				sendCommand("Hello", dict);
			}
			else
			{
				myTrace("MySocket::Unable to connect");
				dispatchEvent(new MyCustomEventType(MYSOCKET_CONNECT_EVENT, false,false, "Unable to connect"));
				
				if (_autoReconnect)
					restartTimer();
			}
		}
 
		private function onSocketCloseHandler(event:Event):void
		{
			dispatchEvent(new MyCustomEventType(MYSOCKET_CONNECT_EVENT, false,false, "MySocket::Socket Closing"));
			myTrace("Socket Closing");
			if (_autoReconnect)
				restartTimer();
		}
 
		private function onSocketErrorHandler(event:ErrorEvent):void
		{
			dispatchEvent(new MyCustomEventType(MYSOCKET_CONNECT_EVENT, false,false, "MySocket::Socket Error"));
			myTrace("Socket Error");
			if (_autoReconnect)
				restartTimer();
		}
		
		private function onSocketSecurityErrorHandler(event:ErrorEvent):void
		{
			dispatchEvent(new MyCustomEventType(MYSOCKET_CONNECT_EVENT, false,false, "MySocket::Socket Security Error\nCheck flash policy server"));
			myTrace("Socket Security Error. Check flash policy server");
			if (_autoReconnect)
				restartTimer();
		}
 
 		private function onSocketIOErrorHandler(event:IOErrorEvent):void
		{
			dispatchEvent(new MyCustomEventType(MYSOCKET_CONNECT_EVENT, false,false, "MySocket::Socket IO Error\nIs server running?"));
			myTrace("Socket IO Error. Is server running?");
			if (_autoReconnect)
				restartTimer();
		}
		
		//----------------------------------------------------------------------
		//-- Timer -------------------------------------------------------------
		//----------------------------------------------------------------------
		
		private function cleanupTimer()
		{
			if (_timer == null)
				return;
			
			_timer.stop();
			_timer.removeEventListener(TimerEvent.TIMER, onTimerExpire);
			_timer = null;
		}
		
		private function restartTimer()
		{
			if (_timer == null)
			{
				_timer = new Timer(_autoReconnectInterval, 1);
				_timer.addEventListener(TimerEvent.TIMER, onTimerExpire);
			}
			_timer.stop();
			_timer.start();
		}
		
		private function onTimerExpire(event:TimerEvent):void
		{
			_timer.stop();
			if (!_autoReconnect)				cleanupTimer();
			else								justConnect();
		}
		
		//----------------------------------------------------------------------
		//-- Transmitting ------------------------------------------------------
		//----------------------------------------------------------------------
		
		//
		// Directly send a XML string to the socket
		//
		private function sendXmlString(xmlString:String):Boolean
		{
			if (_socket == null || !_socket.connected)
				return false;
				
			_socket.writeMultiByte(xmlString, "iso-8859-1");
			_socket.flush();
			return true;
		}
		
		//
		// Construct a XML string from Dictionary and send to socket
		//
		public function sendDictionary(dict:Dictionary):Boolean
		{
			//Format is similar to this https://internal.chumby.com/wiki/index.php/JavaScript/HTML_-_Hardware_Bridge_protocol
    		//Example: <xml><cmd>PlayWidget</cmd><data><value>1234567890</value></data></xml>

			//Needs to be wrapped in a root element
			var xmlString:String = "<xml>";
			
			//Print 'cmd' or 'status' first
			if (dict["cmd"] != null)
				xmlString += "<cmd>" + dict["cmd"].toString() + "</cmd>";
			if (dict["status"] != null)
				xmlString += "<status>" + dict["status"].toString() + "</status>";
			delete dict["cmd"];
			delete dict["status"];
			
			//Follow by 'data'
			xmlString += "<data>";
			if (countKeys(dict) > 1)
			{
				for (var k:Object in dict) 
			  		xmlString += "<" + String(k) + ">" + dict[k].toString() + "</" + String(k) + ">";
			}
			else
			{
				for (var t:Object in dict) 
			  		xmlString += "<value>" + dict[t].toString() + "</value>";
			}
			
			xmlString += "</data></xml>";
			myTrace(xmlString);
			return sendXmlString(xmlString);
		}
		
		public function sendCommand(commandName:String, dict:Dictionary):Boolean
		{
			dict["cmd"] = commandName;
			return sendDictionary(dict);
		}
		
		private function countKeys(myDictionary:Dictionary):int 
		{
			var n:int = 0;
			for (var key:* in myDictionary)
				n++;
			return n;
		}
		
		//----------------------------------------------------------------------
		//-- High-level Transmitting Utilities ---------------------------------
		//----------------------------------------------------------------------
		
		public function sendSimpleCommand(commandName:String, commandValue:String)
		{
			var dict:Dictionary = new Dictionary();
			dict["value"] = commandValue;
			return sendCommand(commandName, dict);
		}
		
		public function executeJavaScript(javascriptString:String)
		{
			return sendSimpleCommand("JavaScript", javascriptString);
		}
		
		public function setCooperative(isCooperative:Boolean)
		{
			return executeJavaScript("fSetCooperative(" + isCooperative ? "true);" : "false);");
		}
		
		public function sendEmail(toAddress:String, body:String)
		{
			return executeJavaScript("fSendEmail(" + toAddress + "," + body + ");");
		}
		
		public function sendNotification(iconURL:String, title:String, body:String)
		{
			return executeJavaScript("fAddNotification(" + iconURL + "," + title + "," + body + ");");
		}
		
		//----------------------------------------------------------------------
		//-- Process receiving data --------------------------------------------
		//----------------------------------------------------------------------
			
		//
		// Receiving new data from socket
		//
		private function onSocketDataHandler(event:ProgressEvent):void
		{
			var bytesAvailable:uint = _socket.bytesAvailable;
			var str:String = _socket.readUTFBytes(bytesAvailable);
			var myXML:XML = new XML(str);
			
			if (_enableTrace)
				trace(str);
			
			//Parse and store in a dictionary
			//http://livedocs.adobe.com/flash/9.0/ActionScriptLangRefV3/flash/utils/Dictionary.html
			var dict:Dictionary = new Dictionary();
			
			for (var i:int = 0; i<myXML.children().length(); i++)
			{
				var key:String = myXML.children()[i].name();
				var val:String = myXML.children()[i].toString();
				
				if (key != "data")
				{
					dict[key] = val;
				}
				else
				{
					for (var j:int = 0; j<myXML.children()[i].children().length(); j++)
					{
						var subkey:String = myXML.children()[i].children()[j].name();
						var subval:String = myXML.children()[i].children()[j].toString();
						dict[subkey] = subval;
					}
				}
			}

			//Raise an event to event listeners
			dispatchEvent(new MyCustomEventType(MYSOCKET_DATA_EVENT, false,false, dict));
        }		
	}
}
