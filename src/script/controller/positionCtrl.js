'use strict';
angular.module('app').controller('positionCtrl', ['$log', '$q', '$http', '$state', '$scope', 'cache', function($log, $q, $http, $state, $scope, cache){
	cache.remove('to', 'd');
  $scope.isLogin = !!cache.get('name');
  $scope.message = $scope.isLogin?'投个简历':'去登录';
  function getPosition() {
    var def = $q.defer();
    $http.get('data/position.json', {
      params: {
        id: $state.params.id
      }
    }).success(function(resp) {
      angular.forEach(resp, function(item) {
        if(item.id === $state.params.id) {
          $scope.position = item;
          if(item.posted) {
            $scope.message = '已投递';
          }
          def.resolve(item);
        }
      });
    }).error(function(err) {
      def.reject(err);
    });
    return def.promise;
  }
  function getCompany(id) {
    $http.get('data/company.json?id='+id).success(function(resp){
      angular.forEach(resp, function(item) {
        if(item.id === id) {
          $scope.company = item;
        }
      });
    });
  }
  getPosition().then(function(obj){
    getCompany(obj.companyId);
  });
  $scope.go = function() {
    if($scope.message !== '已投递') {
      if($scope.isLogin) {
        $http.post('data/handle.json', {
          params: {
            id: $scope.position.id
          }
        }).success(function(resp) {
          $log.info(resp);
          $scope.message = '已投递';
        });
      } else {
        $state.go('login');
      }
    }
  }
}]);
