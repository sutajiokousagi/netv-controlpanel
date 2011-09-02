// -------------------------------------------------------------------------------------------------
//	cWEFlash class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cWEFlash(
	vDivObj
)
{
	this.mDiv = vDivObj ? vDivObj : {};
	
	this.fInit();
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cWEFlash.instance = null;
cWEFlash.fGetInstance = function(
	vDivObj
)
{
	return cWEFlash.instance ? cWEFlash.instance : cWEFlash.instance = new cWEFlash(vDivObj);
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cWEFlash.prototype.fInit = function(
)
{
//~ fDbg2("*** cWEFlash, fInit(), ");
}

// -------------------------------------------------------------------------------------------------
//	fOnSignal
// -------------------------------------------------------------------------------------------------
cWEFlash.prototype.fOnSignal = function(
	vSignal,		// string
	vData,			// data array
	vReturnFun		// return function call
)
{
fDbg2("*** cWEFlash, fOnSignal(), " + vSignal + ", " + vData);
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
}

// -------------------------------------------------------------------------------------------------
//	fShow / fHide
// -------------------------------------------------------------------------------------------------
cWEFlash.prototype.fShow = function(
)
{
fDbg2("*** cWEFlash, fShow(). ");
	cProxy.xmlhttpPost("", "post", {cmd : "WidgetEngine", data : "<value>show</value>"}, function() {});
}
cWEFlash.prototype.fHide = function(
)
{
fDbg2("*** cWEFlash, fHide(). ");
	cProxy.xmlhttpPost("", "post", {cmd : "WidgetEngine", data : "<value>hide</value>"}, function() {});
}

// -------------------------------------------------------------------------------------------------
//	fFadeIn / fFadeOut
// -------------------------------------------------------------------------------------------------
cWEFlash.prototype.fAnimateIn = function(
)
{
fDbg2("*** cWEFlash, fAnimateIn(). ");
	cProxy.xmlhttpPost("", "post", {cmd : "PlayWidget", data : "<value>show</value>"}, function() {});
}
cWEFlash.prototype.fAnimateOut = function(
)
{
fDbg2("*** cWEFlash, fAnimateOut(). ");
	cProxy.xmlhttpPost("", "post", {cmd : "PlayWidget", data : "<value>hide</value>"}, function() {});
}

// -------------------------------------------------------------------------------------------------
//	fPlayWidget
// -------------------------------------------------------------------------------------------------
cWEFlash.prototype.fPlayWidget = function(
	vData,
	vReturnFun
)
{
	cProxy.xmlhttpPost("", "post", {cmd : "PlayWidget", data : "<value>" + vData + "</value>"}, function(vData) {
		fDbg2(vData);
		if (vReturnFun)
			vReturnFun(vData);
	});
}
