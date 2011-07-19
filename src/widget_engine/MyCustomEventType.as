package
{
	import flash.events.Event;
	import flash.utils.Dictionary;

	public class MyCustomEventType extends Event
	{
		// Properties
  		public var arg:*;
		
  		// Constructor
  		public function MyCustomEventType(type:String, bubbles:Boolean = false, cancelable:Boolean = false, ... a:*)
		{
   			super(type, bubbles, cancelable);
   			arg = a;
		}
		
		// Override clone
		override public function clone():Event
		{
			return new MyCustomEventType(type, bubbles, cancelable, arg);
		};
	}
}