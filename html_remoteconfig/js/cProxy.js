// -------------------------------------------------------------------------------------------------
//	cProxy static class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	static members
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cProxy(
)
{


}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cProxy.instance = null;
cProxy.fGetInstance = function(
)
{

	return cProxy.instance ? cProxy.instance : (cProxy.instance = new cProxy());
}

// -------------------------------------------------------------------------------------------------
//	get/post calls
// -------------------------------------------------------------------------------------------------
cProxy.xmlhttpPost = function(
	strURL,
	vType,			// "post" | "get"
	vData,
	vCompleteFun
)
{
	var xmlHttpReq = false;
	var self = this;
	var parameters = "";
	if (!window.XMLHttpRequest)						// Mozilla/Safari
	{
		if (vCompleteFun)
			vCompleteFun("XMLHttpRequest doesn't exist.");
		return;
	}

	if (!strURL || strURL == "")
		strURL = "../bridge";

//~ fDbg("*** cProxy, " + vType.toUpperCase() + ", " + strURL + ", " + vData.cmd + ", " + vData.data + ", " + vData.url + ", " + vData.post);
	xmlHttpReq = new XMLHttpRequest();
	xmlHttpReq.open(vType, strURL, true);
	xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	//~ xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlHttpReq.onreadystatechange = function()
	{
//~ fDbg("state: " + xmlHttpReq.readyState);
		if (xmlHttpReq.readyState == 4)
		{
//~ fDbg("status: " + xmlHttpReq.status);
//~ fDbg("text length : " + xmlHttpReq.responseText.length);
//~ fDbg("text: " + xmlHttpReq.responseText);
			switch (xmlHttpReq.status)
			{
			case 200:
				if (vCompleteFun)
					vCompleteFun(xmlHttpReq.responseText);
				break;
			case 0:
				if (vCompleteFun)
					vCompleteFun(0);
				break;
			}
		}
	}

	if (vType.toLowerCase() == "post")
	{
		for (var o in vData)
			parameters += o + "=" + encodeURIComponent(vData[o]) + "&";
		if (parameters.substr(parameters.length - 1, 1) == "&")
			parameters = parameters.substr(0, parameters.length - 1);
		/*
		if (parameters.substr(parameters.length - 6, 6) == "&data=")
			parameters = parameters.substr(0, parameters.length - 6);
		*/
//~ fDbg("para: " + parameters);
		xmlHttpReq.send(parameters);
	}
	else
		xmlHttpReq.send();
}

// -------------------------------------------------------------------------------------------------
//	communication between JSCore and CPanel
// -------------------------------------------------------------------------------------------------
cProxy.fDispatchSignal = function(
	vSignal,
	vData,
	vReturnFun
)
{
//~ fDbg("*** cProxy, fDispatchSignal(), " + vData);
	cJSCore.fGetInstance().CPANEL.fOnSignal(vSignal, vData, vReturnFun);
}

// -------------------------------------------------------------------------------------------------
//	CPanel, messageboard display message
// -------------------------------------------------------------------------------------------------
cProxy.fCPanelMsgBoardDisplay = function(
	v
)
{
	cProxy.fDispatchSignal(cConst.SIGNAL_MESSAGE, [v], null);
}

// -------------------------------------------------------------------------------------------------
//	CPanel, show
// -------------------------------------------------------------------------------------------------
cProxy.fCPanelShow = function(
)
{
	cProxy.fDispatchSignal(cConst.SIGNAL_SHOW, null, null);
}

// -------------------------------------------------------------------------------------------------
//	CPanel, show widget engine
// -------------------------------------------------------------------------------------------------
cProxy.fWidgetEngineShow = function(
)
{
	cProxy.fDispatchSignal(cConst.SIGNAL_WIDGETENGINE_SHOW, null, null);
}


// -------------------------------------------------------------------------------------------------
//	CPanel, show info SCP
// -------------------------------------------------------------------------------------------------
cProxy.fCPanelInfoPanelShow = function(
)
{
fDbg("*** cProxy, fCPanelInfoPanelShow(), ");
	cProxy.fDispatchSignal(cConst.SIGNAL_SCPINFO_SHOW, null, null);
}

cProxy.fCPanelInfoPanelUpdate = function(
)
{
fDbg("*** cProxy, fCPanelInfoPanelUpdate(), ");
	cProxy.fDispatchSignal(cConst.SIGNAL_SCPINFO_UPDATE, null, null);
}















// -------------------------------------------------------------------------------------------------
//	fUpdateDeviceToServer
// -------------------------------------------------------------------------------------------------
cProxy.fUpdateDeviceToServer = function(
	vPostParam,
	vCompleteFunc
)
{
	var vUrl = "http://netv.bunnie-bar.com/torin/webservices/update_device.php";

	//Decompose vPostParam array into GET style string
	vPostParam = vPostParam ? vPostParam : "";
	var parameters = "";
	for (var o in vPostParam)
		parameters += o + "=" + encodeURIComponent(vPostParam[o]) + "&";
	if (parameters.substr(parameters.length - 1, 1) == "&")
		parameters = parameters.substr(0, parameters.length - 1);

	cProxy.xmlhttpPost("./bridge", "post", {cmd : "GetURL", url : vUrl, post : parameters}, function(vData) {
		if (vCompleteFunc)
			vCompleteFunc(vData);
	});
}














/** ------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 *	save / read external file
 * -----------------------------------------------------------------------------------------------*/
// -------------------------------------------------------------------------------------------------
//	fSaveFile / fReadFile
// -------------------------------------------------------------------------------------------------
cProxy.fSaveFile = function(
	vFileName,
	vFileContent,
	vReturnFun
)
{
	cProxy.xmlhttpPost("", "post", {cmd : "SetFileContents", data : ""}, function(vData){
		if (vReturnFun)
			vReturnFun();
	});
}

cProxy.fReadFile = function(
	vFileName,
	vReturnFun
)
{
	debugger;
	cProxy.xmlhttpPost("", "post", {cmd : "GetFileContents", data : "<value>" + vFileName + "</value>"}, function(vData) {
		//~ fDbg(vData.split("</cmd><data><value>")[0]);
		if (vData)
			vData = vData.split("</cmd><data><value>")[1].split("</value></data></xml>")[0];
		if (vReturnFun)
			vReturnFun(vData);
	});
}

// -------------------------------------------------------------------------------------------------
//	get/post calls
// -------------------------------------------------------------------------------------------------
cProxy.fReadDefaultChannelData = function(
	vReturnFun
)
{
	//try reading from new docroot location
	cProxy.fReadFile("/media/storage/docroot/widgets/channelinfo.xml", function(vData) {
		var tempVData = "" + vData;
		if (tempVData)
			tempVData = tempVData.split("</cmd><data><value>")[1].split("</value></data></xml>")[0];
		var notFound = (!vData || tempVData.length <= 0 || tempVData == "file not found");

		//ok, perform callback with data
		if (!notFound) {
			vReturnFun(vData);
			return;
		}

		//fallback to life support location
		cProxy.fReadFile("/usr/share/netvserver/docroot/widgets/channelinfo.xml", function(vData) {
			if (vReturnFun)
				vReturnFun(vData);
		});
	});
}








/** ------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 *	save / read parameters
 * -----------------------------------------------------------------------------------------------*/
 // -------------------------------------------------------------------------------------------------
//	fSaveParams / fLoadParams
// -------------------------------------------------------------------------------------------------
cProxy.fGetParams = function(
	vTagName,
	vReturnFun
)
{
	cProxy.xmlhttpPost("", "post", {cmd : "GetParam", data : "<value>" + vTagName + "</value>"}, function(vData) {
		//~ fDbg(vData);
		vData = vData.split("</cmd><data><value>")[1].split("</value></data></xml>")[0];
		if (vReturnFun)
			vReturnFun(vData);
	});
}

cProxy.fSaveParams = function(
	vTagName,
	vData,
	vReturnFun
)
{
	var o, vStr;

	vStr = "";
	vStr += "<" + vTagName + ">" + vData + "</" + vTagName + ">";
	cProxy.xmlhttpPost("", "post", {cmd : "SetParam", data : vStr}, function(vData) {
		//~ fDbg(vData);
		if (vReturnFun)
			vReturnFun(vData);
	});
}

// -------------------------------------------------------------------------------------------------
//	pLoadModelData / fSaveModelData
// -------------------------------------------------------------------------------------------------
cProxy.fLoadModelData = function(
	vReturnFun
)
{
fDbg("cProxy, fLoadModelData(), ");
	var o;

	cProxy.fGetParams("cpanel_cmodel", function(vData) {
		//~ fDbg(vData);
		if (!vData || vData == "")
			return;
		vData = JSON.parse(vData);
		cModel.fGetInstance().pData(vData)

		if (vReturnFun)
			vReturnFun();
	});
}

cProxy.fSaveModelData = function(
)
{
fDbg("cProxy, fSaveModelData(), ");
	var o;
	o = cModel.fGetInstance().pData();
	o = JSON.stringify(o);

	cProxy.fSaveParams("cpanel_cmodel", o);
}

// -------------------------------------------------------------------------------------------------
//	cProxy
// -------------------------------------------------------------------------------------------------
cProxy.fClearDeviceData = function(
	v
)
{
fDbg("cProxy, fClearDeviceData, ");
	switch (v)
	{
	case "unauthorized":
		cProxy.fSaveParams("cpanel_cmodel", "");
		cProxy.fSaveParams("facebook_access_token", "");
		cProxy.fSaveParams("twitter_oauth", "");
		break;
	case "all":
		break;
	}
}







/** ------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 *	system related functions
 * -----------------------------------------------------------------------------------------------*/
// -------------------------------------------------------------------------------------------------
//	enable SSH
// -------------------------------------------------------------------------------------------------
cProxy.fEnableSSH = function(
	vReturnFun
)
{
	cProxy.xmlhttpPost("", "post", {cmd : "EnableSSH", data : ""}, function(vData) {
		//~ fDbg(vData);
		if (vData.indexOf("<status>1</status>") > -1)
			cModel.fGetInstance().CHUMBY_SSH_ENABLED = true;
		if (vReturnFun)
			vReturnFun(vData);
	});
}

// -------------------------------------------------------------------------------------------------
//	reboot
// -------------------------------------------------------------------------------------------------
cProxy.fReboot = function(
	vReturnFun
)
{
	cProxy.xmlhttpPost("", "post", {cmd : "reboot", data : ""}, function(vData) {
		//~ fDbg(vData);
		if (vReturnFun)
			vReturnFun(vData);
	});
}
