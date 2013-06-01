var YORECICLO = {}
YORECICLO.Utils = (function(){
	return{
		doRequest: function(url,data,callback){
			$.ajax({
				  type: "POST",
				  url: url,
				  data: data,
				  success: callback,
				  error:callback
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
		successRegistration: function (){
			console.log("a ver");
		},
		subMission: function (elem,fullProfile,event){
			var formContainer = $(elem).parent();
			$(formContainer).hide();
			if(!fullProfile) {
				if($(elem).attr("id") == "registerStep2") {
					profileData.items = $('#chooseMaterial').val();
				}
				else if ($(elem).attr("id") == "registerStep3"){
					profileData.address = $('#approximateAddress').val();
					YORECICLO.Utils.doRequest(requestUrl,profileData,YORECICLO.Register.successRegistration)
					}
				}
			$(formContainer).next().show();
		},
		initRegistration: function (){
			$(".formContainer").first().show();
			$('.registrationFormModal').submit(function(event){
				event.preventDefault();
				YORECICLO.Register.subMission(this);
			})
			if(!fullProfile) {
				$('#registration').modal('show');
			}
		}
	}
})();
