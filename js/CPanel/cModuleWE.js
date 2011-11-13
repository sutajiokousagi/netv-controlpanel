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
	this.mWidgetLockList = [];			// [[id, enabled|disabled, N seconds since last play], [], ]
	
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
//~ fDbg("------------------- playing new channel! --------------------");
	
	// reset after changing channel.
	this.mCurrChannel = v;
	this.mWidgetLockList = [];
	
	
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
		cModuleEventTicker.fAnimateOut();
		if (vThis.mCurrWE)
			if (vThis.mCurrPlayStatus == "playing")
			{
				if (cModel.fGetInstance().PLAYMODE == "default")
					vThis.mCurrWE.fAnimateOut();
				else 	// "event"
					cModuleEventTicker.fGetInstance().fAnimateOut();
				vThis.mCurrPlayStatus = "hidden";
			}
			else if (vThis.mCurrPlayStatus == "hidden")
			{
				if (cModel.fGetInstance().PLAYMODE == "default")
					vThis.mCurrWE.fAnimateIn();
				else 	// "event"
					cModuleEventTicker.fGetInstance().fAnimateIn();
				vThis.mCurrPlayStatus = "playing";
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
		break;
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
			fDbg("----------------------- fPlay(). pCurrChannel() is called --------------------");
			vThis.pCurrChannel(cModel.fGetInstance().CHANNEL_CURRENT);
			vThis.pCurrWidget(this.mCurrChannel.mWidgetList[0]);
			//~ this.mCurrWidget = this.mCurrChannel.mWidgetList[0];
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
		
		vThis.pCurrWidget(vThis.mCurrChannel.mWidgetList[i]);
		//~ vThis.mCurrWidget = vThis.mCurrChannel.mWidgetList[i];
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
//~ fDbg("*** cModuleWE, fNext(), ");
	var i, o, p, vThis;
	vThis = this;

if (!vThis.mCurrChannel)
{
	fDbg("----------------------- fNext(), -1-, pCurrChannel() is called --------------------");
	vThis.pCurrChannel(cModel.fGetInstance().CHANNEL_CURRENT);
	//~ this.mCurrChannel = cModel.fGetInstance().CHANNEL_CURRENT;
}
else if (vThis.mCurrChannel != cModel.fGetInstance().CHANNEL_CURRENT)
{
	fDbg("----------------------- fNext(), -2-, pCurrChannel() is called --------------------");
	vThis.pCurrChannel(cModel.fGetInstance().CHANNEL_CURRENT);
	//~ this.mCurrChannel = cModel.fGetInstance().CHANNEL_CURRENT;
	vThis.pCurrWidget(vThis.mCurrChannel.mWidgetList[0]);
	//~ vThis.mCurrWidget = vThis.mCurrChannel.mWidgetList[0];
}

	o = false;
	for (i = 0; i < vThis.mCurrChannel.mWidgetList.length; i++)
	{
		if (vThis.mCurrChannel.mWidgetList[i].mNeTVCompatiable && vThis.mCurrChannel.mWidgetList[i].pEnabled())
		{
			o = true;
			break;
		}
	}
	if (!o)
		return;

	
	// set curr widget
	if (vThis.mCurrWidget == null)
		vThis.pCurrWidget(vThis.mCurrChannel.mWidgetList[0]);						//~ vThis.mCurrWidget = vThis.mCurrChannel.mWidgetList[0];
	else
		vThis.pCurrWidget(vThis.mCurrChannel.pNextWidget(vThis.mCurrWidget)); 		//~ vThis.mCurrWidget = vThis.mCurrChannel.pNextWidget(vThis.mCurrWidget);

	while (!vThis.mCurrWidget.mNeTVCompatiable || !vThis.mCurrWidget.pEnabled())
	{
		vThis.pCurrWidget(vThis.mCurrChannel.pNextWidget(vThis.mCurrWidget));
		//~ vThis.mCurrWidget = vThis.mCurrChannel.pNextWidget(vThis.mCurrWidget);
	}
	
	if (cModel.fGetInstance().PLAYMODE == "event")
		if (!cModuleEventTicker.fGetInstance().mVisibleOnScreen)
			cModuleEventTicker.fGetInstance().fAnimateIn();
	
	cCPanel.fGetInstance().fOnSignal(cConst.SIGNAL_PLAYNEXTWIDGET, null, null);
	
	// check current WE state (activated | unactivated, playing, paused, stopped)
	if (!vThis.mCurrWE)
	{
		// load the "new" mCurrWidget
		if (vThis.mCurrWidget.pIsHTML())
		{
			//~ fDbg("is html");
			vThis.mCurrWE = cWEHtml.fGetInstance();
		}
		else if (vThis.mCurrWidget.pIsFLASH())
		{
			//~ fDbg("is flash");
			vThis.mCurrWE = cWEHtml.fGetInstance();
			//~ this.mCurrWE = cWEFlash.fGetInstance();
		}
		else
		{
			//~ fDbg("is default(html)");
			vThis.mCurrWE = cWEHtml.fGetInstance();
		}
		
		//~ this.mCurrWE.pPlayMode(this.mCurrChannel.mPlayMode);
		vThis.mCurrWE.pPlayMode(cModel.fGetInstance().PLAYMODE);
		
		p = "?";
		if (vThis.mCurrWidget.mParameterList)
			for (o in vThis.mCurrWidget.mParameterList)
				p += o + "=" + vThis.mCurrWidget.mParameterList[o] + "&";
	}
	else
	{
		// hide / animateout current WE
			
			
		// load the "new" mCurrWidget
		if (vThis.mCurrWidget.pIsHTML())
		{
			vThis.mCurrWE = cWEHtml.fGetInstance();
			//~ this.mCurrWE.pPlayMode(this.mCurrChannel.mPlayMode);
			vThis.mCurrWE.pPlayMode(cModel.fGetInstance().PLAYMODE);
			
			p = "?";
			if (vThis.mCurrWidget.mParameterList)
				for (o in vThis.mCurrWidget.mParameterList)
					p += o + "=" + vThis.mCurrWidget.mParameterList[o] + "&";		
		}
		else if (vThis.mCurrWidget.pIsHTML())
		{
			
		}
		
		// show / animatein current WE
	}






	
	// decide if run this widget in iframe, according to this widget's UpdateInterval
	fDbg("play widget: " + vThis.pCurrWidget().mWidget.mMovie.mHref.split("/")[2] + " |~| "); // + vThis.mWidgetLockList);
	//~ fDbg("-----> " + vThis.pCurrWidget().mUpdateInterval);
	//~ fDbg("-----> " + vThis.pCurrWidget().pOnlyShowNewEvent());
	
	
	/*
	for (i = 0; i < vThis.mWidgetLockList.length; i++)
	{
		if (vThis.mWidgetLockList[i][0] == vThis.pCurrWidget().mID)
		{
			o = [];
			o[0] = (new Date().getTime() - vThis.mWidgetLockList[i][1]) / 1000;
			o[1] = vThis.pCurrWidget().mUpdateIntervalList[vThis.pCurrWidget().mUpdateInterval];
			fDbg("time spent : " + o[0] + " ---------- widget update interval : " + o[1]);
			if (o[0] - o[1] > -2)
			{
				fDbg("ok, you can play!");
				vThis.mWidgetLockList[i][1] = new Date().getTime();
				vThis.mCurrWE.fPlayWidget(vThis.mCurrWidget.pPeerWidgetHref() + p, null);
				vThis.mCurrPlayStatus = "playing";
			}
			
			return;
		}
	}
	*/
	for (i = 0; i < vThis.mWidgetLockList.length; i++)
		if (vThis.mWidgetLockList[i][0] == vThis.pCurrWidget().mID)
		{
			o = [];
			o[0] = (new Date().getTime() - vThis.mWidgetLockList[i][1]) / 1000;
			o[1] = vThis.pCurrWidget().mUpdateIntervalList[vThis.pCurrWidget().mUpdateInterval];
			fDbg("time spent : " + o[0] + " ---------- widget update interval : " + o[1]);
			if (o[0] - o[1] > -2)
			{
				// clear cModuleEventTicker's mPrevEventList;
				cModuleEventTicker.fGetInstance().fClearPrevEventList(vThis.pCurrWidget().mID);
				fDbg("ok, you can play!");
				
				// update new "prev played timestamp"
				vThis.mWidgetLockList[i][1] = new Date().getTime();
			}
			else
			{
				fDbg("ok, you can play, let's see if it's a new message!!!");
			}
			
			// play the widget
			vThis.mCurrWE.fPlayWidget(vThis.mCurrWidget.pPeerWidgetHref() + p, null);
			
			// update status
			vThis.mCurrPlayStatus = "playing";
			return;
		}
	
	vThis.mWidgetLockList.push([vThis.pCurrWidget().mID, new Date().getTime()]);
	vThis.mCurrWE.fPlayWidget(vThis.mCurrWidget.pPeerWidgetHref() + p, null);
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
