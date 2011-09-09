// -------------------------------------------------------------------------------------------------
//	fXMLHttpRequest
// -------------------------------------------------------------------------------------------------
function fXMLHttpRequest(
    strURL,
    vType,			// "post" | "get"
    vData,			// in {} format
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
    var o = hex_md5(String(Math.round((new Date()).getTime()/1000)));
    //~	fDbg("----time MD5 ----> " + o);
    xmlHttpReq.setRequestHeader('Authorized-Caller', hex_md5(String(Math.round((new Date()).getTime()/1000))));
    
    
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

