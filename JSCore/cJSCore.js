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
	"./JSCore/cWidgetModule.js",
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
	
	if (location.href.indexOf("localhost") == -1)
		if (location.href.indexOf("usr/share") == -1)
			if (location.href.indexOf("index_autotest.html") == -1)
				location.href = "html_remote.html";
	
	// members
	
	// javascript classes
	this.mStartupModule = null;
	this.mTimerModuel = null;
	this.mAccountModule = null;
	this.mChannelModule = null;
	this.mWidgetModule = null;
	this.mModel = null;
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
fDbg("*** cJSCore, fOnSignal(), " + vSignal + ", " + vData);
	switch (vSignal)
	{
	case cConst.SIGNAL_HEARTBEAT:
		this.CPANEL.fOnSignal(vSignal, vData, vReturnFun);
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
fDbg2("*** cJSCore, fInit()");
	
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
	this.mModel = cModel.fGetInstance();
	this.mStartupModule = cStartupModule.fGetInstance();
	this.mTimerModule = cTimerModule.fGetInstance();
	this.mAccountModule = cAccountModule.fGetInstance();
	this.mChannelModule = cChannelModule.fGetInstance();
	this.mWidgetModule = cWidgetModule.fGetInstance();
	cXAPI.fGetInstance();
	cDevice.fGetInstance();
	
	// force write over GUID and URLs
	this.mModel.SERVER_URL = cJSCore.kSimulatedData.mServerUrl;						// set serverUrl
	this.mModel.LOCALBRIDGE_URL = cJSCore.kSimulatedData.mLocalBridgeUrl;			// set local hardware bridge server
}

// -------------------------------------------------------------------------------------------------
//	fStartUp
// -------------------------------------------------------------------------------------------------
cJSCore.prototype.fStartUp = function(
	vReturnFun
)
{
fDbg2("*** cJSCore, fStartUp()");
	var o;
	
	this.CPANEL.fOnSignal(cConst.SIGNAL_STARTUP_INIT);
	
	// start up tasks
	this.mStartupModule.fPrepareSystem();
	this.mStartupModule.fEnvironmentalCheck(function(vData) {
		if (vData)
		{
			// TODO
			//	convert this to a singal >> CPANEL - upon bootup, perfect condition
			cProxy.fCPanelInfoPanelUpdate();
			$("#div_startup").hide();
			

			// cast some fake data for testing
			if (!cJSCore.kProductionMode)
				cJSCore.instance.fSimulateTestingData();
			
			// load profile/channel data from server
			cProxy.fCPanelMsgBoardDisplay("Authorization in progress...");
			cAccountModule.fGetInstance().fFetchAccountInfo(function() {
				cProxy.fCPanelMsgBoardDisplay("Fetching Channel Info...");
				cChannelModule.fGetInstance().fFetchChannelInfo(function() {
					cJSCore.instance.fStartUpReturn();
					if (vReturnFun)
						vReturnFun(vData);
				});
			});
			return;
		}
		else
		{
			// TODO
			//	convert this to a singal >> CPANEL - upon bootup, no network
			// display info SCP
			cProxy.fCPanelInfoPanelUpdate();
			cProxy.fCPanelInfoPanelShow();
		}
	});
}

cJSCore.prototype.fStartUpReturn = function(
	vData
)
{
fDbg("*** cJSCore, fStartUpReturn()");

	// everything done!!! START!!!
	this.CPANEL.fOnSignal(cConst.SIGNAL_STARTUP_COMPLETE);
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
	else
	{
		
	}
}
