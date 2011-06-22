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
}

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cJSCore(
)
{
	// CONNECTION LINKS
	this.CPANEL = null;

	
	// members
	this.mJSClassList = [
		"./JSCore/cConst.js",
		"./JSCore/json2.js",
		"./JSCore/cStartupModule.js",
		"./JSCore/cTimerModule.js",
		"./JSCore/cChannelModule.js",
		"./JSCore/cChannelObj.js",
		"./JSCore/cWidgetModule.js",
		"./JSCore/cWidgetObj.js",
		"./JSCore/cProxy.js",
		"./JSCore/cModel.js"];
	this.mCallBackList = [];

	// javascript classes
	this.mStartupModule = null;
	this.mTimerModuel = null;
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
//	fInit
// -------------------------------------------------------------------------------------------------
cJSCore.prototype.fInit = function(
	vCompleteFun
)
{
fDbg("*** cJSCore, fInit()");
	// load other js classes
	this.fLoadExtJSList(vCompleteFun);
}

cJSCore.prototype.fInitReturn = function(
)
{
	
}

// -------------------------------------------------------------------------------------------------
//	fLoadExtJSList
// -------------------------------------------------------------------------------------------------
cJSCore.prototype.fLoadExtJSList = function(
	vCompleteFun
)
{
	if (cJSCore.instance.mJSClassList.length == 1)
		cJSCore.instance.fLoadScript(cJSCore.instance.mJSClassList.pop(), vCompleteFun);
	else
		cJSCore.instance.fLoadScript(cJSCore.instance.mJSClassList.pop(), cJSCore.instance.fLoadExtJSList, vCompleteFun);
}

// -------------------------------------------------------------------------------------------------
//	fLoadScript
// -------------------------------------------------------------------------------------------------
cJSCore.prototype.fLoadScript = function(
	url,
	callback,
	vCompleteFun
)
{	
	var script = document.createElement("script")
	script.type = "text/javascript";
	script.onload = function(){
//fDbg("*** cJSCore, fLoadScript(), loaded");
		callback(vCompleteFun);
	};
	script.src = url;
	document.getElementsByTagName("head")[0].appendChild(script);
//fDbg("*** cJSCore, fLoadScript(), loading " + url);

}

// -------------------------------------------------------------------------------------------------
//	fStartUp
// -------------------------------------------------------------------------------------------------
cJSCore.prototype.fStartUp = function(
)
{
fDbg("*** cJSCore, fStartUp()");
	// init loaded classes
	this.mModel = cModel.fGetInstance();
	this.mStartupModule = cStartupModule.fGetInstance();
	this.mTimerModule = cTimerModule.fGetInstance();
	this.mTimerModule.fInit();
	this.mChannelModule = cChannelModule.fGetInstance();
	this.mWidgetModule = cWidgetModule.fGetInstance();

	// simulation for local testing
	if (!cJSCore.kProductionMode)
	{
		this.mModel.CHUMBY_GUID = cJSCore.kSimulatedData.mGUID;							// set GUID
		this.mModel.SERVER_URL = cJSCore.kSimulatedData.mServerUrl;						// set serverUrl
		this.mModel.LOCALBRIDGE_URL = cJSCore.kSimulatedData.mLocalBridgeUrl;			// set local hardware bridge server
	}
	else
	{

	}
	
	// check if has GUID, server add
	if (this.mModel.CHUMBY_GUID && this.mModel.SERVER_URL && this.mModel.LOCALBRIDGE_URL)
	{
		cProxy.xmlhttpPost("", "post", {cmd: "GetXML", data: "<value>" + this.mModel.SERVER_URL + "?id=" + this.mModel.CHUMBY_GUID + "&nocache=4682&dcid_skin=0000" + "</value>"}, this.fStartUpReturn);
		//~ cProxy.xmlhttpPost("http://www.chumby.com/xml/chumbies/" + this.mModel.CHUMBY_GUID, "get", null, this.fStartUpReturn);
	}
	
cProxy.xmlhttpPost("", "post", {cmd : "ControlPanel", data : "<value>Maximize</value>"}, function() {});
cProxy.xmlhttpPost("", "post", {cmd : "WidgetEngine", data : "<value>Minimize</value>"}, function() {});
cProxy.xmlhttpPost("", "post", {cmd: "SetChromaKey", data: "<value>240,0,240</value>"}, function() {})
cProxy.xmlhttpPost("", "post", {cmd : "SetWidgetSize", data : "<value>0 0 1279 719</value>"}, function() {});
//cProxy.xmlhttpPost("", "post", {cmd : "SetWidgetSize", data : "<value>240 60 800 600</value>"}, function() {});
//cProxy.xmlhttpPost("", "post", {cmd : "SetWidgetSize", data : "<value>" + ((vViewPortSize[0] - 800) / 2) + " " + ((vViewPortSize[1] - 600)) / 2 + " 800 600</value>"}, function() {});

	cProxy.fCPanelMsgBoardDisplay("Athorization in progress...");
}

cJSCore.prototype.fStartUpReturn = function(
	vData
)
{
fDbg("*** cJSCore, fStartUpReturn()");
	vData = vData.split("<data><value>")[1].split("</value></data>")[0];
	var parser = new DOMParser();
	var xmlDoc = parser.parseFromString(vData, "text/xml");

	cJSCore.instance.mModel.CHUMBY_NAME = xmlDoc.getElementsByTagName("name")[0].textContent;
	cJSCore.instance.mModel.PROFILE_HREF = xmlDoc.getElementsByTagName("profile")[0].getAttribute("href");
	cJSCore.instance.mModel.PROFILE_NAME = xmlDoc.getElementsByTagName("profile")[0].getAttribute("name");
	cJSCore.instance.mModel.PROFILE_ID = xmlDoc.getElementsByTagName("profile")[0].getAttribute("id");
	cJSCore.instance.mModel.USER_NAME = xmlDoc.getElementsByTagName("user")[0].getAttribute("username");


	//cProxy.xmlhttpPost("", "post", {cmd : "ControlPanel", data : "<value>Maximize</value>"}, function() { });
	//cProxy.xmlhttpPost("", "post", {cmd : "WidgetEngine", data : "<value>Restart</value>"}, cCPanel.instance.fShowFLASHWidgetEngineReturn);
	//return;

	// proceed to fGetChannelInfo();
	cJSCore.instance.fGetChannelInfo();
}

// -------------------------------------------------------------------------------------------------
//	fGetChannelInfo
// -------------------------------------------------------------------------------------------------
cJSCore.prototype.fGetChannelInfo = function(
)
{
fDbg("*** cJSCore, fGetChannelInfo()");
	
	if (cJSCore.instance.mModel.PROFILE_ID)
		cProxy.xmlhttpPost("", "post", {cmd : "GetXML", data : "<value>" + "http://xml.chumby.com/xml/profiles/" + cJSCore.instance.mModel.PROFILE_ID + "</value>"}, cJSCore.instance.fGetChannelInfoReturn);
		//~ cProxy.xmlhttpPost("http://192.168.1.210/projects/0009.chumbyJSCore/test.php", "get", null, cJSCore.instance.fGetChannelInfoReturn);

	cProxy.fCPanelMsgBoardDisplay("Fetching Channel Info...");
}

cJSCore.prototype.fGetChannelInfoReturn = function(
	vData
)
{
fDbg("*** cJSCore, fGetChannelInfoReturn()");
	vData = vData.split("<data><value>")[1].split("</value></data>")[0];
	//alert(vData);
	
	var o;
	o = new cChannelObj(vData);
	cModel.fGetInstance().CHANNEL_LIST.push(o);
	
	// show and play widget
	//~ cJSCore.instance.fPlayWidget("http://www.chumby.com/" + o.mWidgetList[0].mHref);
	cJSCore.instance.CPANEL.fOnSignal(cConst.SIGNAL_WIDGETENGINE_SHOW, null, null);

	// show channel div
	//cJSCore.instance.CPANEL.fOnSignal(cConst.SIGNAL_CHANNELDIV_SHOW, null, null);
}

// -------------------------------------------------------------------------------------------------
//	fPlayWidget
// -------------------------------------------------------------------------------------------------
cJSCore.prototype.fPlayWidget = function(
	vWidgetPath
)
{
	cProxy.fCPanelMsgBoardDisplay("Playing Widget...");

	cJSCore.instance.CPANEL.fPlayWidget(vWidgetPath);
}

// -------------------------------------------------------------------------------------------------
//	fDbg
// -------------------------------------------------------------------------------------------------
function fDbg(
	v
)
{
	//alert(v);
}
