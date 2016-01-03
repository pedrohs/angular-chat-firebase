/* global angular, Firebase, console */
'use strict';
var app = angular.module('appChat', ['firebase']);

app.controller('chatCtrl', ['$firebaseArray', '$scope', '$rootScope', '$window', function($firebaseArray, $scope, $rootScope, $window) {

	var vm = this;

	vm.user = undefined;
	vm.mensagem = '';
	vm.error = false;

	vm.not = 0;

	function startNotification() {
		if (vm.user) {
			vm.mensagens.$watch(function (data) {
				console.info('[firebase.$watch] event triggered', data);
				if (data.event === 'child_added') {
					$rootScope.$emit('chat.new_message', data);
				}
			});
		}
	}

	$rootScope.$on('chat.new_message', function () {
		vm.not++;
		vm.titleAlert = '(' + vm.not + ')';
	});

	$rootScope.$on('auth.failed', function () {
		console.info('[auth.failed] event triggered');
		vm.error = true;
	});

	$rootScope.$on('auth.successful', function (q, data) {
		console.info('[auth.successful] event triggered');
		vm.error = false;
		vm.user = data;
		startNotification();
	});

	var ref = new Firebase('https://tvchat.firebaseio.com');

	vm.mensagens = undefined;

	vm.login = function () {
		ref.authWithOAuthPopup('facebook', function(error, authData) {
			if (error) {
				console.info('[auth.failed] emiting event');
				$rootScope.$emit('auth.failed');
			} else {
				vm.mensagens = $firebaseArray(ref);
				var data = authData.facebook;
				var user = {id: data.id, name: data.displayName, picture: data.profileImageURL};
				$rootScope.$emit('auth.successful', user);
				console.info('[auth.successful] user logged', user);
			}
		});
	};

	vm.enviar = function (event) {
		if(event.keyCode == 13){
			if(vm.mensagem && vm.mensagem.length >= 1){
				var data = angular.copy(vm.user);
				data.mensagem = vm.mensagem;
				vm.mensagens.$add(data).then(function (data){
					vm.mensagem = '';
					console.log(data);
				});
			}
		}
	};

	$window.onfocus = function () {
		vm.not = 0;
		vm.titleAlert = '';
	};

}]);