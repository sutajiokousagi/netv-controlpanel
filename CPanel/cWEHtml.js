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
	this.mCurrWidgetPeriod = 10;
	this.mHeartbeatN = 0;
	
	
	
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
	return cWEHtml.instance ? cWEHtml.instance : cWEHtml.instance = new cWEHtml(vDivObj);
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cWEHtml.prototype.fInit = function(
)
{
fDbg2("*** cWEHtml, fInit(), ");
}

// -------------------------------------------------------------------------------------------------
//	fPlayWidget
// -------------------------------------------------------------------------------------------------
cWEHtml.prototype.fReset = function(
	vReturnFun
)
{
	cWEHtml.instance.mHeartbeatN = 0;
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
	case cConst.SIGNAL_HEARTBEAT:
		this.mHeartbeatN++;
		if (this.mHeartbeatN > this.mCurrWidgetPeriod)
		{
			cCPanel.fGetInstance().fOnSignal();
		}
		break;
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
cWEHtml.prototype.fSlideIn = function(
	vReturnFun
)
{
	$("#div_htmlWidgetPlayer").css("top", "720px");
	$("#div_htmlWidgetPlayer").animate({
		top: "-=80"
	}, 200, function() {
		if (vReturnFun)
			vReturnFun();
	});
}
cWEHtml.prototype.fSlideOut = function(
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
	
	if (!cWEHtml.instance.mCurrWidget)
		i = 0;
	else
	{
		i = cModel.fGetInstance().CHANNEL_LIST[1].mWidgetList.indexOf(cWEHtml.instance.mCurrWidget) + 1;
		if (i == cModel.fGetInstance().CHANNEL_LIST[1].mWidgetList.length)
			i = 0;
	}
	
	cWEHtml.instance.mCurrWidget = cModel.fGetInstance().CHANNEL_LIST[1].mWidgetList[i];
	vData = cWEHtml.instance.mCurrWidget.mWidget.mMovie.mHref;
	//~ fDbg2(vData);

	$("#div_htmlWidgetPlayer").show();
	$("#div_htmlWidgetPlayer").css("top", "720px");
	$("#div_htmlWidgetPlayer").html('<iframe id="iframe_htmlWidgetPlayer" src="' + vData + '" marginheight="0" marginwidth="0" frameborder="0" scrolling="no" style="width: 1279px; height: 70px; background-color: white"></iframe>');
	
	p = setTimeout(function() {
		cWEHtml.instance.fSlideIn();
	}, 1000);
	
	if (vReturnFun)
		vReturnFun();
}
