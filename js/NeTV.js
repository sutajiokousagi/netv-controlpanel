var mJSCore;
var mCPanel;
var cConst;
var cModel;

var o = new DOMParser();
o = o.parseFromString("<data>null</data>", "text/xml");

var keyPressedArray = new Array();

// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	window.onload function
// -------------------------------------------------------------------------------------------------
function fOnLoad()
{
	fDbg("fOnLoad()");

	// -------- remove layerX and layerY --------
    // ------------------------------------------
	keyboard_init();
	var needsRedirect = fCheckForRedirection();
	if (needsRedirect)
		return;
	
	if (cCPanel)
		mJSCore = cJSCore.fGetInstance();
	else
		window.location.reload();

	if (cCPanel)
		mCPanel = cCPanel.fGetInstance();
	else
		window.location.reload();
		
	var o = setTimeout(function() {
		mJSCore.CPANEL = mCPanel;
		mCPanel.JSCORE = mJSCore;
		mJSCore.fInit(function() { mJSCore.fStartUp(); });
		mCPanel.fInit(function() { mCPanel.fStartUp(); });
	}, 100);
	
	// TODO : make up a input textfield and kept it in focus, capture the keydown stroke within that input textfield
	// Native keyboard events
	$(document).keydown(function(event)
	{
		//~ fDbg(event.which);
		
		var keycode = event.which;
		var isRepeat = (keyPressedArray[""+keycode] == true) ? true : false;
		keyPressedArray[""+keycode] = true;
		
		//event.preventDefault();
		if (keycode == 37)			fButtonPress('left', 1, isRepeat);
		else if (keycode == 39)		fButtonPress('right', 1, isRepeat);
		else if (keycode == 38)		fButtonPress('up', 1, isRepeat);	
		else if (keycode == 40)		fButtonPress('down', 1, isRepeat);
		else if (keycode == 13)		fButtonPress('center', 1, isRepeat);
		else if (keycode == 33)		fButtonPress('cpanel', 1, isRepeat);
		else if (keycode == 34)		fButtonPress('widget', 1, isRepeat);
		return true;
	});
	
	$(document).keyup(function(event)
	{
		keyPressedArray[""+event.which] = false;
		return true;
	});


}

$(function() {

});





// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	MISC functions
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	override fDbg() function
// -------------------------------------------------------------------------------------------------
function fDbg(v)
{
	console.log("|~|" + v);
}
function fDbg2(v)
{
	console.log("|~|" + v);
}

// -------------------------------------------------------------------------------------------------
//	fLoadScript
// -------------------------------------------------------------------------------------------------
function fLoadExtJSScript(
	vFileList,
	vReturnFun
)
{
	var vUrl = vFileList.pop();
//~ fDbg("cJSCore, fLoadExtJSScript()" + vUrl);
	var script = document.createElement("script");
	
	script.type = "text/javascript";
	script.src = vUrl;
	
	script.onload = function() {
//~ fDbg2("*** fLoadScript(), loaded");
		if (vFileList.length == 0)
			vReturnFun();
		else
			fLoadExtJSScript(vFileList, vReturnFun);
	};
	
	document.getElementsByTagName("head")[0].appendChild(script);
}

// -------------------------------------------------------------------------------------------------
//	fCheckForRedirection	
// -------------------------------------------------------------------------------------------------
function fCheckForRedirection(
)
{
	// conveninent development mode
	if (location.search.indexOf("standalone") > -1)
	{
		$("#div_tempBg").hide();
		$("body").css("background-color", "#FFFFFF");
		return true;
	}
		
	// redirect if we access from remote browser
	if (location.href.indexOf("localhost") == -1 && location.href.indexOf("usr/share") == -1) {
		location.href = "./html_remoteconfig/";
		return true;
	}

	return false;
}





// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	system API functions
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	server reset - browser start, and sconnected to NeTVServer
// -------------------------------------------------------------------------------------------------
function fServerReset(
	vData		// true | false
)
{
//~ fDbg2("fServerReset(), " + vData);
	if (vData == "true" || vData == true)
		location.href = "http://localhost/";

	return true;
}

// -------------------------------------------------------------------------------------------------
//	press button on D-pad / android
// -------------------------------------------------------------------------------------------------
function fButtonPress(
	vButtonName,
	vCount,
	vOnHold
)
{
//~ fDbg("*** NeTV, fButtonPress(), " + vButtonName + ", " + vCount);

	if (vOnHold && (vButtonName == "cpanel" || vButtonName == "widget" || vButtonName == "widget" || vButtonName == "setup"))
		return true;
		
	switch (vButtonName)
	{
		case "cpanel": mJSCore.fOnSignal(cConst.SIGNAL_TOGGLE_CONTROLPANEL); break;
		case "widget": mJSCore.fOnSignal(cConst.SIGNAL_TOGGLE_WIDGETENGINE); break;
		case "left": mJSCore.fOnSignal(cConst.SIGNAL_BUTTON_LEFT); break;
		case "right": mJSCore.fOnSignal(cConst.SIGNAL_BUTTON_RIGHT); break;
		case "center": mJSCore.fOnSignal(cConst.SIGNAL_BUTTON_CENTER); break;
		case "up": mJSCore.fOnSignal(cConst.SIGNAL_BUTTON_UP); break;
		case "down": mJSCore.fOnSignal(cConst.SIGNAL_BUTTON_DOWN); break;
		
		case "setup":
			if (vCount == 3)
			{
				// fDbg("switched to demo(AP) mode");
			}
			else if (!vCount || vCount == 1)
			{	
				mCPanel.fOnSignal("signal_goto_controlpanel", ["help"], null);
			}
			break;
	}
	//~ keyboard_onRemoteControl(vButtonName, "input_username");
	return true;
}

function fWidgetMsg(
	vMessage
)
{
//~ fDbg("*** fWidgetMdgEvent(), " + vMessage);
	mJSCore.fOnSignal(cConst.SIGNAL_MESSAGE_WIDGETMSG, vMessage, null);
}


function fTickerEvents(
	vEventMessage,
	vEventTitle,
	vEventImage,
	vEventType,
	vEventLevel,
	vEventVer
)
{
//~ fDbg("*** fTickerEvents(), ");
	if (vEventType && vEventType == "foroauth")
	{
		if (vEventMessage == "false")
			fWidgetMsg("false");
		else
		{
			vEventMessage = decodeURIComponent(vEventMessage);
			fWidgetMsg(vEventMessage);
		}
		return;
	}

//~ fDbg("----- message just received ----");
//~ fDbg(vEventMessage);
//~ fDbg("----- image just received ----");
//~ fDbg(vEventImage);
vEventMessage = decodeURIComponent(vEventMessage);
vEventTitle = decodeURIComponent(vEventTitle);
vEventImage = decodeURIComponent(vEventImage);
vEventType = decodeURIComponent(vEventType);
vEventLevel = decodeURIComponent(vEventLevel);
vEventVer = decodeURIComponent(vEventVer);
//~ fDbg("----- message decoded ----");
//~ fDbg(vEventMessage);
//~ fDbg("----- image path decoded ----");
//~ fDbg(vEventImage);
	
	mJSCore.fOnSignal(cConst.SIGNAL_MESSAGE_EVENTMSG, [vEventMessage, vEventTitle, vEventImage, vEventType, vEventLevel, vEventVer], null);	
}

function fUpdateWifiSignal(
	vStatus		// int
)
{
fDbg("*** fUpdateWifiSignal(), " + vStatus);
	if (vStatus >= 75)
		mJSCore.fOnSignal(cConst.SIGNAL_UPDATE_WIFI, [3], null);
	else if (vStatus >= 50)
		mJSCore.fOnSignal(cConst.SIGNAL_UPDATE_WIFI, [2], null);
	else if (vStatus >= 25)
		mJSCore.fOnSignal(cConst.SIGNAL_UPDATE_WIFI, [1], null);
	else if (vStatus >= 0)
		mJSCore.fOnSignal(cConst.SIGNAL_UPDATE_WIFI, [0], null);
	else
		mJSCore.fOnSignal(cConst.SIGNAL_UPDATE_WIFI, [-1], null);
}

// -------------------------------------------------------------------------------------------------
//	events from HDMI/FPGA
// -------------------------------------------------------------------------------------------------
function fHDMIEvents( vEventName )
{
	//To be decided
	if (vEventName == "unsupported");
	if (vEventName == "attach");
	if (vEventName == "detach");
	if (vEventName == "trigger");
}

// -------------------------------------------------------------------------------------------------
//	events from DBus/NetworkManager
// -------------------------------------------------------------------------------------------------
function fNMStateChanged( vEventName )
{
	switch (vEventName)
	{
		case "unknown":			break;
		case "sleeping":		break;
		case "connecting":		break;
		case "disconnected":	mCPanel.fOnSignal(cConst.SIGNAL_NETWORKEVENT_DISCONNECTED); break;
		case "connected":		break;
	}
}

function fNMDeviceAdded(  )
{
	//Switching back FROM Access Point mode
}

function fNMDeviceRemoved(  )
{
	//Switching TO Access Point mode
}

// -------------------------------------------------------------------------------------------------
//	events from system update machanism
// -------------------------------------------------------------------------------------------------
function fUPDATECOUNTEvent( newPackageCount )
{
	fDbg("-------------------------------------------");
	fDbg("Downloading " + newPackageCount + " packages....");
	fDbg("-------------------------------------------");
	
	//Show a small downloading icon here (like Android)
	
	return "ok";
}

function fUPDATEEvents( vEventName, vEventData )
{
fDbg("fUPDATEEvents: " + vEventName + "," + vEventData);
	
	if (vEventName == "starting")
	{
		var needReboot = (vEventData == "1") ? "true" : "false";
		
		fDbg("-------------------------------------------");
		fDbg("  Update Starting");
		if (needReboot == "true")		fDbg("  Reboot required");
		else							fDbg("  Reboot NOT required");
		fDbg("-------------------------------------------");
	
		//Gracefully hide everything here
		mCPanel.fOnSignal(cConst.SIGNAL_TOGGLE_WIDGETENGINE);
		// TODO: hide whatever on the screen
		// 
		
		
		//Redirect to update page after all animations are done
		var locationString = "http://localhost/html_update/index.html?dummy=0";
		if (needReboot != null && needReboot != "") 				locationString += "&reboot=" + needReboot;
		setTimeout("location.href=\"" + locationString + "\"", 1000);
	}
	else
	{
		//Let html_update handle the rest
	}
	return "ok";
}

// -------------------------------------------------------------------------------------------------
//	events from Android app
// -------------------------------------------------------------------------------------------------
function fAndroidEvents( vEventName, vEventData )
{
	//User has just started the Android app & Switch to remote control view
	if (vEventName == "changeview" && vEventData == "remote")
	{
	}
	
	//User has just started the Android app & select an unconfigured device
	if (vEventName == "changeview" && vEventData == "loading")
	{
		mCPanel.fOnSignal(cConst.SIGNAL_ANDROID_START_CONFIGURING);
	}
}

// -------------------------------------------------------------------------------------------------
//	events from iOS app (To be decided)
// -------------------------------------------------------------------------------------------------
function fIOSEvents( vEventName, vEventData )
{
	//User has just started the iOS app & Switch to remote control view
	if (vEventName == "changeview" && vEventData == "remote")
	{
	}
	
	//User has just started the iOS app & select an unconfigured device
	if (vEventName == "changeview" && vEventData == "loading")
	{
		mCPanel.fOnSignal(cConst.SIGNAL_IOS_START_CONFIGURING);
	}
}


function fCheckAlive(
)
{
	try {
		var jscore = cJSCore.fGetInstance();
		if (!jscore)
			return false;
		var jscore_alive = jscore.fOnSignal("checkalive");	
		if (!jscore_alive)
			return false;

		var cpanel = cCPanel.fGetInstance();
		if (!cpanel)
			return false;
		var cpanel_alive = cpanel.fOnSignal("checkalive");
		if (!cpanel_alive)
			return false;
	}
	catch (e) {
		return false;
	}
	return true;
}


function fMultitab(
	vOption,
	vParam,
	vTab
)
{
	//pass everything to cCPanel
	cCPanel.fGetInstance().fOnSignal("multitab", [vOption, vParam, vTab], null);
}
