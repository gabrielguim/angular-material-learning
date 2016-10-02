(function () {
	angular.module('ScribeApp').controller('editorController', function ($scope, $cookies, $timeout, $sce, $mdToast, $mdDialog, httpToolsService) {

		var currentUserID = $cookies.getObject('current_user_id');
		var pathName = window.location.pathname;


		$scope.document_id = pathName.split('/')[2];

		var isDocumentShared = function(file) {
			return file.user_id !== currentUserID;
		};

    httpToolsService.request('GET', '/documents/' + $scope.document_id + '.json', '').then(
			function (res) {
				$timeout(function () {
					var currentDocument = res.data;

					$scope.editDocument = currentDocument[0];
					$scope.fileContent = $sce.trustAsHtml(res.data[0].content);

				}, 50);

				// if current document is shared, verify current user's permission to that file
				if (isDocumentShared(res.data[0])) {
					httpToolsService.request('GET', '/policies/document/' + $scope.document_id + '.json', '').then(
						function (res) {

							var documentPolicy = res.data[0];
							$scope.viewOnly = (documentPolicy.permission === 'r');

							if ($scope.viewOnly) {
								tinymce.activeEditor.setMode('readonly');
							}
						},

						function (err) { console.log(err); }
					)
				};

			},

			function (err) { console.log(err); }
		);

		$scope.returnToDrive = function () {
			httpToolsService.redirect('/my-drive');
		}

		$scope.changeFileExtension = function (extension) {
			$scope.editDocument.extension = extension;

			$mdToast.show(
				$mdToast.simple()
					.textContent('Extensão alterada para .' + extension)
					.position('bottom left')
					.hideDelay(3000)
			);
		};

		$scope.saveDocument = function () {
      var token = $('meta[name=csrf-token]').attr("content");

			var fileContent = $('#file-content').html();
			if ($scope.editDocument.extension === 'txt') {
				fileContent = $('#file-content').text();
			}

      var config = {
        authenticity_token: token,
        file: {
          name: $scope.editDocument.name,
          extension: $scope.editDocument.extension,
          content: fileContent
        }
      };

      httpToolsService.request('PUT', '/documents/' + $scope.document_id, config).then(
        function (res) {
					if (res.data.success) {
						$mdToast.show(
							$mdToast.simple()
								.textContent('Seu arquivo ' + $scope.editDocument.name + '.' + $scope.editDocument.extension + ' foi salvo com sucesso! :)')
								.position('bottom left')
								.hideDelay(5000)
						);
					}
          console.log(res);
        },
        function (err) { console.log(err); }
      );
		};

	});
})();
