// -------------------------------------------------------------------------------------------------
//	cProfile class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cProfile(
)
{
	this.fInit();
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cProfile.instance = null;
cProfile.fGetInstance = function(
)
{
	return cProfile.instance ? cProfile.instance : (cProfile.instance = new cProfile());
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cProfile.prototype.fInit = function(
)
{
fDbg2("*** cProfile, fInit()");
	
}

// -------------------------------------------------------------------------------------------------
//	fFetchInfo
//
//	/xapis/profile/show/<profile id>
// -------------------------------------------------------------------------------------------------
cProfile.prototype.fFetchInfo = function(
	vProfileID,
	vReturnFun
)
{
fDbg2("*** cProfile, fFetchInfo()");
	var o;
	
	vOauthSignatureMethod = "MD5-HEX";
	vOauthNonce = cXAPI.fGetInstance().mOauthNonce;
	vOauthConsumerKey = cXAPI.fGetInstance().mOauthConsumerKey;
	vOauthSignature = cXAPI.fSignatureMD5Of(["profile", "show", vProfileID], {
		oauth_signature_method : "MD5-HEX",
		oauth_nonce : vOauthNonce,
		oauth_consumer_key : vOauthConsumerKey
	});
	
	cXAPI.fXAPIRequest(["profile", "show", vProfileID], {
		oauth_signature : vOauthSignature,
		oauth_signature_method : vOauthSignatureMethod,
		oauth_nonce : vOauthNonce,
		oauth_consumer_key : vOauthConsumerKey
	}, null, vReturnFun);
	return;
}
