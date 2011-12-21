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
	
	this.LOCAL_WIDGETS_LIST = [];

	
	this.PLAYMODE = "event";
	//~ this.PLAYMODE = "default";
	this.TIMEZONE = "+8:00";
	this.VIEWPORTSIZE = [];
	
	
	// user settings
	this.EVENTTICKER_SPEED = 3;				// range 1 ~ 5
	this.EVENTTICKER_REPEATCOUNT = 2;		// range 1 ~ 3
	this.EVENTTICKER_LINECOUNT = 2;			// range 1 ~ 2
	
	this.UNAUTHORIZED_SHOWACTIVATIONPANEL = false;
	
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
	var vThis, o, i, j;
	vThis = this;
	
	// 1, format mData
	vThis.mData = {};
	vThis.mData["EVENTTICKER_SPEED"] = vThis.EVENTTICKER_SPEED;
	vThis.mData["EVENTTICKER_REPEATCOUNT"] = vThis.EVENTTICKER_REPEATCOUNT;
	vThis.mData["EVENTTICKER_LINECOUNT"] = vThis.EVENTTICKER_LINECOUNT;
	
	o = [];
	for (i = 0; i < vThis.CHANNEL_LIST.length; i++)
		o.push(vThis.CHANNEL_LIST[i].pData());
	vThis.mData["CHANNELLIST_DATA"] = o;
	
	// 2, return mData
	if (v == undefined) return vThis.mData;
	
	// 3, apply/cast mData from v
	if (v["EVENTTICKER_SPEED"])
		vThis.EVENTTICKER_SPEED = v["EVENTTICKER_SPEED"];
	if (v["EVENTTICKER_REPEATCOUNT"])
		vThis.EVENTTICKER_REPEATCOUNT = v["EVENTTICKER_REPEATCOUNT"];
	if (v["EVENTTICKER_LINECOUNT"])
		vThis.EVENTTICKER_LINECOUNT = v["EVENTTICKER_LINECOUNT"];
	
	if (v["CHANNELLIST_DATA"] && v["CHANNELLIST_DATA"].length > 0)
	{
		for (i = 0; i < vThis.CHANNEL_LIST.length; i++)
			for (j = 0; j < v["CHANNELLIST_DATA"].length; j++)
				if (vThis.CHANNEL_LIST[i].mID == v["CHANNELLIST_DATA"][j]["ID"])
				{
					vThis.CHANNEL_LIST[i].pData(v["CHANNELLIST_DATA"][j]);
					break;
				}
	}
}

cModel.prototype.pTickerStep = function(
)
{
	var vThis, o;
	vThis = this;

	o = [null, 16, 8, 4, 2, 1];

	return o[vThis.EVENTTICKER_SPEED];
}
