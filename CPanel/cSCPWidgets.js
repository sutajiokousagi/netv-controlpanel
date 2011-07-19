// -------------------------------------------------------------------------------------------------
//	cSCPWidgets class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cSCPWidgets(
	vDivObj
)
{
	this.mDiv = vDivObj;
	this.mSelectedChannel = null;
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cSCPWidgets.instance = null;
cSCPWidgets.fGetInstance = function(
	vDivObj
)
{
	return cSCPWidgets.instance ? cSCPWidgets.instance : cSCPWidgets.instance = new cSCPWidgets(vDivObj);
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cSCPWidgets.prototype.fInit = function(
)
{
	
}

// -------------------------------------------------------------------------------------------------
//	fOnSignal
// -------------------------------------------------------------------------------------------------
cSCPWidgets.prototype.fOnSignal = function(
	vSignal,		// string
	vData,			// data array
	vReturnFun		// return function call
)
{
fDbg("*** cSCPWidgets, fOnSignal(), " + vSignal + ", " + vData);
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
cSCPWidgets.prototype.fShow = function(
)
{
	this.mDiv.show();
}
cSCPWidgets.prototype.fHide = function(
)
{
	this.mDiv.hide();
}
