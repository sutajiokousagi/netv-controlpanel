// -------------------------------------------------------------------------------------------------
//	cPIChromaBg class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
function cPIChromaBg(
	vDiv
)
{

	this.mDiv = vDiv ? $("#" + vDiv) : {};
	this.mID = vDiv ? vDiv : null;

	this.mRefreshInterval = null;
	this.mRefreshFrequency = 100;
	this.mRefreshPeriod = 4000;
	
	this.fInit();
}

// -------------------------------------------------------------------------------------------------
//	singleton
// -------------------------------------------------------------------------------------------------
cPIChromaBg.instance = null;
cPIChromaBg.fGetInstance = function(
	vDiv
)
{
	return cPIChromaBg.instance ? cPIChromaBg.instance : cPIChromaBg.instance = new cPIChromaBg(vDiv);
}

// -------------------------------------------------------------------------------------------------
//	fInit
// -------------------------------------------------------------------------------------------------
cPIChromaBg.prototype.fInit = function(
)
{
fDbg2("*** cPIChromaBg, fInit(), ");
}

// -------------------------------------------------------------------------------------------------
//	fPlayWidget
// -------------------------------------------------------------------------------------------------
cPIChromaBg.prototype.fReset = function(
	vReturnFun
)
{
	cPIChromaBg.instance.mHeartbeatN = 0;
}

// -------------------------------------------------------------------------------------------------
//	fShow / fHide
// -------------------------------------------------------------------------------------------------
cPIChromaBg.prototype.fShow = function(
)
{
	this.mDiv.show();
}
cPIChromaBg.prototype.fHide = function(
)
{
	this.mDiv.hide();
}

// -------------------------------------------------------------------------------------------------
//	fRefreshScreen
// -------------------------------------------------------------------------------------------------
cPIChromaBg.prototype.fRefreshScreen = function(
	vAction,	// on | off
	vReturnFun
)
{
fDbg2("*** cPIChromaBg, fRefreshScreen(), ");
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
				clearInterval(cPIChromaBg.instance.mRefreshInterval);
				$("#div_tempBg").hide();
			}
		}, f);
	}
}
