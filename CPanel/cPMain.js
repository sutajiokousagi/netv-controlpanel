// -------------------------------------------------------------------------------------------------
//	cPMain class
//
//
//
// -------------------------------------------------------------------------------------------------
var kCPanelStatic = {
	mSelectionList : ["channels", "configurations", "info"]
};

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cPMain(
	vDiv
)
{
	this.mDiv = $("#" + vDiv);
	this.mID = vDiv;

	this.mCurrSelection = 0;


	
	this.fInit();
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cPMain.instance = null;
cPMain.fGetInstance = function(
	vDiv
)
{
	return cPMain.instance ? cPMain.instance : cPMain.instance = new cPMain(vDiv);
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cPMain.prototype.fInit = function(
)
{
fDbg("*** cPMain, fInit(), ");

}

// -------------------------------------------------------------------------------------------------
//	fOnSignal
// -------------------------------------------------------------------------------------------------
cPMain.prototype.fOnSignal = function(
	vSignal,		// string
	vData,			// data array
	vReturnFun		// return function call
)
{
//~ fDbg2("*** cPMain, fOnSignal(), " + vSignal + ", " + vData);
	var vThis, i, o;
	vThis = this;
	
	switch(vSignal)
	{
	case cConst.SIGNAL_TOGGLE_CONTROLPANEL:
		break;
		
	case cConst.SIGNAL_TOGGLE_WIDGETENGINE:
		break;
		
	case cConst.SIGNAL_BUTTON_LEFT:
		var vCurrSelected, vNewSelected, vTitleDivList;
		o = $("#div_cpanelMain #item_images");
		for (i = 0; i < o.children().length; i++)
			if ($(o.children()[i]).is(":visible"))
			{
				vCurrSelected = i;
				break;
			}
		vNewSelected = vCurrSelected - 1;
		if (vNewSelected < 0 )
			vNewSelected = o.children().length - 1;
		$(o.children()[vCurrSelected]).fadeOut(150, function() {
			$(o.children()[vNewSelected]).fadeIn(150);
		});
		p = $("#div_cpanelMain #subnavi");
		p = $(p.children()[vNewSelected]);
		
		$("#div_cpanelMain #item_indicator").animate({
			left: p.css("left"),
			width: p.css("width")
		}, 200, function() {
			vTitleDivList = $("#div_cpanelMain #subnavi").children();
			$(vTitleDivList[vCurrSelected]).css("opacity", "0.2");
			$(vTitleDivList[vNewSelected]).css("opacity", "1");
			vThis.mCurrSelection = vNewSelected;
		});
		break;
		
	case cConst.SIGNAL_BUTTON_RIGHT:
		var vCurrSelected, vNewSelected, vTitleDivList;
		o = $("#div_cpanelMain #item_images");
		for (i = 0; i < o.children().length; i++)
			if ($(o.children()[i]).is(":visible"))
			{
				vCurrSelected = i;
				break;
			}
		vNewSelected = vCurrSelected + 1;
		if (vNewSelected > o.children().length - 1)
			vNewSelected = 0;
		$(o.children()[vCurrSelected]).fadeOut(150, function() {
			$(o.children()[vNewSelected]).fadeIn(150);
		});
		p = $("#div_cpanelMain #subnavi");
		p = $(p.children()[vNewSelected]);
		
		$("#div_cpanelMain #item_indicator").animate({
			left: p.css("left"),
			width: p.css("width")
		}, 200, function() {
			vTitleDivList = $("#div_cpanelMain #subnavi").children();
			$(vTitleDivList[vCurrSelected]).css("opacity", "0.2");
			$(vTitleDivList[vNewSelected]).css("opacity", "1");
			vThis.mCurrSelection = vNewSelected;
		});
		break;
		
	case cConst.SIGNAL_BUTTON_CENTER:
		break;
		
	case cConst.SIGNAL_BUTTON_UP:
		break;
		
	case cConst.SIGNAL_BUTTON_DOWN:
		break;
	}
}

// -------------------------------------------------------------------------------------------------
//	fShow / fHide
// -------------------------------------------------------------------------------------------------
cPMain.prototype.fShow = function(
)
{
	this.mDiv.show();
}
cPMain.prototype.fHide = function(
)
{
	this.mDiv.hide();
}

// -------------------------------------------------------------------------------------------------
//	fAnimateIn / fAnimateOut
// -------------------------------------------------------------------------------------------------
cPMain.prototype.fAnimateIn = function(
	vReturnFun
)
{
	this.mDiv.fadeIn(200, function() { if (vReturnFun) vReturnFun(); });
}
cPMain.prototype.fAnimateOut = function(
	vReturnFun
)
{
	this.mDiv.fadeOut(200, function() { if (vReturnFun) vReturnFun(); });
}

// -------------------------------------------------------------------------------------------------
//	pCurrSelection		// return string
// -------------------------------------------------------------------------------------------------
cPMain.prototype.pCurrSelection = function(
)
{
	return kCPanelStatic.mSelectionList[this.mCurrSelection];
}
