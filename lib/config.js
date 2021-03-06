/**
 * Load and merge base and user config files.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs = require('fs');


// public export
module.exports = function ( name, path, ext ) {
	var data = {},
		cfgBase, cfgUser,
		uriBase, uriUser;

	// apply path if given
	path = path || '/config/';
	ext  = ext  || '.js';

	// get absolute paths to config files
	uriBase = process.env.STB + path + name + ext;
	uriUser = process.env.CWD + path + name + ext;

	// clear previously filled data
	delete require.cache[uriBase];
	delete require.cache[uriUser];

	// base config should always be present
	cfgBase = require(uriBase);

	// try to load user config file
	if ( fs.existsSync(uriUser) ) {
		// if it was provided
		cfgUser = require(uriUser);
	}

	// get user values if possible
	Object.keys(cfgBase).forEach(function ( key ) {
		if ( cfgUser && key in cfgUser ) {
			// user redefined the value
			data[key] = cfgUser[key];
		} else {
			// base value without altering
			data[key] = cfgBase[key];
		}
	});

	return data;
};
