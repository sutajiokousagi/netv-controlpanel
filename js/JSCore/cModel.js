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
fDbg("*** cModel, ");
	this.mData = null;

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
	this.CHUMBY_SSH_ENABLED = false;
	this.CHUMBY_MAC_ADDRESS = "";
	
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
	this.CHANNEL_CURRENT = null;
	this.CURR_WIDGET_INDEX = null;
	this.PREV_WIDGET_INDEX = null;

	
	this.PLAYMODE = "event";
	//~ this.PLAYMODE = "default";
	this.TIMEZONE = "+8:00";

	this.VIEWPORTSIZE = [];


	this.EVENTTICKER_SPEED = 3;			// range 1 ~ 5
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cModel.instance = null;
cModel.fGetInstance = function() { return cModel.instance ? cModel.instance : (cModel.instance = new cModel()); }

cModel.prototype.pData = function(
	v
)
{
	var vThis, o;
	vThis = this;

	vThis.mData = {};
	vThis.mData["EVENTTICKER_SPEED"] = vThis.EVENTTICKER_SPEED;
	
if (!v) return vThis.mData;
	
	if (v["EVENTTICKER_SPEED"])
		vThis.EVENTTICKER_SPEED = v["EVENTTICKER_SPEED"];
}

cModel.prototype.pTickerStep = function(
)
{
	var vThis, o;
	vThis = this;

	o = [null, 16, 8, 4, 2, 1];

	return o[vThis.EVENTTICKER_SPEED];
}
