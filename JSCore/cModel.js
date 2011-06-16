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

	this.CHUMBY_GUID = "";
	this.CHUMBY_NAME = "";
	
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
