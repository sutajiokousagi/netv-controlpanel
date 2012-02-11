// -------------------------------------------------------------------------------------------------
//	cStartupModule class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cStartupModule(
)
{
	this.fInit();
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cStartupModule.instance = null;
cStartupModule.fGetInstance = function(
)
{

	return cStartupModule.instance ? cStartupModule.instance : (cStartupModule.instance = new cStartupModule());
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cStartupModule.prototype.fInit = function(
)
{
fDbg("*** cStartupModule, fInit()");
	
}

// -------------------------------------------------------------------------------------------------
//	fPrepareSystem - setbox, set chromakey, etc....
// -------------------------------------------------------------------------------------------------
cStartupModule.prototype.fPrepareSystem = function(
)
{
//~ fDbg("*** cStartupModule, fPrepareSystem(), ");
	/*
	//~ cProxy.xmlhttpPost("", "post", {cmd : "SetBox", data : "<value>0 0 1279 703</value>"}, function() {});
	//~ cProxy.xmlhttpPost("", "post", {cmd : "SetBox", data : "<value>0 0 1279 719</value>"}, function() {});
	//~ cProxy.xmlhttpPost("", "post", {cmd : "ControlPanel", data : "<value>Maximize</value>"}, function() {});
	*/
	//~ cProxy.xmlhttpPost("", "post", {cmd : "WidgetEngine", data : "<value>Hide</value>"}, function() {});
	//~ cProxy.xmlhttpPost("", "post", {cmd : "SetChromaKey", data : "<value>240,0,240</value>"}, function() {});
}

// -------------------------------------------------------------------------------------------------
//	fEnvironmentalCheck
// -----------------------------------------------------------------------int--------------------------
cStartupModule.prototype.fEnvironmentalCheck = function(
	vReturnFun
)
{
//~ fDbg2("*** cStartupModule, fEnvironmentalCheck(), ");
	var i, o, p;
	
	cProxy.xmlhttpPost("", "post", {cmd : "InitialHello", data: ""}, function(vData) {
		if (!vData || vData == undefined || vData == null)
		{
			if (vReturnFun)
				vReturnFun(null);
			return;
		}
		if (vData.split("</status>")[0].split("<status>")[1] == "1")
		{
			o = cModel.fGetInstance();
			o.CHUMBY_GUID = vData.split("</guid>")[0].split("<guid>")[1];
			o.CHUMBY_DCID = vData.split("</dcid>")[0].split("<dcid>")[1];
			o.CHUMBY_DCID_VERS = o.CHUMBY_DCID.split("</vers>")[0].split("<vers>")[1];
			o.CHUMBY_DCID_RGIN = o.CHUMBY_DCID.split("</rgin>")[0].split("<rgin>")[1];
			o.CHUMBY_DCID_SKIN = o.CHUMBY_DCID.split("</skin>")[0].split("<skin>")[1];
			o.CHUMBY_DCID_PART = o.CHUMBY_DCID.split("</part>")[0].split("<part>")[1];
			o.CHUMBY_DCID_CAMP = o.CHUMBY_DCID.split("</camp>")[0].split("<camp>")[1];
			o.CHUMBY_HWVERSION = vData.split("</hwver>")[0].split("<hwver>")[1];
			o.CHUMBY_FWVERSION = vData.split("</fwver>")[0].split("<fwver>")[1];
			o.CHUMBY_FLASHPLUGIN = vData.split("</flashplugin>")[0].split("<flashplugin>")[1];
			o.CHUMBY_FLASHPLAYER = vData.split("</flashver>")[0].split("<flashver>")[1];
			o.CHUMBY_NETWORK_MAC = vData.split("</mac>")[0].split("<mac>")[1];
			o.CHUMBY_INTERNET = vData.split("</internet>")[0].split("<internet>")[1];
			
			o.CHUMBY_NETWORK_IP = vData.split("</ip>")[0].split("<ip>")[1];
			o.CHUMBY_MAC_ADDRESS = vData.split("</mac>")[0].split("<mac>")[1];
			//o.CHUMBY_INTERNET = "false";
			
			//hwver is an xml string, need more massaging
			if (o.CHUMBY_HWVERSION.indexOf("success") > 0)
				o.CHUMBY_HWVERSION = o.CHUMBY_HWVERSION.split("result=\"success\">")[1].split("</response>")[0];
			o.CHUMBY_HWVERSION = o.CHUMBY_HWVERSION.substring(o.CHUMBY_HWVERSION.length, o.CHUMBY_HWVERSION.length-8);
			
			switch (vData.split("</internet>")[0].split("<internet>")[1])
			{
			case "true":
				cProxy.xmlhttpPost("", "post", {cmd : "FixTime", data: "sa"}, function(vData) {
					fDbg(">>> -----FixTime : " + vData);
				});
				
				if (vData.split("</network>")[0].split("<network>")[1].length > 50)
				{
					// has network
					o.CHUMBY_NETWORK_IF = vData.split("if=\"")[1].split("\"")[0];
					o.CHUMBY_NETWORK_UP = vData.split("up=\"")[1].split("\"")[0];
					//~ o.CHUMBY_NETWORK_IP = vData.split("ip=\"")[1].split("\"")[0];
					o.CHUMBY_NETWORK_BROADCAST = vData.split("broadcast=\"")[1].split("\"")[0];
					o.CHUMBY_NETWORK_NETMASK = vData.split("netmask=\"")[1].split("\"")[0];
					o.CHUMBY_NETWORK_GATEWAY = vData.split("gateway=\"")[1].split("\"")[0];
					o.CHUMBY_NETWORK_NAMESERVER1 = vData.split("nameserver1=\"")[1].split("\"")[0];
				}
				
				vReturnFun(true);
				
				// simulate AP mode
				//~ cModel.fGetInstance().CHUMBY_INTERNET = "false";
				//~ cModel.fGetInstance().CHUMBY_NETWORK_UP = "false";
				//~ vReturnFun(false);
				return;
				
			case "false":
				fDbg2("*** cStartupModule, fEnvironmentalCheck(), sadly... confirm has no network....");
				vReturnFun(false);
				return;

			default:
				fDbg2("*** cStartupModule, fEnvironmentalCheck(), InitialHello retrying......");
				cStartupModule.instance.fEnvironmentalCheck(vReturnFun);
				return;
			}
			
		}
		else
		{
			fDbg2("*** cStartupModule, fEnvironmentalCheck(), Hello failed. NO 'status' returned. ");
			fDbg2("*** cStartupModule, fEnvironmentalCheck(), InitialHello retrying......");
			cStartupModule.instance.fEnvironmentalCheck(vReturnFun);
			return;
		}
	});
}
