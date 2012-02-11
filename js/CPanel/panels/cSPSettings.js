// -------------------------------------------------------------------------------------------------
//	cSPSettings class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cSPSettings(
	vDiv
)
{
	this.mDiv = $("#" + vDiv);
	this.mID = vDiv;

	this.mPrevSelection = null;
	this.mSelection = null;
	this.mCurrHighlightTimezone = -1;

	// div elements
	this.mDivIndicator = $(this.mDiv.children("#item_indicators").children()[0]);
	
	this.mDivContainerSetting = this.mDiv.children("#setting_group");
	this.mDivResetToAP =  $(this.mDiv.children("#setting_group").children()[0]);
	this.mDivResetToAP.pIndicatorStyle = { width: "400px", height: "40px", top: "120px", left: "200px" };
	this.mDivReconnectToWIFI = $(this.mDiv.children("#setting_group").children()[1]);
	this.mDivReconnectToWIFI.pIndicatorStyle = { width: "400px", height: "40px", top: "180px", left: "200px" };
	this.mDivReloadControlPanel = $(this.mDiv.children("#setting_group").children()[2]);
	this.mDivReloadControlPanel.pIndicatorStyle = { width: "400px", height: "40px", top: "230px", left: "200px" };
	this.mDivToggleSSH = $(this.mDiv.children("#setting_group").children()[3]);
	this.mDivToggleSSH.pIndicatorStyle = { width: "400px", height: "40px", top: "280px", left: "200px" };
	this.mDivSetTime = $(this.mDiv.children("#setting_group").children()[4]);
	this.mDivSetTime.pIndicatorStyle = { width: "400px", height: "40px", top: "330px", left: "200px" };
	this.mDivReboot = $(this.mDiv.children("#setting_group").children()[5]);
	this.mDivReboot.pIndicatorStyle = { width: "400px", height: "40px", top: "380px", left: "200px" };
	this.mDivSetEventTicker = $(this.mDiv.children("#setting_group").children()[6]);
	this.mDivSetEventTicker.pIndicatorStyle = { width: "400px", height: "40px", top: "430px", left: "200px" };
	
	// to be DELETED
	this.mDivContainerSettingTimezone = this.mDiv.children("#setting_timezone");
	this.mDivSettingTimezoneTitle = $(this.mDiv.children("#setting_timezone").children()[0]);
	this.mDivSettingTimezoneTitle.pIndicatorStyle = { width: "740px", height: "36px", top: "140px", left: "30px" };
	this.mDivSettingTimezoneListContainer = $(this.mDiv.children("#setting_timezone").children()[1]);
	this.mDivSettingTimezoneListContainer.pIndicatorStyle = { width: "640px", height: "36px", top: "260px", left: "80px" };
	
	// back
	this.mDivBack = $(this.mDiv.children("#subnavi_action").children()[0]);
	this.mDivBack.pIndicatorStyle = { width: "96px", height: "36px", top: "551px", left: "350px" };
	
	// sub sub panels
	this.mSSPTime = cSPSettingsTime.fGetInstance(this.mDiv.children("#setting_time"));
	this.mSSPTime.pDivIndicator(this.mDivIndicator);
	this.mSSPTime.pDivBack(this.mDivBack);
	this.mSSPEventTicker = cSPSettingsEventTicker.fGetInstance(this.mDiv.children("#setting_eventticker"));
	this.mSSPEventTicker.pDivIndicator(this.mDivIndicator);
	this.mSSPEventTicker.pDivBack(this.mDivBack);
	
	
	// view modes
	this.mViewMode = null;
	cSPSettings.VIEWMODE_DEFAULT = "viewmode_default";
	cSPSettings.VIEWMODE_SETTING_TIME = "viewmode_setting_time";
	cSPSettings.VIEWMODE_SETTING_EVENTTICKER = "viewmode_setting_eventticker";
	cSPSettings.VIEWMODE_SETTING_TIMEZONE = "viewmode_setting_timezone";

	this.fInit();
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cSPSettings.instance = null;
cSPSettings.fGetInstance = function(
	vDiv
)
{
	return cSPSettings.instance ? cSPSettings.instance : cSPSettings.instance = new cSPSettings(vDiv);
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cSPSettings.prototype.fInit = function(
)
{
//~ fDbg2("*** cSPSettings, fInit(), ");
	var vThis;
	vThis = this;
	
	vThis.pViewMode(cSPSettings.VIEWMODE_DEFAULT);
}

/** ------------------------------------------------------------------------------------------------
 *	pViewMode
 * -----------------------------------------------------------------------------------------------*/
cSPSettings.prototype.pViewMode = function(
	v
)
{
	var vThis, i, o, p;
	vThis = this;
if (!v) return vThis.mViewMode;
	
	switch (v)
	{
	case cSPSettings.VIEWMODE_DEFAULT:
		$(vThis.mDiv.children("#subnavi").children()[0]).html("Settings");
		
		vThis.mDivContainerSetting.show();
		vThis.mDivContainerSettingTimezone.hide();
		vThis.mSSPTime.fHide();
		vThis.mSSPEventTicker.fHide();
		
		
		vThis.mDivResetToAP.css("opacity", "0.2");
		vThis.mDivReconnectToWIFI.css("opacity", "0.2");
		vThis.mDivReloadControlPanel.css("opacity", "0.2");
		vThis.mDivToggleSSH.css("opacity", "0.2");
		vThis.mDivSetTime.css("opacity", "0.2");
		vThis.mDivReboot.css("opacity", "0.2");
		vThis.mDivSetEventTicker.css("opacity", "0.2");
		
		vThis.mDivBack.css("opacity", "0.2");
		vThis.pSelection(vThis.mDivReconnectToWIFI, false, true);
		
		if (!cModel || !cModel.fGetInstance().CHUMBY_SSH_ENABLED)
		{
			$(vThis.mDivToggleSSH.children()[0]).show();
			$(vThis.mDivToggleSSH.children()[1]).hide();
			$(vThis.mDivToggleSSH.children()[2]).hide();
		}
		else
		{
			$(vThis.mDivToggleSSH.children()[0]).hide();
			$(vThis.mDivToggleSSH.children()[1]).hide();
			$(vThis.mDivToggleSSH.children()[2]).show();
		}
		break;
	case cSPSettings.VIEWMODE_SETTING_TIMEZONE:
		vThis.mDivContainerSetting.hide();
		vThis.mDivContainerSettingTimezone.show();
		vThis.mDivSettingTimezoneListContainer.css("opacity", "0.3");
		
		vThis.pSelection(vThis.mDivSettingTimezoneTitle);
		$(vThis.mDivSettingTimezoneListContainer.children()[0]).css("top", "58px");
		$(vThis.mDiv.children("#subnavi").children()[0]).html("Timezone Selection");
		
		o = $(vThis.mDivSettingTimezoneListContainer.children()[0]).children();
		for (i = 0; i < o.length; i++)
		{
			p = $($($(vThis.mDivSettingTimezoneListContainer.children()[0]).children()[i]).children()[0]).html();
			if (p.indexOf(cModel.fGetInstance().TIMEZONE) > -1)
			{
				vThis.mDivSettingTimezoneTitle.children("span").html(p);
				vThis.mCurrHighlightTimezone = i;
				$(vThis.mDivSettingTimezoneListContainer.children()[0]).css("top", 58 - 52 * vThis.mCurrHighlightTimezone + "px");
				break;
			}
		}
		break;
	case cSPSettings.VIEWMODE_SETTING_TIME:
		$(vThis.mDiv.children("#subnavi").children()[0]).html("Setup Time");
		
		vThis.mDivContainerSetting.hide();
		vThis.mSSPTime.fShow();
		break;
	case cSPSettings.VIEWMODE_SETTING_EVENTTICKER:
		$(vThis.mDiv.children("#subnavi").children()[0]).html("Setup Event Ticker");
		
		vThis.mDivContainerSetting.hide();
		vThis.mSSPEventTicker.fShow();
		break;
	}
	vThis.mViewMode = v;
}

// -------------------------------------------------------------------------------------------------
//	pSelection
// -------------------------------------------------------------------------------------------------
cSPSettings.prototype.pSelection = function(
	vSelection,
	vDimPrevSelection,		// false | true
	vLightNewSelection		// false | true
)
{
	var vThis, o, p;
	vThis = this;
	
if (!vSelection) return vThis.mSelection;
	vThis.mPrevSelection = vThis.mSelection;
	if (vDimPrevSelection)
		vThis.mPrevSelection.css("opacity", "0.2");
	vThis.mSelection = vSelection;
	if (vLightNewSelection)
		vThis.mSelection.css("opacity", "1");
	vThis.mDivIndicator.css(vThis.mSelection.pIndicatorStyle);
}

// -------------------------------------------------------------------------------------------------
//	fOnSignal
// -------------------------------------------------------------------------------------------------
cSPSettings.prototype.fOnSignal = function(
	vSignal,		// string
	vData,			// data array
	vReturnFun		// return function call
)
{
//~ fDbg("*** cSPSettings, fOnSignal(), " + vSignal + ", " + vData);
	var vThis, o, i;
	vThis = this;

	if (vThis.pViewMode() == cSPSettings.VIEWMODE_SETTING_TIME)
	{
		vThis.mSSPTime.fOnSignal(vSignal, vData, vReturnFun);
		return;
	}
	else if (vThis.pViewMode() == cSPSettings.VIEWMODE_SETTING_EVENTTICKER)
	{
		vThis.mSSPEventTicker.fOnSignal(vSignal, vData, vReturnFun);
		return;
	}
	
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
		switch (vThis.pViewMode())
		{
		case cSPSettings.VIEWMODE_DEFAULT:
			switch (vThis.mSelection)
			{
			case vThis.mDivResetToAP:
				break;
			case vThis.mDivReconnectToWIFI:
				window.location = "./html_config/";
				break;
			case vThis.mDivReloadControlPanel:
				window.location = "http://localhost/";
				break;
			case vThis.mDivToggleSSH:
				if ($(vThis.mDivToggleSSH.children()[0]).is(":visible"))
				{
					fDbg("enable SSH!!!!!!!!!!!!!!!!!");
					cProxy.fEnableSSH(function() {
						$(vThis.mDivToggleSSH.children()[0]).hide();
						$(vThis.mDivToggleSSH.children()[1]).hide();
						$(vThis.mDivToggleSSH.children()[2]).show();
						cModuleToast.fGetInstance().fToast("SSH Enabled Successfully.", "message", {color: "#00FF00"});
					});
				}
				break;
			case vThis.mDivSetTime:
				vThis.pViewMode(cSPSettings.VIEWMODE_SETTING_TIME);
				break;
			case vThis.mDivReboot:
				cProxy.fReboot();
				break;
			case vThis.mDivSetEventTicker:
				vThis.pViewMode(cSPSettings.VIEWMODE_SETTING_EVENTTICKER);
				break;
			case vThis.mDivBack:
				cCPanel.fGetInstance().fBack();
				break;
			}
			break;
		case cSPSettings.VIEWMODE_SETTING_TIMEZONE:
			switch (vThis.mSelection)
			{
			case vThis.mDivSettingTimezoneTitle:
				vThis.pSelection(vThis.mDivSettingTimezoneListContainer, false, true);
				vThis.fShiftTimezoneSelection(vThis.mCurrHighlightTimezone);
				break;
			case vThis.mDivSettingTimezoneListContainer:
				o = $($($(vThis.mDivSettingTimezoneListContainer.children()[0]).children()[vThis.mCurrHighlightTimezone]).children()[0]).html();
				vThis.mDivSettingTimezoneTitle.children("span").html(o);
				vThis.pSelection(vThis.mDivSettingTimezoneTitle, true, true);
				
				$(vThis.mDivSettingTimezoneListContainer.children()[0]).children().each(function() {
					$(this).css("opacity", "1");
					$(this).css("font-weight", "normal");
				});
				//~ $(vThis.mDivSettingTimezoneListContainer.children()[0]).children().each{$(this).css("font-weight", "normal")};
				break;
			case vThis.mDivBack:
				vThis.pViewMode(cSPSettings.VIEWMODE_DEFAULT);
				break;
			}
			break;
		}
		break;
		
	case cConst.SIGNAL_BUTTON_UP:
		switch (vThis.pViewMode())
		{
		case cSPSettings.VIEWMODE_DEFAULT:
			switch (vThis.mSelection)
			{
			case vThis.mDivReloadControlPanel:	o = vThis.mDivReconnectToWIFI; break;
			case vThis.mDivToggleSSH:			o = vThis.mDivReloadControlPanel; break;
			case vThis.mDivSetTime:				o = vThis.mDivToggleSSH; break;
			case vThis.mDivReboot:				o = vThis.mDivSetTime; break;
			case vThis.mDivSetEventTicker:		o = vThis.mDivReboot; break;
			case vThis.mDivBack:				o = vThis.mDivSetEventTicker; break;
			default: 							return;
			}
			vThis.mSelection.css("opacity", "0.2");
			vThis.mSelection = o;
			vThis.mSelection.css("opacity", "1");
			vThis.mDivIndicator.css(vThis.mSelection.pIndicatorStyle);
			break;
		case cSPSettings.VIEWMODE_SETTING_TIMEZONE:
			switch (vThis.mSelection)
			{
			case vThis.mDivSettingTimezoneTitle:
				break;
			case vThis.mDivSettingTimezoneListContainer:
				vThis.fShiftTimezoneSelection(vThis.mCurrHighlightTimezone - 1);
				break;
			case vThis.mDivBack:
				vThis.pSelection(vThis.mDivSettingTimezoneTitle, true, true);
				break;
			}
			break;
		}
		break;
		
	case cConst.SIGNAL_BUTTON_DOWN:
		switch (vThis.pViewMode())
		{
		case cSPSettings.VIEWMODE_DEFAULT:
			switch (vThis.mSelection)
			{
			case vThis.mDivReconnectToWIFI:		o = vThis.mDivReloadControlPanel; break;
			case vThis.mDivReloadControlPanel:	o = vThis.mDivToggleSSH; break;
			case vThis.mDivToggleSSH:			o = vThis.mDivSetTime; break;
			case vThis.mDivSetTime:				o = vThis.mDivReboot; break;
			case vThis.mDivReboot:				o = vThis.mDivSetEventTicker; break;
			case vThis.mDivSetEventTicker:		o = vThis.mDivBack; break;
			default: 							return;
			}
			
			vThis.mSelection.css("opacity", "0.2");
			vThis.mSelection = o;
			vThis.mSelection.css("opacity", "1");
			vThis.mDivIndicator.css(vThis.mSelection.pIndicatorStyle);
			break;
		case cSPSettings.VIEWMODE_SETTING_TIMEZONE:
			switch (vThis.mSelection)
			{
			case vThis.mDivSettingTimezoneTitle:
				vThis.pSelection(vThis.mDivBack, false, true);
				break;
			case vThis.mDivSettingTimezoneListContainer:
				vThis.fShiftTimezoneSelection(vThis.mCurrHighlightTimezone + 1);
				break;
			case vThis.mDivBack:
				break;
			}
			break;
		}
		break;
	}
}

// -------------------------------------------------------------------------------------------------
//	fShow / fHide
// -------------------------------------------------------------------------------------------------
cSPSettings.prototype.fShow = function(
)
{
	this.pViewMode(cSPSettings.VIEWMODE_DEFAULT);
	this.mDiv.show();
}
cSPSettings.prototype.fHide = function(
)
{
	this.mDiv.hide();
}

// -------------------------------------------------------------------------------------------------
//	fAnimateIn / fAnimateOut
// -------------------------------------------------------------------------------------------------
cSPSettings.prototype.fAnimateIn = function(
	vReturnFun
)
{
	this.fShow();
	this.mDiv.fadeIn(200, function() { if (vReturnFun) vReturnFun(); });
}
cSPSettings.prototype.fAnimateOut = function(
	vReturnFun
)
{
	this.mDiv.fadeOut(200, function() { if (vReturnFun) vReturnFun(); });
}

// -------------------------------------------------------------------------------------------------
//	fUpdate
// -------------------------------------------------------------------------------------------------
cSPSettings.prototype.fDisplay = function(
	vData
)
{
	var o, mCPanel, vThis;
	mCPanel = cCPanel.fGetInstance();
	vThis = cSPSettings.instance;

	if (vData)
	{
		if ($("#div_messageBoard_text").html() !== vData)
		{
			vThis.mMessageList.push(vData);
			if (vThis.mMessageDisplayInProgress === false)
			{
				vThis.mMessageDisplayInProgress = true;
				$("#div_messageBoard_text").fadeOut("fast", function() {
					$("#div_messageBoard_text").html(vData);
					vThis.mMessageList.splice(0, 1);
					$("#div_messageBoard_text").fadeIn("fast", function() {
						if (vThis.mMessageList.length > 0)
							vThis.fDisplay();
						else
							vThis.mMessageDisplayInProgress = false;
					});
				});
			}
		}
		else
		{
			if (vThis.mMessageList.length > 0)
				vThis.mMessageList.splice(0, 1);
			vThis.fDisplay();
		}
	}
	else
	{
		if (vThis.mMessageList.length == 0)
			return;
		o = vThis.mMessageList[0];
		vThis.mMessageList.splice(0, 1);
		if (vThis.mMessageDisplayInProgress === false)
			vThis.mMessageDisplayInProgress = true;
			
		$("#div_messageBoard_text").fadeOut("fast", function() {
			$("#div_messageBoard_text").html(o);
			$("#div_messageBoard_text").fadeIn("fast", function() {
				if (vThis.mMessageList.length > 0)
					vThis.fDisplay();
				else
					vThis.mMessageDisplayInProgress = false;
			});
		});
	}
	cCPanel.instance.mSubState = "messageBoard";
}


// -------------------------------------------------------------------------------------------------
//	fUpdate
// -------------------------------------------------------------------------------------------------
cSPSettings.prototype.fShiftTimezoneSelection = function(
	vData
)
{
	var vThis;
	vThis = this;
	o = $(vThis.mDivSettingTimezoneListContainer.children()[0]).children().length
	
	if (vData >= o)
	{
		vData = o - 1;
		return;
	}
	else if (vData < 0)
	{
		vData = 0;
		return;
	}
	
	for (i = 0; i < o; i++)
		if (i == vData)
		{
			$($(vThis.mDivSettingTimezoneListContainer.children()[0]).children()[i]).css("opacity", "1");
			$($(vThis.mDivSettingTimezoneListContainer.children()[0]).children()[i]).css("font-weight", "bold");
		}
		else
		{
			$($(vThis.mDivSettingTimezoneListContainer.children()[0]).children()[i]).css("opacity", "0.3");
			$($(vThis.mDivSettingTimezoneListContainer.children()[0]).children()[i]).css("font-weight", "normal");
		}
	$(vThis.mDivSettingTimezoneListContainer.children()[0]).css("top", 58 - 52 * vData + "px");
	vThis.mCurrHighlightTimezone = vData;
}











cSPSettings.prototype.fBack = function(
	vData
)
{
//~ fDbg("*** cSPSetting, fBack(), ");
	var vThis;
	vThis = this;
	
	switch (vThis.mViewMode)
	{
	case cSPSettings.VIEWMODE_SETTING_TIME:
		break;
	case cSPSettings.VIEWMODE_SETTING_EVENTTICKER:
		vThis.pViewMode(cSPSettings.VIEWMODE_DEFAULT);
		break;
	}
}
