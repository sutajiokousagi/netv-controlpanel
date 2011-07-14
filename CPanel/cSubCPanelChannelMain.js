// -------------------------------------------------------------------------------------------------
//	cSubCPanelChannelMain class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cSubCPanelChannelMain(
	vDivObj
)
{
	this.mDiv = vDivObj;
	this.mSelectedChannel = null;
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cSubCPanelChannelMain.instance = null;
cSubCPanelChannelMain.fGetInstance = function(
	vDivObj
)
{
	return cSubCPanelChannelMain.instance ? cSubCPanelChannelMain.instance : cSubCPanelChannelMain.instance = new cSubCPanelChannelMain(vDivObj);
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cSubCPanelChannelMain.prototype.fInit = function(
)
{
	
}

// -------------------------------------------------------------------------------------------------
//	fOnSignal
// -------------------------------------------------------------------------------------------------
cSubCPanelChannelMain.prototype.fOnSignal = function(
	vSignal,		// string
	vData,			// data array
	vReturnFun		// return function call
)
{
fDbg("*** cSubCPanelChannelMain, fOnSignal(), " + vSignal + ", " + vData);
	var i, o;
	
	switch(vSignal)
	{
	case cConst.SIGNAL_TOGGLE_CONTROLPANEL:
		break;
		
	case cConst.SIGNAL_TOGGLE_WIDGETENGINE:
		break;
		
	case cConst.SIGNAL_BUTTON_LEFT:
		o = this.fGetSelected()[0];
		if (o > 0)
			o--;
		this.fSetSelected([o]);
		break;
		
	case cConst.SIGNAL_BUTTON_RIGHT:
		o = this.fGetSelected()[0];
		if (o < 2)
			o++;
		this.fSetSelected([o]);
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
cSubCPanelChannelMain.prototype.fShow = function(
)
{
	this.mDiv.show();
}
cSubCPanelChannelMain.prototype.fHide = function(
)
{
	this.mDiv.hide();
}

// -------------------------------------------------------------------------------------------------
//	fFadeIn / fFadeOut
// -------------------------------------------------------------------------------------------------
cSubCPanelChannelMain.prototype.fFadeIn = function(
)
{
	this.mDiv.fadeIn(500, function() {});
}
cSubCPanelChannelMain.prototype.fFadeOut = function(
)
{
	this.mDiv.fadeOut(500, function() {});
}

// -------------------------------------------------------------------------------------------------
//	fGetSelected
// -------------------------------------------------------------------------------------------------
cSubCPanelChannelMain.prototype.fGetSelected = function(
)
{
	var o;
	if ($('#div_channelMain_channelThumbnail_0_shadow').is(':visible'))
		o = [0];
	else if ($('#div_channelMain_channelThumbnail_1_shadow').is(':visible'))
		o = [1];
	else if ($('#div_channelMain_channelThumbnail_2_shadow').is(':visible'))
		o = [2];

	return o;
}

// -------------------------------------------------------------------------------------------------
//	fRenderChannelMain
// -------------------------------------------------------------------------------------------------
cSubCPanelChannelMain.prototype.fSetSelected = function(
	vData,
	vReturnFun
)
{
	var i;
	
	for (i = 0; i < 3; i++)
		$("#div_channelMain_channelThumbnail_" + i + "_shadow").hide();
	$("#div_channelMain_channelThumbnail_" + vData[0] + "_shadow").show();

	if (vReturnFun)
		vReturnFun();
}
