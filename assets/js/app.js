var app = angular.module('appChat', ['firebase']);

app.controller('chatCtrl', function($scope, $firebaseArray){
	var ref = new Firebase("https://tvchat.firebaseio.com");
	
	$scope.error = false;

	$scope.login = function(){
		ref.authWithOAuthPopup("facebook", function(error, authData) {
		if (error) {
			$scope.error = true;
		} else {
			$scope.$apply(function(){
				console.log(authData.facebook);

				$scope.mensagens = $firebaseArray(ref);
				var data = authData.facebook;
				$scope.user = {id: data.id, name: data.displayName, picture: data.profileImageURL};
			});
		}
	});
	};

	$scope.enviar = function(e){
		if(e.keyCode == 13){
			$scope.mensagens.$add($scope.user).then(function(){
				$scope.user.mensagem = "";
			});
		}
	}
});


/*var list = $firebaseArray(ref);
					var teste = {nome: "pedro henrique", token: "teste417157", mensagem: "Lorem ipsum dolor sit amet, consectetur adipisicing elit."};
					list.$add(teste).then(function(ref) {
					  var id = ref.key();
					  console.log("added record with id " + id);
					  list.$indexFor(id); // returns location in the array
					});*/