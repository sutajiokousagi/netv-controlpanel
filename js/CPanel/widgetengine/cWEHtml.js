	// -------------------------------------------------------------------------------------------------
//	cWEHtml class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cWEHtml(
	vDivObj
)
{
	this.mDiv = vDivObj ? vDivObj : {};
	this.mCurrWidget = null;
	this.mPlayMode = "default";		// default | event
	
	this.fInit();
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cWEHtml.instance = null;
cWEHtml.fGetInstance = function(
	vDivObj
)
{
	return cWEHtml.instance ? cWEHtml.instance : (cWEHtml.instance = new cWEHtml(vDivObj));
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cWEHtml.prototype.fInit = function(
)
{
//~ fDbg2("*** cWEHtml, fInit(), ");
	
}

// -------------------------------------------------------------------------------------------------
//	fReset
// -------------------------------------------------------------------------------------------------
cWEHtml.prototype.pPlayMode = function(
	v
)
{
	if (v)
		this.mPlayMode = v;
	else
		return this.mPlayMode;
}

// -------------------------------------------------------------------------------------------------
//	fOnSignal
// -------------------------------------------------------------------------------------------------
cWEHtml.prototype.fOnSignal = function(
	vSignal,		// string
	vData,			// data array
	vReturnFun		// return function call
)
{
//~ fDbg2("*** cWEHtml, fOnSignal(), " + vSignal + ", " + vData);
	var i, o;
	
	switch(vSignal)
	{
	case cConst.SIGNAL_TOGGLE_CONTROLPANEL:
		break;
		
	case cConst.SIGNAL_TOGGLE_WIDGETENGINE:
		break;
		
	case cConst.SIGNAL_BUTTON_LEFT:
		break;
		
	case cConst.SIGNAL_BUTTON_RIGHT:
		break;
		
	case cConst.SIGNAL_BUTTON_CENTER:
		break;
		
	case cConst.SIGNAL_BUTTON_UP:
		break;
		
	case cConst.SIGNAL_BUTTON_DOWN:
		break;
	}

	switch (vSignal)
	{
		
	}
}

// -------------------------------------------------------------------------------------------------
//	fShow / fHide
// -------------------------------------------------------------------------------------------------
cWEHtml.prototype.fShow = function(
)
{
	
}
cWEHtml.prototype.fHide = function(
)
{
	
}

// -------------------------------------------------------------------------------------------------
//	fFadeIn / fFadeOut
// -------------------------------------------------------------------------------------------------
cWEHtml.prototype.fAnimateIn = function(
	vReturnFun
)
{
fDbg("*** cWEEvent, fAnimateOut(), ");
	$("#div_htmlWidgetPlayer").css("top", "720px");
	$("#div_htmlWidgetPlayer").animate({
		top: "-=80"
	}, 200, function() {
		if (vReturnFun)
			vReturnFun();
	});
}
cWEHtml.prototype.fAnimateOut = function(
	vReturnFun
)
{
	$("#div_htmlWidgetPlayer").css("top", "640px");
	$("#div_htmlWidgetPlayer").animate({
		top: "+=80"
	}, 200, function() {
		if (vReturnFun)
			vReturnFun();
	});
}

// -------------------------------------------------------------------------------------------------
//	fPlayWidget
// -------------------------------------------------------------------------------------------------
cWEHtml.prototype.fPlayWidget = function(
	vData,
	vReturnFun
)
{
fDbg2("*** cWEHtml, fPlayWidget(), " + vData);
	var p, i;

	if (this.mPlayMode == "default")
	{
		// check if curr widget running (on screen)
		if ($("#div_htmlWidgetPlayer").css("top") == "720px")
		{
			// reset and load a new widget
			$("#div_htmlWidgetPlayer").show();
			$("#div_htmlWidgetPlayer").css("top", "720px");
			$("#div_htmlWidgetPlayer").html('<iframe id="iframe_htmlWidgetPlayer" src="' + vData + '" marginheight="0" marginwidth="0" frameborder="0" scrolling="no" style="position: absolute; top: 0px; left: 0px; width: 1279px; height: 70px; background-color: white"></iframe>');
			
			p = setTimeout(function() {
				cWEHtml.instance.fAnimateIn();
			}, 1000);
		}
		else
		{
			// transition between widgets
			$("#iframe_htmlWidgetPlayer").animate({
				top: "+=80px"
			}, 1000, function() {
				$("#iframe_htmlWidgetPlayer").attr("src", vData);
				p = setTimeout(function() {
					$("#iframe_htmlWidgetPlayer").animate({
						top: "-=80px"
					}, 1000, function() {
						
					});
				}, 1000);
			});
		}
	}
	else if (this.mPlayMode == "event")
	{
		$("#div_htmlWidgetPlayer").html('<iframe id="iframe_htmlWidgetPlayer" src="' + vData + '" marginheight="0" marginwidth="0" frameborder="0" scrolling="no" style="position: absolute; top: 0px; left: 0px; width: 1279px; height: 70px; background-color: white"></iframe>');
	}
	
	if (vReturnFun)
		vReturnFun();
}


// -------------------------------------------------------------------------------------------------
//	fStop
// -------------------------------------------------------------------------------------------------
cWEHtml.prototype.fStop = function(
	vReturnFun
)
{
fDbg("*** cWEHtml, fStop(), ");
	var vThis = this;

	$("#div_htmlWidgetPlayer").html("");
	if (vReturnFun)
		vReturnFun();
}

// -------------------------------------------------------------------------------------------------
//	fExit
// -------------------------------------------------------------------------------------------------
cWEHtml.prototype.fExit = function(
	vReturnFun
)
{
fDbg("*** cWEHtml, fExit(), ");
	var vThis = this;

	vThis.fAnimateOut(function() {
		if (vReturnFun)
			vReturnFun();
	});
}
