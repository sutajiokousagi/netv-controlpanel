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
	
	this.mCurrSelection = 0;

	this.mCurrMode = null; 		// null (default) | mode_channel | mode_widget

	this.mCurrChannelSelection = null;
	this.mCurrWidgetSelection = null;
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cSPChannels.instance = null;
cSPChannels.fGetInstance = function(
	vDiv
)
{
	return cSPChannels.instance ? cSPChannels.instance : cSPChannels.instance = new cSPChannels(vDiv);
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cSPChannels.prototype.fInit = function(
)
{
	
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
		if (vThis.mCurrSelection == null)
			return;
			
		var vCurrSelected, vNewSelected;
		o = $("#div_channelMain #div_channelMain_channels");
		for (i = 0; i < o.children().length; i++)
			if ($(o.children()[i]).css("opacity") == "1")
			{
				vCurrSelected = i;
				break;
			}
		vNewSelected = vCurrSelected - 1;
		if (vNewSelected < 0)
			vNewSelected = o.children().length - 1;

		$(o.children()[vCurrSelected]).css("opacity", "0.2");
		$(o.children()[vNewSelected]).css("opacity", "1");
		
		$("#div_channelMain #item_indicator").animate({
			left: $(o.children()[vNewSelected]).css("left"),
			width: parseInt($(o.children()[vNewSelected]).css("width").split("px")[0]) + 5 + "px"
		}, 100, function() {
			vThis.mCurrSelection = vNewSelected;
		});
		break;
		
	case cConst.SIGNAL_BUTTON_RIGHT:
		if (vThis.mCurrSelection == null)
			return;
			
		var vCurrSelected, vNewSelected;
		o = $("#div_channelMain #div_channelMain_channels");
		for (i = 0; i < o.children().length; i++)
			if ($(o.children()[i]).css("opacity") == "1")
			{
				vCurrSelected = i;
				break;
			}
		vNewSelected = vCurrSelected + 1;
		if (vNewSelected > o.children().length - 1)
			vNewSelected = 0;

		$(o.children()[vCurrSelected]).css("opacity", "0.2");
		$(o.children()[vNewSelected]).css("opacity", "1");
		
		$("#div_channelMain #item_indicator").animate({
			left: $(o.children()[vNewSelected]).css("left"),
			width: parseInt($(o.children()[vNewSelected]).css("width").split("px")[0]) + 5 + "px"
		}, 100, function() {
			vThis.mCurrSelection = vNewSelected;
		});
		break;
		
	case cConst.SIGNAL_BUTTON_CENTER:
		if (vThis.mCurrSelection == null)
		{
			cCPanel.fGetInstance().fBack();
		}
		else
		{
			vThis.mCurrMode = "mode_channel";
			vThis.fRenderChannelInfo(cModel.fGetInstance().CHANNEL_LIST[vThis.mCurrSelection]);
			$("#div_channelMain #item_indicator").animate({
				top: parseInt($($("#div_channelMain #widgetstn_content").children()[0]).css("top").split("px")[0]) + 320 + "px",
				left: parseInt($($("#div_channelMain #widgetstn_content").children()[0]).css("left").split("px")[0]) + 50 + "px",
				width: parseInt($($("#div_channelMain #widgetstn_content").children()[0]).css("width").split("px")[0]) + 1 + "px",
			}, 100, function() {
				vThis.mCurrWidgetSelection = 0;
			});
		}
		break;
		
	case cConst.SIGNAL_BUTTON_UP:
		var vCurrSelected, vNewSelected, vList;
		switch (vThis.mCurrMode)
		{
		case null:
			if (vThis.mCurrSelection == null)
			{
				var vCurrSelected, vNewSelected, vList;
				vList = $("#div_channelMain #div_channelMain_channels").children();
				for (i = 0; i < vList.length; i++)
					if ($(vList[i]).css("opacity") == "1")
					{
						vNewSelected = i;
						break;
					}
					
				p = $(vList[vNewSelected]);
				$("#div_channelMain #item_indicator").animate({
					left: p.css("left"),
					top: "290px",
					width: parseInt(p.css("width").split("px")[0]) + 5 + "px"
				}, 100, function() {
					$(vList[vNewSelected]).css("opacity", "1");
					$($("#subnavi_back").children()[0]).css("opacity", "0.2");
					vThis.mCurrSelection = vNewSelected;
				});
			}
			break;
		case "mode_channel":
			o = $($("#div_channelMain #widgetstn_content").children()[vThis.mCurrWidgetSelection - 6]);
			$("#div_channelMain #item_indicator").animate({
				top: parseInt(o.css("top").split("px")[0]) + 320 + "px"
			}, 100, function() {
				vThis.mCurrWidgetSelection = vThis.mCurrWidgetSelection - 6;
			});
			break;
		}
		break;
		
	case cConst.SIGNAL_BUTTON_DOWN:
		var vCurrSelected, vNewSelected, vList;

		switch (vThis.mCurrMode)
		{
		case null:
			if (vThis.mCurrSelection >= 0)
			{
				vList = $("#div_channelMain #div_channelMain_channels").children();
				
				p = $("#div_channelMain #subnavi_back");
				p = $(p.children()[0]);
				$("#div_channelMain #item_indicator").animate({
					left: p.css("left"),
					top: parseInt($("#subnavi_back").css("top").split("px")[0]) + 25 + "px",
					width: p.css("width")
				}, 100, function() {
					//~ $(vList[vThis.mCurrSelection]).css("opacity", "0.2");
					//~ $(vSubNaviList[vNewSelected]).css("opacity", "1");
					p.css("opacity", "1");
					vThis.mCurrSelection = null;
				});
			}
			break;
		case "mode_channel":
			o = $($("#div_channelMain #widgetstn_content").children()[vThis.mCurrWidgetSelection + 6]);
			$("#div_channelMain #item_indicator").animate({
				top: parseInt(o.css("top").split("px")[0]) + 320 + "px"
			}, 100, function() {
				vThis.mCurrWidgetSelection = vThis.mCurrWidgetSelection + 6;
			});
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

	o = "";
	if (vForceRender || vDiv.children().length == 0)
	{
		for (i = 0; i < vChannelList.length; i++)
		{
			o += '<div id="div_channelMain_channelThumbnail_' + i + '_container" style="position: absolute; top: 160px; left: ' + (100 + i * 200) + 'px; width: 120px; height: 130px; color: #FFFFFF; opacity: ' + (i == 0 ? 1 : 0.2) + '; border: solid white 0px;">';
				o += '<div id="channelThumbnail_' + i + '_title" style="position: absolute; top: 0px; left: 0px; width: 120px; font-size: 14px; text-align: center;">Default Channel ' + (i + 1) + '</div>';
				o += '<div id="channelThumbnail_' + i + '_container" style="position: absolute; top: 30px; left: 10px; border: solid #FFFFFF 0px; width: 100px; height: 82px;">';
				vLen = vChannelList[i].mWidgetList.length < 4 ? vChannelList[i].mWidgetList.length : 4;
				for (j = 0; j < vLen; j++)
				{
					//~ fDbg(i + " --- " + j);
					//~ fDbg(vChannelList[i].mWidgetList[j].mLocalThumbnailPath);
					vImagePath = vChannelList[i].mWidgetList[j].mLocalThumbnailPath;
					fDbg(vImagePath);
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
	}
}

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
	$("#div_channelMain #div_channelMain_channelinfo").hide();
	
	o = "";
	o += '<div style="position: absolute; top: 100px; left: 50px; width: 120px; height: 120px; color: #FFFFFF; border: solid white 0px;">';
		o += '<div style="position: absolute; top: 0px; left: 0px; width: 120px; font-size: 14px; text-align: center;">' + vChannelObj.mName + '</div>';
		o += '<div id="channelThumbnail_' + i + '_container" style="position: absolute; top: 30px; left: 10px; border: solid #FFFFFF 0px; width: 100px; height: 82px;">';
		vLen = vChannelObj.mWidgetList.length < 4 ? vChannelObj.mWidgetList.length : 4;
		for (j = 0; j < vLen; j++)
		{
			vImagePath = vChannelObj.mWidgetList[j].mLocalThumbnailPath;
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
	o += '<div id="widgetstn_container" style="position: absolute; top: 250px; left: 50px; width: 700px; height: 300px; overflow: hidden;">';
		o += '<div id="widgetstn_content" style="position: absolute; top: 0px; left: 0px;">';
		vLen = vChannelObj.mWidgetList.length;
		for (j = 0; j < vLen; j++)
		{
			vImagePath = vChannelObj.mWidgetList[j].mLocalThumbnailPath;
			i = j % 18;
			k = (j - i) / 18;
			
			p[0] = (i - i % 6) / 6 * 100;
			p[1] = 35 + j % 6 * 110 + k * 700;
			o += '<div style="position: absolute; top: ' + p[0] + 'px; left: ' + p[1] + 'px; border: solid #FFFFFF 0px; width: 80px; height: 60px; border: solid #666666 0px;">';
			o += '<img src="' + vImagePath + '" width="80px" height="60px"';
			o += '</div>';
		}
		o += '</div>';
	o += '</div>';


	
	$("#div_channelMain #div_channelMain_channels").animate({
		left: "-1000px"
	}, 200, function() {
		$("#div_channelMain #div_channelMain_channelinfo").show();
	});

	$("#div_channelMain #div_channelMain_channelinfo").html(o);
}
