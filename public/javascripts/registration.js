var YORECICLO = {}
YORECICLO.Utils = (function(){
	return{
		doRequest: function(url,data,success){
			$.ajax({
				  type: "POST",
				  url: url,
				  data: data,
				  success: alert("pipo")
				});
		}
	}
})();

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
	//set to false until further backend development and completed profile info is sent to view
	var fullProfile = false;
	var profileData = {};
	var requestUrl = "/signup"
	return {
		//public scope
		subMission: function (step,fullProfile){
			var next = parseInt(step) + 1;
			$(".formContainer").hide();
			$(".step"+next).show();
			if(!fullProfile) {
				switch (step) {
					case 1:
					  alert("1");
					  break;
					case 2:
					 	profileData.items = $('#chooseMaterial').val();
					  break;
					case 3:{
						profileData.address = $('#approximateAddress').val();
						YORECICLO.Utils.doRequest(requestUrl,profileData)
					}
					  break;
				}
			}
		},
		initRegistration: function (){
			if(!fullProfile) {
				$('#registration').modal('show');
			}
		}
	}
})();
