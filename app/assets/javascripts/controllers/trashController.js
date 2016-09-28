(function () {
	angular.module('ScribeApp')
	.controller('trashController', function ($scope, trash, $mdDialog, $mdToast) {

		$scope.gridHeaderTrash = [
			{ name: 'Nome', icon: 'sort_by_alpha', col: 7 },
			{ name: 'Última Modificação', icon: 'access_time', col: 5 }
		];

		$scope.eoq = [ {
			name: "teste 1",
			updated_at: "12312",
		}, {
			name: "teste 2",
			updated_at: "12312",
		}, {
			name: "teste 3",
			updated_at: "12312",
		}];

	    $scope.setPropertyTrash = function(){
	      var deletedItems = $scope.getDeletedFiles();
	      for (var i = 0; i < deletedItems.length; i++) {
	        deletedItems[i].selected = false;
	      }
	    };

		$scope.getDeletedFiles = function () {
	      return $scope.eoq;
		};

		$scope.selectedItems = [];

		$scope.pushItem = function (elem) {
			console.log($scope.selectedItems);
			$scope.selectedItems.push(elem);
		};

	});
})();
