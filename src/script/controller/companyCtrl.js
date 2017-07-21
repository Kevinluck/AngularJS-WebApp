'use strict';
angular.module('app').controller('companyCtrl', ['$http', '$state', '$scope', function($http, $state, $scope){
  $http.get('data/company.json?id='+$state.params.id).success(function(resp){
  	angular.forEach(resp, function(item) {
  		if(item.id === $state.params.id) {
  			$scope.company = item;
  		}
  	});
  });
}]);
