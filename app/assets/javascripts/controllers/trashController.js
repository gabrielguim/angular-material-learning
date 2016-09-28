(function () {
	angular.module('ScribeApp')
	.controller('trashController', function ($scope, trash, $mdDialog, $mdToast) {

		$scope.gridHeaderTrash = [
			{ name: 'Nome', icon: 'sort_by_alpha', col: 7 },
			{ name: 'Última Modificação', icon: 'access_time', col: 5 }
		];

		$scope.eoq = [ {
			name: "teste 1",
			updated_at: "12312"
		}, {
			name: "teste 2",
			updated_at: "12312"
		}, {
			name: "teste 3",
			updated_at: "12312"
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

		$scope.deleteItems = function () {
			var _NodesArray = document.getElementById("drive").getElementsByClassName("drive-item");
			var _DataArray = [];

			for (var i = 0; i < _NodesArray.length; i++)
				if (_NodesArray[i].className.indexOf("selected-item") === -1)
					_DataArray.push($scope.eoq[i]);

			$scope.eoq = _DataArray;
		};

	});
})();
