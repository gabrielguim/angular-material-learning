(function () {
	angular.module('ScribeApp')
	.controller('trashController', function ($scope, $cookies, $mdDialog, $mdToast, $timeout, httpToolsService) {
		var currentUserID = $cookies.getObject('current_user_id');

		$scope.gridHeaderTrash = [
			{ name: 'Nome', icon: 'sort_by_alpha', col: 6 },
			{ name: 'Última Modificação', icon: 'access_time', col: 5 },
      { name: 'Ação', icon: 'code', col: 1}
		];

		$scope.deletedFiles = [];

    httpToolsService.request('GET', '/documents/trash/' + currentUserID + '.json').then(
      function success(res) {
        $scope.deletedFiles = res.data;
      },

      function error(err) {
        console.log(err);
      }
    );

		$scope.getDeletedFiles = function (){
      httpToolsService.request('GET', '/documents/trash/' + currentUserID + '.json').then(
  			function success(res) {
					$timeout(function () {
							$scope.deletedFiles = res.data;
					}, 10);

  			},

  			function error(err) {
  				console.log(err);
  			}
  		);
    };

    $scope.restoreFileDialog = function(ev, item){
      var confirm = $mdDialog.confirm()
        .title('Restaurar arquivo')
        .textContent('Você realmente restaurar arquivo ' + item.name + "." + item.extension + '?')
        .ariaLabel('Restaurar Arquivo')
        .targetEvent(ev)
        .ok('Restaurar')
        .cancel('Cancelar');

      $mdDialog.show(confirm).then(function() {
        $scope.restoreFile(item);
      }, function() {

      });
    };

    $scope.restoreFile = function(item){
      httpToolsService.request('GET', '/documents/delete-or-restore/' + item.id + '.json');

      var toast = $mdToast.simple()
        .textContent('Arquivo restaurado com sucesso! (' + item.name + "." + item.extension + ')')
        .highlightAction(true)
        .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
        .position("top right");

      $mdToast.show(toast);

			$timeout(function () {
				updateTrash();
			}, 20);

    };

    var updateTrash = function (){
			$scope.getDeletedFiles();
			$scope.getChildren($scope.pagination.length);
    };

    // $scope.deleteItems = function(content){
    //   if (content.length === 1){
    //     httpToolsService.request('GET', '/documents/delete-or-restore/' + item.id + '.json');
    //   } else {
    //
    //   }
    // }


		$scope.deleteSelectedItems = function () {
			var _NodesArray = document.getElementById("trash").getElementsByClassName("drive-item");
			var _DataArray = [];

			for (var i = 0; i < _NodesArray.length - 1; i++)
				if (_NodesArray[i].className.indexOf("selected-item") !== -1)
					_DataArray.push($scope.deletedFiles[i]);

      console.log(_DataArray);
		};

		$scope.trashIsEmpty = function (){
			return $scope.deletedFiles.length === 0;
		};

	});
})();
