// -------------------------------------------------------------------------------------------------
//	cSPChannels class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cSPChannels(
	vDiv
)
{
	this.mDiv = $("#" + vDiv);
	this.mID = vDiv;

	this.mStyle = {
		mChannelListRow: 2,
		mChannelListColumn: 4,
		mWidgetListRow: 3,
		mWidgetListColumn: 6
	};
	
	// div elements
	this.mDivIndicator = null;
	
	this.mDivConfigPopup = null;
	this.mDivConfigPopupList = null;
	
	this.mDivChannels = null;
	this.mDivChannelList = null;
	
	this.mDivWidgets = null;
	this.mDivWidgetsContent = null;
	this.mDivWidgetList = null;
	this.mDivWidgetSummary = null;
	this.mDivChannelOperation = null;
	
	this.mDivWidgetConfig = null;
	this.mDivWidgetConfigList = null;
	this.mDivWidgetAuth = null;
	this.mDivWidgetAuthInput = null;
	this.mDivWidgetAuthInput_Username = null;
	this.mDivWidgetAuthInput_Username_Content = null;
	this.mDivWidgetAuthInput_Password = null;
	this.mDivWidgetAuthInput_Password_Content = null;
	this.mDivWidgetAuthInput_OK = null;
	this.mDivWidgetAuthInput_CANCEL = null;
	
	this.mDivInputPanel = null;
	
	this.mDivSubNaviContent = null;
	this.mDivBack = null;
	
	// div variables
	this.mPrevSelection = null;
	this.mSelection = null;
	this.mSelectedChannelN = null;
	this.mSelectedWidgetN = null;

	this.mMode = null; 		// null (default) | mode_channel | mode_widget
	this.mPrevMode = null;
	cSPChannels.MODE_DEFAULT = "mode_default";
	cSPChannels.MODE_WIDGETLIST = "mode_widgetlist";
	cSPChannels.MODE_WIDGETCONFIG_POPUP = "mode_widgetconfig_popup";
	cSPChannels.MODE_WIDGETCONFIG = "mode_widgetconfig";
	cSPChannels.MODE_WIDGETAUTH = "mode_widgetauth";
	cSPChannels.MODE_WIDGETAUTH_INPUT = "mode_widgetauth_input";
	cSPChannels.MODE_INPUT = "mode_input";
	
	this.mCurrWidgetConfigurable = false;
	
	
	this.mLocked = false;

	// fInit();
	this.fInit();
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cSPChannels.instance = null;
cSPChannels.fGetInstance = function( vDiv ) { return cSPChannels.instance ? cSPChannels.instance : cSPChannels.instance = new cSPChannels(vDiv); }

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cSPChannels.prototype.fInit = function(
)
{
//~ fDbg("*** cSPChannel, fInit(), ");
	this.mDivIndicator = this.mDiv.children("#item_indicators").children("#item_indicator");
	this.mDivConfigPopup = this.mDiv.children("#div_channelMain_config_popup");
	
	this.mDivChannels = this.mDiv.children("#div_channelMain_channels");
	this.mDivWidgets = this.mDiv.children("#div_channelMain_widgets");
	this.mDivWidgetConfig = this.mDiv.children("#div_channelMain_widgetconfig");
	this.mDivWidgetAuth = this.mDiv.children("#div_channelMain_widgetauth");
	this.mDivWidgetAuthInput = this.mDiv.children("#div_channelMain_widgetauth_input");
	this.mDivWidgetAuthInput_Username = $(this.mDivWidgetAuthInput.children()[0]);
	this.mDivWidgetAuthInput_Username.pIndicatorStyle = {width: "600px", height: "50px", left: "100px", top: "353px"};
	this.mDivWidgetAuthInput_Username_Content = this.mDivWidgetAuthInput_Username.children("#input_username");
	this.mDivWidgetAuthInput_Password = $(this.mDivWidgetAuthInput.children()[1]);
	this.mDivWidgetAuthInput_Password.pIndicatorStyle = {width: "600px", height: "50px", left: "100px", top: "413px"};
	this.mDivWidgetAuthInput_Password_Content = this.mDivWidgetAuthInput_Password.children("#input_password");
	this.mDivWidgetAuthInput_OK = this.mDivWidgetAuthInput.children("#input_OK");
	this.mDivWidgetAuthInput_OK.pIndicatorStyle =  {width: "96px", height: "36px", top: "513px", left: "295px" };
	this.mDivWidgetAuthInput_CANCEL = this.mDivWidgetAuthInput.children("#input_CANCEL");
	this.mDivWidgetAuthInput_CANCEL.pIndicatorStyle =  {width: "96px", height: "36px", top: "513px", left: "415px" };
	
	this.mDivInputPanel = this.mDiv.children("#div_channelMain_inputpanel");
	
	this.mDivSubNaviContent = $(this.mDiv.children("#subnavi").children()[0]);
	this.mDivBack = $(this.mDiv.children("#subnavi_action").children()[0]);
	this.mDivBack.pIndicatorStyle = { width: "96px", height: "36px", top: "551px", left: "360px" };
}

// -------------------------------------------------------------------------------------------------
//	pMode
// -------------------------------------------------------------------------------------------------
cSPChannels.prototype.pMode = function(
	vMode
)
{
//~ fDbg("*** cSPChannels, pMode(), " + vMode);
	var vThis, o;
	vThis = this;
if (!vMode) return vThis.mMode;

	switch (vMode)
	{
	case cSPChannels.MODE_DEFAULT:
		vThis.mDivWidgets.css("opacity", "1");
		vThis.mDivIndicator.css("opacity", "1");
		vThis.mDivInputPanel.hide();
		vThis.mDivConfigPopup.hide();
		vThis.mDivChannels.show();
		vThis.mDivWidgets.hide();
		vThis.mDivWidgetConfig.hide();
		vThis.mDivWidgetAuth.hide();
		vThis.mDivWidgetAuthInput.hide();
		vThis.mDivBack.show();
		vThis.mDivBack.html("BACK");
		
		vThis.mDivSubNaviContent.html("Channels");
		vThis.fRenderChannelList();
		vThis.mDivBack.css("opacity", "0.2");
		vThis.mDivIndicator.css(vThis.mDivChannelList[0].pIndicatorStyle);
		vThis.pSelection(vThis.mDivChannelList[0]);
		
		vThis.mPrevMode = vThis.mMode;
		vThis.mMode = vMode;
		
		// check/load thumbnails (first 4)
		o = [];
		for (i = 0; i < cModel.fGetInstance().CHANNEL_LIST.length; i++)
			for (j = 0; j < cModel.fGetInstance().CHANNEL_LIST[i].mWidgetList.length; j++)
				if (j < 4)
				{
					if (cModel.fGetInstance().CHANNEL_LIST[i].mWidgetList[j].mLocalThumbnailPath == "")
						o.push([i, j]);
				}
				else
					break;
			
		var fun1 = function() {
			var vChannelN, vWidgetN;
			vChannelN = o[0][0];
			vWidgetN = o[0][1];
			cChannelModule.fGetInstance().fPreloadChannelThumbnails(cModel.fGetInstance().CHANNEL_LIST[vChannelN], [vWidgetN, 1], function(vData) {
				fDbg(vData);
				$($(vThis.mDivChannelList[vData[0]].children()[1]).children()[vData[1]]).children("img").attr("src", cModel.fGetInstance().CHANNEL_LIST[vData[0]].mWidgetList[vData[1]].mLocalThumbnailPath);
				o.splice(0, 1);
				if (o.length > 0)
					fun1();
			});
		}
		if (o.length > 0)
			fun1();
		break;
		
	case cSPChannels.MODE_WIDGETLIST:
		if (vThis.mMode == cSPChannels.MODE_WIDGETCONFIG_POPUP)
		{
			vThis.mDivConfigPopup.fadeOut();
			vThis.mDivWidgets.css("opacity", "1");
			vThis.mDivIndicator.css("opacity", "1");
			vThis.mSelection = vThis.mDivWidgetList[vThis.mSelectedWidgetN];
		}
		else
		{
			vThis.mDivInputPanel.hide();
			vThis.mDivConfigPopup.hide();
			vThis.mDivChannels.hide();
			vThis.mDivWidgets.show();
			vThis.mDivWidgetConfig.hide();
			vThis.mDivWidgetAuth.hide();
			vThis.mDivWidgetAuthInput.hide();
			vThis.mDivSubNaviContent.html(cModel.fGetInstance().CHANNEL_LIST[vThis.mSelectedChannelN].mName);
			vThis.mDivBack.show();
			vThis.mDivBack.html("BACK");
			
			vThis.fRenderWidgetList(cModel.fGetInstance().CHANNEL_LIST[vThis.mSelectedChannelN]);
			vThis.mDivIndicator.css({
				width: "50px",
				height: "50px",
				top: "150px",
				left: "150px"
			});
			vThis.mDivBack.css("opacity", "0.2");
			vThis.pSelection(vThis.mDivWidgetList[0]);
		}
		
		vThis.mPrevMode = vThis.mMode;
		vThis.mMode = vMode;
		break;
		
	case cSPChannels.MODE_WIDGETCONFIG_POPUP:
		vThis.mDivWidgets.css("opacity", "0.4");
		vThis.mDivIndicator.css("opacity", "0.4");
		i = vThis.mDivWidgetList.indexOf(vThis.mSelection);
		vThis.fShowWidgetConfigPopup(vThis.mSelectedChannelN, i);
		vThis.mPrevMode = vThis.mMode;
		vThis.mMode = vMode;
		vThis.pSelection(vThis.mDivConfigPopupList[0], false, false);
		break;
		
	case cSPChannels.MODE_WIDGETCONFIG:
		vThis.mDivWidgets.css("opacity", "1");
		vThis.mDivIndicator.css("opacity", "1");
		vThis.mDivConfigPopup.fadeOut();
		vThis.mDivInputPanel.hide();
		vThis.mDivChannels.hide();
		vThis.mDivWidgets.hide();
		vThis.mDivWidgetConfig.show();
		vThis.mDivWidgetAuth.hide();
		vThis.mDivWidgetAuthInput.hide();
		vThis.mDivBack.show();
		vThis.mDivBack.html("BACK");
		
		vThis.mDivSubNaviContent.html(cModel.fGetInstance().CHANNEL_LIST[vThis.mSelectedChannelN].mWidgetList[vThis.mSelectedWidgetN].mName);
		
		vThis.fRenderWidgetParamConfig(vThis.mSelectedChannelN, vThis.mSelectedWidgetN);
		vThis.mDivIndicator.css(vThis.mDivWidgetConfigList[0].pIndicatorStyle);
		vThis.mDivBack.css("opacity", "0.2");
		vThis.pSelection(vThis.mDivWidgetConfigList[0]);
		
		vThis.mPrevMode = vThis.mMode;
		vThis.mMode = vMode;
		break;
		
	case cSPChannels.MODE_WIDGETAUTH:
		vThis.mDivWidgets.css("opacity", "1");
		vThis.mDivIndicator.css("opacity", "1");
		vThis.mDivConfigPopup.fadeOut();
		vThis.mDivInputPanel.hide();
		vThis.mDivChannels.hide();
		vThis.mDivWidgets.hide();
		vThis.mDivWidgetConfig.hide();
		vThis.mDivWidgetAuth.show();
		vThis.mDivWidgetAuthInput.hide();
		vThis.mDivBack.show();
		vThis.mDivBack.html("BACK");
		
		vThis.mDivSubNaviContent.html(cModel.fGetInstance().CHANNEL_LIST[vThis.mSelectedChannelN].mWidgetList[vThis.mSelectedWidgetN].mName);
		
		vThis.fRenderWidgetAuth(vThis.mSelectedChannelN, vThis.mSelectedWidgetN);
		vThis.mDivIndicator.css(vThis.mDivBack.pIndicatorStyle);
		vThis.mDivBack.css("opacity", "1");
		vThis.pSelection(vThis.mDivBack);
		
		vThis.mPrevMode = vThis.mMode;
		vThis.mMode = vMode;
		break;
		
	case cSPChannels.MODE_WIDGETAUTH_INPUT:
		vThis.mDivWidgetAuthInput.show();
		vThis.pSelection(vThis.mDivWidgetAuthInput_Username);
		vThis.mDivBack.hide();
		
		
		vThis.mPrevMode = vThis.mMode;
		vThis.mMode = vMode;
		break;
		
	case cSPChannels.MODE_INPUT:
		vThis.mDivInputPanel.show();
		if (keyboard_currentY > 4)
			keyboard_onRemoteControl("up", "input_username");
		else if (keyboard_currentY < 0)
			keyboard_onRemoteControl("down", "input_username");
			
		vThis.mPrevMode = vThis.mMode;
		vThis.mMode = vMode;
		break;
	}
	
	//~ fDbg(vThis.mPrevMode + " >>>> " + vThis.mMode);
}

// -------------------------------------------------------------------------------------------------
//	pSelection
// -------------------------------------------------------------------------------------------------
cSPChannels.prototype.pSelection = function(
	vSelection,
	vDimPrevSelection,		// false | true
	vLightNewSelection		// false | true
)
{
//~ fDbg("*** cSPChannels, pSelection(), ");
	var vThis, o, p, i;
	vThis = this;
if (!vSelection) return vThis.mSelection;
	
	if (vThis.mMode == cSPChannels.MODE_WIDGETCONFIG_POPUP)
	{
		if (vThis.mSelection && vThis.mSelection.attr("id") && vThis.mSelection.attr("id").split("config_").length == 2)
			$(vThis.mSelection.children()[0]).hide();
		$(vSelection.children()[0]).show();
		vThis.mSelection = vSelection;
		return;
	}
	
	vThis.mPrevSelection = vThis.mSelection;
	if (vDimPrevSelection)
		vThis.mPrevSelection.css("opacity", "0.2");
	vThis.mSelection = vSelection;
	if (vLightNewSelection)
		vThis.mSelection.css("opacity", "1");
	vThis.mDivIndicator.css(vThis.mSelection.pIndicatorStyle);
	//~ vThis.mDivIndicator.css("opacity", "0.4");
	if (vThis.mSelection && vThis.mSelection.attr("id"))
	{
		o = vThis.mSelection.attr("id").split("widgettn_");
		if (o[0] == "")
		{
			o[1] = parseInt(o[1]);
			vThis.mSelectedWidgetN = o[1];
			vThis.fRenderWidgetSummary(vThis.mSelectedChannelN, vThis.mSelectedWidgetN);
		}
	}
	if (vThis.mDivWidgetList && vThis.mDivWidgetList.indexOf(vThis.mSelection) > -1)
	{
		o = vThis.mDivWidgetList.indexOf(vThis.mSelection);
		p = cModel.fGetInstance().CHANNEL_LIST[vThis.mSelectedChannelN].mWidgetList[o];
		if (!p.mNeTVCompatiable)
			vThis.mDivIndicator.css("opacity", "0.4");
		else
			vThis.mDivIndicator.css("opacity", "1");
	}
	else
		vThis.mDivIndicator.css("opacity", "1");
}

// -------------------------------------------------------------------------------------------------
//	fOnSignal
// -------------------------------------------------------------------------------------------------
cSPChannels.prototype.fOnSignal = function(
	vSignal,		// string
	vData,			// data array
	vReturnFun		// return function call
)
{
//~ fDbg("*** cSPChannels, fOnSignal(), " + vSignal + ", " + vData);
	var vThis, i, j, o, p;
	vThis = this;
	
	switch(vSignal)
	{
	case cConst.SIGNAL_TOGGLE_CONTROLPANEL:
		break;
		
	case cConst.SIGNAL_TOGGLE_WIDGETENGINE:
		break;
		
	case cConst.SIGNAL_BUTTON_LEFT:
		if (vThis.mLocked)
			return;
		switch (vThis.mMode)
		{
		case cSPChannels.MODE_DEFAULT:
			i = vThis.mDivChannelList.indexOf(vThis.pSelection());
			if (i > -1)
			{
				if (i != 0 & i != 4)
				{
					if ((i - 1) % 4 < i % 4)
					{
						j = i - 1;
						vThis.pSelection(vThis.mDivChannelList[j], true, true);
					}
					else
					{
						j = i - 5;
						
						vThis.mLocked = true;
						$("#div_channelMain_channelThumbnail_container").animate({
							left: "+=800px"
						}, 300, function() {
							vThis.pSelection(vThis.mDivChannelList[j], true, true);
							
							j = $("#div_channelMain_pageindicator").children().length;
							for (i = 0; i < j; i++)
								if ($($("#div_channelMain_pageindicator").children()[i]).css("opacity") == "1")
								{
									o = i;
									break;
								}
							o = o - 1;								
							for (i = 0; i < j; i++)
								if (i == o)
									$($("#div_channelMain_pageindicator").children()[i]).css("opacity", 1);
								else
									$($("#div_channelMain_pageindicator").children()[i]).css("opacity", 0.4);
									
							vThis.mLocked = false;
						});
					}
				}
			}
			break;
		case cSPChannels.MODE_WIDGETLIST:
			if (!vThis.mSelection.attr("id"))
				return;
			o = parseInt(vThis.mSelection.attr("id").split("_")[1]);
			
			var vRow, vColumn, vGroup, vSlideFlag;
			vRow = (o % 18 - o % 6) / 6 + 1;
			vColumn = o % 6 + 1;
			vGroup = (o - o % 18) / 18 + 1;
			
			if (vColumn == 1)
			{
				o = (vGroup - 2) * 18 + vRow * 6 - 1;
				if (o > 0)
				{
					o = vThis.mDivWidgetList[o];
					vSlideFlag = true;
				}
				else
					return;
			}
			else
				o = o - 1 >= 0 ?  vThis.mDivWidgetList[o - 1] : null;
				
			if (!o)
				return;
			vThis.pSelection(o);

			if (vSlideFlag)
			{
				vThis.mDivWidgetsContent.animate({ left: "+=700px" }, 200, function() {
					j = $("#div_widgetMain_pageindicator").children().length;
					for (i = 0; i < j; i++)
						if ($($("#div_widgetMain_pageindicator").children()[i]).css("opacity") == "1")
						{
							o = i;
							break;
						}
					o = o - 1;
					for (i = 0; i < j; i++)
						if (i == o)
							$($("#div_widgetMain_pageindicator").children()[i]).css("opacity", 1);
						else
							$($("#div_widgetMain_pageindicator").children()[i]).css("opacity", 0.4);
				});
			}
			break;
		case cSPChannels.MODE_WIDGETCONFIG_POPUP:
			o = vThis.mSelection.attr("id");
			o = o.split("_")[1];
			
			switch (o)
			{
			case "0":
				o = parseInt(vThis.mSelection.children(".selector_bar").css("left")) - parseInt(vThis.mSelection.children(".selector_nod").css("width")) / 2;
				vThis.mSelection.children(".selector_nod").css("left", o + "px");
				o = cModel.fGetInstance().CHANNEL_LIST[vThis.mSelectedChannelN].mWidgetList[vThis.mSelectedWidgetN];
				o.pEnabled(true);
				$($(vThis.mSelection.children()[1]).children()[1]).html("YES");
				$(vThis.mDivWidgetList[vThis.mSelectedWidgetN].children()[1]).children("img").attr("src", "./images/tick_32.png");
				cProxy.fSaveModelData();
				break;
			case "updateinterval":
				o = cModel.fGetInstance().CHANNEL_LIST[vThis.mSelectedChannelN].mWidgetList[vThis.mSelectedWidgetN];
				if (o.mUpdateInterval > 0)
					o.mUpdateInterval--;
				p = parseInt(vThis.mSelection.children(".selector_bar").css("left")) + parseInt(vThis.mSelection.children(".selector_bar").css("width")) / (o.mUpdateIntervalList.length - 1) * o.mUpdateInterval - parseInt(vThis.mSelection.children(".selector_nod").css("width")) / 2;
				vThis.mSelection.children(".selector_nod").css("left", p + "px");
				$($(vThis.mSelection.children()[1]).children()[1]).html(o.mUpdateIntervalDisplayList[o.mUpdateInterval]);
				cProxy.fSaveModelData();
				break;
			case "showneweventsonly":
				o = parseInt(vThis.mSelection.children(".selector_bar").css("left")) - parseInt(vThis.mSelection.children(".selector_nod").css("width")) / 2;
				vThis.mSelection.children(".selector_nod").css("left", o + "px");
				o = cModel.fGetInstance().CHANNEL_LIST[vThis.mSelectedChannelN].mWidgetList[vThis.mSelectedWidgetN];
				o.pOnlyShowNewEvent(true);
				$($(vThis.mSelection.children()[1]).children()[1]).html("YES");
				cProxy.fSaveModelData();
				break;
			}
			break;
		case cSPChannels.MODE_WIDGETAUTH_INPUT:
			if (vThis.pSelection() == vThis.mDivWidgetAuthInput_CANCEL)
				vThis.pSelection(vThis.mDivWidgetAuthInput_OK);
			break;
		}
		break;
		
	case cConst.SIGNAL_BUTTON_RIGHT:
		if (vThis.mLocked)
			return;
		switch (vThis.mMode)
		{
		case cSPChannels.MODE_DEFAULT:
			i = vThis.mDivChannelList.indexOf(vThis.pSelection());
			if (i > -1)
			{
				if (i < vThis.mDivChannelList.length - 1)
				{
					j = i + 1;
					if (j % 4 > i % 4)
					{
						vThis.pSelection(vThis.mDivChannelList[j], true, true);
					}
					else
					{
						j = null;
						if (i + 5 <= vThis.mDivChannelList.length - 1)
							j = i + 5;
						else
						{
							if ((i + 5) % 8 > 3)
								if (i + 1 < vThis.mDivChannelList.length - 1)
									j = i + 1;
						}
						
						if (!j)
							return;
							
						vThis.mLocked = true;
						$("#div_channelMain_channelThumbnail_container").animate({
							left: "-=800px"
						}, 300, function() {
							vThis.pSelection(vThis.mDivChannelList[j], true, true);
							
							j = $("#div_channelMain_pageindicator").children().length;
							for (i = 0; i < j; i++)
								if ($($("#div_channelMain_pageindicator").children()[i]).css("opacity") == "1")
								{
									o = i;
									break;
								}
							o = o + 1;												
							for (i = 0; i < j; i++)
								if (i == o)
									$($("#div_channelMain_pageindicator").children()[i]).css("opacity", 1);
								else
									$($("#div_channelMain_pageindicator").children()[i]).css("opacity", 0.4);
							vThis.mLocked = false;
						});
					}
				}
			}
			break;
		case cSPChannels.MODE_WIDGETLIST:
			if (!vThis.mSelection.attr("id"))
				return;
			o = parseInt(vThis.mSelection.attr("id").split("_")[1]);
			
			var vRow, vColumn, vGroup, vSlideFlag;
			vRow = (o % 18 - o % 6) / 6 + 1;
			vColumn = o % 6 + 1;
			vGroup = (o - o % 18) / 18 + 1;
			
			if (vColumn == 6)
			{
				o = vGroup * 18 + vRow * 6 - 5 - 1;
				
				if (o < vThis.mDivWidgetList.length)
				{
					o = vThis.mDivWidgetList[o];
					vSlideFlag = true;
				}
				else
				{
					// has next page, but not in the same row
					if (vRow == 3)
					{
						o = o - 6;
						if (o < vThis.mDivWidgetList.length)
						{
							o = vThis.mDivWidgetList[o];
							vSlideFlag = true;
						}
						else
						{
							o = o - 6;
							if (o < vThis.mDivWidgetList.length)
							{
								o = vThis.mDivWidgetList[o];
								vSlideFlag = true;
							}
							else
								return;
						}
					}
					else if (vRow == 2)
					{
						o = o - 6;
						if (o < vThis.mDivWidgetList.length)
						{
							o = vThis.mDivWidgetList[o];
							vSlideFlag = true;
						}
						else
							return;
					}
					else
						return;
				}
			}
			else
				o = o + 1 < vThis.mDivWidgetList.length ?  vThis.mDivWidgetList[o + 1] : null;
			if (!o)
				return;
			vThis.pSelection(o);
			
			if (vSlideFlag)
			{
				vThis.mDivWidgetsContent.animate({ left: "-=700px" }, 200, function() {
					j = $("#div_widgetMain_pageindicator").children().length;
					for (i = 0; i < j; i++)
						if ($($("#div_widgetMain_pageindicator").children()[i]).css("opacity") == "1")
						{
							o = i;
							break;
						}
					o = o + 1;
					for (i = 0; i < j; i++)
						if (i == o)
							$($("#div_widgetMain_pageindicator").children()[i]).css("opacity", 1);
						else
							$($("#div_widgetMain_pageindicator").children()[i]).css("opacity", 0.4);
				});
			}
			break;
		case cSPChannels.MODE_WIDGETCONFIG_POPUP:
			o = vThis.mSelection.attr("id");
			o = o.split("_")[1];
			
			switch (o)
			{
			case "0":
				o = parseInt(vThis.mSelection.children(".selector_bar").css("left")) + parseInt(vThis.mSelection.children(".selector_bar").css("width")) - parseInt(vThis.mSelection.children(".selector_nod").css("width")) / 2;
				vThis.mSelection.children(".selector_nod").css("left", o + "px");
				o = cModel.fGetInstance().CHANNEL_LIST[vThis.mSelectedChannelN].mWidgetList[vThis.mSelectedWidgetN];
				o.pEnabled(false);
				$($(vThis.mSelection.children()[1]).children()[1]).html("NO");
				$(vThis.mDivWidgetList[vThis.mSelectedWidgetN].children()[1]).children("img").attr("src", "./images/cross_32.png");
				cProxy.fSaveModelData();
				break;
			case "updateinterval":
				o = cModel.fGetInstance().CHANNEL_LIST[vThis.mSelectedChannelN].mWidgetList[vThis.mSelectedWidgetN];
				if (o.mUpdateInterval < o.mUpdateIntervalList.length - 1)
					o.mUpdateInterval++;
				p = parseInt(vThis.mSelection.children(".selector_bar").css("left")) + parseInt(vThis.mSelection.children(".selector_bar").css("width")) / (o.mUpdateIntervalList.length - 1) * o.mUpdateInterval - parseInt(vThis.mSelection.children(".selector_nod").css("width")) / 2;
				vThis.mSelection.children(".selector_nod").css("left", p + "px");
				$($(vThis.mSelection.children()[1]).children()[1]).html(o.mUpdateIntervalDisplayList[o.mUpdateInterval]);
				cProxy.fSaveModelData();
				break;
			case "showneweventsonly":
				o = parseInt(vThis.mSelection.children(".selector_bar").css("left")) + parseInt(vThis.mSelection.children(".selector_bar").css("width")) - parseInt(vThis.mSelection.children(".selector_nod").css("width")) / 2;
				vThis.mSelection.children(".selector_nod").css("left", o + "px");
				o = cModel.fGetInstance().CHANNEL_LIST[vThis.mSelectedChannelN].mWidgetList[vThis.mSelectedWidgetN];
				o.pOnlyShowNewEvent(false);
				$($(vThis.mSelection.children()[1]).children()[1]).html("NO");
				cProxy.fSaveModelData();
				break;
			}
			break;
		case cSPChannels.MODE_WIDGETAUTH_INPUT:
			if (vThis.pSelection() == vThis.mDivWidgetAuthInput_OK)
				vThis.pSelection(vThis.mDivWidgetAuthInput_CANCEL);
			break;
		}
		break;
		
	case cConst.SIGNAL_BUTTON_CENTER:
		if (vThis.mLocked)
			return;
		switch (vThis.mMode)
		{
		case cSPChannels.MODE_DEFAULT:
			switch (vThis.mSelection)
			{
			case vThis.mDivBack:	cCPanel.fGetInstance().fBack(); break;
			default:
				vThis.mSelectedChannelN = parseInt(vThis.mSelection.attr("id").split("_")[3]);
				vThis.pMode(cSPChannels.MODE_WIDGETLIST);
				break;
			}
			break;
		case cSPChannels.MODE_WIDGETLIST:
			switch (vThis.mSelection)
			{
			case vThis.mDivBack:
				vThis.pMode(cSPChannels.MODE_DEFAULT);
				break;
			case vThis.mDivChannelOperation:
				cModel.fGetInstance().CHANNEL_CURRENT = cModel.fGetInstance().CHANNEL_LIST[vThis.mSelectedChannelN];
				cModuleToast.fGetInstance().fToast("Sucessfully set as current channel.", "message", {color: "#00FF00"});
				cModuleEventTicker.fGetInstance().fClearEventList();
				break;
			default:
				i = vThis.mDivWidgetList.indexOf(vThis.mSelection);
				if (o = cModel.fGetInstance().CHANNEL_LIST[vThis.mSelectedChannelN].mWidgetList[i].pNeTVCompatiable())
					vThis.pMode(cSPChannels.MODE_WIDGETCONFIG_POPUP);
				/*
				if (vThis.mCurrWidgetConfigurable)
					vThis.pMode(cSPChannels.MODE_WIDGETCONFIG);
				*/
				break;
			}
			break;
		case cSPChannels.MODE_WIDGETCONFIG_POPUP:
			o = vThis.mSelection.attr("id");
			switch (o)
			{
			case "config_0":
				break;
			case "config_auth":
				o = cModel.fGetInstance().CHANNEL_LIST[vThis.mSelectedChannelN].mWidgetList[vThis.mSelectedWidgetN];
				if (o.mNeedAuth)
				{
					vThis.pMode(cSPChannels.MODE_WIDGETAUTH);
					vThis.fInitAuth();
				}
				break;
			case "config_param":
				if (vThis.mCurrWidgetConfigurable)
					vThis.pMode(cSPChannels.MODE_WIDGETCONFIG);
				break;
			case "config_ok":
				vThis.pMode(cSPChannels.MODE_WIDGETLIST);
				vThis.fEndAuth();
				break;
			}
			break;
		case cSPChannels.MODE_WIDGETCONFIG:
			switch (vThis.mSelection)
			{
			case vThis.mDivBack:
				vThis.pMode(cSPChannels.MODE_WIDGETLIST);
				break;
			default:
				o = $(vThis.mSelection.children()[2]);
				if (cModuleInput.fGetInstance().mIsActive)
					return;
				cModuleInput.fGetInstance().fShow();
				cModuleInput.fGetInstance().fAssociate(o, o.html(), null, function() {
					o = cModel.fGetInstance().CHANNEL_LIST[vThis.mSelectedChannelN].mWidgetList[vThis.mSelectedWidgetN];
					if (!o.mParameterList)
						o.mParameterList = {};

					for (p in o.mParameterList)
						if (p.toLowerCase() == $(vThis.mSelection.children()[0]).html().toLowerCase())
						{
							o.mParameterList[p] = $(vThis.mSelection.children()[2]).html();
							break;
						}
					//~ o.mParameterList[$(vThis.mSelection.children()[0]).html().toLowerCase()] = $(vThis.mSelection.children()[2]).html();
					cChannelModule.fGetInstance().fSaveChannelData();
				});
				break;
			}
			break;
		case cSPChannels.MODE_WIDGETAUTH:
			vThis.fEndAuth();
			vThis.pMode(cSPChannels.MODE_WIDGETLIST);
			break;
		case cSPChannels.MODE_WIDGETAUTH_INPUT:
			if (cModuleInput.fGetInstance().mIsActive)
				return;
			
			switch (vThis.pSelection())
			{
			case vThis.mDivWidgetAuthInput_Username:
				cModuleInput.fGetInstance().fShow();
				cModuleInput.fGetInstance().fAssociate(vThis.mDivWidgetAuthInput_Username_Content, vThis.mDivWidgetAuthInput_Username_Content.html());
				break;
			case vThis.mDivWidgetAuthInput_Password:
				cModuleInput.fGetInstance().fShow();
				cModuleInput.fGetInstance().fAssociate(vThis.mDivWidgetAuthInput_Password_Content, vThis.mDivWidgetAuthInput_Password_Content.html());
				break;
			case vThis.mDivWidgetAuthInput_OK:
				vThis.fInitAuth({username: vThis.mDivWidgetAuthInput_Username_Content.html(), password: vThis.mDivWidgetAuthInput_Password_Content.html()});
				break;
			case vThis.mDivWidgetAuthInput_CANCEL:
				vThis.fEndAuth();
				vThis.pMode(cSPChannels.MODE_WIDGETLIST);
				break;
			}
			break;
		}
		break;
		
	case cConst.SIGNAL_BUTTON_UP:
		if (vThis.mLocked)
			return;
		switch (vThis.mMode)
		{
		case cSPChannels.MODE_DEFAULT:
			switch (vThis.mSelection)
			{
			case vThis.mDivBack: 	vThis.pSelection(vThis.mPrevSelection, true, true); break;
			default:
				o = parseInt(vThis.mSelection.attr("id").split("_")[3]);
				if (o % 8 < 4)
					return;
				else
					o = o - vThis.mStyle.mChannelListColumn >= 0 ? vThis.mDivChannelList[o - vThis.mStyle.mChannelListColumn] : null;
				if (o)
					vThis.pSelection(o, true, true);
				break;
			}
			break;

		case cSPChannels.MODE_WIDGETLIST:
			switch (vThis.mSelection)
			{
			case vThis.mDivBack:
				o = vThis.mPrevSelection;
				vThis.pSelection(vThis.mPrevSelection, true, false);
				break;
			case vThis.mDivChannelOperation:
				break;
			default:
				o = parseInt(vThis.mSelection.attr("id").split("_")[1]);
				o = o - vThis.mStyle.mWidgetListColumn >= 0 ? vThis.mDivWidgetList[o - vThis.mStyle.mWidgetListColumn] : null;
				if (o)
					vThis.pSelection(o);
				else
					vThis.pSelection(vThis.mDivChannelOperation, false, true);
				break;
			}
			break;

		case cSPChannels.MODE_WIDGETCONFIG:
			i = vThis.mDivWidgetConfigList.indexOf(vThis.mSelection);
			if (i == -1)	// at mDivBack
			{
				vThis.pSelection(vThis.mPrevSelection, true, false);
				p = parseInt($($("#widgetconfig_itemcontainer").children()[0]).css("top").split("px")[0]) + parseInt(vThis.mDivWidgetConfigList[vThis.mDivWidgetConfigList.length - 1].css("top").split("px")[0]);
				vThis.mDivIndicator.css("top", p + 145 + "px");
			}
			else if (i - 1 >= 0)
			{
				// find the actual "next" selection "top"
				p = parseInt($($("#widgetconfig_itemcontainer").children()[0]).css("top").split("px")[0]) + parseInt(vThis.mDivWidgetConfigList[i - 1].css("top").split("px")[0]);
				o = {
					width: vThis.mDivIndicator.css("width"),
					height: vThis.mDivIndicator.css("height"),
					top: vThis.mDivIndicator.css("top"),
					left: vThis.mDivIndicator.css("left")
				};
				vThis.pSelection(vThis.mDivWidgetConfigList[i - 1]);
				vThis.mDivIndicator.css(o);
				if (p > 0)
					vThis.mDivIndicator.css("top", "-=70px");
				else
					$($("#widgetconfig_itemcontainer").children()[0]).css("top", "+=70px");
			}
			break;
			
		case cSPChannels.MODE_WIDGETCONFIG_POPUP:
			o = vThis.mDivConfigPopup.children().length;
			i = vThis.mDivConfigPopupList.indexOf(vThis.mSelection);
			if (i > 0)
				vThis.pSelection(vThis.mDivConfigPopupList[i - 1]);
			break;
			
		case cSPChannels.MODE_WIDGETAUTH_INPUT:
			if (vThis.pSelection() == vThis.mDivWidgetAuthInput_Password)
				vThis.pSelection(vThis.mDivWidgetAuthInput_Username, false, true);
			else if (vThis.pSelection() == vThis.mDivWidgetAuthInput_OK || vThis.pSelection() == vThis.mDivWidgetAuthInput_CANCEL)
				vThis.pSelection(vThis.mDivWidgetAuthInput_Password, false, true);
			break;
		}
		break;
		
	case cConst.SIGNAL_BUTTON_DOWN:
		if (vThis.mLocked)
			return;
		switch (vThis.mMode)
		{
		case cSPChannels.MODE_DEFAULT:
			o = vThis.mSelection.attr("id");
			if (!o || o.indexOf("channelThumbnail") == -1)
				return;
			o = parseInt(o.split("_")[3]);
			if (o % 8 >= 4)
				o = vThis.mDivBack;
			else
				o = o + vThis.mStyle.mChannelListColumn <= vThis.mDivChannelList.length ? vThis.mDivChannelList[o + vThis.mStyle.mChannelListColumn] : vThis.mDivBack;
			vThis.pSelection(o, true, true);
			break;
			
		case cSPChannels.MODE_WIDGETLIST:
			switch (vThis.mSelection)
			{
			case vThis.mDivBack:
				break;
			case vThis.mDivChannelOperation:
				o = vThis.mPrevSelection;
				vThis.pSelection(vThis.mPrevSelection, true, false);
				break;
			default:
				o = parseInt(vThis.mSelection.attr("id").split("_")[1]);
				i = (o % 18 - (o % 18 % 6)) / 6;
				if (i == 2)
					o = vThis.mDivBack;
				else
					o = o + vThis.mStyle.mWidgetListColumn < vThis.mDivWidgetList.length ?  vThis.mDivWidgetList[o + vThis.mStyle.mWidgetListColumn] : vThis.mDivBack;

				if (o == vThis.mDivBack)
					vThis.pSelection(o, false, true);
				else
					vThis.pSelection(o);
				break;
			}
			break;

		case cSPChannels.MODE_WIDGETCONFIG:
			i = vThis.mDivWidgetConfigList.indexOf(vThis.mSelection);
			if (i >= 0)
			{
				if (i + 1 < vThis.mDivWidgetConfigList.length)
				{
					// find the actual "next" selection "top"
					p = parseInt($($("#widgetconfig_itemcontainer").children()[0]).css("top").split("px")[0]) + parseInt(vThis.mDivWidgetConfigList[i + 1].css("top").split("px")[0]) + 70;
					
					o = {
						width: vThis.mDivIndicator.css("width"),
						height: vThis.mDivIndicator.css("height"),
						top: vThis.mDivIndicator.css("top"),
						left: vThis.mDivIndicator.css("left")
					}
					vThis.pSelection(vThis.mDivWidgetConfigList[i + 1]);
					vThis.mDivIndicator.css(o);
					if (p < 385)
						vThis.mDivIndicator.css("top", "+=70px");
					else
						$($("#widgetconfig_itemcontainer").children()[0]).css("top", "-=70px");
				}
				else
				{
					vThis.pSelection(vThis.mDivBack, false, true);
				}
			}
			break;
			
		case cSPChannels.MODE_WIDGETCONFIG_POPUP:
			o = vThis.mDivConfigPopupList.length;
			i = vThis.mDivConfigPopupList.indexOf(vThis.mSelection);
			
			if (i < o - 1)
				vThis.pSelection(vThis.mDivConfigPopupList[i + 1]);
			break;
			
		case cSPChannels.MODE_WIDGETAUTH_INPUT:
			if (vThis.pSelection() == vThis.mDivWidgetAuthInput_Username)
				vThis.pSelection(vThis.mDivWidgetAuthInput_Password, false, true);
			else if (vThis.pSelection() == vThis.mDivWidgetAuthInput_Password)
				vThis.pSelection(vThis.mDivWidgetAuthInput_OK, false, true);
			break;
		}
		break;
		
		
		
		
		
		
		
		
		
	case cConst.SIGNAL_MESSAGE_WIDGETMSG:
		fDbg("msg from widget : " + vData);
		
		if (vThis.mMode != cSPChannels.MODE_WIDGETAUTH && vThis.mMode != cSPChannels.MODE_WIDGETAUTH_INPUT)
			break;
		
		if (vData != "false")
		{
			fDbg(vThis.mMode + " = ? " + cSPChannels.MODE_WIDGETAUTH_INPUT);
			if (vThis.mMode == cSPChannels.MODE_WIDGETAUTH_INPUT)
			{
				//~ vThis.pMode(cSPChannels.MODE_WIDGETAUTH);
			}
			vThis.fUpdateMessage(vData);
		}
		else
		{
			vThis.pMode(cSPChannels.MODE_WIDGETAUTH_INPUT);
		}
		break;
	}
}

// -------------------------------------------------------------------------------------------------
//	fShow / fHide
// -------------------------------------------------------------------------------------------------
cSPChannels.prototype.fShow = function(
)
{
	this.mDiv.show();
}
cSPChannels.prototype.fHide = function(
)
{
	this.mDiv.hide();
}

// -------------------------------------------------------------------------------------------------
//	fAnimateIn / fAnimateOut
// -------------------------------------------------------------------------------------------------
cSPChannels.prototype.fAnimateIn = function(
	vReturnFun
)
{
	this.pMode(cSPChannels.MODE_DEFAULT);
	this.mDiv.fadeIn(200, function() { if (vReturnFun) vReturnFun(); });
}
cSPChannels.prototype.fAnimateOut = function(
	vReturnFun
)
{
	this.mDiv.fadeOut(200, function() { if (vReturnFun) vReturnFun(); });
}

// -------------------------------------------------------------------------------------------------
//	fGetSelected
// -------------------------------------------------------------------------------------------------
cSPChannels.prototype.pCurrSelection = function(
	vData,
	vReturnFun
)
{
	var o, i;
	
	if (!vData)
	{
		if ($('#div_channelMain_channelThumbnail_0_shadow').is(':visible'))
			o = [0];
		else if ($('#div_channelMain_channelThumbnail_1_shadow').is(':visible'))
			o = [1];
		else if ($('#div_channelMain_channelThumbnail_2_shadow').is(':visible'))
			o = [2];
		return o;
	}
	else
	{
		for (i = 0; i < 3; i++)
			$("#div_channelMain_channelThumbnail_" + i + "_shadow").hide();
		$("#div_channelMain_channelThumbnail_" + vData[0] + "_shadow").show();

		if (vReturnFun)
			vReturnFun();
	}
}



































/** ------------------------------------------------------------------------------------------------
 *  fRenderChannelList
 * -----------------------------------------------------------------------------------------------*/
cSPChannels.prototype.fRenderChannelList = function(
	vForceRender
)
{
//~ fDbg("*** cSPChannels, fRenderChannelList(), ");
	var vThis, vDiv, o, p, i, j, vChannelList, vLen, vImagePath, vTop, vLeft, vCircleW, vCircleGap;
	vThis = this;
	
	vDiv = $("#div_channelMain #div_channelMain_channels");
	vChannelList = cModel.fGetInstance().CHANNEL_LIST;
	vForceRender = true;
	o = "";
	if (vForceRender || vDiv.children().length == 0)
	{
		
		o += '<div id="div_channelMain_summary" style="position: absolute; top: 120px; left: 0px; width: 800px; height: 50px; color: #FFFFFF;">';
			o += '<div style="position: absolute; top: 40px; left: 60px; width: 700px font-size: 20px;"><span>CURRENT CHANNEL : </span>' + cModel.fGetInstance().CHANNEL_CURRENT.mName + '</div>';
		o += '</div>';
		o += '<div id="div_channelMain_channelThumbnail_container" style="position: absolute; top: 60px; left: 0px;">';
		for (i = 0; i < vChannelList.length; i++)
		{
			if (vChannelList[i].mID == cModel.fGetInstance().CHANNEL_CURRENT.mID)
				p = "border: solid #EEEEEE 1px;";
			else
				p = "";
			vLeft = (i % 8 % 4 * 180 + 70 + (i - i % 8) / 8 * 800);
			vTop = i % 8 < 4 ? 160 : 335;
			o += '<div id="div_channelMain_channelThumbnail_' + i + '_container" style="position: absolute; top: ' + vTop + 'px; left: ' + vLeft + 'px; width: 120px; height: 120px; color: #FFFFFF; opacity: ' + (i == 0 ? 1 : 0.2) + '; ' + p + '">';
				//~ o += '<div class="indicator_bg" style="position: absolute; top: 0px; left: 0px; width: 120px; height: 120px; background: #6598EB; border-radius: 10px;"></div>';
				o += '<div id="channelThumbnail_' + i + '_title" style="position: absolute; top: 10px; left: 0px; width: 120px; font-size: 15px; font-weight: bold; text-align: center; color: #FFFFFF; text-shadow: #000000 2px 2px 2px;">' + vChannelList[i].mName + '</div>';
				o += '<div id="channelThumbnail_' + i + '_container" style="position: absolute; top: 40px; left: 10px; border: solid #FFFFFF 0px; width: 100px; height: 82px;">';
				vLen = vChannelList[i].mWidgetList.length < 4 ? vChannelList[i].mWidgetList.length : 4;
				for (j = 0; j < vLen; j++)
				{
					vImagePath = vChannelList[i].mWidgetList[j].mLocalThumbnailPath;
					if (j == 0)
						p = [10, 10];
					else if (j == 1)
						p = [10, 54];
					else if (j == 2)
						p = [45, 10];
					else if (j == 3)
						p = [45, 54];
					o += '<div style="position: absolute; top: ' + p[0] + 'px; left: ' + p[1] + 'px; border: solid #FFFFFF 0px; width: 36px; height: 27px; border: solid #666666 1px;">';
					o += '<img src="' + vImagePath + '" width="36px" height="27px"';
					o += '</div>';
				}
				o += '</div>';
			o += '</div>';
		}
		o += '</div>';
		
		j = Math.ceil(vChannelList.length / 8);
		vCircleW = 6;
		vCircleGap = 50;
		o += '<div id="div_channelMain_pageindicator" style="position: absolute; top: 535px; left: 0px; width: 800px; height: 50px; color: #FFFFFF;">';
		for (i = 0; i < j; i++)
			o += '<div style="position: absolute; top: 0px; left: ' + ((800 - (vCircleW + vCircleGap) * (j - 1) + vCircleW) / 2 + (vCircleW + vCircleGap) * i) + 'px; width: ' + vCircleW + 'px; height: ' + vCircleW + 'px; background-color: #CCCCCC; border-radius: ' + (vCircleW / 2) + 'px;"></div>';
		o += '</div>';
		vDiv.html(o);
		
		for (i = 0; i < j; i++)
			if (i == 0)
				$(vDiv.children("#div_channelMain_pageindicator").children()[i]).css("opacity", 1);
			else
				$(vDiv.children("#div_channelMain_pageindicator").children()[i]).css("opacity", 0.4);	
		vThis.mDivChannelList = [];
		vDiv.children("#div_channelMain_channelThumbnail_container").children().each(function() {
			vThis.mDivChannelList.push($(this));
		});
		
		for (i = 0; i < vThis.mDivChannelList.length; i++)
		{
			o = i % 8;
			vThis.mDivChannelList[i].pIndicatorStyle = {
				width: parseInt(vThis.mDivChannelList[o].css("width").split("px")[0]) + 20 + "px",
				height: parseInt(vThis.mDivChannelList[o].css("height").split("px")[0]) + 20 + "px",
				top: parseInt(vThis.mDivChannelList[o].css("top").split("px")[0]) + 50 + "px",
				left: parseInt(vThis.mDivChannelList[o].css("left").split("px")[0]) - 10 + "px"
			};
		}
	}
}

/** ------------------------------------------------------------------------------------------------
 *  fRenderWidgetList
 * -----------------------------------------------------------------------------------------------*/
cSPChannels.prototype.fRenderWidgetList = function(
	vChannelObj,
	vForceRender
)
{
//~ fDbg("*** cSPChannels, fRenderWidgetList(), ");
	var vThis, o, p, i, j, k, vWidgetList, vLen, vWidget, vCount;
	vThis = this;
	
	if (!vChannelObj)
		return;

	for (i = 0; i < vChannelObj.mWidgetList.length; i++)
		if (!vChannelObj.mWidgetList[i].mLocalThumbnailPath)
		{
			vCount = i;
			break;
		}
	var fLoadTH = function() {
		cChannelModule.fGetInstance().fPreloadChannelThumbnails(vChannelObj, [vCount, 1], function() {
			vThis.mDivWidgetList[vCount].children("img").attr("src", vChannelObj.mWidgetList[vCount].mLocalThumbnailPath);
			if (vCount < vChannelObj.mWidgetList.length - 1)
			{
				vCount++;
				fLoadTH();
			}
			else
				return;
		});
	};
	if (vCount)
		fLoadTH();
		
	vDiv = $("#div_channelMain #div_channelMain_widgets");
	o = "";
	o += '<div id="widget_summary" style="position: absolute; top: 140px; left: 20px; width: 360px; height: 80px; color: #FFFFFF; background-color: #222222; border: solid #333333 0px; border-radius: 10px;"></div>';
	o += '<div id="channel_operations" style="position: absolute; top: 140px; left: 400px; width: 360px; height: 80px; color: #FFFFFF; font-size: 14px; font-weight: bold; border: solid #333333 0px;">';
		o += '<div style="position: absolute; top: 10px; left: 30px; width: 300px; text-align: center;">SET AS CURRENT CHANNEL</div>';
	o += '</div>';
	o += '<div id="widgetstn_container" style="position: absolute; top: 250px; left: 0px; width: 800px; height: 300px;">';
		o += '<div id="widgetstn_content" style="position: absolute; top: 0px; left: 50px;">';
		vLen = vChannelObj.mWidgetList.length;
		for (j = 0; j < vLen; j++)
		{
			vWidget = vChannelObj.mWidgetList[j];
			vImagePath = vChannelObj.mWidgetList[j].mLocalThumbnailPath;
			i = j % (vThis.mStyle.mWidgetListRow * vThis.mStyle.mWidgetListColumn);
			k = (j - i) / (vThis.mStyle.mWidgetListRow * vThis.mStyle.mWidgetListColumn);
			p = [];
			p[0] = (i - i % vThis.mStyle.mWidgetListColumn) / vThis.mStyle.mWidgetListColumn * 100;
			p[1] = 35 + j % vThis.mStyle.mWidgetListColumn * 110 + k * 700;
			o += '<div id="widgettn_' + j + '" style="position: absolute; top: ' + p[0] + 'px; left: ' + p[1] + 'px; width: 80px; height: 60px; border: solid #CCCCCC 2px; opacity: ' + (vWidget.mNeTVCompatiable ? "1" : "0.3") + '">';
				o += '<img src="' + vImagePath + '" width="80px" height="60px" />';
				o += '<div style="position: absolute; top: -10px; left: 70px;">';
					o += '<img src="./images/tick_32.png" width="24px" height="24px" />';
				o += '</div>';
			o += '</div>';
		}
		o += '</div>';
	o += '</div>';
	
	j = Math.ceil(vLen / 18);
	vCircleW = 6;
	vCircleGap = 50;
	o += '<div id="div_widgetMain_pageindicator" style="position: absolute; top: 535px; left: 0px; width: 800px; height: 50px; color: #FFFFFF;">';
	for (i = 0; i < j; i++)
		o += '<div style="position: absolute; top: 0px; left: ' + ((800 - (vCircleW + vCircleGap) * (j - 1) + vCircleW) / 2 + (vCircleW + vCircleGap) * i) + 'px; width: ' + vCircleW + 'px; height: ' + vCircleW + 'px; background-color: #CCCCCC; border-radius: ' + (vCircleW / 2) + 'px;"></div>';
	o += '</div>';
	vDiv.html(o);
	
	
	
	for (i = 0; i < j; i++)
		if (i == 0)
			$(vDiv.children("#div_widgetMain_pageindicator").children()[i]).css("opacity", 1);
		else
			$(vDiv.children("#div_widgetMain_pageindicator").children()[i]).css("opacity", 0.4);

	vThis.mDivChannelOperation = $($(vDiv.children()[1]).children()[0]);
	vThis.mDivChannelOperation.pIndicatorStyle = {width: "300px", height: "30px", top: "140px", left: "430px"};
	vThis.mDivChannelOperation.css("opacity", "0.2");
	
	vThis.mDivWidgetSummary = $(vDiv.children()[0]);
	vDiv = $($(vDiv.children()[2]).children()[0]);
	vThis.mDivWidgetsContent = vThis.mDiv.children("#div_channelMain_widgets").children("#widgetstn_container").children("#widgetstn_content");
	vThis.mDivWidgetList = [];
	vDiv.children().each(function() {
		vThis.mDivWidgetList.push($(this));
	});
	for (i = 0; i < vThis.mDivWidgetList.length; i++)
		vThis.mDivWidgetList[i].pIndicatorStyle = {
			width: parseInt(vThis.mDivWidgetList[i % 18].css("width").split("px")[0]) + 22 + "px",
			height: parseInt(vThis.mDivWidgetList[i % 18].css("height").split("px")[0]) + 22 + "px",
			top: parseInt(vThis.mDivWidgetList[i % 18].css("top").split("px")[0]) + 250 - 10 + "px",
			left: parseInt(vThis.mDivWidgetList[i % 18].css("left").split("px")[0]) + 50 - 10 + "px"
		};
	for (i = 0; i < vLen; i++)
	{
		vWidget = vChannelObj.mWidgetList[i];
		if (vWidget.pNeTVCompatiable())
		{
			$(vThis.mDivWidgetList[i].children()[1]).show();
			if (vWidget.pEnabled())
				$(vThis.mDivWidgetList[i].children()[1]).children("img").attr("src", "./images/tick_32.png");
			else
				$(vThis.mDivWidgetList[i].children()[1]).children("img").attr("src", "./images/cross_32.png");
		}
		else
		{
			$(vThis.mDivWidgetList[i].children()[1]).hide();
		}
	}
}

/** ------------------------------------------------------------------------------------------------
 *  fRenderWidgetSummary
 * -----------------------------------------------------------------------------------------------*/
cSPChannels.prototype.fRenderWidgetSummary = function(
	vChannelN,
	vWidgetN
)
{
	var vThis, o, p, vWidget, n, vKeywordFilterList;
	vThis = this;
	
	vWidget = cModel.fGetInstance().CHANNEL_LIST[vChannelN].mWidgetList[vWidgetN];
	fDbg(vWidget.mWidget.mID);
	n = 0;

	vKeywordFilterList = ["session_key", "secret", "api_key_version", "_private_secret", "_private_session_key", "_private"];
	for (p in vWidget.mParameterList)
	{
		if (vKeywordFilterList.indexOf(p) > -1)
			delete vWidget.mParameterList[p];
	}
	
	for (p in vWidget.mParameterList)
		n++;
		
	o = '';
	o += '<div style="position: absolute; top: 10px; left: 10px; font-size: 16px; font-weight: bold;">' + vWidget.mName + '</div>';
	if (!vWidget.mNeTVCompatiable)
	{
		o += '<div style="position: absolute; top: 60px; left: 230px; font-size: 13px; font-style: italic; color: #AAAAAA;"><span style="font-weight: bold; font-style: bold; color: #FF3333;">Not Compatiable</span></div>';
	}
	else if (vWidget.mParameterList && n > 0)
	{
		o += '<div style="position: absolute; top: 60px; left: 140px; font-size: 13px; font-style: italic; color: #AAAAAA;">Press the <span style="font-weight: bold; font-style: normal; color: #FFFFFF;">center</span> button to edit.</div>';
		vThis.mCurrWidgetConfigurable = true;
	}
	else
		vThis.mCurrWidgetConfigurable = false;
	
	vThis.mDivWidgetSummary.html(o);
}

/** ------------------------------------------------------------------------------------------------
 *  fRenderWidgetParamConfig
 * -----------------------------------------------------------------------------------------------*/
cSPChannels.prototype.fRenderWidgetParamConfig = function(
	vChannelN,
	vWidgetN
)
{
	var vThis, o, p, i, vWidget, vLeft, vTop, vKeywordFilterList;
	vThis = this;
	vWidget = cModel.fGetInstance().CHANNEL_LIST[vChannelN].mWidgetList[vWidgetN];
	
	vKeywordFilterList = ["session_key", "secret", "api_key_version", "_private_secret", "_private_session_key"];
	for (p in vWidget.mParameterList)
	{
		if (vKeywordFilterList.indexOf(p) > -1)
			delete vWidget.mParameterList[p];
	}
	
	vTop = 20;
	o = '';
	o += '<div id="widgetconfig_itemcontainer" style="position: absolute; top: 150px; left: 50px; width: 700px; height: 385px; border: dashed #FFFFFF 0px; overflow: hidden;">';
	o += '<div id="widgetconfig_itemcontent" style="position: absolute; top: 0px; left: 0px;">';
	for (p in vWidget.mParameterList)
	{
		o += '<div style="position: absolute; top: ' + vTop + 'px; left: 50px; width: 600px; height: 40px; border: solid #FFFFFF 0px; ">';
			o += '<div style="float: left; width: 200px; font-size: 22px; font-weight: bold; margin: 10px 0 0 10px; text-shadow: #333333 2px 2px 2px;">' + p.toUpperCase() + '</div>';
			o += '<div style="float: left; width: 20px; font-weight: bold; margin: 10px 0 0 10px;"> : </div>';
			o += '<div style="float: left; width: 320px; height: 25px; border: solid #FFFFFF 2px; padding: 6px 0 5px 30px; background-color: #333333; color: #FFFFFF; border-radius: 20px; font-size: 22px; font-weight: bold; ">' + vWidget.mParameterList[p] + '</div>';
		o += '</div>';
		vTop += 40 + 30;
	}
	o += '</div>';
	o += '</div>';
	vThis.mDivWidgetConfig.html(o);
	
	vThis.mDivWidgetConfigList = [];
	$($(vThis.mDivWidgetConfig.children()[0]).children()[0]).children().each(function() {
		vThis.mDivWidgetConfigList.push($(this));
		o = vThis.mDivWidgetConfigList[vThis.mDivWidgetConfigList.length - 1];
		o.pIndicatorStyle = {
			width: parseInt(o.css("width").split("px")[0]) + 30 + "px",
			height: parseInt(o.css("height").split("px")[0]) + 10 + "px",
			top: parseInt(o.css("top").split("px")[0]) + 150 - 5 + "px",
			left: parseInt(o.css("left").split("px")[0]) + 50 - 15 + "px"
		};
	});
}

/** ------------------------------------------------------------------------------------------------
 *  fShowWidgetConfigPopup
 * -----------------------------------------------------------------------------------------------*/
cSPChannels.prototype.fShowWidgetConfigPopup = function(
	vChannelN,
	vWidgetN
)
{
	var vThis, o, i;
	vThis = this;
	
	vThis.fRenderWidgetConfigPopup(vChannelN, vWidgetN);
	vThis.mDivConfigPopup.fadeIn();
}

/** ------------------------------------------------------------------------------------------------
 *  fRenderWidgetConfigPopup
 * -----------------------------------------------------------------------------------------------*/
cSPChannels.prototype.fRenderWidgetConfigPopup = function(
	vChannelN,
	vWidgetN
)
{
	var vThis, o, i, vWidget, vW;
	vThis = this;
	vW = parseInt(vThis.mDivConfigPopup.css("width")) - 40;
	
	o = '';
	o += '<div id="config_0" style="position: absolute; top: 20px; left: 20px; width: ' + vW + 'px; height: 32px; border: solid #EEEEEE 0px;">';
		o += '<div class="indicator_bg" style="position: absolute; top: 0px; left: 0px; width: ' + vW + 'px; height: 32px; background: #6598EB; border-radius: 10px;"></div>';
		o += '<div style="position: absolute; top: 10px; left: 20px; width: ' + (vW - 40) + 'px; text-shadow: #000000 2px 2px 2px;">';
			o += '<div style="position: absolute; top: 0px; left: 0px; width: 140px; text-align: left; font-weight: bold; border: solid #EEEEEE 0px;">';
			o += 'Enabled';
			o += '</div>';
			o += '<div style="position: absolute; top: 0px; left: ' + (vW - 40 - 100) + 'px; width: 100px; text-align: right; font-weight: bold; font-style:italic; border: solid #EEEEEE 0px;">';
				o += 'YES';
			o += '</div>';
		o += '</div>';
		o += '<div class="selector_bar" style="position: absolute; top: 14px; left: 340px; width: 20px; height: 8px; background: #FFFFFF; border-radius: 4px;"></div>';
		o += '<div class="selector_nod" style="position: absolute; top: 10px; left: 332px; width: 16px; height: 16px; background: #104396; border-radius: 8px;"></div>';
	o += '</div>';
	o += '<div id="config_updateinterval" style="position: absolute; top: 70px; left: 20px; width: ' + vW + 'px; height: 32px; border: solid #EEEEEE 0px;">';
		o += '<div class="indicator_bg" style="position: absolute; top: 0px; left: 0px; width: ' + vW + 'px; height: 32px; background: #6598EB; border-radius: 10px;"></div>';
		o += '<div style="position: absolute; top: 10px; left: 20px; width: ' + (vW - 40) + 'px; text-shadow: #000000 2px 2px 2px;">';
			o += '<div style="position: absolute; top: 0px; left: 0px; width: 250px; text-align: left; font-weight: bold; border: solid #EEEEEE 0px;">';
			o += 'Force Update Interval';
			o += '</div>';
			o += '<div style="position: absolute; top: 0px; left: ' + (vW - 40 - 100) + 'px; width: 100px; text-align: right; font-weight: bold; font-style:italic; border: solid #EEEEEE 0px;">';
			o += 'YES';
			o += '</div>';
		o += '</div>';
		o += '<div class="selector_bar" style="position: absolute; top: 14px; left: 240px; width: 120px; height: 8px; background: #FFFFFF; border-radius: 4px;"></div>';
		o += '<div class="selector_nod" style="position: absolute; top: 10px; left: 232px; width: 16px; height: 16px; background: #104396; border-radius: 8px;"></div>';
	o += '</div>';
	o += '<div id="config_showneweventsonly" style="position: absolute; top: 120px; left: 20px; width: ' + vW + 'px; height: 32px; border: solid #EEEEEE 0px;">';
		o += '<div class="indicator_bg" style="position: absolute; top: 0px; left: 0px; width: ' + vW + 'px; height: 32px; background: #6598EB; border-radius: 10px;"></div>';
		o += '<div style="position: absolute; top: 10px; left: 20px; width: ' + (vW - 40) + 'px; text-shadow: #000000 2px 2px 2px;">';
			o += '<div style="position: absolute; top: 0px; left: 0px; width: 250px; text-align: left; font-weight: bold; border: solid #EEEEEE 0px;">';
			o += 'Only Show New Events';
			o += '</div>';
			o += '<div style="position: absolute; top: 0px; left: ' + (vW - 40 - 100) + 'px; width: 100px; text-align: right; font-weight: bold; font-style:italic; border: solid #EEEEEE 0px;">';
				o += 'YES';
			o += '</div>';
		o += '</div>';
		o += '<div class="selector_bar" style="position: absolute; top: 14px; left: 340px; width: 20px; height: 8px; background: #FFFFFF; border-radius: 4px;"></div>';
		o += '<div class="selector_nod" style="position: absolute; top: 10px; left: 332px; width: 16px; height: 16px; background: #104396; border-radius: 8px;"></div>';
	o += '</div>';
	
	o += '<div id="config_auth" style="position: absolute; top: 170px; left: 20px; width: ' + vW + 'px; height: 30px; border: solid #EEEEEE 0px;">';
		o += '<div class="indicator_bg" style="position: absolute; top: 0px; left: 0px; width: ' + vW + 'px; height: 30px; background: #6598EB; border-radius: 10px;"></div>';
		o += '<div style="position: absolute; top: 8px; left: 20px; width: ' + (vW - 40) + 'px; text-align: center; font-weight: bold; font-size: 14px; text-shadow: #000000 2px 2px 2px;">';
			o += 'Authentication';
		o += '</div>';
	o += '</div>';
	o += '<div id="config_param" style="position: absolute; top: 220px; left: 20px; width: ' + vW + 'px; height: 30px; border: solid #EEEEEE 0px;">';
		o += '<div class="indicator_bg" style="position: absolute; top: 0px; left: 0px; width: ' + vW + 'px; height: 30px; background: #6598EB; border-radius: 10px;"></div>';
		o += '<div style="position: absolute; top: 8px; left: 20px; width: ' + (vW - 40) + 'px; text-align: center; font-weight: bold; font-size: 14px; text-shadow: #000000 2px 2px 2px;">';
			o += 'Customize Configuration';
		o += '</div>';
	o += '</div>';
	o += '<div id="config_ok" style="position: absolute; top: 290px; left: 20px; width: ' + vW + 'px; height: 30px; border: solid #EEEEEE 0px;">';
		o += '<div class="indicator_bg" style="position: absolute; top: 0px; left: 0px; width: ' + vW + 'px; height: 30px; background: #6598EB; border-radius: 10px;"></div>';
		o += '<div style="position: absolute; top: 8px; left: 20px; width: ' + (vW - 40) + 'px; text-align: center; font-weight: bold; font-size: 14px; text-shadow: #000000 2px 2px 2px;">';
			o += 'OK';
		o += '</div>';
	o += '</div>';
	vThis.mDivConfigPopup.html(o);
	
	o = vThis.mDivConfigPopup.children();
	vThis.mDivConfigPopupList = [];
	for (i = 0; i < o.length; i++)
	{
		$(o[i]).pIndicatorStyle = {
			width: parseInt(o.css("width").split("px")[0]) + 30 + "px",
			height: parseInt(o.css("height").split("px")[0]) + 20 + "px",
			top: parseInt(o.css("top").split("px")[0]) + 200 - 0 + "px",
			left: parseInt(o.css("left").split("px")[0]) + 250 - 0 + "px"
		}
		$($(o[i]).children()[0]).hide();
		vThis.mDivConfigPopupList.push($(o[i]));
	}
	
	
	
	
	
	vWidget = cModel.fGetInstance().CHANNEL_LIST[vChannelN].mWidgetList[vWidgetN];
	
	// enable/disable
	o = vThis.mDivConfigPopupList[0];
	if (!vWidget.pEnabled())
	{
		i = parseInt(o.children(".selector_bar").css("left")) + parseInt(o.children(".selector_bar").css("width")) - parseInt(o.children(".selector_nod").css("width")) / 2;
		o.children(".selector_nod").css("left", i + "px");
		$($(o.children()[1]).children()[1]).html("NO");
	}
	else
	{
		i = parseInt(o.children(".selector_bar").css("left")) - parseInt(o.children(".selector_nod").css("width")) / 2;
		o.children(".selector_nod").css("left", i + "px");
		$($(o.children()[1]).children()[1]).html("YES");
	}
	
	// update interval
	o = vThis.mDivConfigPopup.children("#config_updateinterval");
	p = parseInt(o.children(".selector_bar").css("left")) + parseInt(o.children(".selector_bar").css("width")) / (vWidget.mUpdateIntervalList.length - 1) * vWidget.mUpdateInterval - parseInt(o.children(".selector_nod").css("width")) / 2;
	o.children(".selector_nod").css("left", p + "px");
	$($(o.children()[1]).children()[1]).html(vWidget.mUpdateIntervalDisplayList[vWidget.mUpdateInterval]);
	
	// show new event only
	o = vThis.mDivConfigPopup.children("#config_showneweventsonly");
	if (!vWidget.mOnlyShowNewEvent)
	{
		i = parseInt(o.children(".selector_bar").css("left")) + parseInt(o.children(".selector_bar").css("width")) - parseInt(o.children(".selector_nod").css("width")) / 2;
		o.children(".selector_nod").css("left", i + "px");
		$($(o.children()[1]).children()[1]).html("NO");
	}
	else
	{
		i = parseInt(o.children(".selector_bar").css("left")) - parseInt(o.children(".selector_nod").css("width")) / 2;
		o.children(".selector_nod").css("left", i + "px");
		$($(o.children()[1]).children()[1]).html("YES");
	}
	
	// auth
	o = vThis.mDivConfigPopup.children("#config_auth");
	if (!vWidget.mNeedAuth)
		o.css("opacity", "0.4");
	
	// param	
	o = vThis.mDivConfigPopup.children("#config_param");
	if (!vThis.mCurrWidgetConfigurable)
		o.css("opacity", "0.4");
}

cSPChannels.prototype.fRenderInputMode = function() {

}
{



}







cSPChannels.prototype.fRenderWidgetAuth = function(
)
{
	var vThis, o;
	vThis = this;
	
	o = '';
	o += '<div id="widgetauth_itemcontainer" style="position: absolute; top: 150px; left: 50px; width: 700px; height: 385px; border: dashed #FFFFFF 0px; overflow: hidden;">';
	o += '<div id="widgetauth_itemtitle" style="position: absolute; top: 0px; left: 0px;">';
		o += "Please follow the instructions below:";
	o += '</div>';
	o += '<div id="widgetauth_itemcontent" style="position: absolute; top: 50px; left: 50px; width: 600; height: 330; border: solid #FFFFFF 0px;">';
	o += '</div>';
	o += '</div>';
	vThis.mDivWidgetAuth.html(o);
}

cSPChannels.prototype.fInitAuth = function(
	v
)
{
fDbg("*** cSPChannels, fInitAuth(), ");
	var vThis, o, vWidget;
	vThis = this;
	
	vWidget = cModel.fGetInstance().CHANNEL_LIST[vThis.mSelectedChannelN].mWidgetList[vThis.mSelectedWidgetN];
	p = "?";
	if (vWidget.mParameterList)
		for (o in vWidget.mParameterList)
			p += o + "=" + vWidget.mParameterList[o] + "&";
			
	if (v)
		for (o in v)
			p += o + "=" + v[o] + "&";
	
	$("#div_tempWidgetPlayer").children("#iframe_tempWidgetPlayer").attr("src", vWidget.pPeerWidgetHref() + p + "auth=true");
	fDbg("auth load : " + (vWidget.pPeerWidgetHref() + p + "auth=true"));
}

cSPChannels.prototype.fEndAuth = function(
)
{
fDbg("*** cSPChannels, fEndAuth(), ");
	var vThis, o, vWidget;
	vThis = this;
	
	$("#div_tempWidgetPlayer").children("#iframe_tempWidgetPlayer").attr("src", "");
}

cSPChannels.prototype.fUpdateMessage = function(
	v
)
{
	var vThis;
	vThis = this;
	
	fDbg("v is : " + v);
	fDbg(vThis.mDivWidgetAuth.children("#widgetauth_itemcontent").attr("id"));
	$(vThis.mDivWidgetAuth.children()[0]).children("#widgetauth_itemcontent").html(v);
}
