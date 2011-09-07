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
fDbg("*** cDevice, fInit()");
	
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
//	fViewDevice
// -------------------------------------------------------------------------------------------------
cDevice.prototype.fViewDevice = function(
	vDeviceID,
	vOauthSignature,
	vOauthSignatureMethod,
	vOauthNonce,
	vOauthConsumerKey,
	vReturnFun
)
{
fDbg2("*** cDevice, fViewDevice(), ");
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


// -------------------------------------------------------------------------------------------------
//	fActivateDevice
// -------------------------------------------------------------------------------------------------
cDevice.prototype.fActivateDevice = function(
	vDeviceID,
	vDeviceName,
	vDeviceDCIDVars,
	vUsername,
	vPassword,
	vReturnFun
)
{
	cXAPI.fXAPIRequest(
		["device", "activate", vDeviceID],
		{
			"chumby[name]" : vDeviceName,
			"dcid_vers" : vDeviceDCIDVars["dcid_vers"],
			"dcid_rgin" : vDeviceDCIDVars["dcid_rgin"],
			"dcid_skin" : vDeviceDCIDVars["dcid_skin"],
			"dcid_part" : vDeviceDCIDVars["dcid_part"],
			"dcid_camp" : vDeviceDCIDVars["dcid_camp"],
			"username" : vUsername,
			"pw" : vPassword
		},
		null,
		vReturnFun
	);
	
	return;
}

cDevice.prototype.fDeActivateDevice = function(
	vDeviceID,
	vReturnFun
)
{
	var vOauthSignatureMethod, vOauthNonce, vOauthConsumerKey, vOauthSignature;
	vOauthSignatureMethod = "MD5-HEX";
	vOauthNonce = cXAPI.fGetInstance().mOauthNonce;
	vOauthConsumerKey = cXAPI.fGetInstance().mOauthConsumerKey;
	vOauthSignature = cXAPI.fSignatureMD5Of(["device", "deregister"], {
		oauth_signature_method : "MD5-HEX",
		oauth_nonce : vOauthNonce,
		oauth_consumer_key : vOauthConsumerKey
	});
	
	cXAPI.fXAPIRequest(
		["device", "deregister"],
		{
			oauth_signature : vOauthSignature,
			oauth_signature_method : vOauthSignatureMethod,
			oauth_nonce : vOauthNonce,
			oauth_consumer_key : vOauthConsumerKey
		},
		null,
		vReturnFun
	);
	return;
}
