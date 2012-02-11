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
cConst.SIGNAL_MESSAGE_EVENTMSG = "signal_message_eventmsg";



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



// -----------------------------------------------------------------------------
//	System signals from NeTVServer
// -----------------------------------------------------------------------------
cConst.SIGNAL_UPDATE_WIFI = "signal_update_wifi";







// -------------------------------------------------------------------------------------------------
//	temp channel constants
// -------------------------------------------------------------------------------------------------
cConst.DEFAULT_WIDGETPEERLIST = [
	{
		mID : "8664F0CE-C50E-11DF-91A6-001B24E044BE",
		mNeTVCompatiable : true,
		mPeerWidget : {
			mID : "0000-hqsg-twitter02",
			mHref : "http://localhost/widgets/twitter0.2/index.html"
		},
		mPeerParameters : {
			zipcode : ""
		},
		mNeedAuth : false
	},
	{
		mID : "E3791136-9AB6-11DB-AC1C-0030485A78AA",
		mNeTVCompatiable : true,
		mPeerWidget : {
			mID : "0000-hqsg-weather01",
			mHref : "http://localhost/widgets/weather_0.1/index.html"
		},
		mPeerParameters : {
			zipcode : ""
		},
		mNeedAuth : false
	},
	{
		mID : "5ED92F74-2F36-11DB-AF6D-001372292121",
		mNeTVCompatiable : true,
		mPeerWidget : {
			mID : "0000-hqsg-hackernews01",
			mHref : "http://localhost/widgets/hackernews_0.1/index.html"
		},
		mNeedAuth : false
	},
	{
		mID : "8D6C6E4C-8ED1-11DF-9C1E-001B24E044BE",
		mNeTVCompatiable : true,
		mPeerWidget : {
			mID : "0000-hqsg-groupon01",
			mHref : "http://localhost/widgets/groupon_0.1/index.html"
		},
		mNeedAuth : false
	},
	{
		mID : "94705846-FE85-11DB-9DF5-0030485A78AA",
		mNeTVCompatiable : true,
		mPeerWidget : {
			mID : "0000-hqsg-engadget01",
			mHref : "http://localhost/widgets/engadget_0.1/index.html"
		},
		mNeedAuth : false
	},
	{
		mID : "B5EE068E-B509-11DE-8681-001B24F07EF4",
		mNeTVCompatiable : true,
		mPeerWidget : {
			mID : "0000-hqsg-facebook01",
			mHref : "http://localhost/widgets/facebook_0.1/index.html"
		},
		mNeedAuth : true
	}
];



/*
"8664F0CE-C50E-11DF-91A6-001B24E044BE" 
"E3791136-9AB6-11DB-AC1C-0030485A78AA" 
"B5EE068E-B509-11DE-8681-001B24F07EF4" 
"F46FFB24-34C4-11DB-9616-001372292121" 
"8D6C6E4C-8ED1-11DF-9C1E-001B24E044BE" 
"CF362162-6D89-11DD-90AF-001B24E044BE"
* 
"59E82B76-AC29-11DB-8062-0030485A78AA" 
"94705846-FE85-11DB-9DF5-0030485A78AA" 
"F478EDE2-F70B-11DB-B414-0030485A78AA" 
"5ED92F74-2F36-11DB-AF6D-001372292121" 
"5D4D001C-6320-11DC-B7A6-0030485A78AA" 
"3B8BB512-3AFA-11E0-9D0B-0021288EBF58"
* 
"415D4FB4-DC86-11DF-9DE3-001B24E044BE" 
"8062565E-2E3A-11E0-8446-0021288E720C" 
"E2357306-BE6C-11DD-97AA-001E681DF646" 
"2190621C-0AAA-11DD-BD36-0030488D0168" 
"02E724E0-D235-11DF-B45D-001B24E044BE" 
"D54AB3CE-A51B-11DC-958C-0016353B4502" 
"2F257F66-4534-11DC-90E0-0030485A78AA" 
"925A5CAA-B6C4-11DF-8D80-001B24E044BE" 
"66F729DC-139A-11DD-8CC4-0030488E34F8" 
"A950948C-F576-11DB-870C-0030485A78AA" 
"B85E4B46-2AEC-11DF-8850-001E681DFAC2" 
"428F3FAC-7374-11DB-A1A6-0030485A78AA" 
"471198D8-6E43-11DD-B3B1-001B24F07EF4" 
"266226B8-B3EE-11DB-BDAE-0030485A78AA" 
"4E63BE5A-3F31-11DC-BD46-0030488E34CA" 
"0AE84B72-8157-11DE-B248-001B24F07EF4" 
"8062565E-2E3A-11E0-8446-0021288E720C" 
"F8809038-A2B0-11DC-99CA-0016353B0686" 
"A7228412-6BCE-11DC-9FAD-0030488CBE0D" 
"3D152DB0-CAAE-11DC-8BC4-0016353B4502" 
"94E04F6A-EE3A-11DD-9C7D-001B24F07EF4" 
"8062565E-2E3A-11E0-8446-0021288E720C" 
"5624A3DE-9403-11DD-B835-001B24E044BE"
*/
