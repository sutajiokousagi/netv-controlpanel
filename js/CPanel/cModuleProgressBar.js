// -------------------------------------------------------------------------------------------------
//	cModuleProgressBar class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cModuleProgressBar(
	vDiv
)
{
	// base elements
	this.mDiv = vDiv ? $("#" + vDiv) : {};
	this.mID = vDiv ? vDiv : null;
	
	// div elements
	this.mDivBase = this.mDiv.children("#div_laodingbar_base");
	this.mDivProgress = this.mDiv.children("#div_laodingbar_progress");
	
	// style elements
	this.mViewPortSize = [];
	this.mWidth = 800;
	this.mHeight = 4;
	
	// function calls
	this.fInit();
}

/** ------------------------------------------------------------------------------------------------
 *	singleton
 * -----------------------------------------------------------------------------------------------*/
cModuleProgressBar.instance = null;
cModuleProgressBar.fGetInstance = function(
	vDiv
)
{
	return cModuleProgressBar.instance ? cModuleProgressBar.instance : cModuleProgressBar.instance = new cModuleProgressBar(vDiv);
}

/** ------------------------------------------------------------------------------------------------
 *	fInit
 * -----------------------------------------------------------------------------------------------*/
cModuleProgressBar.prototype.fInit = function(
)
{
//~ fDbg("*** cModuleProgressBar, fInit(), ");
	
}

/** ------------------------------------------------------------------------------------------------
 *	fResize
 * -----------------------------------------------------------------------------------------------*/
cModuleProgressBar.prototype.fResize = function(
	vViewPortSize
)
{	
	var vThis = this;
	vThis.mViewPortSize = vViewPortSize;

	vThis.mDiv.css("width", vViewPortSize[0] + "px");
}

/** ------------------------------------------------------------------------------------------------
 *	fReset
 * -----------------------------------------------------------------------------------------------*/
cModuleProgressBar.prototype.fReset = function(
	vReturnFun
)
{
	
}

/** ------------------------------------------------------------------------------------------------
 *	fShow / fHide
 * -----------------------------------------------------------------------------------------------*/
cModuleProgressBar.prototype.fShow = function(
)
{
	this.mDiv.show();
}
cModuleProgressBar.prototype.fHide = function(
)
{
	this.mDiv.hide();
}

/** ------------------------------------------------------------------------------------------------
 *	fShow / fHide
 * -----------------------------------------------------------------------------------------------*/
cModuleProgressBar.prototype.fAnimateIn = function(
)
{
	var vThis;
	vThis = this;
	
	vThis.fShow();
}
cModuleProgressBar.prototype.fAnimateOut = function(
)
{
	this.mDiv.hide();
}

/** ------------------------------------------------------------------------------------------------
 *	fToast
 * -----------------------------------------------------------------------------------------------*/
cModuleProgressBar.prototype.fStart = function(
	vCssObj,
	vPercentage,
	vReturnFun
)
{
fDbg("*** cModuleProgressBar, fStart(), " + vMsg + ", " + vType);
	var vThis;
	vThis = this;
	
	if (vCssObj)
	{
		if (vCssObj.width)
		{
			vThis.mDiv.css("width", vCssObj.width);
			vThis.mDivBase.css("width", vCssObj.width);
			vThis.mWidth = parseInt(vCssObj.width);
		}
		
		if (vCssObj.height)
		{
			vThis.mDiv.css("height", vCssObj.height);
			vThis.mDivBase.css("height", vCssObj.height);
			vThis.mHeight = parseInt(vCssObj.height);
		}
		
		if (vCssObj.top)
			vThis.mDiv.css("top", vCssObj.top);
		
		if (vCssObj.left)
			vThis.mDiv.css("left", vCssObj.left);
	}
	
	
	/*
	vT = 3000;
	
	$("#div_toast_content").html(vMsg);
	if (!vType || vType == "warning")
	{
		$("#div_toast_content").css("background-color", "#FF4444");
		$("#div_toast_content").css("color", "#FFFFFF");
		$("#div_toast_content").css("font-size", "24px");
		vT = 5000;
	}
	else if (vType = "message")
	{
		$("#div_toast_content").css("background-color", "#333333");
		$("#div_toast_content").css("color", "#FFFFFF");
		$("#div_toast_content").css("font-size", "24px");
		vT = 3000;
	}
	
	if (vCSSObj)
		$("#div_toast_content").css(vCSSObj);
	
	$("#div_toast").show();
	$("#div_toast").css("top", "-100px");
	$("#div_toast").animate({
		top : vThis.mViewPortSize[1] / 20 + "px"
	}, 200, function() {
		var vTO = setTimeout(function() {
			$("#div_toast").animate({
				top : "-100px"
			}, 200, function() {
			});
		}, vT);

	});
	*/
}

/** ------------------------------------------------------------------------------------------------
 *	fToast
 * -----------------------------------------------------------------------------------------------*/
cModuleProgressBar.prototype.fUpdate = function(
	vPercentage,
	vReturnFun
)
{

}

/** ------------------------------------------------------------------------------------------------
 *	fToast
 * -----------------------------------------------------------------------------------------------*/
cModuleProgressBar.prototype.fEnd = function(
	vReturnFun
)
{

}
