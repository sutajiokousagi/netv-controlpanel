// -------------------------------------------------------------------------------------------------
//	cSPSettingsEventTicker class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cSPSettingsEventTicker(
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
	o = this.mDiv;
	for (i = 0; i < o.children().length; i++)
	{
		//~ p = $($(o.children()[i]).children()[0]);
		p = $(o.children()[i]);
		p.pIndicatorStyle = {
			width: parseInt(p.css("width").split("px")[0]) + 80 + "px",
			height: parseInt(p.css("height").split("px")[0]) + "px",
			top: parseInt(p.css("top").split("px")[0]) + "px",
			left: parseInt(p.css("left").split("px")[0]) - 40 + "px",
		};
		this.mDivItemList.push(p);
	}
	
	// view modes
	this.mViewMode = null;
	cSPSettingsEventTicker.VIEWMODE_DEFAULT = "viewmode_default";
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cSPSettingsEventTicker.instance = null;
cSPSettingsEventTicker.fGetInstance = function(
	vDiv
)
{
	return cSPSettingsEventTicker.instance ? cSPSettingsEventTicker.instance : cSPSettingsEventTicker.instance = new cSPSettingsEventTicker(vDiv);
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cSPSettingsEventTicker.prototype.fInit = function(
)
{
//~ fDbg2("*** cSPSettingsEventTicker, fInit(), ");
	var vThis;
	vThis = this;
}

/** ------------------------------------------------------------------------------------------------
 *	pDivIndicator
 * -----------------------------------------------------------------------------------------------*/
cSPSettingsEventTicker.prototype.pDivIndicator = function(
	v
)
{
	if (v)
		this.mDivIndicator = v;
}

/** ------------------------------------------------------------------------------------------------
 *	pDivIndicator
 * -----------------------------------------------------------------------------------------------*/
cSPSettingsEventTicker.prototype.pDivBack = function(
	v
)
{
	if (v)
		this.mDivBack = v;
}

/** ------------------------------------------------------------------------------------------------
 *	pViewMode
 * -----------------------------------------------------------------------------------------------*/
cSPSettingsEventTicker.prototype.pViewMode = function(
	v
)
{
	var vThis, i, o, p;
	vThis = this;
if (!v) return vThis.mViewMode;
	
	switch (v)
	{
	case cSPSettingsEventTicker.VIEWMODE_DEFAULT:
		vThis.pSelection(vThis.mDivItemList[0], false, true);
		
		o = vThis.mDivItemList[0];
		o = $($($(o.children()[0]).children()[2]).children()[0]);
		o.html(cModel.fGetInstance().EVENTTICKER_SPEED);
		
		o = vThis.mDivItemList[1];
		o = $($($(o.children()[0]).children()[2]).children()[0]);
		o.html(cModel.fGetInstance().EVENTTICKER_REPEATCOUNT);
		
		o = vThis.mDivItemList[2];
		o = $($($(o.children()[0]).children()[2]).children()[0]);
		if (cModel.fGetInstance().EVENTTICKER_LINECOUNT == 1)
			o.html("Single Line");
		else if (cModel.fGetInstance().EVENTTICKER_LINECOUNT == 2)
			o.html("Double Line");
		
		// update value according to cModel data
		$($(vThis.mDivItemList[0].children()[2]).children()[0]).html(cModel.fGetInstance().EVENTTICKER_SPEED);
		break;
	}
	vThis.mViewMode = v;
}

// -------------------------------------------------------------------------------------------------
//	pSelection
// -------------------------------------------------------------------------------------------------
cSPSettingsEventTicker.prototype.pSelection = function(
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
	//~ fDbg(JSON.stringify(vThis.mSelection.pIndicatorStyle));
}

// -------------------------------------------------------------------------------------------------
//	fShow / fHide
// -------------------------------------------------------------------------------------------------
cSPSettingsEventTicker.prototype.fShow = function(
)
{
	this.pViewMode(cSPSettingsEventTicker.VIEWMODE_DEFAULT);
	this.mDiv.show();
}
cSPSettingsEventTicker.prototype.fHide = function(
)
{
	this.mDiv.hide();
}

// -------------------------------------------------------------------------------------------------
//	fAnimateIn / fAnimateOut
// -------------------------------------------------------------------------------------------------
cSPSettingsEventTicker.prototype.fAnimateIn = function(
	vReturnFun
)
{
	this.fShow();
	this.mDiv.fadeIn(200, function() { if (vReturnFun) vReturnFun(); });
}
cSPSettingsEventTicker.prototype.fAnimateOut = function(
	vReturnFun
)
{
	this.mDiv.fadeOut(200, function() { if (vReturnFun) vReturnFun(); });
}

// -------------------------------------------------------------------------------------------------
//	fOnSignal
// -------------------------------------------------------------------------------------------------
cSPSettingsEventTicker.prototype.fOnSignal = function(
	vSignal,		// string
	vData,			// data array
	vReturnFun		// return function call
)
{
//~ fDbg("*** cSPSettingsEventTicker, fOnSignal(), " + vSignal + ", " + vData);
	var vThis, o, p, i, j;
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
		o = $($($(o.children()[0]).children()[2]).children()[0]);
		if (i == 0)
		{
			p = parseInt(o.html()) - 1;
			if (p < 1)
				p = 1;
			o.html(p);
			cModel.fGetInstance().EVENTTICKER_SPEED = p;
			cProxy.fSaveModelData();
		}
		if (i == 1)
		{
			p = parseInt(o.html()) - 1;
			if (p < 1)
				p = 1;
			o.html(p);
			cModel.fGetInstance().EVENTTICKER_REPEATCOUNT = p;
			cProxy.fSaveModelData();
		}
		if (i == 2)
		{
			//~ p = parseInt(o.html()) - 1;
			p = cModel.fGetInstance().EVENTTICKER_LINECOUNT;
			p--;
			if (p < 1)
				p = 1;
			o.html("Single Line");
			cModel.fGetInstance().EVENTTICKER_LINECOUNT = p;
			cProxy.fSaveModelData();
		}
		break;
		
	case cConst.SIGNAL_BUTTON_RIGHT:
		o = vThis.pSelection();
		i = vThis.mDivItemList.indexOf(o);
		o = $($($(o.children()[0]).children()[2]).children()[0]);
		if (i == 0)
		{
			p = parseInt(o.html()) + 1;
			if (p > 5)
				p = 5;
			o.html(p);
			cModel.fGetInstance().EVENTTICKER_SPEED = p;
			cProxy.fSaveModelData();
		}
		if (i == 1)
		{
			p = parseInt(o.html()) + 1;
			if (p > 3)
				p = 3;
			o.html(p);
			cModel.fGetInstance().EVENTTICKER_REPEATCOUNT = p;
			cProxy.fSaveModelData();
		}
		if (i == 2)
		{
			//~ p = parseInt(o.html()) + 1;
			p = cModel.fGetInstance().EVENTTICKER_LINECOUNT;
			p++;
			if (p > 2)
				p = 2;
			o.html("Double Line");
			cModel.fGetInstance().EVENTTICKER_LINECOUNT = p;
			cProxy.fSaveModelData();
		}
		break;
		
	case cConst.SIGNAL_BUTTON_CENTER:
		switch (vThis.pViewMode())
		{
		case cSPSettingsEventTicker.VIEWMODE_DEFAULT:
			switch (vThis.mSelection)
			{
			case vThis.mDivBack:
				cSPSettings.fGetInstance().fBack();
				break;
			}
		}
		break;
		
	case cConst.SIGNAL_BUTTON_UP:
		if (vThis.pSelection() == vThis.mDivBack)
		{
			o = vThis.mDivItemList[vThis.mDivItemList.length - 1];
			vThis.pSelection(o, true, true);
		}
		else
		{
			o = vThis.pSelection();
			i = vThis.mDivItemList.indexOf(o);
			if (i > 0)
			{
	 			i--;
				vThis.pSelection(vThis.mDivItemList[i], false, true);
			}
		}
		break;
		
	case cConst.SIGNAL_BUTTON_DOWN:
		o = vThis.pSelection();
		i = vThis.mDivItemList.indexOf(o);
		
		if (i > -1)
			if (i == vThis.mDivItemList.length - 1)
			{
				o = vThis.mDivBack;
				vThis.pSelection(o, false, true);
			}
			else
			{
				i++;
				vThis.pSelection(vThis.mDivItemList[i], false, true);
			}
		break;
	}
}

// -------------------------------------------------------------------------------------------------
//	fUpdate
// -------------------------------------------------------------------------------------------------
cSPSettingsEventTicker.prototype.fShiftTimezoneSelection = function(
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
