HomeNode
========

Home automation with Nodejs.

Requirements: Nodejs , mongodb, tdtools.

IMPORTANT!

This setup is tested with my own environment and devices, it might crash, blow up, call you names.

This setup has been tested with a tellstick, not duo or net.
You need to assure that the telldusd service is started for this application to run.

* Unpack the compressed archive db.tar.gz and use the dumpdir HomeNode to import it into a mongodb database called HomeNode.
  ( mongorestore -d HomeNode db/HomeNode )
* Install nodejs modules with npm install
* Start the server with nodemon server.js
* Access the server on localhost:8888
* The user starting server.js need to be able to run sudo without password in /etc/sudoers ex:
	# Allow members of group sudo to execute any command
	#%sudo  ALL=(ALL:ALL) ALL <-- commented out
	%sudo ALL=NOPASSWD: ALL <-- added


0.0.5
 * More sonos stuff (only one zone tested though), you now need the socket.io module. And change the string "var socket = io.connect('http://127.0.0.1:3000');" To your servers ip or dns name in the file viewmodels/sonos.viewmodel.js (gonna fix this later).
 * A html5 canvas is used to display all units, they are movable and clickable to toggle states. You can upload you're own background image aswell as long as its .png and not huge.

0.0.4
 * Sonos support (volume, start,stop,pause. tested with radiostations and spotify.
   IP-address of sonos bridge or main speaker need to be configured in /api/sonos.js for now.
 * English interface.

0.0.3
 * Auto calculated sun-up and sun-down depending on coordinates, or manually selected time.
 * Set up/down to auto/man/disabled

0.0.2
 * Groups! 
 * Automated on/off on selected group.

0.0.1
 * Functionality tested with a basic tellstick device (not duo or net).
 * Add/remove/learn devices from the webinterface.
 * Uses mongodb to keep settings for tellstick.conf, which can be written on demand.
 * Currently uses some static settings such as protocol=arctech and self-learning switches.
 * Automaticly turning on/off all configured outlets (only by time of day calculated by coordinates).
 * Most things should be responsive and viewable in a mobile device

Planned
 * Queue spotify songs, trying to contribute to https://github.com/bencevans/node-sonos
 * A better landing page.
 * Language selection, Swedish and English.
 * Error handling if mongodb is not connected at server startup.
