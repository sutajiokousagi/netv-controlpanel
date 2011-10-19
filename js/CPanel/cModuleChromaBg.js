// -------------------------------------------------------------------------------------------------
//	cModuleChromaBg class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cModuleChromaBg(
	vDiv
)
{

	this.mDiv = vDiv ? $("#" + vDiv) : {};
	this.mID = vDiv ? vDiv : null;

	this.mRefreshInterval = null;
	this.mRefreshFrequency = 100;
	this.mRefreshPeriod = 2000;
	
	this.fInit();
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cModuleChromaBg.instance = null;
cModuleChromaBg.fGetInstance = function(
	vDiv
)
{
	return cModuleChromaBg.instance ? cModuleChromaBg.instance : cModuleChromaBg.instance = new cModuleChromaBg(vDiv);
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cModuleChromaBg.prototype.fInit = function(
)
{
//~ fDbg2("*** cModuleChromaBg, fInit(), ");
}

// -------------------------------------------------------------------------------------------------
//	fPlayWidget
// -------------------------------------------------------------------------------------------------
cModuleChromaBg.prototype.fReset = function(
	vReturnFun
)
{
	cModuleChromaBg.instance.mHeartbeatN = 0;
}

// -------------------------------------------------------------------------------------------------
//	fShow / fHide
// -------------------------------------------------------------------------------------------------
cModuleChromaBg.prototype.fShow = function(
)
{
	this.mDiv.show();
}
cModuleChromaBg.prototype.fHide = function(
)
{
	this.mDiv.hide();
}

// -------------------------------------------------------------------------------------------------
//	fRefreshScreen
// -------------------------------------------------------------------------------------------------
cModuleChromaBg.prototype.fRefreshScreen = function(
	vAction,	// on | off
	vReturnFun
)
{
//~ fDbg("*** cModuleChromaBg, fRefreshScreen(), ");
	//~ return;
	var o, p, f;
	if (vAction == "off")
	{
		if (this.mRefreshInterval != null)
		{
			clearInterval(this.mRefreshInterval);
			this.mRefreshInterval = null;
		}
	}
	else
	{
		o = 0;
		p = this.mRefreshPeriod;
		f = this.mRefreshFrequency;
		
		this.mRefreshInterval = setInterval(function() {
			$("#div_tempBg").show();
			if ($("#div_tempBg").css("left") == "-50px")
				$("#div_tempBg").css("left", "-40px");
			else
			{
				$("#div_tempBg").hide();
				$("#div_tempBg").css("left", "-50px");
			}
			o++;
			if (o * f > p)
			{
				clearInterval(cModuleChromaBg.instance.mRefreshInterval);
				$("#div_tempBg").hide();
			}
		}, f);
	}
}
