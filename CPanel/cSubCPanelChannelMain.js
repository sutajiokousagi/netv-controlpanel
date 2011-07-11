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
		$("#div_channelMain_channelThumbnail_0_shadow").show();
		$("#div_channelMain_channelThumbnail_1_shadow").hide();
		break;
		
	case cConst.SIGNAL_BUTTON_RIGHT:
		$("#div_channelMain_channelThumbnail_0_shadow").hide();
		$("#div_channelMain_channelThumbnail_1_shadow").show();
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
	this.mDiv.fadeIn(500, function() {});
	
	switch (vData[0])
	{
	case 0:
		$("#div_channelMain_channelThumbnail_0_shadow").show();
		$("#div_channelMain_channelThumbnail_1_shadow").hide();
		break;
	case 1:
		$("#div_channelMain_channelThumbnail_0_shadow").hide();
		$("#div_channelMain_channelThumbnail_1_shadow").show();
		break;
	case null:
		$("#div_channelMain_channelThumbnail_0_shadow").hide();
		$("#div_channelMain_channelThumbnail_1_shadow").show();
		break;
	}
	if (vReturnFun)
		vReturnFun();
}
