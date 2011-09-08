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
	
	this.mStyle = {
		mBottomOffset: 40,
		mWidgetWidth: 1280,
		mWidgetHeight: 70
	}

	this.mViewPortSize = [];

	// init
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

/** -------------------------------------------------------------------------------------------------
	fResize
-------------------------------------------------------------------------------------------------- */
cWEHtml.prototype.fResize = function(
	vViewPortSize
)
{
	var vThis = this;
	vThis.mViewPortSize = vViewPortSize;
	
	vThis.mStyle.mWidgetWidth = vViewPortSize[0];
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
	var vThis;
	vThis = this;
	
	this.mDiv.show();
	$("#div_htmlWidgetPlayer").css("top", vThis.mViewPortSize[1] + 20 + "px");
}
cWEHtml.prototype.fHide = function(
)
{
	this.mDiv.hide();
}

// -------------------------------------------------------------------------------------------------
//	fFadeIn / fFadeOut
// -------------------------------------------------------------------------------------------------
cWEHtml.prototype.fAnimateIn = function(
	vReturnFun
)
{
fDbg("*** cWEEvent, fAnimateIn(), ");
	var vThis;
	vThis = this;
	
	vThis.fShow();
	$("#div_htmlWidgetPlayer").css("top", vThis.mViewPortSize[1] + 20 + "px");
	$("#div_htmlWidgetPlayer").css("width", vThis.mViewPortSize[0] + "px");
	$("#div_htmlWidgetPlayer").animate({
		top: vThis.mViewPortSize[1] - vThis.mStyle.mBottomOffset - vThis.mStyle.mWidgetHeight + "px"
	}, 200, function() {
		if (vReturnFun)
			vReturnFun();

		fDbg($("#div_htmlWidgetPlayer").html());
	});
}
cWEHtml.prototype.fAnimateOut = function(
	vReturnFun
)
{
fDbg("*** cWEEvent, fAnimateOut(), ");
	
	$("#div_htmlWidgetPlayer").css("top", vThis.mViewPortSize[1] - vThis.mStyle.mBottomOffset - vThis.mStyle.mWidgetHeight + "px");
	$("#div_htmlWidgetPlayer").animate({
		top: vThis.mViewPortSize[1] + 20 + "px"
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
fDbg("*** cWEHtml, fPlayWidget(), " + vData);
	var vThis, p, i;
	vThis = this;
	
	if (this.mPlayMode == "default")
	{
		// check if curr widget running (on screen)
		if ($("#div_htmlWidgetPlayer").css("top") != vThis.mViewPortSize[1] - vThis.mStyle.mBottomOffset - vThis.mStyle.mWidgetHeight + "px")
		{
			$("#div_htmlWidgetPlayer").html('<iframe id="iframe_htmlWidgetPlayer" src="' + vData + '" marginheight="0" marginwidth="0" frameborder="0" scrolling="no" style="position: absolute; top: 0px; left: 0px; width: ' + vThis.mViewPortSize[0] + 'px; height: ' + vThis.mStyle.mWidgetHeight + 'px; background-color: white"></iframe>');
			//~ fDbg($("#div_htmlWidgetPlayer").html());

			p = setTimeout(function() {
				//~ fDbg($("#div_htmlWidgetPlayer").html());
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
