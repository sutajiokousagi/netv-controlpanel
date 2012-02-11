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
fDbg("*** cAccountModule, fInit()");
	
}

// -------------------------------------------------------------------------------------------------
//	fFetchAccountInfo
// -------------------------------------------------------------------------------------------------
cAccountModule.prototype.fCheckAccount = function(
	vReturnFun
)
{
fDbg("*** cAccountModule, fCheckAccount()");
	
	var o, parser, xmlDoc, vThis;
	parser = new DOMParser();
	vThis = this;
	
	vThis.fCheckAuthorization(vReturnFun);
	return;
}










/** ------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * 	cDevice related functions
 * ---------------------------------------------------------------------------------------------- */
// -------------------------------------------------------------------------------------------------
//	fCheckAuthorization
// -------------------------------------------------------------------------------------------------
cAccountModule.prototype.fCheckAuthorization = function(
	vReturnFun
)
{
//~ fDbg("*** cAccountModule, fCheckAuthorization(), ");
	var vThis;
	vThis = this;
	
	//~ cModel.fGetInstance().CHUMBY_GUID = "12345";		// simulate a fake ID to get a "unzuthorized" chumby
	cDevice.fGetInstance().fCheckAuthorization(cModel.fGetInstance().CHUMBY_GUID, function(vData) {
		vThis.fCheckAuthorizationReturn(vData, vReturnFun);
	});
}

cAccountModule.prototype.fCheckAuthorizationReturn = function(
	vData,
	vReturnFun
)
{
	var o, parser, xmlDoc, vThis;
	parser = new DOMParser();
	vThis = this;
	
	fDbg("--------------------------");
	fDbg(vData);
	fDbg("--------------------------");
	//~ vData = "";
	if (vData.indexOf("<chumby") > -1)
	{
		if (vData.indexOf("unauthorized") > -1)
		{
			cModel.fGetInstance().CHUMBY_AUTHORIZED = false;
			cJSCore.fGetInstance().fOnSignal(cConst.SIGNAL_STARTUP_AUTHORIZATION_FAIL, null, null);
			cChannelModule.fGetInstance().fSimulateDefaultChannels();
			//~ cProxy.fClearDeviceData("unauthorized");
			cCPanel.fGetInstance().mLocked = false;
			cCPanel.fGetInstance().mGearBtnLocked = false;
			cProxy.fLoadModelData(function() {
				fDbg("=====>>> load model data complete! @ unauthorized");
				
				
				// skip showing activation screen for unauthorized device
				if (!cModel.fGetInstance().UNAUTHORIZED_SHOWACTIVATIONPANEL)
				{
					cCPanel.fGetInstance().mLocked = false;
					cCPanel.fGetInstance().mGearBtnLocked = false;
					cCPanel.fGetInstance().fOnSignal(cConst.SIGNAL_STARTUP_COMPLETE);
				}
			});
			return;
		}
		cModel.fGetInstance().CHUMBY_AUTHORIZED = true;
		xmlDoc = parser.parseFromString(vData, "text/xml");
		cModel.fGetInstance().CHUMBY_NAME = xmlDoc.getElementsByTagName("chumby")[0].getElementsByTagName("name")[0].textContent;
		vThis.fAuthenticateByDla(vReturnFun);
	}
	else
	{
		// server down, internet down, 
		
		cModuleToast.fGetInstance().fToast("Internet Down! Please check your internet connection.", "warning", null);
		return;
	}
}

// -------------------------------------------------------------------------------------------------
//	fAuthenticateByDla
// -------------------------------------------------------------------------------------------------
cAccountModule.prototype.fAuthenticateByDla = function(
	vReturnFun
)
{
//~ fDbg("*** cAccountModule, fAuthenticateByDla(), ");
	var vThis;
	vThis = this;
	
	cXAPI.fGetInstance().fAuthenticateByDla(cModel.fGetInstance().CHUMBY_NAME, cModel.fGetInstance().CHUMBY_GUID, null, function(vData) {
		vThis.fAuthenticateByDlaReturn(vData, vReturnFun);
	});
}

cAccountModule.prototype.fAuthenticateByDlaReturn = function(
	vData,
	vReturnFun
)
{
//~ fDbg("*** cAccountModule, fAuthenticateByDlaReturn(), ");
	var o, parser, xmlDoc, vThis;
	vThis = this;
	parser = new DOMParser();
	
	xmlDoc = parser.parseFromString(vData, "text/xml");
	cXAPI.fGetInstance().mOauthConsumerKey = xmlDoc.getElementsByTagName("oauth_session")[0].textContent;
	vThis.fFetchDeviceInfo(vReturnFun);
}

// -------------------------------------------------------------------------------------------------
//	fFetchDeviceInfo
// -------------------------------------------------------------------------------------------------
cAccountModule.prototype.fFetchDeviceInfo = function(
	vReturnFun
)
{
//~ fDbg("*** cAccountModule, fFetchDeviceInfo(), ");
	var vThis;
	vThis = this;
	
	cDevice.fGetInstance().fViewDevice(cModel.fGetInstance().CHUMBY_GUID, null, null, null, null, function(vData) {
		vThis.fParseDeviceInfo(vData, vReturnFun);
	});
}

// -------------------------------------------------------------------------------------------------
//	fParseDeviceInfo
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
cAccountModule.prototype.fParseDeviceInfo = function(
	vData,
	vReturnFun
)
{
//~ fDbg("*** cAccountModule, fParseAccountInfo(), ");
	//~ fDbg(vData);
	var parser = new DOMParser();
	var xmlDoc = parser.parseFromString(vData, "text/xml");
	//~ fDbg(vData);
	/*
	<?xml version="1.0" encoding="UTF-8"?>
	<chumby
		created="Sun Oct 02 20:25:25 -0700 2011"
		updated="Sun Oct 02 20:27:05 -0700 2011"
		authorized="Sun Oct 02 20:27:05 -0700 2011"
		id="60CF5773-507A-C4DD-24B3-40E4F9A45F14"
		anonymous="false">
		<name>NeTV50</name>
		<user id="0B4B5D44-0F6C-11E0-A0A1-0021288E785A">torinnguyen</user>
		<mature>allow</mature>
		<profile id="26F1E8A6-0F6C-11E0-AC8F-0021288EBF58">Default</profile>
		<dcid version="0002" hash="0006-1000-0001-0001"/>
		<control_panel enable="true" name="Control Panel"/>
	</chumby>
	*/

		
	cModel.fGetInstance().USER_NAME = xmlDoc.getElementsByTagName("chumby")[0].getElementsByTagName("user")[0].textContent;
	cModel.fGetInstance().USER_ID = xmlDoc.getElementsByTagName("chumby")[0].getElementsByTagName("user")[0].getAttribute("id");
	cModel.fGetInstance().PROFILE_NAME = xmlDoc.getElementsByTagName("chumby")[0].getElementsByTagName("profile")[0].textContent;
	cModel.fGetInstance().PROFILE_ID = xmlDoc.getElementsByTagName("chumby")[0].getElementsByTagName("profile")[0].getAttribute("id");

	if (vReturnFun)
		vReturnFun();
		
}


































/** ------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 * 	cDevice related functions
 * ---------------------------------------------------------------------------------------------- */
cAccountModule.prototype.fDoActivate = function(
	vUsername,
	vPassword,
	vDevicename,
	vReturnFun
)
{
	var vThis, o;
	vThis = this;
	
	o = cModel.fGetInstance();
	cDevice.fGetInstance().fActivateDevice(
		o.CHUMBY_GUID,
		vDevicename,
		{dcid_vers: o.CHUMBY_DCID_VERS, dcid_rgin: o.CHUMBY_DCID_RGIN, dcid_skin: o.CHUMBY_DCID_SKIN, dcid_part: o.CHUMBY_DCID_PART, dcid_camp: o.CHUMBY_DCID_CAMP},
		vUsername,
		vPassword,
		function(vData) {
			if (vReturnFun)
			{
				if (vData.indexOf("<success/>") > -1)
				{
					vReturnFun(true);
					vThis.fCheckAccount(function(vData) {
						cChannelModule.fGetInstance().fFetchChannelInfo(function() {
							fDbg("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
							fDbg("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
							fDbg("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
						});
					});
				}
				else
					vReturnFun(vData);
			}
		}
	);
}

cAccountModule.prototype.fDoDeActivate = function(
	vReturnFun
)
{
	var vThis;
	vThis = this;

	o = cModel.fGetInstance();
	cDevice.fGetInstance().fDeActivateDevice(
		o.CHUMBY_GUID,
		function(vData) {
			if (vReturnFun)
			{
				if (vData.indexOf("<success") > -1)
				{
					vReturnFun(true);
					cModel.fGetInstance().CHUMBY_AUTHORIZED = false;
				}
				else
					vReturnFun(vData);
			}
		}
	);
}
