(function () {
	angular.module('ScribeApp')
	.controller('shareController', function ($scope, $cookies, $timeout, share, httpToolsService) {
		var current_user_id = $cookies.getObject('current_user_id');

		share.getSharedFiles(current_user_id).then(
			function (res) {
				for (var i = 0; i < res.data.length; i++) {
					var currentFilePermission = res.data[i].permission;

					if (currentFilePermission === 'rw') {
						res.data[i].permission = 'Editar';
					} else {
						res.data[i].permission = 'Visualizar';
					}
				}

				$scope.sharedContents = res.data;
			},

			function (err) {
				console.log(err);
			}
		);

		$scope.openDocument = function(document) {
			httpToolsService.redirect('/documents/' + document.id + '/edit/');
		};

		$scope.getPermission = function(item) {
			if (item.permission === 'Editar')
				return 'edit';
			else
				return 'remove_red_eye';
		};

		$scope.gridHeaderShare = [
			{ name: 'Nome', icon: 'sort_by_alpha', col: 6 },
			{ name: 'Proprietário', icon: 'person', col: 3 },
			{ name: 'Última Modificação', icon: 'access_time', col: 2 },
			{ name: 'Permissões', icon: 'info_outline', col: 1 }
		];
		
	});
})();
