var mJSCore;
var mCPanel;

fDbg2("--------------------!!!!!!!!----------------------");



$(function() {
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
	
	mJSCore.fInit(function() {
		mJSCore.fStartUp();
	});
	mCPanel.fInit(function() {
		mCPanel.fStartUp();
	});

	
	$(window).keypress(function(event) {
		fDbg2("key stroke!!");
		fDbg2(event.which);
		/*
		if ( event.which == 13 ) {
			event.preventDefault();
		}
		xTriggered++;
		var msg = "Handler for .keypress() called " + xTriggered + " time(s).";
		*/
	});


	var t1 = setInterval(function(){
		//~ fNMStateChanged("disconnected");
	}, 10000);
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
	/*
	if ($("#div_dbg").length > 0)
	{
		$("#div_dbg").html($("#div_dbg").html() + "<br />" + v);
		document.getElementById("div_dbg").scrollTop = document.getElementById("div_dbg").scrollHeight;
	}
	*/
	console.log("|~|" + v);
}
function fDbg2(v)
{
	/*
	if ($("#div_dbg").length > 0)
	{
		$("#div_dbg").html($("#div_dbg").html() + "<br />" + v);
		document.getElementById("div_dbg").scrollTop = document.getElementById("div_dbg").scrollHeight;
	}
	*/
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
//~ fDbg2("*** fLoadScript(), loading " + vUrl);
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
	vButtonName
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
	}
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
	mJSCore.fOnSignal(cConst.SIGNAL_MESSAGE_WIDGETMSG, [vEventMessage, vEventTitle, vEventImage], null);	
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
