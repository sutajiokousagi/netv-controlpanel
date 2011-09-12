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
	// --------- from NeTVServer -------------------------------------
	case cConst.SIGNAL_MESSAGE_WIDGETMSG:
		this.CPANEL.fOnSignal(vSignal, vData, vReturnFun);
		break;
		
	case "checkalive":
		return true;
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
		{
			vThis.CPANEL.fOnSignal(cConst.SIGNAL_STARTUP_ENVIRONMENTALCHECK_FAILED);
		}
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
	cAccountModule.fGetInstance().fCheckAccount(function() {
		cChannelModule.fGetInstance().fFetchChannelInfo(function() {
			if (vReturnFun)
				vReturnFun(vData);
				
			// all DONE!!! START!!!!!
			vThis.CPANEL.fOnSignal(cConst.SIGNAL_STARTUP_COMPLETE);
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
