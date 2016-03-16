angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, $location, $rootScope) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};


  //informação se esta logado
  $scope.logado = false;

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    if($rootScope.logado){
	$location.path('/app/usuario');
    }
    else
    	$scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
	var dados = {usuario: {rga: $scope.loginData.rga, senha: $scope.loginData.senha}};
        $http({
  	method: 'POST',
    	url: 'http://carlos-note:3000/login',
   	data: dados
  }).success(function(res) {
  	$scope.modal.hide()
	$rootScope.logado = true;
	$location.path('/app/usuario');


  }).error(function(res) {
	alert('n logou')
  });	
  };
})

.controller('HomeCtrl', function($scope) {
	
})
.controller('UsuarioCtrl', function($scope, $location, $rootScope){
	$scope.sair = function(){
		$rootScope.logado = false;
		$location.path('/app/home');		
  	};
});
