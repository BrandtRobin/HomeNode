var ViewModel = function () {
	var self = this;

	console.log('loading Map viewmodel');
	self.units = ko.observableArray([]);
	self.edittext = ko.observable('Edit');
	self.notification = ko.observable('');

	$('#notification-div').hide();

	//pretty file-input
	$('input[type=file]').bootstrapFileInput();
	$('.file-inputs').bootstrapFileInput();


	self.loadUnits = function () {
		$("document").ready(function () {
			$.getJSON("units", function (data) {
				self.units(data);
				self.loadMap();
			});
		});

	};

	self.editing = false;
	self.unitToMove = null;
	self.unitToMoveName = null;
	self.unitToMoveState = false;
	var unit_h = 0;
	var unit_w = 0;

	self.loadMap = function() {
		var x = 0;
		var y = 0;
		var unit_h = 50;
		var unit_w = 50;
		var sources = {
	       	bg: 'pics/plan1.png',
	       	unit: 'pics/pin.png',
	       	unitoff: 'pics/pinoff.png'
      	};
      	var can = document.getElementById('canvas');
		var ctx = can.getContext('2d');
		var image_collection;

		function loadImages(sources, callback) {
	    	var images = {};
	        var loadedImages = 0;
	        var numImages = 0;
	        // get num of sources
	        for(var src in sources) {
	            numImages++;
	        }
	        for(var src in sources) {
	            images[src] = new Image();
	            images[src].onload = function() {
	            	if(++loadedImages >= numImages) {
	                	callback(images);
	            	}
	        	};
	        	images[src].src = sources[src];
	        }
	    }

		loadImages(sources, function(images) {		    
			image_collection = images;
        	can.width = image_collection.bg.width; 
			can.height = image_collection.bg.height;
			for (i in self.units()) {
				if (self.units()[i].x > can.width || self.units()[i].y > can.height) {
					self.units()[i].x = 0;
					self.units()[i].y = 0;
				}
			}
			ctx.font="17px sans-serif";
			ctx.textAlign = 'center';
			ctx.fillStyle = 'white';
			ctx.shadowColor = 'black';
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.shadowBlur = 10;
			can.addEventListener('mousedown', mousemover, false);
			redraw();
		});


		function getMousePos(canvas, evt) {
	         var rect = canvas.getBoundingClientRect();
	         return {
	           x: evt.clientX - rect.left,
	           y: evt.clientY - rect.top
	         };
	    }

	    function imagechecking() {
	    	if (self.units()[i].state) {
					ctx.drawImage(image_collection.unit, self.units()[i].x, self.units()[i].y);
				}
			else if (!self.units()[i].state) {
				ctx.drawImage(image_collection.unitoff, self.units()[i].x, self.units()[i].y);
			}
			ctx.fillText(self.units()[i].name, (self.units()[i].x+25), (self.units()[i].y));
	    }

	    function redraw(x, y) {
	     	ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(image_collection.bg, 0, 0);
			x = (x-unit_w/2);
			y = (y-unit_h/2);
			if (self.unitToMoveState) {
				ctx.drawImage(image_collection.unit, x, y);
			}
			else {
				ctx.drawImage(image_collection.unitoff, x, y);
			}
			ctx.fillText(self.unitToMoveName, x+25, y);
			for (i in self.units()) {
				imagechecking();
			}
	    }

	    var unitmover = function(evt) {
	     	var mousePos = getMousePos(canvas, evt);
	     	redraw(mousePos.x, mousePos.y);
	    }

	    var mousemover = function(evt) {
	     	var mousePos = getMousePos(canvas, evt);
	     	searchPosition(mousePos.x, mousePos.y);
	     }
	     var placeunit = function(evt) {
	     	$('#notification-div').hide();
	     	self.notification('');
	     	can.removeEventListener('mousemove', unitmover, false);
	     	can.removeEventListener('mousedown', placeunit, false);
	     	var mousePos = getMousePos(canvas, evt);
	     	x = (mousePos.x-unit_w/2);
			y = (mousePos.y-unit_h/2);
	     	self.updateUnitPlacement(self.unitToMove, x, y);
	     }

		function searchPosition(x,y) {
			for(i in self.units()) {
		     	if (x >= self.units()[i].x && x <= self.units()[i].x+unit_w) {
		     		if (y >= self.units()[i].y && y <= self.units()[i].y+unit_h) {
		         		console.log('unit ' + self.units()[i]._id +  ' clicked');
		         		if (self.editing) {
		         			self.notification('Move mouse and click to place.');
		         			$('#notification-div').show();
		         			console.log('move ' + self.units()[i]._id);
		         			self.unitToMove = self.units()[i]._id;
		         			self.unitToMoveName = self.units()[i].name;
		         			self.unitToMoveState = self.units()[i].state;
		         			can.removeEventListener('mousedown', mousemover, false);
		         			can.addEventListener('mousedown', placeunit, false);
		         			can.addEventListener('mousemove', unitmover, false);
		         			self.units.splice(self.units.indexOf(self.units()[i]),1);
		         		}
		         		if (!self.editing) {
		         			$.ajax({
								type: "POST",
								url: "toggle",
								dataType: 'json',
								contentType: 'application/json',
								data: JSON.stringify(self.units()[i]),
								success: function (data) {
									$('#loadingModal').modal('show');
									setTimeout(function () {
										$('#loadingModal').modal('hide');
										self.loadUnits();
									}, 3000);
								}
							});
			         	}
		         	}
		       	}
		    }
		}

	};


	self.editMode = function () {
		if (self.editing) {
			self.editing = false;
			self.edittext('Edit');
			$('#notification-div').hide();
		}
		else {
			self.editing = true;
			self.notification('');
		    self.notification('Click the unit you want to move.');
		    $('#notification-div').show();
			self.edittext('Stop edit');
		}
	};

	self.updateUnitPlacement = function (unit, x, y) {
		console.log('updating placement ' + unit + ' ' + x + ':' +y);
		data = {
			_id: unit,
			x: x,
			y: y
		};
		$.ajax({
			type: "POST",
			url: "updatemap", // your POST target goes here
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(data), // message to send goes here
			success: function (data) {
				self.loadUnits();
			}
		});
	};

	self.uploadBackground = function () {
		console.log('uploading new background');
		$('#uploadModal').modal('show');
	};

	self.submitBackground = function() {
		document.getElementById("uploadform").submit();
		$('#uploadModal').modal('hide');	
		return false;
	};

	(function () {
		self.loadUnits();
	}(self));
};
