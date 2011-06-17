// -------------------------------------------------------------------------------------------------
//	cCPanel class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	static members
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cCPanel(
)
{
	this.JSCORE = null;
	this.mModel = null;

	
	this.mMessageDisplayInProgress = false;
	this.mMessageList = [];
	this.mState = "";
	this.mPrevState = "";
	this.mCurrDivVisible = "";
	this.mLocked = false;
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cCPanel.instance = null;
cCPanel.fGetInstance = function(
)
{
	return cCPanel.instance ? cCPanel.instance : (cCPanel.instance = new cCPanel());
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fInit = function(
)
{
	$("#div_channelMain").hide();
	$("#div_channelMain_arrowPrev").click(function() {
		cModel.fGetInstance().PREV_WIDGET_INDEX = cModel.fGetInstance().CURR_WIDGET_INDEX;
		cModel.fGetInstance().CURR_WIDGET_INDEX--;
		if (cModel.fGetInstance().CURR_WIDGET_INDEX < 0)
			cModel.fGetInstance().CURR_WIDGET_INDEX = cModel.fGetInstance().CHANNEL_LIST[cModel.fGetInstance().CURR_CHANNEL_INDEX].mWidgetList.length - 1;
		cCPanel.fGetInstance().fRefreshChannelDiv();
	});
	$("#div_channelMain_arrowNext").click(function() {
		//~ alert();
		cModel.fGetInstance().PREV_WIDGET_INDEX = cModel.fGetInstance().CURR_WIDGET_INDEX;
		cModel.fGetInstance().CURR_WIDGET_INDEX++;
		if (cModel.fGetInstance().CURR_WIDGET_INDEX > cModel.fGetInstance().CHANNEL_LIST[cModel.fGetInstance().CURR_CHANNEL_INDEX].mWidgetList.length - 1)
			cModel.fGetInstance().CURR_WIDGET_INDEX = 0;
		cCPanel.fGetInstance().fRefreshChannelDiv();
	});

	$("#div_actionArea").hide();
	$("#div_dbg_container").hide();
	
	$("#div_flashWidgetPlayer").hide();
	$("#div_htmlWidgetPlayer").hide();
	$("#div_loader").hide();
	
	$("#div_messageBoard").hide();
	$("#div_messageBoard").fadeIn();
	mCurrDivVisible = "div_messageBoard";

	$("#div_loader").fadeIn();
	
	var vViewPortSize = [];
	var vWidgetEdgeOffset = [50, 50];
//	return;
	if (typeof window.innerWidth != 'undefined')
	{
		vViewPortSize[0] = window.innerWidth,
		vViewPortSize[1] = window.innerHeight
	}
	if (vViewPortSize[0] > 800)
		$("#div_CPanel").css("left", (vViewPortSize[0] - 800) / 2 + "px");

	if (vViewPortSize[1] > 600)
		$("#div_CPanel").css("top", (vViewPortSize[1] - 600) / 2 + "px");

	if ($("#div_actionArea").length)
	{
		$("#div_actionArea").css("top", (parseFloat($("#div_CPanel").css("top").split("px")[0]) + 570) + "px");
		$("#div_actionArea").css("left", $("#div_CPanel").css("left"));
	}
	
	if ($("#div_widgetPlayer").length)
	{
		$("#div_widgetPlayer").css("left", (vViewPortSize[0] - parseFloat($("#div_widgetPlayer").css("width").split("px")[0]) - vWidgetEdgeOffset[0]) + "px")
		$("#div_widgetPlayer").css("top", (vViewPortSize[1] - parseFloat($("#div_widgetPlayer").css("height").split("px")[0]) - vWidgetEdgeOffset[1]) + "px")
	}
	
	this.pState("controlpanel");
}

// -------------------------------------------------------------------------------------------------
//	pState
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.pState = function(
	vState
)
{
	if (! vState)
		return cCPanel.instance.mState;
		
	if (cCPanel.instance.mState != vState)
	{
		cCPanel.instance.mPrevState = cCPanel.instance.mState;	
		cCPanel.instance.mState = vState;
	}
	return cCPanel.instance.mState;
}

// -------------------------------------------------------------------------------------------------
//	fOnSignal
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fOnSignal = function(
	vSignal,		// string
	vData,			// data array
	vReturnFun		// return function call
)
{
fDbg("*** cCPanel, fOnSignal(), " + vSignal + ", " + vData);
	var mCPanel = cCPanel.fGetInstance();
	
	// JavaScript Injection Signals
	switch(vSignal)
	{
	case cConst.SIGNAL_TOGGLE_CONTROLPANEL:
		if (mCPanel.mState != "controlpanel")
			mCPanel.fOnSignal(cConst.SIGNAL_GOTO_CONTROLPANEL);
		else
		{
			if (mCPanel.mPrevState == "htmlwidgetengine")
				mCPanel.fOnSignal(cConst.SIGNAL_GOTO_HTMLWIDGETENGINE);
		}
		break;
		
	case cConst.SIGNAL_TOGGLE_WIDGETENGINE:
		break;
	}
	
	switch(vSignal)
	{
	case cConst.SIGNAL_MESSAGE:
		mCPanel.fDisplayMessageBoard(vData[0]);
		break;
		
	case cConst.SIGNAL_CHANNELDIV_SHOW:
		switch (mCurrDivVisible)
		{
		case "div_messageBoard":
			mCPanel.fRefreshChannelDiv(mCPanel.fShowChannelDiv);	
			break;
		}
		break;
		
	case cConst.SIGNAL_WIDGETENGINE_SHOW:
		//mCPanel.fShowWidgetEngine();
		mCPanel.fOnSignal(cConst.SIGNAL_GOTO_HTMLWIDGETENGINE);
		break;
		
	case cConst.SIGNAL_GOTO_CONTROLPANEL:
		switch (mCPanel.mState)
		{
		case "controlpanel":
			break;
		case "htmlwidgetengine":
			mCPanel.fHideHTMLWidgetEngine(function() {
				mCPanel.fShowControlPanel();
			});
			break;
		case "flashwidgetengine":
			break;
		}
		break;
		
	case cConst.SIGNAL_GOTO_HTMLWIDGETENGINE:
		mCPanel.fShowHTMLWidgetEngine();
		break;
		
	case cConst.SIGNAL_GOTO_FLASHWIDGETENGINE:
		this.pState("flashwidgetengine");
		break;
	}	
}

// -------------------------------------------------------------------------------------------------
//	fShow
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fDisplayMessageBoard = function(
	v
)
{
	var o;
	
	if (v)
	{
		if ($("#div_messageBoard_text").html() !== v)
		{
			mCPanel.mMessageList.push(v);
			if (mCPanel.mMessageDisplayInProgress === false)
			{
				mCPanel.mMessageDisplayInProgress = true;
				$("#div_messageBoard_text").fadeOut("fast", function() {
					$("#div_messageBoard_text").html(v);
					mCPanel.mMessageList.splice(0, 1);
					$("#div_messageBoard_text").fadeIn("fast", function() {
						if (mCPanel.mMessageList.length > 0)
						{
							mCPanel.instance.fDisplayMessageBoard();
						}
						else
							mCPanel.mMessageDisplayInProgress = false;
					});
				});
			}
		}
		else
		{
			if (mCPanel.mMessageList.length > 0)
				mCPanel.mMessageList.splice(0, 1);
			fDisplayMessageBoard();
		}
	}
	else
	{
		if (mCPanel.mMessageList.length == 0)
			return;
		o = mCPanel.mMessageList[0];
		mCPanel.mMessageList.splice(0, 1);
		if (mCPanel.mMessageDisplayInProgress === false)
		{
			mCPanel.mMessageDisplayInProgress = true;
		}
			$("#div_messageBoard_text").fadeOut("fast", function() {
				$("#div_messageBoard_text").html(o);
				fDbg("new curr : " + $("#div_messageBoard_text").html());
				$("#div_messageBoard_text").fadeIn("fast", function() {
					if (mCPanel.mMessageList.length > 0)
					{
						fDisplayMessageBoard();
					}
					else
						mCPanel.mMessageDisplayInProgress = false;
				});
			});
	}
}


// -------------------------------------------------------------------------------------------------
//	fShowMessageDiv
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fShowMessageDiv = function(
)
{
	
}

// -------------------------------------------------------------------------------------------------
//	fHideMessageDiv
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fHideMessageDiv = function(
)
{
	
}


/*
// -------------------------------------------------------------------------------------------------
//	fPlayWidget
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fPlayWidget = function(
	vWidgetPath
)
{
fDbg("*** cCPanel, fPlayWidget(), " + vWidgetPath);
	$("#div_widgetPlayer").show();
	$("#div_widgetPlayer_embed").css("left", (parseFloat($("#div_widgetPlayer_embed").css("left").split("px")[0]) + 800) + "px");
	$("#div_widgetPlayer_embed").animate({
		left: '-=800'
	}, 200, function() {
		// Animation complete.
	});
	
	$("#div_messageBoard").animate({
		left: "-=800"
	}, 200, function() {
		// Animation compelte
	});
	
	var o = setInterval(function() {
		//document.getElementById("widget_player_01").fPlayWidget();
		clearInterval(o);
	}, 500);
}

// -------------------------------------------------------------------------------------------------
//	fShow
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fShow = function(
)
{
	// hide widget rendering engine
	$("#div_widgetPlayer_embed").animate({
		left: '+=800'
	}, 200, function() {
		// Animation complete.
		//~ $("#div_widgetPlayer").hide();
	});
	// tell JSCore to hold counter/heartbeat, or shall reset it??
	
	
	// show control panel MAIN div
	$.get('http://192.168.1.210/projects/0009.chumbyJSCore/test/test1.php?url=' + "http://s3movies.chumby.com/cdn/xmlthumbnail/40D95390-FF04-11DE-A291-001B24E044BE", function(data) {
		$("#div_main_thumbnailPrev").attr("src", "data:image/jpg;base64," + data);
	});
	$.get('http://192.168.1.210/projects/0009.chumbyJSCore/test/test1.php?url=' + "http://s3movies.chumby.com/cdn/xmlthumbnail/B86CAD48-3114-11DF-B75B-001B24E044BE", function(data) {
		$("#div_main_thumbnailCurr").attr("src", "data:image/jpg;base64," + data);
	});
	$.get('http://192.168.1.210/projects/0009.chumbyJSCore/test/test1.php?url=' + "http://s3movies.chumby.com/cdn/xmlthumbnail/F9694E16-2AEB-11DF-B699-001B24E044BE", function(data) {
		$("#div_main_thumbnailNext").attr("src", "data:image/jpg;base64," + data);
	});
	//~ $("#div_main").fadeIn();

	
	$("#div_main").show();
	$("#div_main").css("left", "-800px");
	$("#div_main").animate({
		left: "+=800"
	}, 200, function() {
		// Animation complete
	});
}

cCPanel.prototype.fHide = function(
)
{
	$("#div_main").show();
	$("#div_main").css("left", "0px");
	$("#div_main").animate({
		left: "-=800"
	}, 200, function() {
		// Animation complete
	});
	
	$("#div_widgetPlayer_embed").show();
	$("#div_widgetPlayer_embed").css("left", "800px");
	$("#div_widgetPlayer_embed").animate({
		left: '-=800'
	}, 200, function() {
		// Animation complete.
	});
}
*/



// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	control panel div functions
// 
// 
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	fShowControlPanel
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fShowControlPanel = function(
)
{
fDbg("*** cCPanel, fShowControlPanel(), ");
	$("#div_CPanel").css("left", "-960px");
	$("#div_CPanel").animate({
		left: "+=1200"
	}, 1200, function() {
		cCPanel.instance.fShowControlPanelReturn();
	});
}

cCPanel.prototype.fShowControlPanelReturn = function(
	vData
)
{
fDbg("*** cCPanel, fShowControlPanelReturn(), " + vData);
	this.pState("controlpanel");
}































// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	widget engine div functions   (HTML widgets)
// 
// 
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	fShowHTMLWidgetEngine
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fShowHTMLWidgetEngine = function(
)
{
fDbg("*** cCPanel, fShowHTMLWidgetEngine(), ");
	//cProxy.xmlhttpPost("", "post", {cmd : "ShowWidgetEngine", data : "<value>true</value>"}, cCPanel.instance.fShowHTMLWidgetEngineReturn);
	cCPanel.instance.fShowHTMLWidgetEngineReturn();
}

cCPanel.prototype.fShowHTMLWidgetEngineReturn = function(
	vData
)
{
fDbg("*** cCPanel, fShowHTMLWidgetEngineReturn(), " + vData);
	cCPanel.instance.fSetHTMLWidgetEngineSize();
}

// -------------------------------------------------------------------------------------------------
//	fSetWidgetEngineSize
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fSetHTMLWidgetEngineSize = function(
)
{
fDbg("*** cCPanel, fSetHTMLWidgetEngineSize(), ");

	$("#div_loader").fadeOut(200, function() {
	});
	$("#div_CPanel").animate({
		left: "-=1200"
	}, 1000, function() {
		cCPanel.instance.fSetHTMLWidgetEngineSizeReturn();
	});
}

cCPanel.prototype.fSetHTMLWidgetEngineSizeReturn = function(
	vData
)
{
fDbg("*** cCPanel, fSetHTMLWidgetEngineSizeReturn(), " + vData);
	var o, p;
	o = 'http://localhost/widgets/twitter0.1/index.html';
	
	//p = setTimeout(function() {
		$("#div_htmlWidgetPlayer").show();
		$("#div_htmlWidgetPlayer").css("top", "720px");
		$("#div_htmlWidgetPlayer").animate({
			top: "-=80"
		}, 1000, function() {
		
		});
	//}, 1000);
	
	$("#div_htmlWidgetPlayer").html('<iframe id="iframe_htmlWidgetPlayer" src="' + o + '" marginheight="0" marginwidth="0" frameborder="0" scrolling="no" style="width: 1080px; height: 70px; background-color:rgba(255, 255, 255, 1)"></iframe>');
	this.pState("htmlwidgetengine");
}

// -------------------------------------------------------------------------------------------------
//	fHideHTMLWidgetEngine
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fHideHTMLWidgetEngine = function(
	vReturnFun
)
{
fDbg("*** cCPanel, fHideHTMLWidgetEngine(), ");
	$("#div_htmlWidgetPlayer").animate({
		top: "+=80"
	}, 500, function() {
		cCPanel.instance.fHideHTMLWidgetEngineReturn(null, vReturnFun);
	});
}

cCPanel.prototype.fHideHTMLWidgetEngineReturn = function(
	vData,
	vReturnFun
)
{
fDbg("*** cCPanel, fHideHTMLWidgetEngineReturn(), " + vData);
	if (vReturnFun)
		vReturnFun();
}






































// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	widget engine div functions		(flash widgets)
// 
// 
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	fShowWidgetEngine
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fShowWidgetEngine = function(
)
{
fDbg("*** cCPanel, fShowWidgetEngine(), ");
	cProxy.xmlhttpPost("", "post", {cmd : "ShowWidgetEngine", data : "<value>true</value>"}, cCPanel.instance.fShowWidgetEngineReturn);
}

cCPanel.prototype.fShowWidgetEngineReturn = function(
	vData
)
{
fDbg("*** cCPanel, fShowWidgetEngineReturn(), " + vData);
	cCPanel.instance.fSetWidgetEngineSize();
}

// -------------------------------------------------------------------------------------------------
//	fSetWidgetEngineSize
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fSetWidgetEngineSize = function(
)
{
fDbg("*** cCPanel, fSetWidgetEngineSize(), ");

	$("#div_CPanel").animate({
		left: "-=1200"
	}, 1200, function() {
		cProxy.xmlhttpPost("", "post", {cmd : "SetWidgetSize", data : "<value>1000 520 240 180</value>"}, cCPanel.instance.fSetWidgetEngineSizeReturn);
		
		/*
		var vStepCount = 50;
		var vCurrBox = [240, 60, 800, 600];
		var vFinalBox = [800, 450, 320, 240];
		var vStep = [
			(vFinalBox[0] - vCurrBox[0]) / vStepCount,
			(vFinalBox[1] - vCurrBox[1]) / vStepCount,
			(vFinalBox[2] - vCurrBox[2]) / vStepCount,
			(vFinalBox[3] - vCurrBox[3]) / vStepCount
		];
		var i = 0;
		//cProxy.xmlhttpPost("", "post", {cmd : "SetWidgetSize", data : "<value>" + vFinalBox.join(" ") + "</value>"}, cCPanel.instance.fSetWidgetEngineSizeReturn);
		//return;
		var o = setInterval(function() {
			i++;
			vCurrBox = [vCurrBox[0] + vStep[0], vCurrBox[1] + vStep[1], vCurrBox[2] + vStep[2], vCurrBox[3] + vStep[3]];
			var str = vCurrBox[0] + " " + vCurrBox[1] + " " + vCurrBox[2] + " " + vCurrBox[3];
			cProxy.xmlhttpPost("", "post", {cmd : "SetWidgetSize", data : "<value>" + str + "</value>"}, cCPanel.instance.fSetWidgetEngineSizeReturn);
			if (i == vStepCount)
				clearInterval(o);
		}, 20);
		*/
	});
	
}

cCPanel.prototype.fSetWidgetEngineSizeReturn = function(
	vData
)
{
fDbg("*** cCPanel, fSetWidgetEngineSizeReturn(), " + vData);
	$("#div_flashWidgetPlayer").show();
	$("#div_flashWidgetPlayer").css("left", "1000px");
	$("#div_flashWidgetPlayer").css("top", "520px");
	cCPanel.instance.fPlayWidget();
}


// -------------------------------------------------------------------------------------------------
//	fPlayWidget
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fPlayWidget = function(
)
{
fDbg("*** cCPanel, fPlayWidget(), ");
	cProxy.xmlhttpPost("", "post", {cmd : "PlayWidget", data : "<value>./widget1.swf</value>"}, cCPanel.instance.fPlayWidgetReturn);
}

cCPanel.prototype.fPlayWidgetReturn = function(
	vData
)
{
fDbg("*** cCPanel, fPlayWidgetReturn(), " + vData);
	
}


























// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	channel div functions
// 
// 
// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
//	fShowChannelDiv
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fRefreshChannelDiv = function(
	vReturnFun
)
{
	var o, p, vWidgetList, vTransitionTime;
	var i;
	vTransitionTime = 500;
	
	if (!this.mModel)
		this.mModel = cModel.fGetInstance();
	
	if (!this.mModel.CURR_CHANNEL_INDEX)
		this.mModel.CURR_CHANNEL_INDEX = 0;
	if (!this.mModel.CURR_WIDGET_INDEX)
		this.mModel.CURR_WIDGET_INDEX = 0;

	vWidgetList = this.mModel.CHANNEL_LIST[this.mModel.CURR_CHANNEL_INDEX].mWidgetList;
	if ($("#img_channelMain_thumbnailPrev").attr("src") == "")
	{
		// show control panel MAIN div
		if (this.mModel.CURR_WIDGET_INDEX == 0)
			p = vWidgetList.length - 1;
		else
			p = this.mModel.CURR_WIDGET_INDEX - 1;
		cProxy.xmlhttpPost("", "post", {cmd: "GetJPG", data: "<value>" + vWidgetList[p].mWidget.mThumbnail.mHref + "</value>"}, function(vData) {
			vData = vData.split("<data><value>")[1].split("</value></data>")[0];
			$("#img_channelMain_thumbnailPrev").attr("src", "");
			$("#img_channelMain_thumbnailPrev").attr("src", vData);
		});
		
		cProxy.xmlhttpPost("", "post", {cmd: "GetJPG", data: "<value>" + vWidgetList[this.mModel.CURR_WIDGET_INDEX].mWidget.mThumbnail.mHref + "</value>"}, function(vData) {
			vData = vData.split("<data><value>")[1].split("</value></data>")[0];
			$("#img_channelMain_thumbnailCurr").attr("src", "");
			$("#img_channelMain_thumbnailCurr").attr("src", vData);
		});

		if (this.mModel.CURR_WIDGET_INDEX == vWidgetList.length - 1)
			p = 0;
		else
			p = this.mModel.CURR_WIDGET_INDEX + 1;
		cProxy.xmlhttpPost("", "post", {cmd: "GetJPG", data: "<value>" + vWidgetList[p].mWidget.mThumbnail.mHref + "</value>"}, function(vData) {
			vData = vData.split("<data><value>")[1].split("</value></data>")[0];
			$("#img_channelMain_thumbnailNext").attr("src", "");
			$("#img_channelMain_thumbnailNext").attr("src", vData);
		});
		
		$("#div_channelMain_title_container").html(vWidgetList[this.mModel.CURR_WIDGET_INDEX].mWidget.mName);
		$("#div_channelMain_description_container").html(vWidgetList[this.mModel.CURR_WIDGET_INDEX].mWidget.mDescription);


		if (vReturnFun)
			vReturnFun();
	}
	else
	{
		o = ["Prev", "Curr", "Next"];
		p = [parseFloat($("#div_channelMain_thumbnail" + o[0] + "_container").css("left").split("px")[0]),
			parseFloat($("#div_channelMain_thumbnail" + o[1] + "_container").css("left").split("px")[0]),
			parseFloat($("#div_channelMain_thumbnail" + o[2] + "_container").css("left").split("px")[0])]
		if (p[0] < p[1] && p[1] < p[2])
			o = ["Prev", "Curr", "Next"];
		else if (p[1] < p[2] && p[2] < p[0])
			o = ["Curr", "Next", "Prev"];
		else if (p[2] < p[0] && p[0] < p[1])
			o = ["Next", "Prev", "Curr"];
		
		if ((cModel.fGetInstance().CURR_WIDGET_INDEX < cModel.fGetInstance().PREV_WIDGET_INDEX && cModel.fGetInstance().PREV_WIDGET_INDEX - cModel.fGetInstance().CURR_WIDGET_INDEX == 1) ||
			(cModel.fGetInstance().CURR_WIDGET_INDEX == vWidgetList.length - 1 && cModel.fGetInstance().PREV_WIDGET_INDEX == 0))
		{
			if (this.mModel.CURR_WIDGET_INDEX == 0)
				i = vWidgetList.length - 1;
			else
				i = this.mModel.CURR_WIDGET_INDEX - 1;
			/*
			$.get('http://192.168.1.210/projects/0009.chumbyJSCore/test/test1.php?url=' + vWidgetList[i].mWidget.mThumbnail.mHref, function(data) {
				$("#img_channelMain_thumbnail" + o[2]).attr("src", "data:image/jpg;base64," + data);
			});
			*/
			cProxy.xmlhttpPost("", "post", {cmd: "GetJPG", data: "<value>" + vWidgetList[i].mWidget.mThumbnail.mHref + "</value>"}, function(vData) {
				vData = vData.split("<data><value>")[1].split("</value></data>")[0];
				$("#img_channelMain_thumbnail" + o[2]).attr("src", vData);
			});
			
			$("#div_channelMain_thumbnail" + o[2] + "_container").animate({
				left: "+=300"
			}, vTransitionTime / 2, function() {
				// Animation complete
			});
			$("#img_channelMain_thumbnail" + o[2]).animate({
				width: "-=100",
				height: "-=100"
			}, vTransitionTime / 2, function() {
					$("#img_channelMain_thumbnail" + o[2]).attr("src", "");
					$("#img_channelMain_thumbnail" + o[2]).attr("src", "./images/chumby_logo_48x48.png");
					$("#div_channelMain_thumbnail" + o[2] + "_container").css("left", "-100px");
					$("#div_channelMain_thumbnail" + o[2] + "_container").animate({
						left: "+=200"
					}, vTransitionTime, function() {
						// Animation complete
					});
					$("#img_channelMain_thumbnail" + o[2]).animate({
						width: "+=100",
						height: "+=100"
					}, vTransitionTime, function() {
						// Animation complete
					});
			});
			
			$("#div_channelMain_thumbnail" + o[0] + "_container").animate({
				left: "+=200",
				top: "-=15"
			}, vTransitionTime, function() {
				// Animation complete
			});
			$("#img_channelMain_thumbnail" + o[0]).animate({
				width: "+=40",
				height: "+=30"
			}, vTransitionTime, function() {
				// Animation complete
			});

			
			$("#div_channelMain_thumbnail" + o[1] + "_container").animate({
				left: "+=240",
				top: "+=15"
			}, vTransitionTime, function() {
				// Animation complete
			});
			$("#img_channelMain_thumbnail" + o[1]).animate({
				width: "-=40",
				height: "-=30"
			}, vTransitionTime, function() {
				// Animation complete
			});
		}
		else if ((cModel.fGetInstance().CURR_WIDGET_INDEX > cModel.fGetInstance().PREV_WIDGET_INDEX && cModel.fGetInstance().CURR_WIDGET_INDEX - cModel.fGetInstance().PREV_WIDGET_INDEX == 1) ||
			(cModel.fGetInstance().CURR_WIDGET_INDEX == 0 && cModel.fGetInstance().PREV_WIDGET_INDEX == vWidgetList.length - 1))
		{
			if (this.mModel.CURR_WIDGET_INDEX == vWidgetList.length - 1)
				i = 0;
			else
				i = this.mModel.CURR_WIDGET_INDEX + 1;
			/*
			$.get('http://192.168.1.210/projects/0009.chumbyJSCore/test/test1.php?url=' + vWidgetList[i].mWidget.mThumbnail.mHref, function(data) {
				$("#img_channelMain_thumbnail" + o[0]).attr("src", "data:image/jpg;base64," + data);
			});
			*/
			cProxy.xmlhttpPost("", "post", {cmd: "GetJPG", data: "<value>" + vWidgetList[i].mWidget.mThumbnail.mHref + "</value>"}, function(vData) {
				vData = vData.split("<data><value>")[1].split("</value></data>")[0];
				$("#img_channelMain_thumbnail" + o[0]).attr("src", vData);
			});
			
			$("#div_channelMain_thumbnail" + o[0] + "_container").animate({
				left: "-=300"
			}, vTransitionTime / 2, function() {
				// Animation complete
			});
			$("#img_channelMain_thumbnail" + o[0]).animate({
				width: "-=100",
				height: "-=100"
			}, vTransitionTime / 2, function() {
					$("#img_channelMain_thumbnail" + o[0]).attr("src", "");
					$("#img_channelMain_thumbnail" + o[0]).attr("src", "./images/chumby_logo_48x48.png");
					$("#div_channelMain_thumbnail" + o[0] + "_container").css("left", "840px");
					$("#div_channelMain_thumbnail" + o[0] + "_container").animate({
						left: "-=300"
					}, vTransitionTime, function() {
						// Animation complete
					});
					$("#img_channelMain_thumbnail" + o[0]).animate({
						width: "+=100",
						height: "+=100"
					}, vTransitionTime, function() {
						// Animation complete
					});
			});
			
			$("#div_channelMain_thumbnail" + o[1] + "_container").animate({
				left: "-=200",
				top: "+=15"
			}, vTransitionTime, function() {
				// Animation complete
			});

			$("#img_channelMain_thumbnail" + o[1]).animate({
				width: "-=40",
				height: "-=30"
			}, vTransitionTime, function() {
			});

			
			$("#div_channelMain_thumbnail" + o[2] + "_container").animate({
				left: "-=240",
				top: "-=15"
			}, vTransitionTime, function() {
				// Animation complete
			});

			$("#img_channelMain_thumbnail" + o[2]).animate({
				width: "+=40",
				height: "+=30"
			}, vTransitionTime, function() {
				
			});
		}

		
		$("#div_channelMain_title_container").html(vWidgetList[this.mModel.CURR_WIDGET_INDEX].mWidget.mName);
		$("#div_channelMain_description_container").html(vWidgetList[this.mModel.CURR_WIDGET_INDEX].mWidget.mDescription);
		
		if (vReturnFun)
			vReturnFun();
	}
}

// -------------------------------------------------------------------------------------------------
//	fShowChannelDiv
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fShowChannelDiv = function(
)
{
	$("#div_channelMain").show();
	$("#div_channelMain").css("left", "-800px");
	$("#div_channelMain").animate({
		left: "+=800"
	}, 200, function() {
		// Animation complete
	});
}

// -------------------------------------------------------------------------------------------------
//	fHideChannelDiv
// -------------------------------------------------------------------------------------------------
cCPanel.prototype.fHideChannelDiv = function(
)
{
	
}

