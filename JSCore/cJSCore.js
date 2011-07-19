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

	if (location.href.indexOf("localhost") == -1)
		if (location.href.indexOf("usr/share") == -1)
			location.href = "test.html";
	
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
	fLoadExtJSScript(this.mJSClassList, vCompleteFun);
}

cJSCore.prototype.fInitReturn = function(
)
{
	
}

// -------------------------------------------------------------------------------------------------
//	fStartUp
// -------------------------------------------------------------------------------------------------
cJSCore.prototype.fStartUp = function(
	vReturnFun
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

	// force write over GUID and URLs
	this.mModel.SERVER_URL = cJSCore.kSimulatedData.mServerUrl;						// set serverUrl
	this.mModel.LOCALBRIDGE_URL = cJSCore.kSimulatedData.mLocalBridgeUrl;			// set local hardware bridge server


// do necessary with NeTVBrowser and FlashPlayer, ChromaKey	
cProxy.xmlhttpPost("", "post", {cmd : "SetBox", data : "<value>0 0 1279 703</value>"}, function() {});
//cProxy.xmlhttpPost("", "post", {cmd : "ControlPanel", data : "<value>Maximize</value>"}, function() {});
cProxy.xmlhttpPost("", "post", {cmd : "WidgetEngine", data : "<value>Hide</value>"}, function() {});
cProxy.xmlhttpPost("", "post", {cmd : "SetChromaKey", data : "<value>240,0,240</value>"}, function() {});

	var fun1 = function() {
		
		var vInterval = setInterval(function() {
			$("#div_tempBg").show();
			if ($("#div_tempBg").css("left") == "-50px")
				$("#div_tempBg").css("left", "-40px");
			else
			{
				$("#div_tempBg").hide();
				$("#div_tempBg").css("left", "-50px");
			}
		}, 2000);
			
		
		cProxy.xmlhttpPost("", "post", {cmd : "InitialHello", data: ""}, function(vData) {
			//fDbg2(vData);
			
			var o;
			o = cModel.fGetInstance();
			
			if (vData.split("</status>")[0].split("<status>")[1] == "1")
			{
				o.CHUMBY_GUID = vData.split("</guid>")[0].split("<guid>")[1];
				o.CHUMBY_DCID = vData.split("</dcid>")[0].split("<dcid>")[1];
				o.CHUMBY_HWVERSION = vData.split("</hwver>")[0].split("<hwver>")[1];
				o.CHUMBY_FWVERSION = vData.split("</fwver>")[0].split("<fwver>")[1];
				o.CHUMBY_FLASHPLUGIN = vData.split("</flashplugin>")[0].split("<flashplugin>")[1];
				o.CHUMBY_FLASHPLAYER = vData.split("</flashver>")[0].split("<flashver>")[1];
				o.CHUMBY_NETWORK_MAC = vData.split("</mac>")[0].split("<mac>")[1];
				o.CHUMBY_INTERNET = vData.split("</internet>")[0].split("<internet>")[1];
				
				cProxy.fCPanelInfoPanelUpdate();

				
				if (vData.split("</internet>")[0].split("<internet>")[1] != "true")
				{
					// has no network
					fDbg2("sadly... has no network....");
					// display info SCP
					cProxy.fCPanelInfoPanelShow();
					return;
				}
				else
				{
					// has network
					o.CHUMBY_NETWORK_IF = vData.split("if=\"")[1].split("\"")[0];
					o.CHUMBY_NETWORK_UP = vData.split("up=\"")[1].split("\"")[0];
					o.CHUMBY_NETWORK_IP = vData.split("ip=\"")[1].split("\"")[0];
					o.CHUMBY_NETWORK_BROADCAST = vData.split("broadcast=\"")[1].split("\"")[0];
					o.CHUMBY_NETWORK_NETMASK = vData.split("netmask=\"")[1].split("\"")[0];
					o.CHUMBY_NETWORK_GATEWAY = vData.split("gateway=\"")[1].split("\"")[0];
					o.CHUMBY_NETWORK_NAMESERVER1 = vData.split("nameserver1=\"")[1].split("\"")[0];

					
					$("#div_info_ip").html(o.CHUMBY_NETWORK_IP);

					clearInterval(vInterval);
					$("#div_startup").hide();
					
					// display info SCP
					//~ o.CHUMBY_NETWORK_UP = "";
					//~ cProxy.fCPanelInfoPanelShow();
					//~ return;
					
				}	
			}
			else
			{
				fDbg2("Hello failed.");
				// display info SCP
			}
			
			// force write over GUID and URLs
			if (!cJSCore.kProductionMode)
			{
				cModel.instance.CHUMBY_GUID = cJSCore.kSimulatedData.mGUID;							// set GUIDfDbg2("yes!!!");
			}
			else
			{
				
			}
			
			cProxy.fCPanelMsgBoardDisplay("Authorization in progress...");
			
			// check if has GUID, server add
			var fAjaxReturn = function(vData) {
				cJSCore.instance.fStartUpReturn(vData);
				if (vReturnFun)
					vReturnFun(vData);
			};
			
			if (o.CHUMBY_GUID && o.SERVER_URL && o.LOCALBRIDGE_URL)
			{
				cProxy.xmlhttpPost("", "post", {cmd: "GetXML", data: "<value>" + o.SERVER_URL + "?id=" + o.CHUMBY_GUID + "</value>"}, fAjaxReturn);
			}
		});
	};
	
	fun1();
	
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
	vReturnFun
)
{
fDbg("*** cJSCore, fGetChannelInfo()");
	
	var fAjaxReturn = function(vData) {
		cJSCore.instance.fGetChannelInfoReturn(vData);
		if (vReturnFun)
			vReturnFun(vData);
	};
	
	if (cJSCore.instance.mModel.PROFILE_ID)
		cProxy.xmlhttpPost("", "post", {cmd : "GetXML", data : "<value>" + "http://xml.chumby.com/xml/profiles/" + cJSCore.instance.mModel.PROFILE_ID + "</value>"}, fAjaxReturn);
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
	cJSCore.instance.fPreloadChannelThumbnails(o);
	
	
	// show and play widget
	//~ cJSCore.instance.fPlayWidget("http://www.chumby.com/" + o.mWidgetList[0].mHref);
	cJSCore.instance.CPANEL.fOnSignal(cConst.SIGNAL_WIDGETENGINE_SHOW, null, null);
	
	//connect();
	
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
//	fPreloadChannelThumbnails
// -------------------------------------------------------------------------------------------------
cJSCore.prototype.fPreloadChannelThumbnails = function(
	vChannelObj,
	vReturnFun
)
{
	var o, i;
	fDbg2(vChannelObj.mWidgetList.length);
	o = [];

	for (i = 0; i < vChannelObj.mWidgetList.length; i++)
		o.push(vChannelObj.mWidgetList[i].mWidget.mThumbnail.mHref);
	
	var fLoadTN = function () {
		cProxy.xmlhttpPost("", "post", {cmd: "GetJPG", data: "<value>" + o[0] + "</value>"}, function(vData) {
			//~ fDbg2(o.length);
			//~ fDbg2(vData);
			vChannelObj.mWidgetList[vChannelObj.mWidgetList.length - o.length].mLocalThumbnailPath = vData.split("<data><value>")[1].split("</value></data>")[0];
			o.splice(0, 1);
			if (o.length == 0)
			{
				if (vReturnFun)
					vReturnFun();
				return;
			}
			fLoadTN();
		});
	};
	
	fLoadTN();
}






















































































	
	
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
//	utility functions
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	fDbg
// -------------------------------------------------------------------------------------------------
function fDbg(
	v
)
{
	//alert(v);
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


function fServerReset(
	vData		// true | false
)
{
	if (vData == "true" || vData == true)
	{
		location.href="http://localhost/";
	}
	fDbg2("fServerReset(), " + vData);
}
