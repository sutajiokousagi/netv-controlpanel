// -------------------------------------------------------------------------------------------------
//	cSCPInfo class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cSCPInfo(
	vDiv
)
{
	this.mDiv = $("#" + vDiv);
	this.mID = vDiv;
	

	this.fInit();
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cSCPInfo.instance = null;
cSCPInfo.fGetInstance = function(
	vDiv
)
{
	return cSCPInfo.instance ? cSCPInfo.instance : cSCPInfo.instance = new cSCPInfo(vDiv);
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cSCPInfo.prototype.fInit = function(
)
{
//~ fDbg2("*** cSCPInfo, fInit(), ");
	$("#div_infoMain_content_basic").show();
	$("#div_infoMain_content_advanced").hide();
}

// -------------------------------------------------------------------------------------------------
//	fOnSignal
// -------------------------------------------------------------------------------------------------
cSCPInfo.prototype.fOnSignal = function(
	vSignal,		// string
	vData,			// data array
	vReturnFun		// return function call
)
{
fDbg2("*** cSCPInfo, fOnSignal(), " + vSignal + ", " + vData);
	var i, o;
	
	switch(vSignal)
	{
	case cConst.SIGNAL_TOGGLE_CONTROLPANEL:
		break;
		
	case cConst.SIGNAL_TOGGLE_WIDGETENGINE:
		break;
		
	case cConst.SIGNAL_BUTTON_LEFT:
		if ($("#div_infoMain_content_basic").is(":visible"))
			o = [$("#div_infoMain_content_basic"), $("#div_infoMain_content_advanced")];
		else
			o = [$("#div_infoMain_content_advanced"), $("#div_infoMain_content_basic")];
		o[0].fadeOut(200, function() {
			o[1].fadeIn(200);
		});
		break;
		
	case cConst.SIGNAL_BUTTON_RIGHT:
		if ($("#div_infoMain_content_basic").is(":visible"))
			o = [$("#div_infoMain_content_basic"), $("#div_infoMain_content_advanced")];
		else
			o = [$("#div_infoMain_content_advanced"), $("#div_infoMain_content_basic")];

		o[0].fadeOut(200, function() {
			o[1].fadeIn(200);
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
cSCPInfo.prototype.fShow = function(
)
{
	this.mDiv.show();
}
cSCPInfo.prototype.fHide = function(
)
{
	this.mDiv.hide();
}

// -------------------------------------------------------------------------------------------------
//	fFadeIn / fFadeOut
// -------------------------------------------------------------------------------------------------
cSCPInfo.prototype.fFadeIn = function(
)
{
	this.mDiv.fadeIn(500, function() {});
}
cSCPInfo.prototype.fFadeOut = function(
)
{
	this.mDiv.fadeOut(500, function() {});
}

// -------------------------------------------------------------------------------------------------
//	fUpdate
// -------------------------------------------------------------------------------------------------
cSCPInfo.prototype.fUpdate = function(
)
{
fDbg2("*** cSCPInfo, fUpdate(), ");
	var o;
	o = cModel.fGetInstance();
	
	$("#div_info_guid").html(o.CHUMBY_GUID);
	$("#div_info_dcid").html(o.CHUMBY_DCID);
	$("#div_info_hwver").html(o.CHUMBY_HWVERSION);
	$("#div_info_fwver").html(o.CHUMBY_FWVERSION);
	$("#div_info_mac").html(o.CHUMBY_NETWORK_MAC);
	
	$("#div_info_ip").html(o.CHUMBY_NETWORK_IP);
}
