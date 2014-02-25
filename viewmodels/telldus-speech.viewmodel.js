var ViewModel = function () {
	var self = this;

	console.log('loading telldus speech viewmodel');
	self.units = ko.observableArray([]);

	self.loadUnits = function () {
		var field = document.querySelector('#queryField');
		field.onwebkitspeechchange = function(e) {
	    	var q = field.value;
	    	console.log(q);
	    	if (q == "kitchen") {
	    		console.log('doing something with kitchen');
	    	}
		};

    }
    
   function notify(notification,time) {
      if (typeof time == 'undefined' ) time = 2000;
       $("#speechnotification").html(notification);
       $("#speechnotification").animate({"left":0},1500).delay(time).animate({"left" :-( ($(this).width())+5)},1500);
   }

	(function () {
		self.loadUnits();
	}(self));
};
