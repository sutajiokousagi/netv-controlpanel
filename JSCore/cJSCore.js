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
	mGUID : "A620123B-1F0E-B7CB-0E11-921ADB7BE22A",				// the black chumbyR
	//~ mGUID : "84436234-0E47-3AB6-A0C9-95897F243B32",			// the white chumbyR
	mServerUrl : "http://xml.chumby.com/xml/chumbies/",
	//~ mLocalBridgeUrl : "http://192.168.1.210/projects/0009.chumbyJSCore/server.php"			// testing/development mode at 192.168.1.210
	mLocalBridgeUrl : "./bridge"			// production mode
};
cJSCore.kPluginClassList = [
	"./JSCore/json2.js",
	"./JSCore/cConst.js",
	"./JSCore/cProxy.js",
	"./JSCore/cStartupModule.js",
	"./JSCore/cTimerModule.js",
	"./JSCore/cAccountModule.js",
	"./JSCore/cChannelModule.js",
	"./JSCore/cChannelObj.js",
	"./JSCore/cWidgetObj.js",
	"./JSCore/cModel.js",
	"./JSCore/XAPI/cXAPI.js",
	"./JSCore/XAPI/cDevice.js",
	"./JSCore/XAPI/cProfile.js",
	"./JSCore/util/cGUID.js",
	"./JSCore/util/cMD5.js"
];

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cJSCore(
)
{
	// CONNECTION LINKS
	this.CPANEL = null;

	// redirect
	if (location.href.indexOf("localhost") == -1)
		if (location.href.indexOf("usr/share") == -1)
			if (location.href.indexOf("index_autotest.html") == -1)
				location.href = "./html_config/";
	
	// members
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
		if (vSignal != cConst.SIGNAL_BUTTON_LEFT && vSignal != cConst.SIGNAL_BUTTON_RIGHT)
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
	case "checkalive":
		return true;
		break;
		
	case cConst.SIGNAL_HEARTBEAT:
		this.CPANEL.fOnSignal(vSignal, vData, vReturnFun);
		break;

	case cConst.SIGNAL_MESSAGE_WIDGETMSG:
		this.CPANEL.fOnSignal(cConst.SIGNAL_MESSAGE_WIDGETMSG, vData, vReturnFun);
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
	
	// force write over GUID and URLs
	cModel.fGetInstance().SERVER_URL = cJSCore.kSimulatedData.mServerUrl;						// set serverUrl
	cModel.fGetInstance().LOCALBRIDGE_URL = cJSCore.kSimulatedData.mLocalBridgeUrl;			// set local hardware bridge server
}

// -------------------------------------------------------------------------------------------------
//	fStartUp
// -------------------------------------------------------------------------------------------------
cJSCore.prototype.fStartUp = function(
	vReturnFun
)
{
fDbg("*** cJSCore, fStartUp()");
	var vThis;
	vThis = this;
	
	// signal CPanel
	this.CPANEL.fOnSignal(cConst.SIGNAL_STARTUP_INIT);
	
	// start up tasks
	cStartupModule.fGetInstance().fPrepareSystem();
	cStartupModule.fGetInstance().fEnvironmentalCheck(function(vData) {
		if (vData)
		{
			vThis.CPANEL.fOnSignal(cConst.SIGNAL_STARTUP_ENVIRONMENTALCHECK_COMPLETE);
			
			// cast some fake data for testing
			if (!cJSCore.kProductionMode)
				vThis.fSimulateTestingData();
			
			vThis.fStartUpReturn(vReturnFun);
		}
		else
			vThis.CPANEL.fOnSignal(cConst.SIGNAL_STARTUP_ENVIRONMENTALCHECK_FAILED);
	});
}

cJSCore.prototype.fStartUpReturn = function(
	vReturnFun
)
{
fDbg2("*** cJSCore, fStartUpReturn()");
	var vThis;
	vThis = this;
	
	// load profile/channel data from server
	cProxy.fCPanelMsgBoardDisplay("Authorization in progress...");
	cAccountModule.fGetInstance().fFetchAccountInfo(function() {
		cProxy.fCPanelMsgBoardDisplay("Fetching Channel Info...");
		cChannelModule.fGetInstance().fFetchChannelInfo(function() {
			if (vReturnFun)
				vReturnFun(vData);
				
			// all DONE!!! START!!!!!
			vThis.CPANEL.fOnSignal(cConst.SIGNAL_STARTUP_COMPLETE);
		});
	});
	
}

// -------------------------------------------------------------------------------------------------
//	fSimulateTestingData
// -------------------------------------------------------------------------------------------------
cJSCore.prototype.fSimulateTestingData = function(
)
{
	// force write over GUID and URLs
	if (!cJSCore.kProductionMode)
	{
		cModel.instance.CHUMBY_GUID = cJSCore.kSimulatedData.mGUID;							// set GUIDfDbg2("yes!!!");
	}
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
