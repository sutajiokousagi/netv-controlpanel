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
cConst.SIGNAL_BUTTON_SETUP = "signal_button_setup";

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
//	constructor
// -------------------------------------------------------------------------------------------------
