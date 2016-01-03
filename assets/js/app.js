var app = angular.module('appChat', ['firebase']);

app.controller('chatCtrl', function($scope, $firebaseArray, $window){
	var ref = new Firebase("https://tvchat.firebaseio.com");

	$scope.error = false;
	$scope.mensagem = "";

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

					notification();
				});
			}
		});
	};

	$scope.enviar = function(e){
		if(e.keyCode == 13){
			if($scope.mensagem.length >= 1){
				$scope.user.mensagem = $scope.mensagem;
				$scope.mensagens.$add($scope.user).then(function(){
					$scope.mensagem = "";
				});
			}

		}
	};

	function notification(){
		var qntMensagens = 0;
		$window.onblur = function(){
			$scope.mensagens.$watch(function(){
				qntMensagens++;
				$scope.titleAlert = "(" + qntMensagens + ")";
			});

		};
		$window.onfocus = function(){
			$scope.$apply(function(){
				qntMensagens = 0;
				$scope.titleAlert = "";
			});

		};
	}
	/*
	function notification(){
		var qntMensagens = 0;
		$scope.mensagens.$watch(function(){

			$window.onblur = function(){
				$scope.$apply(function(){
					qntMensagens++;
					$scope.titleAlert = "(" + qntMensagens + ")";
				});

			};
			$window.onfocus = function(){
				$scope.$apply(function(){
					qntMensagens = 0;
					$scope.titleAlert = "";
				});
			};
		});

	};
	*/
});