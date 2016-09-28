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

	});
})();
