// -------------------------------------------------------------------------------------------------
//	cSPInfo class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cSPInfo(
	vDiv
)
{
	this.mDiv = $("#" + vDiv);
	this.mID = vDiv;
	
	this.mEnableBackButton = true;
	this.mSelection = null;
	this.mViewMode = null;
	this.mSubViewMode = null;

	// divs
	this.mDivIndicator = $(this.mDiv.children("#item_indicators").children()[0]);
	
	this.mDivSubNaviNeTV = $(this.mDiv.children("#subnavi").children()[0]);
	this.mDivSubNaviNeTV.pIndicatorStyle = { width: "145px", height: "30px", top: "85px", left: "220px" };
	this.mDivSubNaviSystemInfo = $(this.mDiv.children("#subnavi").children()[1]);
	this.mDivSubNaviSystemInfo.pIndicatorStyle = { width: "180px", height: "30px", top: "85px", left: "420px" };
	
	this.mDivSubNaviNeTVContent = $(this.mDiv.children("#div_infoMain_content").children()[0]);
	this.mDivSubNaviSystemInfoContent = $(this.mDiv.children("#div_infoMain_content").children()[1]);
	
	this.mDivToggleSSH = $(this.mDivSubNaviSystemInfoContent.children("#options")[0]);
	this.mDivToggleSSH.pIndicatorStyle = { width: "400px", height: "40px", top: "350px", left: "200px" };
	this.mDivBack = $(this.mDiv.children("#subnavi_action").children()[0]);
	this.mDivBack.pIndicatorStyle = { width: "96px", height: "36px", top: "551px", left: "350px" };
	this.mDivGotoHelp = $(this.mDiv.children("#subnavi_action").children()[1]);
	this.mDivGotoHelp.pIndicatorStyle = { width: "160px", height: "36px", top: "551px", left: "320px" };
	
	
	
	// view modes
	cSPInfo.VIEWMODE_DEFAULT = "viewmode_default";
	cSPInfo.VIEWMODE_SYSINFO = "viewmode_sysinfo";
	cSPInfo.SUBVIEWMODE_BACK = "subviewmode_back";
	cSPInfo.SUBVIEWMODE_GOTOHELP = "subviewmode_gotohelp";
	
	this.fInit();
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cSPInfo.instance = null;
cSPInfo.fGetInstance = function(
	vDiv
)
{
	return cSPInfo.instance ? cSPInfo.instance : cSPInfo.instance = new cSPInfo(vDiv);
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cSPInfo.prototype.fInit = function(
)
{
//~ fDbg("*** cSPInfo, fInit(), ");
	this.pViewMode(cSPInfo.VIEWMODE_DEFAULT);
	this.pSubViewMode(cSPInfo.SUBVIEWMODE_BACK);
}

/** ------------------------------------------------------------------------------------------------
 *	pViewMode
 * -----------------------------------------------------------------------------------------------*/
cSPInfo.prototype.pViewMode = function(
	vViewMode
)
{
	var vThis;
	vThis = this;

	if (!vViewMode) return vThis.mViewMode;
	
	switch (vViewMode)
	{
	case cSPInfo.VIEWMODE_DEFAULT:
		vThis.mDivSubNaviNeTV.css("opacity", "1");
		vThis.mDivSubNaviNeTV.css("color", "#FFFFFF");
		vThis.mDivSubNaviNeTVContent.show();
		vThis.mDivSubNaviSystemInfo.css("opacity", "0.2");
		vThis.mDivSubNaviSystemInfo.css("color", "#FFFFFF");
		vThis.mDivSubNaviSystemInfoContent.hide();

		vThis.mDivToggleSSH.css("opacity", "0.2");
		vThis.mDivBack.css("opacity", "0.2");
		vThis.mDivGotoHelp.css("opacity", "0.2");

		
		vThis.mSelection = vThis.mDivSubNaviNeTV;
		vThis.mSelection.css("opacity", "1");
		vThis.mDivIndicator.css(vThis.mSelection.pIndicatorStyle);
		
		break;
	case cSPInfo.VIEWMODE_SYSINFO:
		vThis.mDivSubNaviNeTV.css("opacity", "0.2");
		vThis.mDivSubNaviNeTV.css("color", "#FFFFFF");
		vThis.mDivSubNaviNeTVContent.hide();
		vThis.mDivSubNaviSystemInfo.css("opacity", "1");
		vThis.mDivSubNaviSystemInfo.css("color", "#FFFFFF");
		vThis.mDivSubNaviSystemInfoContent.show();

		vThis.mDivToggleSSH.css("opacity", "0.2");
		vThis.mDivGotoHelp.css("opacity", "0.2");

		
		vThis.mSelection = vThis.mDivSubNaviSystemInfo;
		vThis.mSelection.css("opacity", "1");
		vThis.mDivIndicator.css(vThis.mSelection.pIndicatorStyle);
		
		if (!cModel.fGetInstance().CHUMBY_SSH_ENABLED)
		{
			$($(vThis.mDivToggleSSH.children()[0]).children()[0]).show();
			$($(vThis.mDivToggleSSH.children()[0]).children()[1]).hide();
			$($(vThis.mDivToggleSSH.children()[0]).children()[2]).hide();
		}
		else
		{
			$($(vThis.mDivToggleSSH.children()[0]).children()[0]).hide();
			$($(vThis.mDivToggleSSH.children()[0]).children()[1]).hide();
			$($(vThis.mDivToggleSSH.children()[0]).children()[2]).show();
		}
		break;
	}
	vThis.mViewMode = vViewMode;
}

/** ------------------------------------------------------------------------------------------------
 *	pSubViewMode
 * -----------------------------------------------------------------------------------------------*/
cSPInfo.prototype.pSubViewMode = function(
	vSubViewMode
)
{
	var vThis;
	vThis = this;

	if (!vSubViewMode) return vThis.mSubViewMode;
	
	switch (vSubViewMode)
	{
	case cSPInfo.SUBVIEWMODE_BACK:
		vThis.mDivBack.show();
		vThis.mDivGotoHelp.hide();
		vThis.mDivBack.css("opacity", "0.2");
		break;
	case cSPInfo.SUBVIEWMODE_GOTOHELP:
		vThis.mDivBack.hide();
		vThis.mDivGotoHelp.show();
		vThis.mDivGotoHelp.css("opacity", "0.2");
		break;
	}
	vThis.mSubViewMode = vSubViewMode;
}


// -------------------------------------------------------------------------------------------------
//	pSelection
// -------------------------------------------------------------------------------------------------
cSPInfo.prototype.pSelection = function(
	vSelection,
	vPrevSelectionStyle,		// false | true | {}
	vNewSelectionStyle,			// false | true | {}
	vAnimateIndicator			// false | true | time
)
{
if (!vSelection) return this.mSelection;
	var vThis, o;
	vThis = this;
	
	vDefaultPrevSelectionStyle = {opacity: "0.2"};
	vDefaultNewSelectionStyle = {opacity: "1"};
	vDefaultAnimateIndicator = 300;

	if (vPrevSelectionStyle == true)
		vPrevSelectionStyle = vDefaultPrevSelectionStyle;
	if (vNewSelectionStyle == true)
		vNewSelectionStyle = vDefaultNewSelectionStyle;
	if (vAnimateIndicator == true)
		vAnimateIndicator = vDefaultAnimateIndicator;
		
	vThis.mPrevSelection = vThis.mSelection;
	if (vPrevSelectionStyle)
		vThis.mPrevSelection.css(vPrevSelectionStyle);
	vThis.mSelection = vSelection;
	
		
	if (vAnimateIndicator)
		vThis.mDivIndicator.animate(vThis.mSelection.pIndicatorStyle, vAnimateIndicator, function() {
			if (vNewSelectionStyle)
				vThis.mSelection.css(vNewSelectionStyle);
		});
	else
	{
		vThis.mDivIndicator.css(vThis.mSelection.pIndicatorStyle);
		if (vNewSelectionStyle)
			vThis.mSelection.css(vNewSelectionStyle);
	}
}

// -------------------------------------------------------------------------------------------------
//	fOnSignal
// -------------------------------------------------------------------------------------------------
cSPInfo.prototype.fOnSignal = function(
	vSignal,		// string
	vData,			// data array
	vReturnFun		// return function call
)
{
//~ fDbg2("*** cSPInfo, fOnSignal(), " + vSignal + ", " + vData);
	var vThis, i, o, p;
	vThis = this;
	
	switch(vSignal)
	{
	case cConst.SIGNAL_TOGGLE_CONTROLPANEL:
		break;
		
	case cConst.SIGNAL_TOGGLE_WIDGETENGINE:
		break;
		
	case cConst.SIGNAL_BUTTON_LEFT:
		if (vThis.mSelection == vThis.mDivSubNaviSystemInfo)
			vThis.mDivIndicator.animate(vThis.mDivSubNaviNeTV.pIndicatorStyle, 200, function() { vThis.pViewMode(cSPInfo.VIEWMODE_DEFAULT); });
		break;
		
	case cConst.SIGNAL_BUTTON_RIGHT:
		if (vThis.mSelection == vThis.mDivSubNaviNeTV)
			vThis.mDivIndicator.animate(vThis.mDivSubNaviSystemInfo.pIndicatorStyle, 200, function() { vThis.pViewMode(cSPInfo.VIEWMODE_SYSINFO); });
		break;
		
	case cConst.SIGNAL_BUTTON_CENTER:
		switch (vThis.mSelection)
		{
		case vThis.mDivBack:
			cCPanel.fGetInstance().fBack();
			break;
		case vThis.mDivGotoHelp:
			cCPanel.fGetInstance().fBack("help");
			break;
		case vThis.mDivToggleSSH:
			if ($($(vThis.mDivToggleSSH.children()[0]).children()[0]).is(":visible"))
			{
				fDbg("enable SSH!!!!!!!!!!!!!!!!!");
				cProxy.fEnableSSH(function() {
					$($(vThis.mDivToggleSSH.children()[0]).children()[0]).hide();
					$($(vThis.mDivToggleSSH.children()[0]).children()[1]).hide();
					$($(vThis.mDivToggleSSH.children()[0]).children()[2]).show();
				});
			}
			break;
		}
		break;
		
	case cConst.SIGNAL_BUTTON_UP:
		switch (vThis.mViewMode)
		{
		case cSPInfo.VIEWMODE_DEFAULT:
			if (vThis.mSelection == vThis.mDivBack || vThis.mSelection == vThis.mDivGotoHelp)
				vThis.pSelection(vThis.mDivSubNaviNeTV, {opacity: "0.2"}, {color: "#FFFFFF"}, true);
			break;

		case cSPInfo.VIEWMODE_SYSINFO:
			if (vThis.mSelection == vThis.mDivBack || vThis.mSelection == vThis.mDivGotoHelp)
				vThis.pSelection(vThis.mDivToggleSSH, true, true, true);
			else if (vThis.mSelection == vThis.mDivToggleSSH)
				vThis.pSelection(vThis.mDivSubNaviSystemInfo, {opacity: "0.2"}, {color: "#FFFFFF"}, true);
			break;
		}
		break;
		
	case cConst.SIGNAL_BUTTON_DOWN:
		switch (vThis.mViewMode)
		{
		case cSPInfo.VIEWMODE_DEFAULT:
			if (vThis.mSelection == vThis.mDivSubNaviNeTV)
			{
				if (!vThis.mEnableBackButton)
					return;
				fDbg("---------->>> " + cSPInfo.SUBVIEWMODE_BACK);
				switch (vThis.pSubViewMode())
				{
				case cSPInfo.SUBVIEWMODE_BACK: vThis.pSelection(vThis.mDivBack, {color: "#6598EB"}, {opacity: "1"}, true); break;
				case cSPInfo.SUBVIEWMODE_GOTOHELP: vThis.pSelection(vThis.mDivGotoHelp, {color: "#6598EB"}, {opacity: "1"}, true); break;
				}
			}
			break;

		case cSPInfo.VIEWMODE_SYSINFO:
			if (vThis.mSelection == vThis.mDivSubNaviSystemInfo)
				vThis.pSelection(vThis.mDivToggleSSH, {color: "#6598EB"}, {opacity: "1"}, true);
			else if (vThis.mSelection == vThis.mDivToggleSSH)
			{
				if (!vThis.mEnableBackButton)
					return;
				
				switch (vThis.pSubViewMode())
				{
				case cSPInfo.SUBVIEWMODE_BACK: vThis.pSelection(vThis.mDivBack, true, true, true); break;
				case cSPInfo.SUBVIEWMODE_GOTOHELP: vThis.pSelection(vThis.mDivGotoHelp, true, true, true); break;
				}
			}
			break;
		}
		break;
	}
}

// -------------------------------------------------------------------------------------------------
//	fShow / fHide
// -------------------------------------------------------------------------------------------------
cSPInfo.prototype.fShow = function(
)
{
	this.mDiv.show();
}
cSPInfo.prototype.fHide = function(
)
{
	this.mDiv.hide();
}

// -------------------------------------------------------------------------------------------------
//	fAnimateIn / fAnimateOut
// -------------------------------------------------------------------------------------------------
cSPInfo.prototype.fAnimateIn = function(
	vReturnFun
)
{
	this.pViewMode(cSPInfo.VIEWMODE_DEFAULT);
	this.mDiv.fadeIn(200, function() { if (vReturnFun) vReturnFun(); });
}
cSPInfo.prototype.fAnimateOut = function(
	vReturnFun
)
{
	this.mDiv.fadeOut(200, function() { if (vReturnFun) vReturnFun(); });
}

// -------------------------------------------------------------------------------------------------
//	fUpdate
// -------------------------------------------------------------------------------------------------
cSPInfo.prototype.fUpdate = function(
)
{
fDbg2("*** cSPInfo, fUpdate(), ");
	var o;
	o = cModel.fGetInstance();
	
	$("#div_info_guid").html(o.CHUMBY_GUID);
	$("#div_info_dcid").html(o.CHUMBY_DCID);
	$("#div_info_hwver").html(o.CHUMBY_HWVERSION);
	$("#div_info_fwver").html(o.CHUMBY_FWVERSION);
	$("#div_info_mac").html(o.CHUMBY_NETWORK_MAC);
	
	$("#div_info_ip").html(o.CHUMBY_NETWORK_IP);
}

// -------------------------------------------------------------------------------------------------
//	pEnableBack
// -------------------------------------------------------------------------------------------------
cSPInfo.prototype.pEnableBack = function(
	vData	// true | false
)
{
fDbg("*** cSPInfo, pEnableBack(), ");
	var vThis, o;
	vThis = this;

	if (vData == false)
	{
		vThis.mEnableBackButton = vData;
		$("#div_infoMain #subnavi_action").hide();
	}
	else
	{
		vThis.mEnableBackButton = vData;
		$("#div_infoMain #subnavi_action").show();
	}
}
