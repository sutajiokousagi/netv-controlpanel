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
	
	if (window.XMLHttpRequest)						// Mozilla/Safari
		xmlHttpReq = new XMLHttpRequest();
	
	if (!strURL || strURL == "")
		strURL = cModel.fGetInstance().LOCALBRIDGE_URL;

		
//~ fDbg("*** cProxy, " + vType.toUpperCase() + ", " + strURL + ", " + vData.cmd + ", " + vData.data + ", " + vData.url + ", " + vData.post);
	xmlHttpReq.open(vType, strURL, true);
	xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
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
fDbg2("*** cProxy, fCPanelInfoPanelShow(), ");
	cProxy.fDispatchSignal(cConst.SIGNAL_SCPINFO_SHOW, null, null);
}

cProxy.fCPanelInfoPanelUpdate = function(
)
{
fDbg2("*** cProxy, fCPanelInfoPanelUpdate(), ");
	cProxy.fDispatchSignal(cConst.SIGNAL_SCPINFO_UPDATE, null, null);
}





/** ------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 *	save / read external file
 * -----------------------------------------------------------------------------------------------*/
// -------------------------------------------------------------------------------------------------
//	get/post calls
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


// -------------------------------------------------------------------------------------------------
//	get/post calls
// -------------------------------------------------------------------------------------------------
cProxy.fReadFile = function(
	vFileName,
	vReturnFun
)
{
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
	cProxy.fReadFile("/usr/share/netvserver/docroot/widgets/channelinfo.xml", function(vData) {
		if (vReturnFun)
			vReturnFun(vData);
	});
}







/** ------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 *	save / read parameters
 * -----------------------------------------------------------------------------------------------*/
 // -------------------------------------------------------------------------------------------------
//	fSaveParams
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

// -------------------------------------------------------------------------------------------------
//	fSaveParams
// -------------------------------------------------------------------------------------------------
cProxy.fSaveParams = function(
	vTagName,
	vData,
	vReturnFun
)
{
	var o, vStr;

	vStr = "";
	vStr += "<" + vTagName + ">" + vData + "</" + vTagName + ">";
	//~ for (o in vData)
		//~ vStr += "<" + o + ">" + vData[o] + "</" + o + ">";
		
	cProxy.xmlhttpPost("", "post", {cmd : "SetParam", data : vStr}, function(vData) {
		//~ fDbg(vData);
		if (vReturnFun)
			vReturnFun(vData);
	});

/*	
<myKey1>myValue1</myKey1>
<myKey2>myValue2</myKey2>
<myGroup1/mySubKey1>myValue2</myGroup1/mySubKey1>
<myGroup2/mySubKey2>myValue2</myGroup1/mySubKey2>
*/

}


 
// -------------------------------------------------------------------------------------------------
//	get/post calls
// -------------------------------------------------------------------------------------------------
cProxy.fReadUserData = function(
	vReturnFun
)
{
	cProxy.xmlhttpPost("", "post", {cmd : "GetFileContents", data : "<value>/usr/share/netvserver/docroot/widgets/channelinfo.xml</value>"}, function(vData) {
	});
}

// -------------------------------------------------------------------------------------------------
//	get/post calls
// -------------------------------------------------------------------------------------------------
cProxy.fSaveUserData = function(
	vReturnFun
)
{
	cProxy.xmlhttpPost("", "post", {cmd : "GetFileContents", data : "<value>/usr/share/netvserver/docroot/widgets/channelinfo.xml</value>"}, function(vData) {
	});
}
