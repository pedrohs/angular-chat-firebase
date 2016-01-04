'use strict';
angular
	.module('appChat', ['firebase', 'ngAudio'])
	.controller('ChatController', ChatController)
	.directive('scroll', scrollDirective);

function ChatController($rootScope, $firebaseAuth, $firebaseArray, $window, ngAudio){
	var vm = this;
	var ref = new Firebase('https://tvchat.firebaseio.com');
	var not = 0;
	var focus = true;

	vm.user = undefined;
	vm.error = false;

	vm.login = function(){
		var auth = $firebaseAuth(ref);

		auth.$authWithOAuthPopup("facebook").then(function(userData){
			var data = userData.facebook;
			var user = {id: data.id, name: data.displayName, picture: data.profileImageURL};

			$rootScope.$emit('auth.successful', user);
		}).catch(function(err){
			$rootScope.$emit('auth.failed');
		});
	};

	vm.send = function(event){
		if(event.keyCode == 13 && vm.message.length >= 1){
			var data = angular.copy(vm.user);

			data.message = vm.message;
			vm.messages.$add(data).then(function(){
				vm.message = '';
			});
		}
	};

	function startNotification(){
		if(vm.user){
			vm.soundPop = ngAudio.load("../mp3/pop.mp3");
			vm.messages.$watch(function(data){
				if(data.event == 'child_added'){
					$rootScope.$emit('chat.new_message');
				}
			});
			getFocus();
		}
	}

	function getFocus(){
		$window.onfocus = function(){
			focus = true;

			if(not != 0){
				$rootScope.$emit('chat.focus');
			}
		}
		$window.onblur = function(){
			focus = false;
		}
	}

	$rootScope.$on('auth.successful', function(event, data){
		vm.user = data;
		vm.messages = $firebaseArray(ref);

		startNotification();
	});

	$rootScope.$on('auth.failed', function(event){
		vm.error = true;
	});

	$rootScope.$on('chat.new_message', function(){
		console.log(focus);
		if(!focus){
			not++;
			$rootScope.titleAlert = "(" + not + ")";
			vm.soundPop.play("../mp3/pop.mp3");
		}else{
			not = 0;
			$rootScope.titleAlert = "";
		}		
	});

	$rootScope.$on('chat.focus', function(){
		$rootScope.$apply(function(){
			not = 0;
			$rootScope.titleAlert = "";
		});
	});
};