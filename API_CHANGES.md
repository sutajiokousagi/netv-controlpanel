The original NeTV Control Panel used many shell scripts to accomplish
what it needed.  since this can now run anywhere, and not just on an
embedded Linux machine, we add API calls to accomplish the same thing.


* call: GETLOCALWIDGETS
* value: none
* result: Returns a JSON element of the local widgets, plus their configuration.

* call: GETLOCALWIDGETCONFIG
* value: name of widget to configure
* result: Returns a JSON value containing the local widget configuration

