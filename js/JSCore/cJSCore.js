// -------------------------------------------------------------------------------------------------
//	cJSCore class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	static members
// -------------------------------------------------------------------------------------------------
cJSCore.kProductionMode = false;
cJSCore.kSimulatedData = {
	mGUID : "A620123B-1F0E-B7CB-0E11-921ADB7BE22A",			// the black chumbyR
	//~ mGUID : "84436234-0E47-3AB6-A0C9-95897F243B32",			// the white chumbyR
	//~ mGUID : "4E3C1363-37B2-5FAA-18A5-D391239A526B",			// testing for torin's NeTV board
	mServerUrl : "http://xml.chumby.com/xml/chumbies/",
	//~ mLocalBridgeUrl : "http://192.168.1.210/projects/0009.chumbyJSCore/server.php"			// testing/development mode at 192.168.1.210
	mLocalBridgeUrl : "./bridge"			// production mode
};
cJSCore.kPluginClassList = [
	// ".js/JSCore/json2.js",
	"./js/JSCore/cConst.js",
	"./js/JSCore/cModel.js",
	"./js/JSCore/cProxy.js",
	"./js/JSCore/cTimerModule.js",

	"./js/JSCore/cStartupModule.js",
	"./js/JSCore/cAccountModule.js",
	"./js/JSCore/cChannelModule.js",
	"./js/JSCore/cChannelObj.js",
	"./js/JSCore/cWidgetObj.js",

	"./js/JSCore/XAPI/cXAPI.js",
	"./js/JSCore/XAPI/cDevice.js",
	"./js/JSCore/XAPI/cProfile.js",
	"./js/JSCore/XAPI/cWidgetInstance.js",
	"./js/JSCore/util/cGUID.js",
	"./js/JSCore/util/cMD5.js"
];

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cJSCore(
)
{
	// CONNECTION LINKS
	this.CPANEL = null;
	
	this.mFullyLoaded = false;
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cJSCore.instance = null;
cJSCore.fGetInstance = function(
)
{
	return cJSCore.instance ? cJSCore.instance : (cJSCore.instance = new cJSCore());
}

// -------------------------------------------------------------------------------------------------
//	fOnSignal
// -------------------------------------------------------------------------------------------------
cJSCore.prototype.fOnSignal = function(
	vSignal,		// string
	vData,			// data array
	vReturnFun		// return function call
)
{
//~ fDbg("*** cJSCore, fOnSignal(), " + vSignal + ", " + vData);
	var vThis;
	vThis = this;
	
	switch (vSignal)
	{
	case cConst.SIGNAL_TOGGLE_CONTROLPANEL:
	case cConst.SIGNAL_TOGGLE_WIDGETENGINE:
	case cConst.SIGNAL_BUTTON_LEFT:
	case cConst.SIGNAL_BUTTON_RIGHT:
	case cConst.SIGNAL_BUTTON_CENTER:
	case cConst.SIGNAL_BUTTON_UP:
	case cConst.SIGNAL_BUTTON_DOWN:
	case cConst.SIGNAL_BUTTON_SETUP:
		if (vSignal == cConst.SIGNAL_TOGGLE_CONTROLPANEL || vSignal == cConst.SIGNAL_TOGGLE_WIDGETENGINE)
			if (cModel.fGetInstance().CHUMBY_INTERNET == "false")					// redirect to html_config.html
			{
				location.href = "./html_config/";
				return;
			}
		this.CPANEL.fOnSignal(vSignal, vData, vReturnFun);
		break;
	}

	switch (vSignal)
	{
	// --------- from NeTVServer -------------------------------------
	case cConst.SIGNAL_MESSAGE_EVENTMSG:
		this.CPANEL.fOnSignal(vSignal, vData, vReturnFun);
		break;
	case cConst.SIGNAL_MESSAGE_WIDGETMSG:
		this.CPANEL.fOnSignal(vSignal, vData, vReturnFun);
		break;
		
	case "checkalive":
		return true;
		break;
		
	case cConst.SIGNAL_UPDATE_WIFI:
		this.CPANEL.fOnSignal(vSignal, vData, vReturnFun);
		break;

	// --------- from jscore -----------------------------------------
	case cConst.SIGNAL_HEARTBEAT:
		this.CPANEL.fOnSignal(vSignal, vData, vReturnFun);
		break;
	
	case cConst.SIGNAL_STARTUP_AUTHORIZATION_FAIL:
		this.CPANEL.fOnSignal(vSignal, vData, vReturnFun);
		break;

	// --------- from subpanel ---------------------------------------
	case cConst.SIGNAL_ACTIVATE:
		cAccountModule.fGetInstance().fDoActivate(vData[0], vData[1], vData[2], function(vData) { vReturnFun(vData); });
		//~ cAccountModule.fGetInstance().fDoActivate("demosg", "ddddd", "NeTV Device", function(vData) { vReturnFun(vData); });
		break;
	case cConst.SIGNAL_DEACTIVATE:
		cAccountModule.fGetInstance().fDoDeActivate(function(vData) {
			if (vData == "true" || vData == true)
			{
				cModel.fGetInstance().CHANNEL_LIST.splice(1, 100);
			}
			else
			{

			}
			vReturnFun(vData);
		});
		break;
	}
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cJSCore.prototype.fInit = function(
	vReturnFun
)
{
fDbg("*** cJSCore, fInit()");
	
	// load other js classes
	fLoadExtJSScript(cJSCore.kPluginClassList, function(vData) {
		cJSCore.fGetInstance().fInitReturn(vData);
		if (vReturnFun)
			vReturnFun(vData);
	});
}

cJSCore.prototype.fInitReturn = function(
)
{
	// init loaded classes
	cModel.fGetInstance();
	cStartupModule.fGetInstance();
	cTimerModule.fGetInstance();
	cAccountModule.fGetInstance();
	cChannelModule.fGetInstance();
	cXAPI.fGetInstance();
	cDevice.fGetInstance();
	cWidgetInstance.fGetInstance();
	
	// force write over GUID and URLs
	cModel.fGetInstance().SERVER_URL = cJSCore.kSimulatedData.mServerUrl;					// set serverUrl
	cModel.fGetInstance().LOCALBRIDGE_URL = cJSCore.kSimulatedData.mLocalBridgeUrl;			// set local hardware bridge server
}

// -------------------------------------------------------------------------------------------------
//	fStartUp
// -------------------------------------------------------------------------------------------------
cJSCore.prototype.fStartUp = function(
	vReturnFun
)
{
fDbg("*** cJSCore, fStartUp()---------------------");
	var vThis;
	vThis = this;
	
	// start up tasks
	cStartupModule.fGetInstance().fPrepareSystem();
	cStartupModule.fGetInstance().fEnvironmentalCheck(function(vData) {
		if (vData)
		{
			vThis.fUpdateDeviceToServer();
			vThis.CPANEL.fOnSignal(cConst.SIGNAL_STARTUP_ENVIRONMENTALCHECK_COMPLETE);
			
			// cast some fake data for testing
			if (!cJSCore.kProductionMode)
				vThis.fSimulateTestingData();
			vThis.fStartUpReturn(vReturnFun);
		}
		else
		{
			cCPanel.fGetInstance().mLocked = false;
			cCPanel.fGetInstance().mGearBtnLocked = false;
			vThis.CPANEL.fOnSignal(cConst.SIGNAL_STARTUP_ENVIRONMENTALCHECK_FAILED);
		}
	});
	vThis.mFullyLoaded = true;
}

cJSCore.prototype.fStartUpReturn = function(
	vReturnFun
)
{
fDbg("*** cJSCore, fStartUpReturn()");
	var vThis;
	vThis = this;
	
	// load profile/channel data from server
	cAccountModule.fGetInstance().fCheckAccount(function() {
		cChannelModule.fGetInstance().fFetchChannelInfo(function() {
			fDbg("now we have " + cModel.fGetInstance().CHANNEL_LIST.length + " channels.");
			fDbg("start fetching channel list by user ID.");
			
			// here we have the user_id, therefore we proceed to fetch the ID of this user's other channels
			cChannelModule.fGetInstance().fFetchChannelListByUserID(function(vData) {
				fDbg("*** fetching channel list (by user ID) complete... ...");
				if (vReturnFun)
					vReturnFun(vData);
					
				// all DONE!!! START!!!!!
				//~ fDbg("all done");
				cCPanel.fGetInstance().mLocked = false;
				cCPanel.fGetInstance().mGearBtnLocked = false;
				vThis.CPANEL.fOnSignal(cConst.SIGNAL_STARTUP_COMPLETE);
			});
			
		});
	});
	return;
}

// -------------------------------------------------------------------------------------------------
//	fSimulateTestingData
// -------------------------------------------------------------------------------------------------
cJSCore.prototype.fSimulateTestingData = function(
)
{
	return;
	
	// force write over GUID and URLs
	if (!cJSCore.kProductionMode)
	{
		cModel.instance.CHUMBY_GUID = cJSCore.kSimulatedData.mGUID;							// set GUID
	}
}

// -------------------------------------------------------------------------------------------------
//	fUpdateDeviceToServer
// -------------------------------------------------------------------------------------------------
cJSCore.prototype.startUpdateDeviceToServer = function(
)
{
	var min1020 = Math.round(10 + Math.random() * 10.0) * 60000;		//10 to 20 minutes
	setTimeout('this.fUpdateDeviceToServer', min1020);
	fDbg("Checking in with stats server in " + Math.round(min1020/60000) + "minutes");
}

cJSCore.prototype.fUpdateDeviceToServer = function(
)
{
	// report this device to statistic server
	var model = cModel.fGetInstance();
	var devInfo = new Array();
	devInfo['guid'] = model.CHUMBY_GUID;
	devInfo['hwver'] = model.CHUMBY_HWVERSION;
	devInfo['fwver'] = model.CHUMBY_FWVERSION;
	devInfo['mac'] = model.CHUMBY_MAC_ADDRESS;
	devInfo['local_ip'] = model.CHUMBY_NETWORK_IP;
	
	cProxy.fUpdateDeviceToServer(devInfo, function(responseText)
	{
		if (responseText != null && responseText.length > 10)
			responseText = responseText.split("<value>")[1].split("</value>")[0];
		var json = eval('(' + responseText + ')')[0];
		var status = json['ws_status'];
		
		if (status != null && status != "" && status.toLowerCase() == "yes") {
			fDbg("Successfully report to stats server");
		}
		else {
			fDbg("+++++++++++++++++++++++++++++++++++++++++++");
			fDbg("Failed to report to stats server: " + status);
			fDbg(responseText);
			fDbg("+++++++++++++++++++++++++++++++++++++++++++");
		}
	});
	
	// restart the update
	this.startUpdateDeviceToServer();
}






































cJSCore.fTestingFuns = function(
)
{
fDbg("*** cJSCore, fTestingFuns(), ");

	cProfile.fGetProfileListByAccountID(cModel.fGetInstance().USER_ID, function(vData) {
		fDbg(vData);

		cProfile.fGetProfileListByAccountID(cModel.fGetInstance().CHUMBY_GUID, function(vData) {
			fDbg(vData);
		});
	});

}
