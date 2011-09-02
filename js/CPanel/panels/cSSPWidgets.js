// -------------------------------------------------------------------------------------------------
//	cSCPWidgets class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cSCPWidgets(
	vDiv
)
{
	this.mDiv = $("#" + vDiv);
	this.mID = vDiv;
	
	this.mSelectedChannel = null;
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cSCPWidgets.instance = null;
cSCPWidgets.fGetInstance = function(
	vDiv
)
{
	return cSCPWidgets.instance ? cSCPWidgets.instance : cSCPWidgets.instance = new cSCPWidgets(vDiv);
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cSCPWidgets.prototype.fInit = function(
)
{
	
}

// -------------------------------------------------------------------------------------------------
//	fOnSignal
// -------------------------------------------------------------------------------------------------
cSCPWidgets.prototype.fOnSignal = function(
	vSignal,		// string
	vData,			// data array
	vReturnFun		// return function call
)
{
fDbg("*** cSCPWidgets, fOnSignal(), " + vSignal + ", " + vData);
	var i, o;
	
	switch(vSignal)
	{
	case cConst.SIGNAL_TOGGLE_CONTROLPANEL:
		break;
		
	case cConst.SIGNAL_TOGGLE_WIDGETENGINE:
		break;
		
	case cConst.SIGNAL_BUTTON_LEFT:
		if ($("#div_flashWidgetMain").children(".bg_focusborder_outer").css("top") == "485px")
		{
			$("#div_flashWidgetMain").children("#div_flashWidgetMain_bottom").children("#bottomhighlight").css("left", "150px");
			$("#div_flashWidgetMain").children("#div_flashWidgetMain_bottom").children("#bottomhighlight").css("width", "70px");
		}
		else if ($("#div_flashWidgetMain").children(".bg_focusborder_outer").css("top") == "75px")
		{
			cModel.fGetInstance().PREV_WIDGET_INDEX = cModel.fGetInstance().CURR_WIDGET_INDEX;
			cModel.fGetInstance().CURR_WIDGET_INDEX--;
			if (cModel.fGetInstance().CURR_WIDGET_INDEX < 0)
				cModel.fGetInstance().CURR_WIDGET_INDEX = cModel.fGetInstance().CHANNEL_LIST[cModel.fGetInstance().CURR_CHANNEL_INDEX].mWidgetList.length - 1;
			//~ cCPanel.fGetInstance().fRefreshChannelDiv();
			cSCPWidgets.instance.fRefreshChannelDiv();
		}
		break;
		
	case cConst.SIGNAL_BUTTON_RIGHT:
		if ($("#div_flashWidgetMain").children(".bg_focusborder_outer").css("top") == "485px")
		{
			$("#div_flashWidgetMain").children("#div_flashWidgetMain_bottom").children("#bottomhighlight").css("left", "238px");
			$("#div_flashWidgetMain").children("#div_flashWidgetMain_bottom").children("#bottomhighlight").css("width", "58px");
		}
		else if ($("#div_flashWidgetMain").children(".bg_focusborder_outer").css("top") == "75px")
		{
			cModel.fGetInstance().PREV_WIDGET_INDEX = cModel.fGetInstance().CURR_WIDGET_INDEX;
			cModel.fGetInstance().CURR_WIDGET_INDEX++;
			if (cModel.fGetInstance().CURR_WIDGET_INDEX > cModel.fGetInstance().CHANNEL_LIST[cModel.fGetInstance().CURR_CHANNEL_INDEX].mWidgetList.length - 1)
				cModel.fGetInstance().CURR_WIDGET_INDEX = 0;
			//~ cCPanel.fGetInstance().fRefreshChannelDiv();
			cSCPWidgets.instance.fRefreshChannelDiv();
		}
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
cSCPWidgets.prototype.fShow = function(
)
{
	this.mDiv.show();
}
cSCPWidgets.prototype.fHide = function(
)
{
	this.mDiv.hide();
}

// -------------------------------------------------------------------------------------------------
//	fRefreshChannelDiv
// -------------------------------------------------------------------------------------------------
cSCPWidgets.prototype.fRefreshChannelDiv = function(
	vReturnFun
)
{
fDbg2("*** cSCPWidgets, fRefreshChannelDiv(), ");
	var o, p, vWidgetList, vTransitionTime;
	var i;
	var vDefaultImg = "chumby_logo_48x48";
	
	vTransitionTime = 500;
	
	if (!this.mModel)
		this.mModel = cModel.fGetInstance();
	if (!this.mModel.CURR_CHANNEL_INDEX)
		this.mModel.CURR_CHANNEL_INDEX = 0;
	if (!this.mModel.CURR_WIDGET_INDEX)
		this.mModel.CURR_WIDGET_INDEX = 0;

	vWidgetList = this.mModel.CHANNEL_LIST[this.mModel.CURR_CHANNEL_INDEX].mWidgetList;
	if ($("#img_flashWidgetMain_thumbnailPrev").attr("src").indexOf(vDefaultImg) > -1)
	{
		$("#img_flashWidgetMain_thumbnailPrev").hide();
		$("#img_flashWidgetMain_thumbnailCurr").hide();
		$("#img_flashWidgetMain_thumbnailNext").hide();
	
		
		// show control panel MAIN div
		if (this.mModel.CURR_WIDGET_INDEX == 0)
			p = vWidgetList.length - 1;
		else
			p = this.mModel.CURR_WIDGET_INDEX - 1;
		
		$("#img_flashWidgetMain_thumbnailPrev").attr("src", "");
		$("#img_flashWidgetMain_thumbnailPrev").attr("src", vWidgetList[p].mLocalThumbnailPath);
		$("#img_flashWidgetMain_thumbnailPrev").fadeIn();

		$("#img_flashWidgetMain_thumbnailCurr").attr("src", "");
		$("#img_flashWidgetMain_thumbnailCurr").attr("src", vWidgetList[this.mModel.CURR_WIDGET_INDEX].mLocalThumbnailPath);
		$("#img_flashWidgetMain_thumbnailCurr").fadeIn();
		
		if (this.mModel.CURR_WIDGET_INDEX == vWidgetList.length - 1)
			p = 0;
		else
			p = this.mModel.CURR_WIDGET_INDEX + 1;
		
		$("#img_flashWidgetMain_thumbnailNext").attr("src", "");
		$("#img_flashWidgetMain_thumbnailNext").attr("src", vWidgetList[p].mLocalThumbnailPath);
		$("#img_flashWidgetMain_thumbnailNext").fadeIn();
		
		$("#div_flashWidgetMain_title_container").html(vWidgetList[this.mModel.CURR_WIDGET_INDEX].mWidget.mName);
		$("#div_flashWidgetMain_description_container").html(vWidgetList[this.mModel.CURR_WIDGET_INDEX].mWidget.mDescription);
		
		if (vReturnFun)
			vReturnFun();
	}
	else
	{
		o = ["Prev", "Curr", "Next"];
		p = [
			parseFloat($("#div_flashWidgetMain_thumbnail" + o[0] + "_container").css("left").split("px")[0]),
			parseFloat($("#div_flashWidgetMain_thumbnail" + o[1] + "_container").css("left").split("px")[0]),
			parseFloat($("#div_flashWidgetMain_thumbnail" + o[2] + "_container").css("left").split("px")[0])
		];
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
			
			$("#div_flashWidgetMain_thumbnail" + o[2] + "_container").animate({
				left: "+=300"
			}, vTransitionTime / 2, function() {
				// Animation complete
			});
			$("#img_flashWidgetMain_thumbnail" + o[2]).animate({
				width: "-=100",
				height: "-=100"
			}, vTransitionTime / 2, function() {
					$("#img_flashWidgetMain_thumbnail" + o[2]).attr("src", "");
					$("#img_flashWidgetMain_thumbnail" + o[2]).attr("src", vWidgetList[i].mLocalThumbnailPath);
					$("#div_flashWidgetMain_thumbnail" + o[2] + "_container").css("left", "-100px");
					$("#div_flashWidgetMain_thumbnail" + o[2] + "_container").animate({
						left: "+=200"
					}, vTransitionTime, function() {
						// Animation complete
					});
					$("#img_flashWidgetMain_thumbnail" + o[2]).animate({
						width: "+=100",
						height: "+=100"
					}, vTransitionTime, function() {
						// Animation complete
					});
			});
			
			$("#div_flashWidgetMain_thumbnail" + o[0] + "_container").animate({
				left: "+=200",
				top: "-=15"
			}, vTransitionTime, function() {
				// Animation complete
			});
			$("#img_flashWidgetMain_thumbnail" + o[0]).animate({
				width: "+=40",
				height: "+=30"
			}, vTransitionTime, function() {
				// Animation complete
			});

			
			$("#div_flashWidgetMain_thumbnail" + o[1] + "_container").animate({
				left: "+=240",
				top: "+=15"
			}, vTransitionTime, function() {
				// Animation complete
			});
			$("#img_flashWidgetMain_thumbnail" + o[1]).animate({
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
			
			$("#div_flashWidgetMain_thumbnail" + o[0] + "_container").animate({
				left: "-=300"
			}, vTransitionTime / 2, function() {
				// Animation complete
			});
			$("#img_flashWidgetMain_thumbnail" + o[0]).animate({
				width: "-=100",
				height: "-=100"
			}, vTransitionTime / 2, function() {
					$("#img_flashWidgetMain_thumbnail" + o[0]).attr("src", "");
					$("#img_flashWidgetMain_thumbnail" + o[0]).attr("src", vWidgetList[i].mLocalThumbnailPath);
					$("#div_flashWidgetMain_thumbnail" + o[0] + "_container").css("left", "840px");
					$("#div_flashWidgetMain_thumbnail" + o[0] + "_container").animate({
						left: "-=300"
					}, vTransitionTime, function() {
						// Animation complete
					});
					$("#img_flashWidgetMain_thumbnail" + o[0]).animate({
						width: "+=100",
						height: "+=100"
					}, vTransitionTime, function() {
						// Animation complete
					});
			});
			
			$("#div_flashWidgetMain_thumbnail" + o[1] + "_container").animate({
				left: "-=200",
				top: "+=15"
			}, vTransitionTime, function() {
				// Animation complete
			});

			$("#img_flashWidgetMain_thumbnail" + o[1]).animate({
				width: "-=40",
				height: "-=30"
			}, vTransitionTime, function() {
				
			});

			
			$("#div_flashWidgetMain_thumbnail" + o[2] + "_container").animate({
				left: "-=240",
				top: "-=15"
			}, vTransitionTime, function() {
				// Animation complete
				
			});

			$("#img_flashWidgetMain_thumbnail" + o[2]).animate({
				width: "+=40",
				height: "+=30"
			}, vTransitionTime, function() {
				
			});
		}
		
		$("#div_flashWidgetMain_title_container").html(vWidgetList[this.mModel.CURR_WIDGET_INDEX].mWidget.mName);
		$("#div_flashWidgetMain_description_container").html(vWidgetList[this.mModel.CURR_WIDGET_INDEX].mWidget.mDescription);
		
		if (vReturnFun)
			vReturnFun();
	}

}
