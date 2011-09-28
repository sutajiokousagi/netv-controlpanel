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
	
	this.mDivChannels = null;
	this.mDivChannelList = null;
	this.mDivWidgets = null;
	this.mDivWidgetsContent = null;
	this.mDivWidgetList = null;
	this.mDivWidgetSummary = null;
	this.mDivWidgetConfig = null;
	this.mDivWidgetConfigList = null;
	this.mDivInputPanel = null;
	
	this.mDivSubNaviContent = null;
	this.mDivBack = null;

	// div variables
	this.mPrevSelection = null;
	this.mSelection = null;
	this.mSelectedChannelN = null;
	this.mSelectedWidgetN = null;
	

	this.mMode = null; 		// null (default) | mode_channel | mode_widget
	cSPChannels.MODE_DEFAULT = "mode_default";
	cSPChannels.MODE_WIDGETLIST = "mode_widgetlist";
	cSPChannels.MODE_WIDGETCONFIG = "mode_widgetconfig";
	cSPChannels.MODE_INPUT = "mode_input";
	
	
	this.mCurrWidgetConfigurable = false;


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
	this.mDivChannels = this.mDiv.children("#div_channelMain_channels");
	this.mDivWidgets = this.mDiv.children("#div_channelMain_widgets");
	this.mDivWidgetConfig = this.mDiv.children("#div_channelMain_widgetconfig");
	this.mDivInputPanel = this.mDiv.children("#div_channelMain_inputpanel");
	
	this.mDivSubNaviContent = $(this.mDiv.children("#subnavi").children()[0]);
	this.mDivBack = $(this.mDiv.children("#subnavi_action").children()[0]);
	this.mDivBack.pIndicatorStyle = { width: "96px", height: "36px", top: "551px", left: "350px" };
}

// -------------------------------------------------------------------------------------------------
//	pMode
// -------------------------------------------------------------------------------------------------
cSPChannels.prototype.pMode = function(
	vMode
)
{
	var vThis;
	vThis = this;
	
if (!vMode) return vThis.mMode;

	switch (vMode)
	{
	case cSPChannels.MODE_DEFAULT:
		vThis.mDivInputPanel.hide();
		vThis.mDivChannels.show();
		vThis.mDivWidgets.hide();
		vThis.mDivWidgetConfig.hide();
		
		vThis.mDivSubNaviContent.html("Channels");
		vThis.fRenderChannelList();
		vThis.mDivBack.css("opacity", "0.2");
		vThis.pSelection(vThis.mDivChannelList[0]);
		break;
	case cSPChannels.MODE_WIDGETLIST:
		vThis.mDivInputPanel.hide();
		vThis.mDivChannels.hide();
		vThis.mDivWidgets.show();
		vThis.mDivWidgetConfig.hide();
		vThis.mDivSubNaviContent.html(cModel.fGetInstance().CHANNEL_LIST[vThis.mSelectedChannelN].mName);
		
		//~ o = parseInt(vThis.mSelection.attr("id").split("_")[3]);
		vThis.fRenderWidgetList(cModel.fGetInstance().CHANNEL_LIST[vThis.mSelectedChannelN]);
		vThis.mDivIndicator.css({
			width: "50px",
			height: "50px",
			top: "150px",
			left: "150px"
		});
		vThis.mDivBack.css("opacity", "0.2");
		vThis.pSelection(vThis.mDivWidgetList[0]);
		break;
	case cSPChannels.MODE_WIDGETCONFIG:
		vThis.mDivInputPanel.hide();
		vThis.mDivChannels.hide();
		vThis.mDivWidgets.hide();
		vThis.mDivWidgetConfig.show();
		
		vThis.mDivSubNaviContent.html(cModel.fGetInstance().CHANNEL_LIST[vThis.mSelectedChannelN].mWidgetList[vThis.mSelectedWidgetN].mName);
		
		vThis.fRenderWidgetConfig(vThis.mSelectedChannelN, vThis.mSelectedWidgetN);
		vThis.mDivIndicator.css(vThis.mDivWidgetConfigList[0].pIndicatorStyle);
		vThis.mDivBack.css("opacity", "0.2");
		vThis.pSelection(vThis.mDivWidgetConfigList[0]);
		break;
	case cSPChannels.MODE_INPUT:
		
		vThis.mDivInputPanel.show();
		if (keyboard_currentY > 4)
			keyboard_onRemoteControl("up", "input_username");
		else if (keyboard_currentY < 0)
			keyboard_onRemoteControl("down", "input_username");
		break;
	}
	vThis.mMode = vMode;
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
	var vThis, o;
	vThis = this;
	
if (!vSelection) return vThis.mSelection;
	vThis.mPrevSelection = vThis.mSelection;
	if (vDimPrevSelection)
		vThis.mPrevSelection.css("opacity", "0.2");
	vThis.mSelection = vSelection;
	if (vLightNewSelection)
		vThis.mSelection.css("opacity", "1");
	vThis.mDivIndicator.css(vThis.mSelection.pIndicatorStyle);
	
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
	var vThis, i, o, p;
	vThis = this;
	
	switch(vSignal)
	{
	case cConst.SIGNAL_TOGGLE_CONTROLPANEL:
		break;
		
	case cConst.SIGNAL_TOGGLE_WIDGETENGINE:
		break;
		
	case cConst.SIGNAL_BUTTON_LEFT:
		switch (vThis.mMode)
		{
		case cSPChannels.MODE_DEFAULT:
			if (vThis.mDivChannelList.indexOf(vThis.pSelection()) > -1 && vThis.mDivChannelList.indexOf(vThis.pSelection()) > 0)
				vThis.pSelection(vThis.mDivChannelList[vThis.mDivChannelList.indexOf(vThis.pSelection()) - 1], true, true);
			break;
		case cSPChannels.MODE_WIDGETLIST:
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
				vThis.mDivWidgetsContent.animate({ left: "+=700px" }, 200, function() { });
			}
			break;
		}
		break;
		
	case cConst.SIGNAL_BUTTON_RIGHT:
		switch (vThis.mMode)
		{
		case cSPChannels.MODE_DEFAULT:
			if (vThis.mDivChannelList.indexOf(vThis.pSelection()) > -1 && vThis.mDivChannelList.indexOf(vThis.pSelection()) < vThis.mDivChannelList.length - 1)
				vThis.pSelection(vThis.mDivChannelList[vThis.mDivChannelList.indexOf(vThis.pSelection()) + 1], true, true);
			break;
		case cSPChannels.MODE_WIDGETLIST:
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
				vThis.mDivWidgetsContent.animate({ left: "-=700px" }, 200, function() { });
			}
			break;
		}
		break;
		
	case cConst.SIGNAL_BUTTON_CENTER:
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
			case vThis.mDivBack:	vThis.pMode(cSPChannels.MODE_DEFAULT); break;
			default:
				if (vThis.mCurrWidgetConfigurable)
					vThis.pMode(cSPChannels.MODE_WIDGETCONFIG);
				break;
			}
			break;
		case cSPChannels.MODE_WIDGETCONFIG:
			switch (vThis.mSelection)
			{
			case vThis.mDivBack:	vThis.pMode(cSPChannels.MODE_WIDGETLIST); break;
			default:
				o = $(vThis.mSelection.children()[2]);
				if (cModuleInput.fGetInstance().mIsActive)
					return;
				cModuleInput.fGetInstance().fShow();
				cModuleInput.fGetInstance().fAssociate(o, o.html(), null, function() {
					fDbg($(vThis.mSelection.children()[0]).html().toLowerCase());
					// TODO : MUST finish this on monday!!!!!!
					o = cModel.fGetInstance().CHANNEL_LIST[vThis.mSelectedChannelN].mWidgetList[vThis.mSelectedWidgetN];
					if (!o.mParameterList)
						o.mParameterList = {};

					o.mParameterList[$(vThis.mSelection.children()[0]).html().toLowerCase()] = $(vThis.mSelection.children()[2]).html();
					fDbg(o.mName);
					fDbg(JSON.stringify(o.mParameterList));
					cChannelModule.fGetInstance().fSaveChannelData();
				});
				break;
			}
			break;
		}
		break;
		
	case cConst.SIGNAL_BUTTON_UP:
		switch (vThis.mMode)
		{
		case cSPChannels.MODE_DEFAULT:
			switch (vThis.mSelection)
			{
			case vThis.mDivBack: 	vThis.pSelection(vThis.mPrevSelection, true, true); break;
			default:
				o = parseInt(vThis.mSelection.attr("id").split("_")[3]);
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
			default:
				o = parseInt(vThis.mSelection.attr("id").split("_")[1]);
				o = o - vThis.mStyle.mWidgetListColumn >= 0 ? vThis.mDivWidgetList[o - vThis.mStyle.mWidgetListColumn] : null;
				if (o)
					vThis.pSelection(o);
				break;
			}
			break;

		case cSPChannels.MODE_WIDGETCONFIG:
			i = vThis.mDivWidgetConfigList.indexOf(vThis.mSelection);
			if (i == -1)	// at mDivBack
			{
				vThis.pSelection(vThis.mPrevSelection, true, false);
			}
			else if (i - 1 >= 0)
			{
				o = {
					width: vThis.mDivIndicator.css("width"),
					height: vThis.mDivIndicator.css("height"),
					top: vThis.mDivIndicator.css("top"),
					left: vThis.mDivIndicator.css("left")
				};
				vThis.pSelection(vThis.mDivWidgetConfigList[i - 1]);

				/*
				p = [];
				p[0] = parseInt($("#widgetconfig_itemcontainer").css("top").split("px")[0]);
				p[1] = parseInt(vThis.mDivIndicator.css("top").split("px")[0]);
				
				if (p[1] > p[0])
				{
					$($("#widgetconfig_itemcontainer").children()[0]).css("top", "-=70px");
					vThis.mDivIndicator.css(o);
				}
				*/
			}
			break;
		}
		break;
		
	case cConst.SIGNAL_BUTTON_DOWN:
		switch (vThis.mMode)
		{
		case cSPChannels.MODE_DEFAULT:
			o = vThis.mSelection.attr("id");
			if (!o || o.indexOf("channelThumbnail") == -1)
				return;
			o = parseInt(o.split("_")[3]);
			o = o + vThis.mStyle.mChannelListColumn <= vThis.mDivChannelList.length ? vThis.mDivChannelList[o + vThis.mStyle.mChannelListColumn] : vThis.mDivBack;
			vThis.pSelection(o, true, true);
			break;
			
		case cSPChannels.MODE_WIDGETLIST:
			o = parseInt(vThis.mSelection.attr("id").split("_")[1]);
			i = (o % 18 - (o % 18 % 6)) / 6;
			if (i == 2)
				o = vThis.mDivBack;
			else
				o = o + vThis.mStyle.mWidgetListColumn <= vThis.mDivWidgetList.length ?  vThis.mDivWidgetList[o + vThis.mStyle.mWidgetListColumn] : vThis.mDivBack;
			vThis.pSelection(o, false, true);
			break;

		case cSPChannels.MODE_WIDGETCONFIG:
			i = vThis.mDivWidgetConfigList.indexOf(vThis.mSelection);
			if (i >= 0)
			{
				if (i + 1 < vThis.mDivWidgetConfigList.length)
				{
					o = {
						width: vThis.mDivIndicator.css("width"),
						height: vThis.mDivIndicator.css("height"),
						top: vThis.mDivIndicator.css("top"),
						left: vThis.mDivIndicator.css("left")
					}
					vThis.pSelection(vThis.mDivWidgetConfigList[i + 1]);
					
					p = [];
					p[0] = parseInt($("#widgetconfig_itemcontainer").css("top").split("px")[0]) + parseInt($("#widgetconfig_itemcontainer").css("height").split("px")[0]);
					p[1] = parseInt(vThis.mDivIndicator.css("top").split("px")[0]) + parseInt(vThis.mDivIndicator.css("height").split("px")[0]);
					
					if (p[1] > p[0])
					{
						$($("#widgetconfig_itemcontainer").children()[0]).css("top", "-=70px");
						vThis.mDivIndicator.css(o);
					}
				}
				else
				{
					vThis.pSelection(vThis.mDivBack, false, true);
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
fDbg("*** cSPChannels, fRenderChannelList(), ");
	var vThis, vDiv, o, p, i, j, vChannelList, vLen, vImagePath;
	vThis = this;
	
	vDiv = $("#div_channelMain #div_channelMain_channels");
	vChannelList = cModel.fGetInstance().CHANNEL_LIST;
	vForceRender = true;
	o = "";
	if (vForceRender || vDiv.children().length == 0)
	{
		for (i = 0; i < vChannelList.length; i++)
		{
			o += '<div id="div_channelMain_channelThumbnail_' + i + '_container" style="position: absolute; top: 160px; left: ' + (100 + i * 200) + 'px; width: 120px; height: 120px; color: #FFFFFF; opacity: ' + (i == 0 ? 1 : 0.2) + '; border: solid white 0px;">';
				o += '<div id="channelThumbnail_' + i + '_title" style="position: absolute; top: 10px; left: 0px; width: 120px; font-size: 15px; font-weight: bold; text-align: center; color: #FFFFFF; text-shadow: #000000 2px 2px 2px;">' + vChannelList[i].mName + '</div>';
				o += '<div id="channelThumbnail_' + i + '_container" style="position: absolute; top: 40px; left: 10px; border: solid #FFFFFF 0px; width: 100px; height: 82px;">';
				vLen = vChannelList[i].mWidgetList.length < 4 ? vChannelList[i].mWidgetList.length : 4;
				for (j = 0; j < vLen; j++)
				{
					vImagePath = vChannelList[i].mWidgetList[j].mLocalThumbnailPath;
					//~ fDbg(vImagePath);
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
		vDiv.html(o);
		
		vThis.mDivChannelList = [];
		vDiv.children().each(function() {
			vThis.mDivChannelList.push($(this));
		});
		for (i = 0; i < vThis.mDivChannelList.length; i++)
			vThis.mDivChannelList[i].pIndicatorStyle = {
				width: parseInt(vThis.mDivChannelList[i].css("width").split("px")[0]) + 20 + "px",
				height: parseInt(vThis.mDivChannelList[i].css("height").split("px")[0]) + 20 + "px",
				top: parseInt(vThis.mDivChannelList[i].css("top").split("px")[0]) - 10 + "px",
				left: parseInt(vThis.mDivChannelList[i].css("left").split("px")[0]) - 10 + "px"
			};
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
fDbg("*** cSPChannels, fRenderWidgetList(), ");
	var vThis, o, p, i, j, k, vWidgetList, vLen;
	vThis = this;
	
	if (!vChannelObj)
		return;
	vDiv = $("#div_channelMain #div_channelMain_widgets");
	
	o = "";
	o += '<div id="widget_summary" style="position: absolute; top: 140px; left: 50px; width: 700px; height: 80px; color: #FFFFFF; background-color: #222222; border: solid #333333 0px; border-radius: 10px;"></div>';
	//~ o += '<div id="widgetstn_container" style="position: absolute; top: 250px; left: 50px; width: 700px; height: 300px; overflow: hidden;">';
	o += '<div id="widgetstn_container" style="position: absolute; top: 250px; left: 0px; width: 800px; height: 300px; overflow: hidden;">';
		o += '<div id="widgetstn_content" style="position: absolute; top: 0px; left: 50px;">';
		vLen = vChannelObj.mWidgetList.length;
		for (j = 0; j < vLen; j++)
		{
			vImagePath = vChannelObj.mWidgetList[j].mLocalThumbnailPath;
			i = j % (vThis.mStyle.mWidgetListRow * vThis.mStyle.mWidgetListColumn);
			k = (j - i) / (vThis.mStyle.mWidgetListRow * vThis.mStyle.mWidgetListColumn);
			p = [];
			p[0] = (i - i % vThis.mStyle.mWidgetListColumn) / vThis.mStyle.mWidgetListColumn * 100;
			p[1] = 35 + j % vThis.mStyle.mWidgetListColumn * 110 + k * 700;
			o += '<div id="widgettn_' + j + '" style="position: absolute; top: ' + p[0] + 'px; left: ' + p[1] + 'px; width: 80px; height: 60px; border: solid #CCCCCC 2px;">';
			o += '<img src="' + vImagePath + '" width="80px" height="60px" />';
			o += '</div>';
		}
		o += '</div>';
	o += '</div>';
	vDiv.html(o);

	vThis.mDivWidgetSummary = $(vDiv.children()[0]);
	vDiv = $($(vDiv.children()[1]).children()[0]);
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
}

/** ------------------------------------------------------------------------------------------------
 *  fRenderWidgetSummary
 * -----------------------------------------------------------------------------------------------*/
cSPChannels.prototype.fRenderWidgetSummary = function(
	vChannelN,
	vWidgetN
)
{
	var vThis, o, p, vWidget, n;
	vThis = this;

	vWidget = cModel.fGetInstance().CHANNEL_LIST[vChannelN].mWidgetList[vWidgetN];
	n = 0;
	for (p in vWidget.mParameterList)
		n++;
		
	
	o = '';
	o += '<div style="position: absolute; top: 10px; left: 10px; font-size: 20px;">' + vWidget.mName + '</div>';
	if (vWidget.mParameterList && n > 0)
	{
		o += '<div style="position: absolute; top: 60px; left: 390px; font-size: 13px; font-style: italic; color: #AAAAAA;">Configurable. Press the <span style="font-weight: bold; font-style: normal; color: #FFFFFF;">center</span> button to edit.</div>';
		vThis.mCurrWidgetConfigurable = true;
	}
	else
		vThis.mCurrWidgetConfigurable = false;

	/*
	fDbg("======================================");
	fDbg("======================================");
	for (p in vWidget.mParameterList)
		fDbg(p + " : " + vWidget.mParameterList[p]);
	fDbg("======================================");
	*/
	vThis.mDivWidgetSummary.html(o);
}

/** ------------------------------------------------------------------------------------------------
 *  fRenderWidgetConfig
 * -----------------------------------------------------------------------------------------------*/
cSPChannels.prototype.fRenderWidgetConfig = function(
	vChannelN,
	vWidgetN
)
{
	var vThis, o, p, i, vWidget, vLeft, vTop;
	vThis = this;
	vWidget = cModel.fGetInstance().CHANNEL_LIST[vChannelN].mWidgetList[vWidgetN];
	
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

cSPChannels.prototype.fRenderInputMode = function() {

}
{



}
