var YORECICLO = {}
YORECICLO.Utils = (function(){
	return{
		doRequest: function(url,data,callback){
			$.ajax({
				  type: "POST",
				  url: url,
				  data: data,
				  success: callback,
				  dataType: "json"
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
			if(!fullProfile) {
				switch (step) {
					case 1:
					  break;
					case 2:
					 	profileData.items = $('#chooseMaterial').val();
					  break;
					case 3:{
						profileData.address = $('#approximateAddress').val();
						console.log(profileData);
						YORECICLO.Utils.doRequest(requestUrl,profileData,YORECICLO.Register.successRegistration)
					}
					  break;
				}
			}
			$(".step"+next).show();
		},
		initRegistration: function (){
			console.log("le pega");
			if(!fullProfile) {
				$('#registration').modal('show');
			}
		},
		successRegistration: function (){
			alert("viva perón!");
		}
	}
})();
