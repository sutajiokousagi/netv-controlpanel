// -------------------------------------------------------------------------------------------------
//	cSPHelp class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cSPHelp(
	vDiv
)
{
	this.mDiv = $("#" + vDiv);
	this.mID = vDiv;

	this.mEnableBackButton = true;
	
	this.fInit();
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cSPHelp.instance = null;
cSPHelp.fGetInstance = function(
	vDiv
)
{
	return cSPHelp.instance ? cSPHelp.instance : cSPHelp.instance = new cSPHelp(vDiv);
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cSPHelp.prototype.fInit = function(
)
{
//~ fDbg2("*** cSPHelp, fInit(), ");
	$("#div_helpMain_content_basic").show();
	$("#div_helpMain_content_advanced").hide();
}

// -------------------------------------------------------------------------------------------------
//	fOnSignal
// -------------------------------------------------------------------------------------------------
cSPHelp.prototype.fOnSignal = function(
	vSignal,		// string
	vData,			// data array
	vReturnFun		// return function call
)
{
//~ fDbg2("*** cSPHelp, fOnSignal(), " + vSignal + ", " + vData);
	var vThis, i, o, p;
	vThis = this;
	
	switch(vSignal)
	{	
	case cConst.SIGNAL_BUTTON_CENTER:
	case cConst.SIGNAL_BUTTON_SETUP:
		cCPanel.fGetInstance().fBack();
		break;
	}
}

// -------------------------------------------------------------------------------------------------
//	fShow / fHide
// -------------------------------------------------------------------------------------------------
cSPHelp.prototype.fShow = function(
)
{
	this.mDiv.show();
}
cSPHelp.prototype.fHide = function(
)
{
	this.mDiv.hide();
}

// -------------------------------------------------------------------------------------------------
//	fAnimateIn / fAnimateOut
// -------------------------------------------------------------------------------------------------
cSPHelp.prototype.fAnimateIn = function(
	vReturnFun
)
{
	this.mDiv.fadeIn(200, function() { if (vReturnFun) vReturnFun(); });
}
cSPHelp.prototype.fAnimateOut = function(
	vReturnFun
)
{
	this.mDiv.fadeOut(200, function() { if (vReturnFun) vReturnFun(); });
}

// -------------------------------------------------------------------------------------------------
//	fUpdate
// -------------------------------------------------------------------------------------------------
cSPHelp.prototype.fUpdate = function(
)
{
fDbg2("*** cSPHelp, fUpdate(), ");
	var o;
	o = cModel.fGetInstance();
}

// -------------------------------------------------------------------------------------------------
//	pEnableBack
// -------------------------------------------------------------------------------------------------
cSPHelp.prototype.pEnableBack = function(
	vData	// true | false
)
{
fDbg2("*** cSPHelp, pEnableBack(), ");
	var vThis, o;
	vThis = this;

	if (vData == false)
	{
		vThis.mEnableBackButton = vData;
		$("#div_helpMain #subnavi_back").hide();
	}
	else
	{
		vThis.mEnableBackButton = vData;
		$("#div_helpMain #subnavi_back").show();
	}
}
