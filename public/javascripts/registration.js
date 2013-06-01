var YORECICLO = {}
YORECICLO.Home = (function (){

	return {
	init: function (){
//		$('.facebook-btn').click(function (){
//			YORECICLO.Register.initRegistration();
//		});
	}
	}
})();

YORECICLO.Register = (function () {
	// private scope
	var registered = false;
	return {
		//public scope
		subMission: function (step){
			var next = parseInt(step) + 1;
			$(".formContainer").hide();
			$(".step"+next).show();
			if(!registered) {
				switch (step) {
					case 1:
					  //alert("1");
					  break;
					case 2:
					  //alert("2");
					  break;
					case 3:{
					  registered = true;
					}
					  break;
				}
			}
		},
		initRegistration: function (){
			if(!registered) {
				$('#registration').modal('show');
			}
		}
	}
})();
