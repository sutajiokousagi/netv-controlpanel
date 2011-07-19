// -------------------------------------------------------------------------------------------------
//	cModel static class
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
function cModel(
)
{
	this.USER_NAME = "";
	this.USER_ID = "";

	this.CHUMBY_NAME = "";
	this.CHUMBY_GUID = "";
	this.CHUMBY_DCID = "";
	this.CHUMBY_HWVERSION = "";
	this.CHUMBY_FWVERSION = "";
	this.CHUMBY_FLASHPLUGIN = "";
	this.CHUMBY_FLASHPLAYER = "";
	this.CHUMBY_INTERNET = "";
	
	this.CHUMBY_NETWORK_IF = "";
	this.CHUMBY_NETWORK_UP = "";
	this.CHUMBY_NETWORK_IP = "";
	this.CHUMBY_NETWORK_MAC = "";
	this.CHUMBY_NETWORK_BROADCAST = "";
	this.CHUMBY_NETWORK_NETMASK = "";
	this.CHUMBY_NETWORK_GATEWAY = "";
	this.CHUMBY_NETWORK_NAMESERVER1 = "";
	this.CHUMBY_NETWORK_NAMESERVER2 = "";
	
	this.PROFILE_HREF = "";
	this.PROFILE_NAME = "";
	this.PROFILE_ID = "";

	this.SERVER_URL = "";
	this.LOCALBRIDGE_URL = "";


	this.CHANNEL_LIST = [];
	this.CURR_CHANNEL_INDEX = null;
	this.PREV_CHANNEL_INDEX = null;
	this.CURR_WIDGET_INDEX = null;
	this.PREV_WIDGET_INDEX = null;
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cModel.instance = null;
cModel.fGetInstance = function(
)
{
	return cModel.instance ? cModel.instance : (cModel.instance = new cModel());
}
