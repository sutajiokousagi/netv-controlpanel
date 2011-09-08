var mJSCore;
var mCPanel;
var cConst;

var o = new DOMParser();
o = o.parseFromString("<data>null</data>", "text/xml");
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	window.onload function
// -------------------------------------------------------------------------------------------------
$(function() {
	keyboard_init();
	fCheckForRedirection();
	
	if (cCPanel)
		mJSCore = cJSCore.fGetInstance();
	else
		window.location.reload();

	if (cCPanel)
		mCPanel = cCPanel.fGetInstance();
	else
		window.location.reload();
		
	mJSCore.CPANEL = mCPanel;
	mCPanel.JSCORE = mJSCore;
	mJSCore.fInit(function() { mJSCore.fStartUp(); });
	mCPanel.fInit(function() { mCPanel.fStartUp(); });
	
	$(window).keydown(function(event) {
		switch (event.which)
		{
		case 36: fButtonPress("cpanel"); break;
		case 33: fButtonPress("widget"); break;
		case 37: fButtonPress("left"); break;
		case 39: fButtonPress("right"); break;
		case 38: fButtonPress("up"); break;
		case 40: fButtonPress("down"); break;
		case 13: fButtonPress("center"); break;
		}
	});

	//~ fCheckAlive();
	// var t1 = setInterval(function(){
		// fNMStateChanged("disconnected");
	// }, 10000);
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
//~ fDbg("cJSCore, fLoadExtJSScript()");
	var vUrl = vFileList.pop();
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
	if (location.search.indexOf("standalone") > -1)
	{
		$("#div_tempBg").hide();
		$("body").css("background-color", "#FFFFFF");
		return true;
	}
		
	// redirect
	if (location.href.indexOf("localhost") == -1)
		if (location.href.indexOf("usr/share") == -1)
			if (location.href.indexOf("index_autotest.html") == -1)
				location.href = "./html_config/";
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
		location.href="http://localhost/";

	return true;
}

// -------------------------------------------------------------------------------------------------
//	press button on D-pad / android
// -------------------------------------------------------------------------------------------------
function fButtonPress(
	vButtonName,
	vCount
)
{
//~ fDbg("*** NeTV, fButtonPress(), " + vButtonName);
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
			break;
	}
	//~ keyboard_onRemoteControl(vButtonName, "input_username");
	return true;
}

function fWidgetMsgEvent(
	vEventData
)
{
//~ fDbg("*** fWidgetMdgEvent(), " + vEventData);
	mJSCore.fOnSignal(cConst.SIGNAL_MESSAGE_WIDGETMSG, vEventData, null);
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
/*
fDbg("------------------------------------------------------");
fDbg("message : " + vEventMessage.substr(0, 10));
fDbg("title   : " + vEventTitle.substr(0, 10));
fDbg("image   : " + vEventImage.substr(0, 10));
fDbg("type    : " + vEventType);
fDbg("level   : " + vEventLevel);
fDbg("------------------------------------------------------");
*/
	fDbg("------------------------------------------------------");
	fDbg(vEventMessage);
	vEventMessage = decodeURIComponent(vEventMessage);
	fDbg("------------------------------------------------------");
	fDbg(vEventMessage);
	fDbg("------------------------------------------------------");
	mJSCore.fOnSignal(cConst.SIGNAL_MESSAGE_WIDGETMSG, [vEventMessage, vEventTitle, vEventImage, vEventType, vEventLevel, vEventVer], null);	
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
	fDbg2("-------------------------------------------");
	fDbg2("Downloading " + newPackageCount + " packages....");
	fDbg2("-------------------------------------------");
	
	//Show a small downloading icon here (like Android)
	
	return "ok";
}

function fUPDATEEvents( vEventName, vEventData )
{
fDbg("fUPDATEEvents: " + vEventName + "," + vEventData);
	
	if (vEventName == "starting")
	{
		var needReboot = (vEventData == "1") ? "true" : "false";
		
		fDbg2("-------------------------------------------");
		fDbg2("  Update Starting");
		if (needReboot == "true")		fDbg2("  Reboot required");
		else							fDbg2("  Reboot NOT required");
		fDbg2("-------------------------------------------");
	
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
	var o, p;
	try {
		o = cJSCore.fGetInstance().fOnSignal("checkalive");
		
		if (!o)
			return false;

		o = cCPanel.fGetInstance().fOnSignal("checkalive");
		
		if (!o)
			return false;
		else
			return true;
	}
	catch (e) {
		return false;
	}
	return true;
}

function fSetIFrame(
	vOption,
	vData
)
{
	//pass everything to cCPanel
	cCPanel.fGetInstance().fOnSignal("setiframe", [vOption, vData], null);
}
