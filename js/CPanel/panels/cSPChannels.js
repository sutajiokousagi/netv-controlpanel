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
	this.mDivWIdgets = null;
	this.mDivWidgetList = null;
	this.mDivWidgetSummary = null;
	
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
		vThis.mDivChannels.show();
		vThis.mDivWidgets.hide();
		
		vThis.mDivSubNaviContent.html("Channels");
		vThis.fRenderChannelList();
		vThis.mDivBack.css("opacity", "0.2");
		vThis.pSelection(vThis.mDivChannelList[0]);
		break;
	case cSPChannels.MODE_WIDGETLIST:
		vThis.mDivChannels.hide();
		vThis.mDivWidgets.show();
		
		o = parseInt(vThis.mSelection.attr("id").split("_")[3]);
		vThis.mDivSubNaviContent.html(cModel.fGetInstance().CHANNEL_LIST[o].mName);
		vThis.fRenderChannelInfo(cModel.fGetInstance().CHANNEL_LIST[o]);

		vThis.mDivIndicator.css({
			width: "50px",
			height: "50px",
			top: "150px",
			left: "150px"
		});
		vThis.mDivBack.css("opacity", "0.2");
		vThis.pSelection(vThis.mDivWidgetList[0]);
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

	o = vThis.mSelection.attr("id").split("widgettn_");
	if (o[0] == "")
	{
		o[1] = parseInt(o[1]);
		vThis.mSelectedWidgetN = o[1];
		vThis.fRenderWidgetSummary(vThis.mSelectedChannelN, vThis.mSelectedWidgetN);
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
	var vThis, i, o;
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
		case cSPChannels.MODE_WIDGETLIST:
			o = parseInt(vThis.mSelection.attr("id").split("_")[1]);
			o = o - 1 >= 0 ?  vThis.mDivWidgetList[o - 1] : null;
			if (!o)
				return;
			vThis.pSelection(o);
			break;
		}
		break;
		
	case cConst.SIGNAL_BUTTON_RIGHT:
		switch (vThis.mMode)
		{
		case cSPChannels.MODE_WIDGETLIST:
			o = parseInt(vThis.mSelection.attr("id").split("_")[1]);
			o = o + 1 < vThis.mDivWidgetList.length ?  vThis.mDivWidgetList[o + 1] : null;
			if (!o)
				return;
			vThis.pSelection(o);
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
			o = o + vThis.mStyle.mWidgetListColumn <= vThis.mDivWidgetList.length ?  vThis.mDivWidgetList[o + vThis.mStyle.mWidgetListColumn] : vThis.mDivBack;
			vThis.pSelection(o, false, true);
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
				width: vThis.mDivChannelList[i].css("width"),
				height: vThis.mDivChannelList[i].css("height"),
				top: vThis.mDivChannelList[i].css("top"),
				left: vThis.mDivChannelList[i].css("left")
			};
	}
}

/** ------------------------------------------------------------------------------------------------
 *  fRenderChannelInfo
 * -----------------------------------------------------------------------------------------------*/
cSPChannels.prototype.fRenderChannelInfo = function(
	vChannelObj,
	vForceRender
)
{
fDbg("*** cSPChannels, fRenderChannelInfo(), ");
	var vThis, o, p, i, j, k, vWidgetList, vLen;
	vThis = this;
	
	if (!vChannelObj)
		return;
	vDiv = $("#div_channelMain #div_channelMain_widgets");
	
	o = "";
	o += '<div id="widget_summary" style="position: absolute; top: 140px; left: 50px; width: 700px; height: 80px; color: #FFFFFF; background-color: #222222; border: solid #333333 0px; border-radius: 10px;"></div>';
	o += '<div id="widgetstn_container" style="position: absolute; top: 250px; left: 50px; width: 700px; height: 300px; overflow: hidden;">';
		o += '<div id="widgetstn_content" style="position: absolute; top: 0px; left: 0px;">';
		vLen = vChannelObj.mWidgetList.length;
		for (j = 0; j < vLen; j++)
		{
			vImagePath = vChannelObj.mWidgetList[j].mLocalThumbnailPath;
			i = j % 18;
			k = (j - i) / 18;
			p = [];
			p[0] = (i - i % 6) / 6 * 100;
			p[1] = 35 + j % 6 * 110 + k * 700;
			o += '<div id="widgettn_' + j + '" style="position: absolute; top: ' + p[0] + 'px; left: ' + p[1] + 'px; width: 80px; height: 60px; border: solid #CCCCCC 2px;">';
			o += '<img src="' + vImagePath + '" width="80px" height="60px" />';
			o += '</div>';
		}
		o += '</div>';
	o += '</div>';
	vDiv.html(o);

	vThis.mDivWidgetSummary = $(vDiv.children()[0]);
	vDiv = $($(vDiv.children()[1]).children()[0]);
	vThis.mDivWidgetList = [];
	vDiv.children().each(function() {
		vThis.mDivWidgetList.push($(this));
	});
	for (i = 0; i < vThis.mDivWidgetList.length; i++)
		vThis.mDivWidgetList[i].pIndicatorStyle = {
			width: parseInt(vThis.mDivWidgetList[i].css("width").split("px")[0]) + 22 + "px",
			height: parseInt(vThis.mDivWidgetList[i].css("height").split("px")[0]) + 22 + "px",
			top: parseInt(vThis.mDivWidgetList[i].css("top").split("px")[0]) + 250 - 10 + "px",
			left: parseInt(vThis.mDivWidgetList[i].css("left").split("px")[0]) + 50 - 10 + "px"
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
	var vThis, o, p, vWidget;
	vThis = this;

	vWidget = cModel.fGetInstance().CHANNEL_LIST[vChannelN].mWidgetList[vWidgetN];
	
	o = "";
	o += vWidget.mName;
	fDbg(vWidget.mParameterList);
	fDbg(vWidget.mParameterList.length);
	for (p in vWidget.mParameterList)
		fDbg(p + " : " + vWidget.mParameterList[p]);


	
	vThis.mDivWidgetSummary.html(o);
}
