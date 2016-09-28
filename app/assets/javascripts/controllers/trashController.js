(function () {
	angular.module('ScribeApp')
	.controller('trashController', function ($scope, trash, $cookies, $mdDialog, $mdToast, httpToolsService) {
		var currentUserID = $cookies.getObject('current_user_id');

		$scope.gridHeaderTrash = [
			{ name: 'Nome', icon: 'sort_by_alpha', col: 7 },
			{ name: 'Última Modificação', icon: 'access_time', col: 5 }
		];

		httpToolsService.request('GET', '/documents/trash/' + currentUserID + '.json').then(
			function success(res) {
				$scope.deletedFiles = res.data;
			},

			function error(err) {
				console.log(err);
			}
		);

	    $scope.setPropertyTrash = function(){
	      var deletedItems = $scope.getDeletedFiles();
	      for (var i = 0; i < deletedItems.length; i++) {
	        deletedItems[i].selected = false;
	      }
	    };

		$scope.getDeletedFiles = function () {
      return $scope.deletedFiles;
		};

		$scope.deleteItems = function () {
			var _NodesArray = document.getElementById("drive").getElementsByClassName("drive-item");
			var _DataArray = [];

			for (var i = 0; i < _NodesArray.length; i++)
				if (_NodesArray[i].className.indexOf("selected-item") === -1)
					_DataArray.push($scope.deletedFiles[i]);

			$scope.deletedFiles = _DataArray;
		};

	});
})();
