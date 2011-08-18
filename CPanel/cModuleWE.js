// -------------------------------------------------------------------------------------------------
//	cModuleWE class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cModuleWE(
	vDiv
)
{
	this.mDiv = null;

	// channel/widget playing
	this.mCurrChannel = null;
	this.mCurrWidget = null;
	this.mCurrWidgetPeriod = 90;
	this.mCurrWidgetTimeSpend = 0;
	
	// WE status
	this.mCurrWE = null;				// cWEHtml | cWEFlash     (cModuleEventTicker will depends on the mCurrChannel.mPlayMode)
	this.mCurrPlayStatus = null;		// null(stopped) | playing | hidden | paused

	
	// initialize
	this.fInit();
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cModuleWE.instance = null;
cModuleWE.fGetInstance = function(
	vDivObj
)
{
	return cModuleWE.instance ? cModuleWE.instance : (cModuleWE.instance = new cModuleWE(vDivObj));
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cModuleWE.prototype.fInit = function(
)
{
fDbg("*** cModuleWE, fInit(), ");
}

// -------------------------------------------------------------------------------------------------
//	pCurrChannel
// -------------------------------------------------------------------------------------------------
cModuleWE.prototype.pCurrChannel = function(
	v
)
{
	return typeof(v) === "undefined" ? this.mCurrChannel : this.mCurrChannel = v;
}

// -------------------------------------------------------------------------------------------------
//	fOnSignal
// -------------------------------------------------------------------------------------------------
cModuleWE.prototype.fOnSignal = function(
	vSignal,		// string
	vData,			// data array
	vReturnFun		// return function call
)
{
//~ fDbg("*** cModuleWE, fOnSignal(), " + vSignal + ", " + vData);
	var vThis = this;
	var i, o;

	switch(vSignal)
	{
	case cConst.SIGNAL_TOGGLE_WIDGETENGINE:
		/*
		if (cCPanel.instance.mLocked == true)
			return;
		cCPanel.instance.mLocked = true;
		*/
		cModuleEventTicker.fAnimateOut();
		if (vThis.mCurrWE)
		{
			fDbg("playstatus " + vThis.mCurrPlayStatus);
			fDbg("playmode   " + vThis.mCurrChannel.mPlayMode);
			if (vThis.mCurrPlayStatus == "playing")
			{
				if (vThis.mCurrChannel.mPlayMode == "default")
				{
					vThis.mCurrWE.fAnimateOut();
				}
				else 	// "event"
				{
					cModuleEventTicker.fGetInstance().fAnimateOut();
				}
				vThis.mCurrPlayStatus = "hidden";
			}
			else if (vThis.mCurrPlayStatus == "hidden")
			{
				if (vThis.mCurrChannel.mPlayMode == "default")
				{
					vThis.mCurrWE.fAnimateIn();
				}
				else 	// "event"
				{
					cModuleEventTicker.fGetInstance().fAnimateIn();
				}
				vThis.mCurrPlayStatus = "playing";
			}
		}
	}
	
	switch(vSignal)
	{
	case cConst.SIGNAL_HEARTBEAT:
		if (vThis.mCurrWE)
		{
			vThis.mCurrWidgetTimeSpend++;
fDbg(vThis.mCurrWidgetTimeSpend);
			if (vThis.mCurrWidgetTimeSpend == 15)
			{
				//~ window.status = "<xml><cmd>TickerEvent</cmd><data><message>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</message></data></xml>";
			}
			if (vThis.mCurrWidgetTimeSpend >= vThis.mCurrWidgetPeriod)
			{
				vThis.fNext();
				vThis.mCurrWidgetTimeSpend = 0;
			}
		}
		else
		{

		}
		break;
		
	case cConst.SIGNAL_MESSAGE_WIDGETMSG:
		if (vThis.mCurrChannel.mPlayMode == "event")
		{
			cModuleEventTicker.fGetInstance().fAddEvent(vData);
		}
	}
}

// -------------------------------------------------------------------------------------------------
//	fPlay
// -------------------------------------------------------------------------------------------------
cModuleWE.prototype.fPlay = function(
)
{
fDbg("*** cModuleWE, fPlay(), ");
	
}

// -------------------------------------------------------------------------------------------------
//	fNext
// -------------------------------------------------------------------------------------------------
cModuleWE.prototype.fNext = function(
)
{
fDbg("*** cModuleWE, fNext(), ");
	var i, o, vThis;
	vThis = this;
	
	// set curr widget
	if (this.mCurrWidget == null)
	{
		this.mCurrWidget = this.mCurrChannel.mWidgetList[0];
	}
	else
	{
		this.mCurrWidget = this.mCurrChannel.pNextWidget(this.mCurrWidget);
	}
	
	if (this.mCurrChannel.mPlayMode == "event")
	{
		if (!cModuleEventTicker.fGetInstance().mVisibleOnScreen)
			cModuleEventTicker.fGetInstance().fAnimateIn();
	}
	
	// check current WE state (activated | unactivated, playing, paused, stopped)
	if (!this.mCurrWE)
	{
		// load the "new" mCurrWidget
		if (this.mCurrWidget.pIsHTML())
		{
			this.mCurrWE = cWEHtml.fGetInstance();
		}
		else if (this.mCurrWidget.pIsHTML())
		{
			this.mCurrWE = cWEFlash.fGetInstance();
		}
		this.mCurrWE.pPlayMode(this.mCurrChannel.mPlayMode);
		this.mCurrWE.fPlayWidget(this.mCurrWidget.mWidget.mMovie.mHref, null);
	}
	else
	{
		// hide / animateout current WE
			
			
		// load the "new" mCurrWidget
		if (this.mCurrWidget.pIsHTML())
		{
			this.mCurrWE = cWEHtml.fGetInstance();
			this.mCurrWE.pPlayMode(this.mCurrChannel.mPlayMode);
			this.mCurrWE.fPlayWidget(this.mCurrWidget.mWidget.mMovie.mHref, null);
		}
		else if (this.mCurrWidget.pIsHTML())
		{

		}
		
		// show / animatein current WE
	}

	vThis.mCurrPlayStatus = "playing";
}

// -------------------------------------------------------------------------------------------------
//	fStop
// -------------------------------------------------------------------------------------------------
cModuleWE.prototype.fStop = function(
	vReturnFun
)
{
fDbg("*** cModuleWE, fStop(), ");
	var vThis = this;

	if (vThis.mCurrChannel.mPlayMode == "default")
	{

	}
	else if (vThis.mCurrChannel.mPlayMode == "event")
	{
		// pause cCurrWE
		vThis.mCurrWE.fStop(function() {
			vThis.mCurrWE = null;
			cModuleEventTicker.fGetInstance().fExit(function() {

			});
		});
		
		// stop/hide cEventWE
		
	}
	
/*
	if (vThis.mCurrWE)
	{
		fDbg("playstatus " + vThis.mCurrPlayStatus);
		fDbg("playmode   " + vThis.mCurrChannel.mPlayMode);
		
		
		
		if (vThis.mCurrPlayStatus == "playing")
		{
			if (vThis.mCurrChannel.mPlayMode == "default")
			{
				vThis.mCurrWE.fAnimateOut();
			}
			else 	// "event"
			{
				cModuleEventTicker.fGetInstance().fAnimateOut();
			}
			vThis.mCurrPlayStatus = "hidden";
		}
		else if (vThis.mCurrPlayStatus == "hidden")
		{
			if (vThis.mCurrChannel.mPlayMode == "default")
			{
				vThis.mCurrWE.fAnimateIn();
			}
			else 	// "event"
			{
				cModuleEventTicker.fGetInstance().fAnimateIn();
			}
			vThis.mCurrPlayStatus = "playing";
		}
	}
*/


	if (vReturnFun)
		vReturnFun();
}
