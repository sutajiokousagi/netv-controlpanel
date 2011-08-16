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

	this.mCurrSelection = 0;		//	0 | 1
	
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
//~ fDbg2("*** cSPInfo, fInit(), ");
	$("#div_infoMain_content_basic").show();
	$("#div_infoMain_content_advanced").hide();
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
		if (vThis.mCurrSelection == null)
			return;
	
		var vCurrSelected, vNewSelected, vSubNaviList;
		vSubNaviList = $("#div_infoMain #subnavi").children();
		for (i = 0; i < vSubNaviList.length; i++)
			if ($(vSubNaviList[i]).css("opacity") == "1")
			{
				vCurrSelected = i;
				break;
			}
		vNewSelected = vCurrSelected - 1;
		if (vNewSelected < 0)
			vNewSelected = vSubNaviList.length - 1;
			
		$($("#div_infoMain #div_infoMain_content").children()[vCurrSelected]).fadeOut(100, function() {
			$($("#div_infoMain #div_infoMain_content").children()[vNewSelected]).fadeIn(100);
		});
		
		p = $("#div_infoMain #subnavi");
		p = $(p.children()[vNewSelected]);
		$("#div_infoMain #item_indicator").animate({
			left: p.css("left"),
			width: p.css("width")
		}, 100, function() {
			$(vSubNaviList[vCurrSelected]).css("opacity", "0.2");
			$(vSubNaviList[vNewSelected]).css("opacity", "1");
			vThis.mCurrSelection = vNewSelected;
		});
		break;
		
	case cConst.SIGNAL_BUTTON_RIGHT:
		if (vThis.mCurrSelection == null)
			return;
			
		var vCurrSelected, vNewSelected, vSubNaviList;
		vSubNaviList = $("#div_infoMain #subnavi").children();
		for (i = 0; i < vSubNaviList.length; i++)
			if ($(vSubNaviList[i]).css("opacity") == "1")
			{
				vCurrSelected = i;
				break;
			}
		vNewSelected = vCurrSelected + 1;
		if (vNewSelected > vSubNaviList.length - 1)
			vNewSelected = 0;
			
		$($("#div_infoMain #div_infoMain_content").children()[vCurrSelected]).fadeOut(100, function() {
			$($("#div_infoMain #div_infoMain_content").children()[vNewSelected]).fadeIn(100);
		});
		
		p = $("#div_infoMain #subnavi");
		p = $(p.children()[vNewSelected]);
		$("#div_infoMain #item_indicator").animate({
			left: p.css("left"),
			width: p.css("width")
		}, 100, function() {
			$(vSubNaviList[vCurrSelected]).css("opacity", "0.2");
			$(vSubNaviList[vNewSelected]).css("opacity", "1");
			vThis.mCurrSelection = vNewSelected;
		});
		break;
		
	case cConst.SIGNAL_BUTTON_CENTER:
		if (vThis.mCurrSelection == null)
		{
			cCPanel.fGetInstance().fBack();
		}
		break;
		
	case cConst.SIGNAL_BUTTON_UP:
		var vCurrSelected, vNewSelected, vSubNaviList;
		if (vThis.mCurrSelection == null)
		{
			var vCurrSelected, vNewSelected, vSubNaviList;
			vSubNaviList = $("#div_infoMain #div_infoMain_content").children();
			for (i = 0; i < vSubNaviList.length; i++)
				if ($(vSubNaviList[i]).is(":visible"))
				{
					vNewSelected = i;
					break;
				}
			
				
			vSubNaviList = $("#div_infoMain #subnavi").children();
			p = $("#div_infoMain #subnavi");
			p = $(p.children()[vNewSelected]);
			$("#div_infoMain #item_indicator").animate({
				left: p.css("left"),
				top: "115px",
				width: p.css("width")
			}, 100, function() {
				$(vSubNaviList[vNewSelected]).css("opacity", "1");
				$($("#div_infoMain #subnavi_back").children()[0]).css("opacity", "0.2");
				vThis.mCurrSelection = vNewSelected;
			});
		}
		break;
		
	case cConst.SIGNAL_BUTTON_DOWN:
		var vCurrSelected, vNewSelected, vSubNaviList;
		if (vThis.mCurrSelection >= 0)
		{
			vSubNaviList = $("#div_infoMain #subnavi").children();
			p = $("#div_infoMain #subnavi_back");
			p = $(p.children()[0]);
			$("#div_infoMain #item_indicator").animate({
				left: p.css("left"),
				top: parseInt($("#subnavi_back").css("top").split("px")[0]) + 25 + "px",
				width: p.css("width")
			}, 100, function() {
				$(vSubNaviList[vThis.mCurrSelection]).css("opacity", "0.2");
				//~ $(vSubNaviList[vNewSelected]).css("opacity", "1");
				p.css("opacity", "1");
				vThis.mCurrSelection = null;
			});
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
