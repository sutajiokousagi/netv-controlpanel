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
	this.mState = null;

	// channel/widget playing
	this.mCurrChannel = null;
	this.mCurrWidget = null;
	this.mCurrWidgetPeriod = 15;
	this.mCurrWidgetTimeSpend = 0;
	this.mWidgetLockList = [];			// [[enabled|disabled, N seconds since last play], [], ]
	
	// WE status
	this.mCurrWE = null;				// cWEHtml | cWEFlash     (cModuleEventTicker will depends on the mCurrChannel.mPlayMode)
	this.mCurrPlayStatus = null;		// null(stopped) | playing | hidden | paused
	
	
	// main status
	this.mViewPortSize = [];
	
	
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
//~ fDbg("*** cModuleWE, fInit(), ");
}

/** -------------------------------------------------------------------------------------------------
	fResize
-------------------------------------------------------------------------------------------------- */
cModuleWE.prototype.fResize = function(
	vViewPortSize
)
{
	var vThis = this;
	vThis.mViewPortSize = vViewPortSize;

	cWEHtml.fGetInstance().fResize(vViewPortSize);
}

// -------------------------------------------------------------------------------------------------
//	pCurrChannel
// -------------------------------------------------------------------------------------------------
cModuleWE.prototype.pCurrChannel = function(
	v
)
{
	var i;
	if (v == undefined)
		return this.mCurrChannel;
	
	this.mCurrChannel = v;
	this.mWidgetLockList = [];
	for (i = 0; i < this.mCurrChannel.mWidgetList.length; i++)
	{
		this.mWidgetLockList.push(["enabled", -1]);
	}
	//~ fDbg("------------------- playing new channel! --------------------");
	//~ fDbg(this.mWidgetLockList);
	
	
	
	//~ return typeof(v) === "undefined" ? this.mCurrChannel : this.mCurrChannel = v;
}

// -------------------------------------------------------------------------------------------------
//	pCurrWidget
// -------------------------------------------------------------------------------------------------
cModuleWE.prototype.pCurrWidget = function(
	v
)
{
	return typeof(v) === "undefined" ? this.mCurrWidget : this.mCurrWidget = v;
}


// -------------------------------------------------------------------------------------------------
//	pState
// -------------------------------------------------------------------------------------------------
cModuleWE.prototype.pState = function(
	vState
)
{
	var vThis, o;
	vThis = this;
	
	if (!vState)
		return vThis.mState;

	switch (vState)
	{
	
	}
	vThis.mState = vState;
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
			if (vThis.mCurrPlayStatus == "playing")
			{
				if (cModel.fGetInstance().PLAYMODE == "default")
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
				if (cModel.fGetInstance().PLAYMODE == "default")
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
if (vThis.mCurrWidgetTimeSpend % 5 == 0)
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
		if (cModel.fGetInstance().PLAYMODE == "event")
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
//~ fDbg("*** cModuleWE, fPlay(), ");
	var vThis, o, p;
	vThis = this;

	if (!vThis.mCurrWidget)
	{
		vThis.fNext();
		return;
	}
	else
	{
		if (this.mCurrChannel != cModel.fGetInstance().CHANNEL_CURRENT)
		{
			this.pCurrChannel(cModel.fGetInstance().CHANNEL_CURRENT);
			//~ this.mCurrChannel = cModel.fGetInstance().CHANNEL_CURRENT;
			this.mCurrWidget = this.mCurrChannel.mWidgetList[0];
		}
		
		o = false;
		for (i = 0; i < this.mCurrChannel.mWidgetList.length; i++)
		{
			if (this.mCurrChannel.mWidgetList[i].mNeTVCompatiable && this.mCurrChannel.mWidgetList[i].pEnabled())
			{
				o = true;
				break;
			}
		}
		if (!o)
			return;

		vThis.mCurrWidget = this.mCurrChannel.mWidgetList[i];
	}
	p = "?";
	if (vThis.mCurrWidget.mParameterList)
		for (o in vThis.mCurrWidget.mParameterList)
			p += o + "=" + vThis.mCurrWidget.mParameterList[o] + "&";
	vThis.mCurrWE.fPlayWidget(vThis.mCurrWidget.pPeerWidgetHref() + p, null);
}

// -------------------------------------------------------------------------------------------------
//	fNext
// -------------------------------------------------------------------------------------------------
cModuleWE.prototype.fNext = function(
)
{
fDbg("*** cModuleWE, fNext(), ");
	var i, o, p, vThis;
	vThis = this;

if (!this.mCurrChannel)
{
	this.pCurrChannel(cModel.fGetInstance().CHANNEL_CURRENT);
	//~ this.mCurrChannel = cModel.fGetInstance().CHANNEL_CURRENT;
}
else if (this.mCurrChannel != cModel.fGetInstance().CHANNEL_CURRENT)
{
	this.pCurrChannel(cModel.fGetInstance().CHANNEL_CURRENT);
	//~ this.mCurrChannel = cModel.fGetInstance().CHANNEL_CURRENT;
	this.mCurrWidget = this.mCurrChannel.mWidgetList[0];
}

	o = false;
	for (i = 0; i < this.mCurrChannel.mWidgetList.length; i++)
	{
		if (this.mCurrChannel.mWidgetList[i].mNeTVCompatiable && this.mCurrChannel.mWidgetList[i].pEnabled())
		{
			o = true;
			break;
		}
	}
	if (!o)
		return;

	
	// set curr widget
	if (this.mCurrWidget == null)
		this.mCurrWidget = this.mCurrChannel.mWidgetList[0];
	else
		this.mCurrWidget = this.mCurrChannel.pNextWidget(this.mCurrWidget);

	while (!this.mCurrWidget.mNeTVCompatiable || !this.mCurrWidget.pEnabled())
	{
		this.mCurrWidget = this.mCurrChannel.pNextWidget(this.mCurrWidget);
	}
	
	if (cModel.fGetInstance().PLAYMODE == "event")
		if (!cModuleEventTicker.fGetInstance().mVisibleOnScreen)
			cModuleEventTicker.fGetInstance().fAnimateIn();
	
	cCPanel.fGetInstance().fOnSignal(cConst.SIGNAL_PLAYNEXTWIDGET, null, null);
	
	// check current WE state (activated | unactivated, playing, paused, stopped)
	if (!this.mCurrWE)
	{
		// load the "new" mCurrWidget
		if (this.mCurrWidget.pIsHTML())
		{
			//~ fDbg("is html");
			this.mCurrWE = cWEHtml.fGetInstance();
		}
		else if (this.mCurrWidget.pIsFLASH())
		{
			//~ fDbg("is flash");
			this.mCurrWE = cWEHtml.fGetInstance();
			//~ this.mCurrWE = cWEFlash.fGetInstance();
		}
		else
		{
			//~ fDbg("is default(html)");
			this.mCurrWE = cWEHtml.fGetInstance();
		}
		
		//~ this.mCurrWE.pPlayMode(this.mCurrChannel.mPlayMode);
		this.mCurrWE.pPlayMode(cModel.fGetInstance().PLAYMODE);
		
		p = "?";
		if (this.mCurrWidget.mParameterList)
			for (o in this.mCurrWidget.mParameterList)
				p += o + "=" + this.mCurrWidget.mParameterList[o] + "&";
	}
	else
	{
		// hide / animateout current WE
			
			
		// load the "new" mCurrWidget
		if (this.mCurrWidget.pIsHTML())
		{
			this.mCurrWE = cWEHtml.fGetInstance();
			//~ this.mCurrWE.pPlayMode(this.mCurrChannel.mPlayMode);
			this.mCurrWE.pPlayMode(cModel.fGetInstance().PLAYMODE);
			
			p = "?";
			if (this.mCurrWidget.mParameterList)
				for (o in this.mCurrWidget.mParameterList)
					p += o + "=" + this.mCurrWidget.mParameterList[o] + "&";		
		}
		else if (this.mCurrWidget.pIsHTML())
		{
			
		}
		
		// show / animatein current WE
	}

	this.mCurrWE.fPlayWidget(this.mCurrWidget.pPeerWidgetHref() + p, null);
	//this.mCurrWE.fPlayWidget(this.mCurrWidget.pPeerWidgetHref() + p, null);
	
	vThis.mCurrPlayStatus = "playing";
}

// -------------------------------------------------------------------------------------------------
//	fStop
// -------------------------------------------------------------------------------------------------
cModuleWE.prototype.fStop = function(
	vReturnFun
)
{
//~ fDbg("*** cModuleWE, fStop(), ");
	var vThis = this;

	if (cModel.fGetInstance().PLAYMODE == "default")
	{

	}
	else if (cModel.fGetInstance().PLAYMODE == "event")
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
