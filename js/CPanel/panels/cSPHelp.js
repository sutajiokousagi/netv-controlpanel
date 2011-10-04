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
	this.mSelection - null;
	this.mViewMode = null;
	this.mSubViewMode = null;

	// divs
	this.mDivIndicator = $(this.mDiv.children("#item_indicators").children()[0]);
	
	this.mDivBack = $(this.mDiv.children("#subnavi_action").children()[0]);
	this.mDivBack.pIndicatorStyle = { width: "96px", height: "36px", top: "551px", left: "350px" };
	this.mDivGotoInfo = $(this.mDiv.children("#subnavi_action").children()[1]);
	this.mDivGotoInfo.pIndicatorStyle = { width: "150px", height: "36px", top: "551px", left: "350px" };

	// view modes
	cSPHelp.VIEWMODE_DEFAULT = "viewmode_default";
	cSPHelp.SUBVIEWMODE_BACK = "subviewmode_back";
	cSPHelp.SUBVIEWMODE_GOTOINFO = "subviewmode_gotoINFO";
	
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
//~ fDbg("*** cSPHelp, fInit(), ");
	this.pViewMode(cSPHelp.VIEWMODE_DEFAULT);
	this.pSubViewMode(cSPHelp.SUBVIEWMODE_BACK);
}

/** ------------------------------------------------------------------------------------------------
 *	pViewMode
 * -----------------------------------------------------------------------------------------------*/
cSPHelp.prototype.pViewMode = function(
	vViewMode
)
{
	var vThis;
	vThis = this;

	if (!vViewMode) return vThis.mViewMode;
	
	switch (vViewMode)
	{
	case cSPHelp.VIEWMODE_DEFAULT:
		vThis.mSelection = vThis.mDivBack;
		vThis.mSelection.css("opacity", "1");
		vThis.mDivIndicator.css(vThis.mSelection.pIndicatorStyle);
		break;
	}
	vThis.mViewMode = vViewMode;
}

/** ------------------------------------------------------------------------------------------------
 *	pSubViewMode
 * -----------------------------------------------------------------------------------------------*/
cSPHelp.prototype.pSubViewMode = function(
	vSubViewMode
)
{
	var vThis;
	vThis = this;

	if (!vSubViewMode) return vThis.mSubViewMode;
	
	switch (vSubViewMode)
	{
	case cSPHelp.SUBVIEWMODE_BACK:
		vThis.mDivBack.show();
		vThis.mDivGotoInfo.hide();
		vThis.mDivBack.css("opacity", "1");
		break;
	case cSPHelp.SUBVIEWMODE_GOTOINFO:
		vThis.mDivBack.hide();
		vThis.mDivGotoInfo.show();
		vThis.mDivGotoInfo.css("opacity", "1");
		
		if (vThis.mSelection == vThis.mDivBack)
		{
			vThis.mSelection = vThis.mDivGotoInfo;
			vThis.mSelection.css("opacity", "1");
			vThis.mDivIndicator.css(vThis.mSelection.pIndicatorStyle);
		}
		break;
	}
	vThis.mSubViewMode = vSubViewMode;
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
		if (vThis.mSelection == vThis.mDivBack)
			cCPanel.fGetInstance().fBack();
		else if (vThis.mSelection == vThis.mDivGotoInfo)
			cCPanel.fGetInstance().fBack("info");
		break;
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
fDbg("*** cSPHelp, fUpdate(), ");
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
		$("#div_helpMain #subnavi").hide();
	}
	else
	{
		vThis.mEnableBackButton = vData;
		$("#div_helpMain #subnavi").show();
	}
}
