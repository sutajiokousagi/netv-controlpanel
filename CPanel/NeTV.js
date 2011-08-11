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
fDbg2("fServerReset(), " + vData);
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
	switch (vButtonName)
	{
		case "cpanel": mCPanel.fOnSignal(cConst.SIGNAL_TOGGLE_CONTROLPANEL); break;
		case "widget": mCPanel.fOnSignal(cConst.SIGNAL_TOGGLE_WIDGETENGINE); break;
		case "left": mCPanel.fOnSignal(cConst.SIGNAL_BUTTON_LEFT); break;
		case "right": mCPanel.fOnSignal(cConst.SIGNAL_BUTTON_RIGHT); break;
		case "center": mCPanel.fOnSignal(cConst.SIGNAL_BUTTON_CENTER); break;
		case "up": mCPanel.fOnSignal(cConst.SIGNAL_BUTTON_UP); break;
		case "down": mCPanel.fOnSignal(cConst.SIGNAL_BUTTON_DOWN); break;
	}
	return true;
}

function fWidgetMsgEvent(
	vEventData
)
{
fDbg("*** fWidgetMdgEvent(), " + vEventData);
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
//	events from system
// -------------------------------------------------------------------------------------------------
function fUPDATECOUNTEvent( newPackageCount )
{
	fDbg2("-------------------------------------------");
	fDbg2("Downloading " + newPackageCount + " packages....");
	fDbg2("-------------------------------------------");
}

function fUPDATEREADYEvent( vEventData )
{
	var newPackageCount = vEventData.split(" ")[0];
	var needReboot = vEventData.split(" ")[1];
	needReboot = (needReboot == "1") ? true : false;
	
	fDbg2("-------------------------------------------");
	fDbg2("  Update Ready (" + newPackageCount + " packages)");
	if (needReboot)		fDbg2("  Reboot required");
	else				fDbg2("  Reboot NOT required");
	fDbg2("-------------------------------------------");
	
	//Immediately redirect to update page
	location.href="http://localhost/html_update/index.html";
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
//	events from Android app
// -------------------------------------------------------------------------------------------------
function fAndroidEvents( vEventName, vEventData )
{
	//User has just started the Android app & Switch to remote control view
	if (vEventName == "changeview" && vEventData == "remote")
	{
	}
}