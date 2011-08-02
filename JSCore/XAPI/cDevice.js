// -------------------------------------------------------------------------------------------------
//	cDevice class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cDevice(
)
{
	this.fInit();
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cDevice.instance = null;
cDevice.fGetInstance = function(
)
{
	return cDevice.instance ? cDevice.instance : (cDevice.instance = new cDevice());
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cDevice.prototype.fInit = function(
)
{
fDbg2("*** cDevice, fInit()");
	
}

// -------------------------------------------------------------------------------------------------
//	fAuthenticateByUsr
// -------------------------------------------------------------------------------------------------
cDevice.prototype.fCheckAuthorization = function(
	vDeviceID,
	vReturnFun
)
{
	cXAPI.fXAPIRequest(["device", "authorize", vDeviceID], {hw : 1, sw : 1, fw : 1}, null, vReturnFun);
	return;
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cDevice.prototype.fFetchInfo = function(
	vDeviceID,
	vOauthSignature,
	vOauthSignatureMethod,
	vOauthNonce,
	vOauthConsumerKey,
	vReturnFun
)
{
fDbg2("*** cDevice, fFetchInfo()");
	var o;

	vOauthSignatureMethod = "MD5-HEX";
	vOauthNonce = cXAPI.fGetInstance().mOauthNonce;
	vOauthConsumerKey = cXAPI.fGetInstance().mOauthConsumerKey;
	vOauthSignature = cXAPI.fSignatureMD5Of(["device", "index", vDeviceID], {
		oauth_signature_method : "MD5-HEX",
		oauth_nonce : vOauthNonce,
		oauth_consumer_key : vOauthConsumerKey
	});
	
	cXAPI.fXAPIRequest(["device", "index", vDeviceID], {
		oauth_signature : vOauthSignature,
		oauth_signature_method : vOauthSignatureMethod,
		oauth_nonce : vOauthNonce,
		oauth_consumer_key : vOauthConsumerKey
	}, null, vReturnFun);
	return;
}
