// -------------------------------------------------------------------------------------------------
//	cWidgetInstance class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cWidgetInstance(
)
{
	this.fInit();
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cWidgetInstance.instance = null;
cWidgetInstance.fGetInstance = function(
)
{
	return cWidgetInstance.instance ? cWidgetInstance.instance : (cWidgetInstance.instance = new cWidgetInstance());
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cWidgetInstance.prototype.fInit = function(
)
{
fDbg("*** cWidgetInstance, fInit()");
}

// -------------------------------------------------------------------------------------------------
//	fViewDevice
// -------------------------------------------------------------------------------------------------
cWidgetInstance.prototype.fConfigure = function(
	vWidgetID,
	vWidgetName,
	vWidgetPlayMode,
	vWidgetPlayTime,
	vWidgetParameters,		// {key : value, key2 : value2, ...}
	vReturnFun
)
{
fDbg2("*** cWidgetInstance, fConfig(), ");
	var vOauthSignatureMethod, vOauthNonce, vOauthConsumerKey, vOauthSignature;
	vOauthSignatureMethod = "MD5-HEX";
	vOauthNonce = cXAPI.fGetInstance().mOauthNonce;
	vOauthConsumerKey = cXAPI.fGetInstance().mOauthConsumerKey;
	vOauthSignature = cXAPI.fSignatureMD5Of(["device", "deregister"], {
		oauth_signature_method : "MD5-HEX",
		oauth_nonce : vOauthNonce,
		oauth_consumer_key : vOauthConsumerKey
	});
	var o, p;

	o = {};
	if (vWidgetName)
		o["name"] = vWidgetName;
	if (vWidgetPlayMode)
		o["play[mode]"] = vWidgetPlayMode;
	if (vWidgetPlayTime)
		o["play[time]"] = vWidgetPlayTime;
	if (vWidgetParameters)
		for (p in vWidgetParameters)
			o[p] = vWidgetParameters[p];
	
	o["oauth_signature"] = vOauthSignature;
	o["oauth_signature_method"] = vOauthSignatureMethod;
	o["oauth_nonce"] = vOauthNonce;
	o["oauth_consumer_key"] = vOauthConsumerKey;

	if (vWidgetParameters)
	{
		fDbg("------------------>> parameter exist");
		for (p in vWidgetParameters)
		{
			o[p] = vWidgetParameters[p];
			fDbg(p + " exist");
			fDbg("value is : " + o[p]);
		}
	}

	
	cXAPI.fXAPIRequest(["widget_instance", "configure", vWidgetID], o, null, vReturnFun);
	return;
}
