// -------------------------------------------------------------------------------------------------
//	cModel static class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	static members
// -------------------------------------------------------------------------------------------------
var cConst = {};

// -----------------------------------------------------------------------------
//	control panel signals
// ----------------------------------------------------------------------------- 
// startup signals
cConst.SIGNAL_STARTUP_INIT = "signal_startup_init";
cConst.SIGNAL_STARTUP_ENVIRONMENTALCHECK_COMPLETE = "signal_startup_environmentalcheck_complete";
cConst.SIGNAL_STARTUP_ENVIRONMENTALCHECK_FAILED = "signal_startup_environmentalcheck_failed";

cConst.SIGNAL_STARTUP_AUTHORIZATION_SUCCESS = "signal_startup_authorization_success";
cConst.SIGNAL_STARTUP_AUTHORIZATION_FAIL = "signal_startup_authorization_fail";

cConst.SIGNAL_STARTUP_AUTHENTICATION_SUCCESS = "signal_startup_authentication_success";
cConst.SIGNAL_STARTUP_AUTHENTICATION_FAIL = "signal_startup_authentication_fail";

cConst.SINGAL_STARTUP_COMPLETE = "signal_startup_complete";



// general signals
cConst.SIGNAL_SHOW = "signal_show";
cConst.SIGNAL_HIDE = "signal_hide";

cConst.SIGNAL_CHANNELDIV_SHOW = "signal_channeldiv_show";
cConst.SIGNAL_CHANNELDIV_HIDE = "signal_channeldiv_hide";
cConst.SIGNAL_SCPINFO_SHOW = "signal_scpinfo_hide";
cConst.SIGNAL_SCPINFO_HIDE = "signal_scpinfo_hide";
cConst.SIGNAL_SCPINFO_UPDATE = "signal_scpinfo_update";

cConst.SIGNAL_GOTO_CONTROLPANEL = "signal_goto_controlpanel";
cConst.SIGNAL_GOTO_FLASHWIDGETENGINE = "signal_goto_flashwidgetengine";
cConst.SIGNAL_GOTO_HTMLWIDGETENGINE = "signal_goto_htmlwidgetengine";
cConst.SIGNAL_GOTO_EVENTWIDGETENGINE = "signal_goto_eventwidgetengine";
cConst.SIGNAL_GOTO_EVENTTICKER = "signal_goto_eventticker";

cConst.SIGNAL_FIRSTTIME_STARTUP = "signal_firsttime_startup";
cConst.SIGNAL_HEARTBEAT = "signal_heartbeat";
cConst.SIGNAL_PLAYNEXTWIDGET = "signal_playnextwidget";



// message events
cConst.SIGNAL_NETWORKEVENT_DISCONNECTED = "signal_networkevent_disconnnected";
cConst.SIGNAL_NETWORKEVENT_CONNECTED = "signal_networkevent_connnected";
cConst.SIGNAL_MESSAGE = "signal_message";
cConst.SIGNAL_MESSAGE_WIDGETMSG = "signal_message_widgetmsg";



// XAPI signals
cConst.SIGNAL_ACTIVATE = "signal_activate";





// -----------------------------------------------------------------------------
//	widget engine signals
// -----------------------------------------------------------------------------
cConst.SIGNAL_WIDGETENGINE_SHOW = "signal_widgetengine_show";
cConst.SIGNAL_WIDGET_NEXT = "signal_widget_next";
cConst.SIGNAL_WIDGET_PREV = "signal_widget_prev";

// -----------------------------------------------------------------------------
//	D-Pad buttons
// -----------------------------------------------------------------------------
cConst.SIGNAL_TOGGLE_CONTROLPANEL = "signal_toggle_controlpanel";
cConst.SIGNAL_TOGGLE_WIDGETENGINE = "signal_toggle_widgetengine";

cConst.SIGNAL_BUTTON_LEFT = "signal_button_left";
cConst.SIGNAL_BUTTON_RIGHT = "signal_button_right";
cConst.SIGNAL_BUTTON_CENTER = "signal_button_center";
cConst.SIGNAL_BUTTON_UP = "signal_button_up";
cConst.SIGNAL_BUTTON_DOWN = "signal_button_down";

// -----------------------------------------------------------------------------
//	Android/iOS events
// -----------------------------------------------------------------------------
cConst.SIGNAL_ANDROID_START_CONFIGURING = "signal_android_start_configuring";
cConst.SIGNAL_IOS_START_CONFIGURING = "signal_ios_start_configuring";

// -----------------------------------------------------------------------------
//	states
// -----------------------------------------------------------------------------
cConst.STATE_CONTROLPANEL = "state_controlpanel";
cConst.STATE_HTMLWIDGETENGINE = "state_htmlwidgetengine";
cConst.STATE_FLASHWIDGETENGINE = "state_flashwidgetengine";

cConst.STATE_SUB_FLASHCHANNELWIDGETSMAIN = "state_sub_flashchannelwidgetsmain";
cConst.STATE_SUB_HTMLCHANNELWIDGETSMAIN = "state_sub_htmlchannelwidgetsmain";
cConst.STATE_SUB_CHANNELMAIN = "state_sub_channelmain";




















// -------------------------------------------------------------------------------------------------
//	temp channel constants
// -------------------------------------------------------------------------------------------------
cConst.DEFAULT_WIDGETPEERLIST = [
	{
		mID : "7482B0E8-D9D6-11E0-BDB5-0021288EC192",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "169CDF90-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : true,
		mPeerWidget : {
			mID : "0000-hqsg-twitter02",
			mHref : "http://localhost/widgets/twitter0.2/index.html"
		},
		mPeerParameters : {
			zipcode : ""
		}
	},
	{
		mID : "169D98D6-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : true,
		mPeerWidget : {
			mID : "0000-hqsg-weather01",
			mHref : "http://localhost/widgets/weather_0.1/index.html"
		},
		mPeerParameters : {
			zipcode : ""
		}
	},
	{
		mID : "169E5082-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "169F1BA2-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : true,
		mPeerWidget : {
			mID : "0000-hqsg-hackernews01",
			mHref : "http://localhost/widgets/hackernews_0.1/index.html"
		}
	},
	{
		mID : "169FE2EE-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16A0B534-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : true,
		mPeerWidget : {
			mID : "0000-hqsg-groupon01",
			mHref : "http://localhost/widgets/groupon_0.1/index.html"
		}
	},
	{
		mID : "16A1523C-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16A20DE4-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16A2CF4A-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : true,
		mPeerWidget : {
			mID : "0000-hqsg-engadget01",
			mHref : "http://localhost/widgets/engadget_0.1/index.html"
		}
	},
	{
		mID : "16A3AB9A-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16A4D3D0-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16A62DA2-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16A71906-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16A81540-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16A8E9E8-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16A9A824-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16AA64DA-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16AB2244-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16ABE238-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16ACAA24-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16AD7850-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16AE3E02-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16AEF86A-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16AF7FCE-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16B008E0-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16B14840-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16C5C6F8-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16C6909C-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16C73A38-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16C7DDEE-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16C8A1FC-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16C932FC-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16C9BB96-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	},
	{
		mID : "16CA5ACE-D921-11E0-9CCA-0021288EBF58",
		mNeTVCompatiable : false,
		mPeerWidget : {
			mID : null,
			mHref : null
		}
	}
];
