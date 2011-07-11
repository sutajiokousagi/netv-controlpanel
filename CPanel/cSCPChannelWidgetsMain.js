// -------------------------------------------------------------------------------------------------
//	cSCPChannelWidgetsMain class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cSCPChannelWidgetsMain(
	vDivObj
)
{
	this.mDiv = vDivObj;
	this.mSelectedChannel = null;
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cSCPChannelWidgetsMain.instance = null;
cSCPChannelWidgetsMain.fGetInstance = function(
	vDivObj
)
{
	return cSCPChannelWidgetsMain.instance ? cSCPChannelWidgetsMain.instance : cSCPChannelWidgetsMain.instance = new cSCPChannelWidgetsMain(vDivObj);
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cSCPChannelWidgetsMain.prototype.fInit = function(
)
{
	
}

// -------------------------------------------------------------------------------------------------
//	fOnSignal
// -------------------------------------------------------------------------------------------------
cSCPChannelWidgetsMain.prototype.fOnSignal = function(
	vSignal,		// string
	vData,			// data array
	vReturnFun		// return function call
)
{
fDbg("*** cSCPChannelWidgetsMain, fOnSignal(), " + vSignal + ", " + vData);
	var i, o;
	
	switch(vSignal)
	{
	case cConst.SIGNAL_TOGGLE_CONTROLPANEL:
		break;
		
	case cConst.SIGNAL_TOGGLE_WIDGETENGINE:
		break;
		
	case cConst.SIGNAL_BUTTON_LEFT:
		break;
		
	case cConst.SIGNAL_BUTTON_RIGHT:
		break;
		
	case cConst.SIGNAL_BUTTON_CENTER:
		break;
		
	case cConst.SIGNAL_BUTTON_UP:
		break;
		
	case cConst.SIGNAL_BUTTON_DOWN:
		break;
	}
}

// -------------------------------------------------------------------------------------------------
//	fShow / fHide
// -------------------------------------------------------------------------------------------------
cSCPChannelWidgetsMain.prototype.fShow = function(
)
{
	this.mDiv.show();
}
cSCPChannelWidgetsMain.prototype.fHide = function(
)
{
	this.mDiv.hide();
}
