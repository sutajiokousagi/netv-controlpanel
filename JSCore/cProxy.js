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
fDbg("*** cProxy, " + vType.toUpperCase() + " >> " + strURL);
	
	if (window.XMLHttpRequest)						// Mozilla/Safari
		xmlHttpReq = new XMLHttpRequest();
	
	xmlHttpReq.open(vType, cModel.fGetInstance().LOCALBRIDGE_URL, true);
	xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlHttpReq.onreadystatechange = function()
	{
//~ fDbg2("state: " + xmlHttpReq.readyState);
		if (xmlHttpReq.readyState == 4)
		{
//~ fDbg2("status: " + xmlHttpReq.status);
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
fDbg("para: " + parameters);
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
