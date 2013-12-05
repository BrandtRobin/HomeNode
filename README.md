HomeNode
========

Home automation with Nodejs.

Requirements: Nodejs , mongodb, tdtools.

* Unpack the compressed archive db.tar.gz and use the dumpdir HomeNode to import it into a mongodb database called HomeNode.
  ( mongorestore -d HomeNode db/HomeNode )
* Install nodejs modules with npm install
* Start the server with nodemon server.js
* Access the server on localhost:8888


0.0.1
 * Functionality tested with a basic tellstick device (not duo or net).
 * Add/remove/learn devices from the webinterface.
 * Uses mongodb to keep settings for tellstick.conf, which can be written on demand.
 * Currently uses some static settings such as protocol=arctech and self-learning switches.
 * Automaticly turning on/off all configured outlets (only by time of day calculated by coordinates).
 * Most things should be responsive and viewable in a mobile device

Planned
 * Proper groups.
 * Manual time selection for automatic on/off for groups.
 * A better landing page.
 * Language selection, Swedish and English.
 * Error handling if mongodb is not connected at server startup.
