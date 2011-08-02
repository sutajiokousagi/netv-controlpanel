// -------------------------------------------------------------------------------------------------
//	cAccountModule class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cAccountModule(
)
{
	this.fInit();
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cAccountModule.instance = null;
cAccountModule.fGetInstance = function()
{
	return cAccountModule.instance ? cAccountModule.instance : cAccountModule.instance = new cAccountModule();
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cAccountModule.prototype.fInit = function(
)
{
fDbg2("*** cAccountModule, fInit()");
	
}

// -------------------------------------------------------------------------------------------------
//	fFetchAccountInfo
// -------------------------------------------------------------------------------------------------
cAccountModule.prototype.fFetchAccountInfo = function(
	vReturnFun
)
{
fDbg2("*** cAccountModule, fFetchAccountInfo()");
	
	var o, parser, xmlDoc;
	parser = new DOMParser();

	// 1, check connection / make sure server is connectable
	cDevice.fGetInstance().fCheckAuthorization(cModel.fGetInstance().CHUMBY_GUID, function(vData) {
		xmlDoc = parser.parseFromString(vData, "text/xml");
		cModel.fGetInstance().CHUMBY_NAME = xmlDoc.getElementsByTagName("chumby")[0].getElementsByTagName("name")[0].textContent;
		
		// 2, authentication / get session key
		cXAPI.fGetInstance().fAuthenticateByDla(cModel.fGetInstance().CHUMBY_NAME, cModel.fGetInstance().CHUMBY_GUID, null, function(vData) {
			xmlDoc = parser.parseFromString(vData, "text/xml");
			cXAPI.fGetInstance().mOauthConsumerKey = xmlDoc.getElementsByTagName("oauth_session")[0].textContent;
			
			// 3, fetch device info
			cDevice.fGetInstance().fFetchInfo(cModel.fGetInstance().CHUMBY_GUID, null, null, null, null, function(vData) {
				
				// 4, parse
				cAccountModule.fGetInstance().fParseAccountInfo(vData, vReturnFun);
			});
		});
	});
	return;
}

// -------------------------------------------------------------------------------------------------
//	fParseAccountInfo
//
/*
	<?xml version="1.0" encoding="UTF-8"?>
		<chumby created="Sun May 22 23:26:56 -0700 2011" anonymous="false" updated="Mon Aug 01 02:54:11 -0700 2011" authorized="Mon Aug 01 02:54:11 -0700 2011" id="A620123B-1F0E-B7CB-0E11-921ADB7BE22A">
			<name>chumbyR_test2</name>
			<user id="920ED424-81FD-11E0-96B7-001B24F07EF4">qinchuan</user>
			<mature>allow</mature>
			<profile id="98E703D4-81FD-11E0-927E-0021288EC192">chumby picks</profile>
			<dcid version="0002" hash="0002-1000-0001-0001"/>
			<control_panel enable="true" name="Control Panel"/>
		</chumby>" 
*/
// -------------------------------------------------------------------------------------------------
cAccountModule.prototype.fParseAccountInfo = function(
	vData,
	vReturnFun
)
{
fDbg2("*** cAccountModule, fParseAccountInfo()");
	
	var parser = new DOMParser();
	var xmlDoc = parser.parseFromString(vData, "text/xml");
	
	cModel.fGetInstance().USER_NAME = xmlDoc.getElementsByTagName("chumby")[0].getElementsByTagName("user")[0].textContent;
	cModel.fGetInstance().USER_ID = xmlDoc.getElementsByTagName("chumby")[0].getElementsByTagName("user")[0].getAttribute("id");
	cModel.fGetInstance().PROFILE_NAME = xmlDoc.getElementsByTagName("chumby")[0].getElementsByTagName("profile")[0].textContent;
	cModel.fGetInstance().PROFILE_ID = xmlDoc.getElementsByTagName("chumby")[0].getElementsByTagName("profile")[0].getAttribute("id");
	
	if (vReturnFun)
		vReturnFun();
}
