// -------------------------------------------------------------------------------------------------
//	cGUID class
//
//
//
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------
//	constructor
// -------------------------------------------------------------------------------------------------
cGUID = function() {

};


cGUID.fGenerate = function() {
	return cGUID.fGuidOf(String((new Date()).getTime()));
}

cGUID.fGuidOf = function(
	vS
)
{
	return cGUID.fAsGUID(cGUID.fGetMD5(vS));
}

cGUID.fAsGUID = function(
	vS
)
{
	return vS.slice(0,8) + '-' + vS.slice(8,12) + '-' + vS.slice(12,16) + '-' + vS.slice(16,20) + '-' + vS.slice(20);	
}

cGUID.fGetMD5 = function(
	vS
)
{
	return hex_md5(vS);
}


/*
	public static function guidOf(s:String):String {
		return GUID.asGUID(GUID.md5(s));
	}

	public static function asGUID(g:String):String {
		return g.slice(0,8)+'-'+g.slice(8,12)+'-'+g.slice(12,16)+'-'+g.slice(16,20)+'-'+g.slice(20);	
	}

	public static function md5(s:String):String {
		// edited by qinchuan
		var md5 = new MD5();
		return md5.hash(s);
		return;
		
		
		
		if (Chumby._chumby.isChumby) {
			return ChumbyNative._md5Sum(s);
		} else {
			var md5 = new MD5();
			return md5.hash(s);
		}
	}

	public static function makeKey():String {
		var s:String = '';
		for (var i:Number=0;i<36;i++) {
			s += String.fromCharCode(0x61+random(26));
		}
		return s;
	}

	public static function xor(a:String,b:String):String {
		var s:String = '';
		for (var i:Number=0;i<36;i++) {
			s += String.fromCharCode(a.charCodeAt(i) ^ b.charCodeAt(i));
		}
		return s;
	}
}
*/
