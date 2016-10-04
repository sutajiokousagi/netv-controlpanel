// -------------------------------------------------------------------------------------------------
//	cXAPI class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cXAPI(
)
{
	this.mAuthenticated = false;

	this.mOauthAuthID = null;
	this.mOauthConsumerSecret = null;
	this.mOauthConsumerKey = null;
	this.mOauthSessionExpires = null;
	this.mOauthShouldRenew = null;		// suggested time for renewal, before session expires
	this.mOauthNonce = (new Date()).getTime()/60000;



	this.mReq = null;
	this.mRes = null;

	this.GET = 'GET';
	this.POST = 'POST';

	this.fInit();
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cXAPI.instance = null;
cXAPI.fGetInstance = function(
)
{
	return cXAPI.instance ? cXAPI.instance : (cXAPI.instance = new cXAPI());
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cXAPI.prototype.fInit = function(
)
{
fDbg("*** cXAPI, fInit()");

}

// -------------------------------------------------------------------------------------------------
//	fAuthenticateByUsr
// -------------------------------------------------------------------------------------------------
cXAPI.prototype.fAuthenticateByUsr = function(
	vUserName,
	vPassword,
	vDeviceID,
	vReturnFun
)
{
fDbg("*** cXAPI, fAuthenticateByUsr()");
	var o;
	o = {
		auth_request : {
			__attr : {
				type : "usr"
			},
			username : vUserName,
			password : vPassword,
			chumby : vDeviceID,
			oauth_consumer_secret : cXAPI.instance.mOauthConsumerSecret
		}
	};
	o = cXAPI.fObjToXML(o);

	fDbg2(o);
}

// -------------------------------------------------------------------------------------------------
//	fAuthenticateByDla
// -------------------------------------------------------------------------------------------------
cXAPI.prototype.fAuthenticateByDla = function(
	vDeviceName,
	vDeviceID,
	vOauthConsumerSecret,
	vReturnFun
)
{
fDbg("*** cXAPI, fAuthenticateByDla()");
	var o;

	if (cXAPI.instance.mOauthAuthID == null)
		cXAPI.instance.mOauthAuthID = cGUID.fAsGUID(cGUID.fGetMD5(cGUID.fGetMD5(vDeviceID + vDeviceName))).toUpperCase();
	if (cXAPI.instance.mOauthConsumerSecret == null)
		cXAPI.instance.mOauthConsumerSecret = cGUID.fGetMD5(cGUID.fGetMD5(vDeviceID)).toUpperCase();

	o = {
		auth_request : {
			__attr : {
				type : "dla"
			},
			auth_id : cXAPI.instance.mOauthAuthID,
			chumby : vDeviceID,
			oauth_consumer_secret : cXAPI.instance.mOauthConsumerSecret
		}
	};
	o = cXAPI.fObjToXML(o);

	cXAPI.fXAPIRequest(["auth", "create"], null, o, vReturnFun);
	return;
}

// -------------------------------------------------------------------------------------------------
//	static functions ---
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	fXAPIRequest
// -------------------------------------------------------------------------------------------------
cXAPI.fXAPIRequest = function(
	vPathList,
	vParamList,
	vPostParam,
	vReturnFun
)
{
	var o, vUrl;

	// 1, process vPathList
	vUrl = "http://xml.chumby.com/xapis/";
	for (o in vPathList)
		vUrl += vPathList[o] + "/";
	vUrl = vUrl.substring(0, vUrl.length - 1);

	// 2, process vParamList
	if (vParamList)
	{
		vUrl += "?";
		for (o in vParamList)
			vUrl += cXAPI.fUrlEscape(o) + "=" + cXAPI.fUrlEscape(String(vParamList[o])) + "&";
		vUrl = vUrl.substring(0, vUrl.length - 1);
	}
	//~ fDbg(vUrl);


	// 3, process vPostParam
	vPostParam = vPostParam ? vPostParam : "";
	cProxy.xmlhttpPost("./bridge", "post", {cmd : "GetURL", url : vUrl, post : vPostParam}, function(vData) {
		vData = vData.split("<value>")[1].split("</value>")[0];

		if (vReturnFun)
			vReturnFun(vData);
	});
}

// -------------------------------------------------------------------------------------------------
//	fObjToXML
// -------------------------------------------------------------------------------------------------
cXAPI.fObjToXML = function(
	vObj
)
{
	var o, p, vStr, vStr2;
	vStr = vStr2 = "";

	for (o in vObj)
	{
		if (typeof(vObj[o]) == "string")
			vStr += "<" + o  + ">" + vObj[o] + "</" + o  + ">";
		else
			if (vObj[o] && vObj[o]["__attr"])
			{
				for (p in vObj[o]["__attr"])
					vStr2 += " " + p + "='" + vObj[o]["__attr"][p] + "'";
				delete vObj[o]["__attr"];
				vStr += "<" + o  + vStr2 + ">" + cXAPI.fObjToXML(vObj[o]) + "</" + o  + ">";
			}
			else
				vStr += "<" + o  + ">" + cXAPI.fObjToXML(vObj[o]) + "</" + o  + ">";
	}
	return vStr;
}

// -------------------------------------------------------------------------------------------------
//	fAddStandardParams
// -------------------------------------------------------------------------------------------------
cXAPI.fAddStandardParams = function(
	vUrl,
	vParamObj
)
{
	if (!vParamObj)
		vParamObj = {};
	vParamObj.oauth_consumer_key = cXAPI.instance.mOauthConsumerKey;
	vParamObj.oauth_nonce = String(cXAPI.instance.mOauthNonce);
	vParamObj.oauth_signature_method = 'MD5-HEX';

	return vUrl + "oauth_consumer_key=" + vParamObj.oauth_consumer_key + "&oauth_nonce=" + vParamObj.oauth_nonce + "&oauth_signature_method=" + vParamObj.oauth_signature_method;
}

// -------------------------------------------------------------------------------------------------
//	fObjToXML
// -------------------------------------------------------------------------------------------------
cXAPI.fSignatureMD5Of = function(
	pathItems,
	params
)
{
	var baseString = cXAPI.fBaseStringOf(pathItems, params);
	return cGUID.fGetMD5(baseString + "&" + cXAPI.instance.mOauthConsumerSecret + "&");
}

// -------------------------------------------------------------------------------------------------
//	fObjToXML
// -------------------------------------------------------------------------------------------------
cXAPI.fBaseStringOf = function(
	pathItems,
	params
)
{
	var pathPart = cXAPI.fPathSignaturePartOf(pathItems);
	var paramsPart = cXAPI.fParamsSignaturePartOf(params);
	if (paramsPart == '')
		return pathPart;
	else
		return pathPart + '&' + paramsPart;
}


cXAPI.fPathSignaturePartOf = function(
	pathItems
)
{
	var result = '';
	if (typeof(pathItems)=='string')
		result += pathItems.toString();
	else
		result += pathItems.join('/');

	return cXAPI.fUrlEscape('/xapis/' + result);
}

cXAPI.fParamSort = function(
	a,
	b
)
{
	var aa = a[0];
	var bb = b[0];
	if (aa < bb) return -1;
	if (aa > bb) return 1;
	aa = a[1];
	bb = b[1];
	if (aa < bb) return -1;
	if (aa > bb) return 1;
	return 0;
}

cXAPI.fParamsSignaturePartOf = function(
	params
)
{
	var result = '';
	var a = [];
	if (params != undefined)
		for (var key in params)
		{
			if(key != "oauth_signature")
				a.push([key, params[key]]);
		}
	a.sort(cXAPI.fParamSort);
	var isFirst = true;
	var b = []
	for (var i=0;i<a.length;i++) {
		var key = a[i][0];
		var value = a[i][1];
		b.push(cXAPI.fUrlEscapeDouble(key) + '%3D' + cXAPI.fUrlEscapeDouble(String(value)));  // %3D = '='
	}
	result = b.join('%26');  // %26 = '&'
	return result;
}

cXAPI.fUrlEscape = function(
	str
)
{
	str = str.split("%").join("%25");
	str = str.split(" ").join("%20");
	str = str.split(",").join("%2C");
	str = str.split("<").join("%3C");
	str = str.split(">").join("%3E");
	str = str.split("#").join("%23");
	str = str.split("{").join("%7B");
	str = str.split("}").join("%7D");
	str = str.split("|").join("%7C");
	str = str.split("\\").join("%5C");
	str = str.split("^").join("%5E");
	str = str.split("~").join("%7E");
	str = str.split("[").join("%5B");
	str = str.split("]").join("%5D");
	str = str.split("`").join("%60");
	str = str.split(";").join("%3B");
	str = str.split("/").join("%2F");
	str = str.split("?").join("%3F");
	str = str.split(":").join("%3A");
	str = str.split("@").join("%40");
	str = str.split("=").join("%3D");
	str = str.split("&").join("%26");
	str = str.split("$").join("%24");
	return str;
}

cXAPI.fUrlEscapeDouble = function(
	str
)
{
	str = str.split("%").join("%2525");
	str = str.split("[").join("%255B");
	str = str.split("]").join("%255D");
	str = str.split("/").join("%252F");
	str = str.split("?").join("%253F");
	str = str.split(":").join("%253A");
	str = str.split(" ").join("%2520");
	str = str.split(",").join("%252C");
	str = str.split("<").join("%253C");
	str = str.split(">").join("%253E");
	str = str.split("#").join("%2523");
	str = str.split("{").join("%257B");
	str = str.split("}").join("%257D");
	str = str.split("|").join("%257C");
	str = str.split("\\").join("%255C");
	str = str.split("^").join("%255E");
	str = str.split("~").join("%257E");
	str = str.split("`").join("%2560");
	str = str.split(";").join("%253B");
	str = str.split("@").join("%2540");
	str = str.split("=").join("%253D");
	str = str.split("&").join("%2526");
	str = str.split("$").join("%2524");
	return str;
}
