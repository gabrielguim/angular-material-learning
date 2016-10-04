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
        .textContent('Você realmente deseja restaurar o arquivo ' + item.name + "." + item.extension + '?')
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
      httpToolsService.request('GET', '/documents/restore/' + item.id + '.json');

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

		$scope.deletePermanentDialog = function (ev, item){

			var confirm = $mdDialog.confirm()
				.title('Excluir arquivo')
				.textContent('Você realmente deseja excluir o arquivo ' + item.name + "." + item.extension + ' permanentemente?')
				.ariaLabel('Excluir Arquivo')
				.targetEvent(ev)
				.ok('Excluir')
				.cancel('Cancelar');

			$mdDialog.show(confirm).then(function() {
				$scope.deletePermanent(item);

				var toast = $mdToast.simple()
					.textContent("Arquivo deletado com sucesso!")
					.highlightAction(true)
					.highlightClass('md-accent')
					.position("top right");

				$mdToast.show(toast);

				$timeout(function () {
					updateTrash();
				}, 20);
			}, function() {

			});
		};

    // $scope.deleteItems = function(content){
    //   if (content.length === 1){
    //     httpToolsService.request('GET', '/documents/delete-or-restore/' + item.id + '.json');
    //   } else {
    //
    //   }
    // }

		$scope.deletePermanent = function(item){
			httpToolsService.request('DELETE', '/documents/' + item.id).then(
				function success(res) {},

				function error(err) {}
			);
		};

		$scope.deleteAllFilesDialog = function(ev){

			var confirm = $mdDialog.confirm()
				.title('Esvaziar a lixeira')
				.textContent('Você realmente deseja esvaziar a lixeira?')
				.ariaLabel('Esvaziar a lixeira')
				.targetEvent(ev)
				.ok('Esvaziar')
				.cancel('Cancelar');

			$mdDialog.show(confirm).then(function() {
				$scope.deleteAllFiles();

				var toast = $mdToast.simple()
					.textContent("Lixeira esvaziada com sucesso!")
					.highlightAction(true)
					.highlightClass('md-accent')
					.position("top right");

				$mdToast.show(toast);

			}, function() {

			});

		};

		$scope.deleteAllFiles = function(){
			for (var i = 0; i < $scope.deletedFiles.length; i++) {
				var currentFile = $scope.deletedFiles[i];
				$scope.deletePermanent(currentFile);

			};

			$timeout(function () {
				updateTrash();
			}, 10);
		};

		$scope.checkSelectedItemsInTrash = function(){
			var _NodesArray = document.getElementById("trash").getElementsByClassName("drive-item");
			$scope.selectedItems = [];

			for (var i = 1; i < _NodesArray.length; i++){
				if (_NodesArray[i].getAttribute("class").indexOf("selected-item") > -1){
					$scope.selectedItems.push($scope.deletedFiles[i - 1]);
				}
			};

		};

		$scope.restoreSelectedItems = function () {
			for (var i = 0; i < $scope.selectedItems.length; i++) {
				var currentItem = $scope.selectedItems[i];
				$scope.restoreFile(currentItem);
			};

			var toast = $mdToast.simple()
				.textContent('Arquivos restaurados com sucesso!')
				.highlightAction(true)
				.highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
				.position("top right");

			$mdToast.show(toast);

			$timeout(function () {
				updateTrash();
			}, 50);

		};


		$scope.deleteSelectedItems = function () {
			for (var i = 0; i < $scope.selectedItems.length; i++) {
				var currentItem = $scope.selectedItems[i];
				$scope.deletePermanent(currentItem);
			};

			var toast = $mdToast.simple()
				.textContent('Arquivos excluídos permanentemente!')
				.highlightAction(true)
				.highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
				.position("top right");

			$mdToast.show(toast);

			$timeout(function () {
				updateTrash();
			}, 50);

		};

		$scope.trashIsEmpty = function (){
			return $scope.deletedFiles.length === 0;
		};

	});
})();
