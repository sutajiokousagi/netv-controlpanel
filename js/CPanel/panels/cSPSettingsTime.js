// -------------------------------------------------------------------------------------------------
//	cSPSettingsTime class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cSPSettingsTime(
	vDiv
)
{
	var o, p;
	
	if (typeof(vDiv) == "string")
		this.mDiv = $("#" + vDiv);
	else
		this.mDiv = vDiv;
	this.mID = vDiv;

	this.mPrevSelection = null;
	this.mSelection = null;
	
	// div elements
	this.mDivIndicator = null;
	this.mDivBack = null;
	this.mDivItemList = [];
	o = $(this.mDiv.children()[1]);
	for (i = 0; i < o.children().length; i++)
	{
		p = $(o.children()[i]);
		p.pIndicatorStyle = {
			width: parseInt(p.css("width").split("px")[0]) + 80 + "px",
			height: parseInt(p.css("height").split("px")[0]) + "px",
			top: parseInt(o.css("top").split("px")[0]) + (i * parseInt(p.css("height").split("px")[0])) + "px",
			left: parseInt(o.css("left").split("px")[0]) - 40 + "px",
		};
		this.mDivItemList.push(p);
	}
	
	this.mMonthList = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JULY", "AUG", "SEP", "OCT", "NOV", "DEC"];
	this.mMonthLimit = [0, 11];
	this.mDayLimit = [1, 31];
	this.mHourLimit = [0, 23];
	this.mMinuteLimit = [0, 59];
	
	/*
	this.mDivSettingTimezoneTitle = $(this.mDiv.children("#setting_timezone").children()[0]);
	this.mDivSettingTimezoneTitle.pIndicatorStyle = { width: "740px", height: "36px", top: "140px", left: "30px" };
	this.mDivSettingTimezoneListContainer = $(this.mDiv.children("#setting_timezone").children()[1]);
	this.mDivSettingTimezoneListContainer.pIndicatorStyle = { width: "640px", height: "36px", top: "260px", left: "80px" };
	*/
	
	// view modes
	this.mViewMode = null;
	cSPSettingsTime.VIEWMODE_DEFAULT = "viewmode_default";
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cSPSettingsTime.instance = null;
cSPSettingsTime.fGetInstance = function(
	vDiv
)
{
	return cSPSettingsTime.instance ? cSPSettingsTime.instance : cSPSettingsTime.instance = new cSPSettingsTime(vDiv);
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cSPSettingsTime.prototype.fInit = function(
)
{
fDbg("*** cSPSettingsTime, fInit(), ");
	var vThis;
	vThis = this;
}

/** ------------------------------------------------------------------------------------------------
 *	pDivIndicator
 * -----------------------------------------------------------------------------------------------*/
cSPSettingsTime.prototype.pDivIndicator = function(
	v
)
{
fDbg("*** cSPSettingTime, pDivIndicator(), ");
	if (v)
		this.mDivIndicator = v;
}

/** ------------------------------------------------------------------------------------------------
 *	pDivBack
 * -----------------------------------------------------------------------------------------------*/
cSPSettingsTime.prototype.pDivBack = function(
	v
)
{
fDbg("*** cSPSettingTime, pDivBack(), ");
	if (v)
		this.mDivBack = v;
}

/** ------------------------------------------------------------------------------------------------
 *	pViewMode
 * -----------------------------------------------------------------------------------------------*/
cSPSettingsTime.prototype.pViewMode = function(
	v
)
{
	var vThis, i, o, p;
	vThis = this;
if (!v) return vThis.mViewMode;
	
	switch (v)
	{
	case cSPSettingsTime.VIEWMODE_DEFAULT:
		vThis.pSelection(vThis.mDivItemList[0], false, true);
		break;
	}
	vThis.mViewMode = v;
}

// -------------------------------------------------------------------------------------------------
//	pSelection
// -------------------------------------------------------------------------------------------------
cSPSettingsTime.prototype.pSelection = function(
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
//	fShow / fHide
// -------------------------------------------------------------------------------------------------
cSPSettingsTime.prototype.fShow = function(
)
{
	this.pViewMode(cSPSettingsTime.VIEWMODE_DEFAULT);
	this.mDiv.show();
	this.mDivBack.html("DONE");
	
	var vThis = this;
	var vDate = new Date();
	o = $($(vThis.mDivItemList[0].children()[2]).children()[0]);
	o.html(vDate.getFullYear());
	o = $($(vThis.mDivItemList[1].children()[2]).children()[0]);
	o.html(vThis.mMonthList[vDate.getMonth()]);
	o = $($(vThis.mDivItemList[2].children()[2]).children()[0]);
	o.html(vDate.getDate());
	o = $($(vThis.mDivItemList[3].children()[2]).children()[0]);
	o.html(vDate.getHours());
	o = $($(vThis.mDivItemList[4].children()[2]).children()[0]);
	o.html(vDate.getMinutes());
}
cSPSettingsTime.prototype.fHide = function(
)
{
	this.mDiv.hide();
}

// -------------------------------------------------------------------------------------------------
//	fAnimateIn / fAnimateOut
// -------------------------------------------------------------------------------------------------
cSPSettingsTime.prototype.fAnimateIn = function(
	vReturnFun
)
{
	this.fShow();
	this.mDiv.fadeIn(200, function() { if (vReturnFun) vReturnFun(); });
}
cSPSettingsTime.prototype.fAnimateOut = function(
	vReturnFun
)
{
	this.mDiv.fadeOut(200, function() { if (vReturnFun) vReturnFun(); });
}

// -------------------------------------------------------------------------------------------------
//	fOnSignal
// -------------------------------------------------------------------------------------------------
cSPSettingsTime.prototype.fOnSignal = function(
	vSignal,		// string
	vData,			// data array
	vReturnFun		// return function call
)
{
//~ fDbg("*** cSPSettingsTime, fOnSignal(), " + vSignal + ", " + vData);
	var vThis, o, i;
	vThis = this;
	
	switch(vSignal)
	{
	case cConst.SIGNAL_TOGGLE_CONTROLPANEL:
		break;
		
	case cConst.SIGNAL_TOGGLE_WIDGETENGINE:
		break;
		
	case cConst.SIGNAL_BUTTON_LEFT:
		o = vThis.pSelection();
		i = vThis.mDivItemList.indexOf(o);
		o = $($(o.children()[2]).children()[0]);
		
		switch (i)
		{
		case 0:
			o.html(parseInt(o.html()) - 1);
			break;
			
		case 1:
			i = this.mMonthList.indexOf(o.html()) - 1;
			if (i < this.mMonthLimit[0])
				i = this.mMonthLimit[1];
			o.html(this.mMonthList[i]);
			break;
			
		case 2:
			i = parseInt(o.html()) - 1;
			if (i < this.mDayLimit[0])
				i = this.mDayLimit[1];
			o.html(i);
			break;
			
		case 3:
			i = parseInt(o.html()) - 1;
			if (i < this.mHourLimit[0])
				i = this.mHourLimit[1];
			o.html(i);
			break;
		
		case 4:
			i = parseInt(o.html()) - 1;
			if (i < this.mMinuteLimit[0])
				i = this.mMinuteLimit[1];
			o.html(i);
			break;
		}
		break;
		
	case cConst.SIGNAL_BUTTON_RIGHT:
		o = vThis.pSelection();
		i = vThis.mDivItemList.indexOf(o);
		o = $($(o.children()[2]).children()[0]);
		
		switch (i)
		{
		case 0:
			o.html(parseInt(o.html()) + 1);
			break;
			
		case 1:
			i = this.mMonthList.indexOf(o.html()) + 1;
			if (i > this.mMonthLimit[1])
				i = this.mMonthLimit[0];
			o.html(this.mMonthList[i]);
			break;
			
		case 2: 
			i = parseInt(o.html()) + 1;
			if (i > this.mDayLimit[1])
				i = this.mDayLimit[0];
			o.html(i);
			break;
			
		case 3:
			i = parseInt(o.html()) + 1;
			if (i > this.mHourLimit[1])
				i = this.mHourLimit[0];
			o.html(i);
			break;
			
		case 4:
			i = parseInt(o.html()) + 1;
			if (i > this.mMinuteLimit[1])
				i = this.mMinuteLimit[0];
			o.html(i);
			break;
		}
		break;
		
	case cConst.SIGNAL_BUTTON_CENTER:
		o = vThis.pSelection();
		if (o == this.mDivBack)
		{
			cCPanel.fGetInstance().fBack();
			this.mDivBack.html("BACK");
			
			var vStr = "";
			for (i = 0; i < 5; i++)
			{
				o = $($(vThis.mDivItemList[i].children()[2]).children()[0]).html();
				if (i == 1)
					o = this.mMonthList.indexOf(o) + 1;
				vStr += o + (i == 4 ? "" : "_");
			}
			cProxy.xmlhttpPost("./bridge", "post", {cmd : "FixTime", data: vStr}, function(vData) {
				fDbg(">>> -----FixTime : " + vData);
			});
		}
		/*
		switch (vThis.pViewMode())
		{
		case cSPSettingsTime.VIEWMODE_DEFAULT:
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
					});
				}
				break;
			case vThis.mDivSetTimezone:
				vThis.pViewMode(cSPSettingsTime.VIEWMODE_SETTING_TIMEZONE);
				break;
			case vThis.mDivReboot:
				cProxy.fReboot();
				break;
			case vThis.mDivBack:
				cCPanel.fGetInstance().fBack();
				break;
			}
			break;
		case cSPSettingsTime.VIEWMODE_SETTING_TIMEZONE:
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
				vThis.pViewMode(cSPSettingsTime.VIEWMODE_DEFAULT);
				break;
			}
			break;
		}
		*/
		break;
		
	case cConst.SIGNAL_BUTTON_UP:
		o = vThis.pSelection();
		i = vThis.mDivItemList.indexOf(o);
		if (i == -1)
			this.pSelection(vThis.mDivItemList[4], true, false);
		else if (i != 0)
			this.pSelection(vThis.mDivItemList[i-1], false, false);
		break;
		
	case cConst.SIGNAL_BUTTON_DOWN:
		o = vThis.pSelection();
		i = vThis.mDivItemList.indexOf(o);
		
		if (i == 4)
			this.pSelection(vThis.mDivBack, false, true);
		else if (i > -1)
			this.pSelection(vThis.mDivItemList[i+1], false, false);
		break;
	}
}

// -------------------------------------------------------------------------------------------------
//	fUpdate
// -------------------------------------------------------------------------------------------------
cSPSettingsTime.prototype.fShiftTimezoneSelection = function(
	vData
)
{
	var vThis;
	vThis = this;
	/*
	o = $(vThis.mDivSettingTimezoneListContainer.children()[0]).children().length;
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
	*/
}























		
		/*
		switch (vThis.pViewMode())
		{
		case cSPSettingsTime.VIEWMODE_DEFAULT:
			switch (vThis.mSelection)
			{
			case vThis.mDivReloadControlPanel:	o = vThis.mDivReconnectToWIFI; break;
			case vThis.mDivToggleSSH:			o = vThis.mDivReloadControlPanel; break;
			case vThis.mDivSetTimezone:			o = vThis.mDivToggleSSH; break;
			case vThis.mDivReboot:				o = vThis.mDivSetTimezone; break;
			case vThis.mDivBack:				o = vThis.mDivReboot; break;
			default: 							return;
			}
			vThis.mSelection.css("opacity", "0.2");
			vThis.mSelection = o;
			vThis.mSelection.css("opacity", "1");
			vThis.mDivIndicator.css(vThis.mSelection.pIndicatorStyle);
			break;
		case cSPSettingsTime.VIEWMODE_SETTING_TIMEZONE:
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
		*/
		/*
		switch (vThis.pViewMode())
		{
		case cSPSettingsTime.VIEWMODE_DEFAULT:
			switch (vThis.mSelection)
			{
			case vThis.mDivReconnectToWIFI:		o = vThis.mDivReloadControlPanel; break;
			case vThis.mDivReloadControlPanel:	o = vThis.mDivToggleSSH; break;
			case vThis.mDivToggleSSH:			o = vThis.mDivSetTimezone; break;
			case vThis.mDivSetTimezone:			o = vThis.mDivReboot; break;
			case vThis.mDivReboot:				o = vThis.mDivBack; break;
			default: 							return;
			}
			
			vThis.mSelection.css("opacity", "0.2");
			vThis.mSelection = o;
			vThis.mSelection.css("opacity", "1");
			vThis.mDivIndicator.css(vThis.mSelection.pIndicatorStyle);
			break;
		case cSPSettingsTime.VIEWMODE_SETTING_TIMEZONE:
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
		*/
