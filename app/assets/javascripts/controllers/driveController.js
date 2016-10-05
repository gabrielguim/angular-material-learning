(function () {
	angular.module('ScribeApp')
	.controller('driveController', function ($scope, $cookies, $timeout, files, $mdDialog, $mdToast, user, httpToolsService) {
		// the user's root folder id, used to make http requests to the server.
		var current_root_folder_id = $cookies.getObject('current_root_folder_id');

		$scope.currentUser = user.getUserData($cookies.getObject('current_user_id')).then(
			function (res) { $scope.currentUser = res.data; },
			function (err) { console.log(err); }
		);

		// sets $scope.contents
		$scope.getChildren = function (current_root_folder_id) {

			files.getChildrenFolders(current_root_folder_id).then(
				function (res) {
					$scope.contents = res.data;
					for (var i = 0; i < $scope.contents.length; i++)
						$scope.contents[i].type = 'folder';

					files.getChildrenFiles(current_root_folder_id).then(
						function (res) {
							var contents = res.data;
							for (var i = 0; i < contents.length; i++)
								contents[i].type = 'file';
							$scope.contents = $scope.contents.concat(contents);
						},
						function (err) { console.log(err); }
					);
				},
				function (err) { console.log(err); }
			);
		};

		// options that will be rendered on the table's header.
		$scope.gridHeaderDrive = [
			{ name: 'Nome', icon: 'sort_by_alpha', col: 5 },
			{ name: 'Última Modificação', icon: 'access_time', col: 5 },
			{ name: 'Ação', icon: 'code', col: 2}
		];

		// sets the current folder id.
		$scope.setCurrentFolderId = function (item) {
			current_root_folder_id = item.id;
		};

		// sets the current folder.
		$scope.setCurrentFolder = function (item) {
			$scope.setCurrentFolderId(item);

			$timeout(function () {
				$scope.currentFolder = files.getRootFolder(current_root_folder_id).then(
					function (res) { $scope.currentFolder = res.data; },
					function (err) { console.log(err); }
				);

				$scope.getChildren(current_root_folder_id);

				$scope.pagination.push(item);

			}, 100);
		};

		$scope.setPagination = function (index) {
			$scope.pagination = $scope.pagination.splice(0, index + 1);
			$scope.setCurrentFolderId($scope.pagination[index].id);
			$scope.currentFolder = $scope.pagination[index];
			$scope.getChildren($scope.currentFolder.id);
		};

		// action() when a file or folder is clicked on the list.
		$scope.fileAction = function (ev, item) {

			if (item.type === 'file'){
				if (item.selected){
					if (item.extension === 'txt' || item.extension === 'md'){
						httpToolsService.redirect('/documents/' + item.id + '/edit/');
						return;
					} else if (item.extension !== 'txt' && item.extension !== 'md') {
						$scope.showCompressContentDialog(ev, item);
					}
				}
			} else {
				if (item.selected){
					$scope.setCurrentFolder(item);
				}
			}

			$scope.singleItem(item);

		};

		// misc function to get the icon based on the file's type.
		$scope.getIcon = function (item) {
			if (item.type === 'file') {
				if (item.extension !== 'txt' && item.extension !== 'md'){
					return 'library_books';
				}	else {
					return 'insert_drive_file';
				}
			} else return 'folder';
		};

		// misc function that determines to show or not the dropdown arrow.
		$scope.showArrow = function (index) {
			return index === $scope.pagination.length - 1;
		};

		// two way data variables.
		$scope.currentFolder = {};
		$scope.contents = [];
		$scope.pagination = [];

		// initalize the variables above by retrieving the data with http
		// requests.
		files.getRootFolder(current_root_folder_id).then(
			function (res) {
				$scope.currentFolder = res.data;
				$scope.pagination.push($scope.currentFolder);

				$scope.getChildren(current_root_folder_id);
			},
			function (err) { console.log(err); }
		);

			$scope.createFolder = function (folderName) {
				var token = $('meta[name=csrf-token]').attr("content");

				var config = {
					authenticity_token: token,
					folder: {
						name: folderName,
						parent_folder_id: $scope.currentFolder.id,
						user_id: $scope.currentUser.id
					}
				};

				httpToolsService.request('POST', '/my-drive', config).then(
					function (res) {
			 			if (res.data.success){
							$timeout(function () {
								update($scope.currentFolder);
							}, 50);
			 			}
			 		},
					function (err) { console.log(err) }
				);

			};

			$scope.createFile = function (fileName) {
				var token = $('meta[name=csrf-token]').attr("content");

				var config = {
					authenticity_token: token,
					file: {
						name: fileName,
						extension: 'txt',
						content: 'Este é seu novo arquivo! Para editá-lo, use o botão direito do mouse ou selecione o texto que deseja alterar :-)',
						folder_id: $scope.currentFolder.id,
						user_id: $scope.currentUser.id
					}
				};

				httpToolsService.request('POST', '/documents', config).then(
					function (res) {
			 			if (res.data.success){
							$timeout(function () {
								update($scope.currentFolder);
							}, 50);
			 			}
			 		},

					function (err) { console.log(err) }
				);
			};

			$scope.renameItem = function(newName, item){
				var token = $('meta[name=csrf-token]').attr("content");
				var name = newName;
				var config;
				var route;

				if (!newName)
					name = item.name;

				if (item.type === 'file') {
					config = {
						authenticity_token: token,
						file: {
							name: name,
							extension: item.extension,
							content: item.content,
							folder_id: item.folder_id,
							user_id: item.user_id
						}
					};
					route = '/documents/' + item.id
				} else {
					config = {
						authenticity_token: token,
						folder: {
							name: name,
							parent_folder_id: item.parent_folder_id,
							user_id: item.user_id
						}
					};
					route = '/my-drive/' + item.id
				}

				httpToolsService.request('PUT', route , config).then(
					function (res) {
			 			if (res.data.success){
							$timeout(function () {
								update($scope.currentFolder);
							}, 50);
			 			}
			 		},
					function (err) { console.log(err) }
				);
			};

			$scope.shareFile = function (shareObject, item) {
				var token = $('meta[name=csrf-token]').attr("content");

				var request_body = {
					authenticity_token: token,
					policy: {
						user_email: shareObject.email,
						document_id: item.id,
						permission: shareObject.permission
					}
				}

				httpToolsService.request('POST', '/policies', request_body).then(
					function(res) {
						console.log(res);
					}, function(err) {
						console.log(err);
					}
				);
			};

			$scope.createFolderDialog = function(ev) {
		    var confirm = $mdDialog.prompt()
		      .title('Nova pasta')
		      .textContent('Criar uma pasta em ' + $scope.currentFolder.name)
		      .placeholder('Nome da pasta')
		      .ariaLabel('Nome da pasta')
		      .targetEvent(ev)
		      .ok('Criar')
		      .cancel('Cancelar');

		    $mdDialog.show(confirm).then(function(result) {
					$scope.createFolder(result);
				}, function() {
					$mdToast.show(
						$mdToast.simple()
							.textContent("Não criou nenhuma pasta em " + $scope.currentFolder.name)
							.position("top right")
							.hideDelay(3000)
					);
		    });
		  };

		$scope.createFileDialog = function(ev) {
			var confirm = $mdDialog.prompt()
				.title('Novo arquivo')
				.textContent('Criar um arquivo em ' + $scope.currentFolder.name)
				.placeholder('Documento sem título')
				.ariaLabel('Documento sem título')
				.targetEvent(ev)
				.ok('Criar')
				.cancel('Cancelar');

			$mdDialog.show(confirm).then(function(result) {
				$scope.createFile(result);
			}, function() {
				$mdToast.show(
		      $mdToast.simple()
		        .textContent('Não criou nenhum arquivo em ' + $scope.currentFolder.name)
		        .position("top right")
		        .hideDelay(3000)
		    );
			});
		};

		$scope.shareFileDialog = function(ev, item) {
			$mdDialog.show({
				controller: DialogController,
				templateUrl: '../directives/shareDialog.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:false,
			})
			.then(function(answer) {
				var texto = "";
				if (answer.email === $scope.currentUser.email){
					texto = "Não é possível compartilhar um arquivo consigo mesmo. :(";
				} else {
					texto = "Arquivo compartilhado com " + answer.email + "! :)";
      		$scope.shareFile(answer, item);
				}
				$mdToast.show(
					$mdToast.simple()
						.textContent(texto)
						.position("top right")
						.hideDelay(3000)
				);
	    }, function() {
				$mdToast.show(
					$mdToast.simple()
						.textContent('Nenhum arquivo foi compartilhado')
						.position("top right")
						.hideDelay(3000)
				);
	    });
		};

		$scope.showCompressContentDialog = function(ev, item) {

			files.setDocumentToShow(item);

			$mdDialog.show({
				controller: DialogShowCompressController,
				templateUrl: '../directives/compressionList.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:false,
			})
			.then(function(answer) {
				$scope.decompressFileDialog(ev, item);
	    }, function() {

	    });
		};


		$scope.compressFileDialog = function(ev, item) {
			$mdDialog.show({
				controller: DialogCompressController,
				templateUrl: '../directives/compressDialog.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:false,
			})
			.then(function(answer) {
				$scope.compressFile(item, answer);
	    }, function() {

	    });
		};

		$scope.compressFile = function (item, answer){
			var token = $('meta[name=csrf-token]').attr("content");
			var lastExtension = answer.type;
			var config = {
				authenticity_token: token,
				file: {
					name: item.name,
					extension: answer.type + '/' + item.extension,
					content: item.content,
					folder_id: $scope.currentFolder.id,
					user_id: $scope.currentUser.id
				}
			};

			httpToolsService.request('POST', '/documents', config).then(
				function (res) {
					if (res.data.success){
						$timeout(function () {
							update($scope.currentFolder);
						}, 50);

						$mdToast.show(
							$mdToast.simple()
								.textContent("O arquivo " + item.name +'.'+ lastExtension + " foi comprimido com sucesso! :)")
								.position("top right")
								.hideDelay(3000)
						);
					}
				},

				function (err) { console.log(err) }
			);

		};

		$scope.decompressFileDialog = function(ev, item) {
			var confirm = $mdDialog.confirm()
				.title('Descompactar Arquivo')
				.textContent('Você realmente deseja descompactar o arquivo ' + item.name +'.'+ item.extension.split('/')[0] + '?')
				.ariaLabel('Descompactar Arquivo')
				.targetEvent(ev)
				.ok('Descompactar')
				.cancel('Cancelar');

			$mdDialog.show(confirm).then(function(result) {
				$scope.decompressFile(item);
			}, function() {

			});
		};


		$scope.decompressFile = function(item){
			var token = $('meta[name=csrf-token]').attr("content");
			var config = {
				authenticity_token: token,
				file: {
					name: item.name,
					extension: item.extension.split('/')[1],
					content: item.content,
					folder_id: $scope.currentFolder.id,
					user_id: $scope.currentUser.id
				}
			};

			httpToolsService.request('POST', '/documents', config).then(
				function (res) {
					if (res.data.success){
						$timeout(function () {
							update($scope.currentFolder);
						}, 50);

						$mdToast.show(
							$mdToast.simple()
								.textContent("O arquivo " + item.name +'.'+ item.extension.split('/')[0] + " foi descompactado com sucesso! :)")
								.position("top right")
								.hideDelay(3000)
						);
					}
				},

				function (err) { console.log(err) }
			);

		};


		$scope.renameItemDialog = function(ev, item) {
			var confirm = $mdDialog.prompt()
				.title('Renomear')
				.textContent(item.name + ' terá seu nome alterado.')
				.placeholder('Insira o novo nome')
				.ariaLabel('Nome do item')
				.targetEvent(ev)
				.ok('Renomear')
				.cancel('Cancelar');

			$mdDialog.show(confirm).then(function(result) {
				$scope.renameItem(result, item);
			}, function() {
				$mdToast.show(
		      $mdToast.simple()
		        .textContent(item.name + ' não foi renomeado(a).')
		        .position("top right")
		        .hideDelay(3000)
		    );
			});
		};

		var update = function (item){
			$scope.getChildren(item.id);
			angular.element($('#trash')).scope().getDeletedFiles();
		};

		$scope.deleteFileDialog = function (ev, file){
			var confirm = $mdDialog.confirm()
				.title('Excluir arquivo')
				.textContent('Você realmente deseja mover o arquivo ' + file.name + "." + file.extension+ ' para a lixeira?')
				.ariaLabel('Excluir Arquivo')
				.targetEvent(ev)
				.ok('Deletar')
				.cancel('Cancelar');

			$mdDialog.show(confirm).then(function() {
				$scope.deleteFile(file);
			}, function() {

			});
		};

		$scope.deleteFile = function(file){

			httpToolsService.request('GET', '/documents/delete/' + file.id + '.json');

			var toast = $mdToast.simple()
				.textContent('Arquivo excluído com sucesso! (' + file.name + "." + file.extension + ')')
				.action('DESFAZER')
				.highlightAction(true)
				.highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
				.position("top right");

			$mdToast.show(toast).then(function(response) {
				if ( response == 'ok' ) {
					httpToolsService.request('GET', '/documents/restore/' + file.id + '.json');

					var toast = $mdToast.simple()
						.textContent('Arquivo restaurado com sucesso! (' + file.name + "." + file.extension +  ')')
						.highlightAction(true)
						.highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
						.position("top right");

					$mdToast.show(toast)

					$timeout(function () {
						update($scope.currentFolder);
					}, 30);

				}
			});

			$timeout(function () {
				update($scope.currentFolder);
			}, 30);

		};

		$scope.singleItem = function(item){
			var allFiles = $scope.contents;
			for (var i = 0; i < allFiles.length; i++) {
				allFiles[i].selected = false;
			}

			item.selected = !item.selected;
		};

		$scope.driveIsEmpty = function (){
			return $scope.contents.length === 0;
		};

		$scope.checkSelectedItems = function(){
			var _NodesArray = document.getElementById("drive").getElementsByClassName("drive-item");
			$scope.selectedItems = [];

			for (var i = 1; i < _NodesArray.length; i++){
				if (_NodesArray[i].getAttribute("class").indexOf("selected-item") > -1){
					$scope.selectedItems.push($scope.contents[i - 1]);
				}
			};

		};

		$scope.moveSelectedItems = function () {

			for (var i = 0; i < $scope.selectedItems.length; i++) {
				var currentItem = $scope.selectedItems[i];
				$scope.deleteFile(currentItem);
			};


			$timeout(function () {
				update($scope.currentFolder);
			}, 30);

		};

	});
})();


function DialogShowCompressController(files, $scope, $mdDialog){

	$scope.file = files.getDocumentToShow();

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

	$scope.answer = function() {
		$mdDialog.hide();
	};
}

function DialogCompressController($scope, $mdDialog){

	$scope.compressionType = "ZIP";

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

	$scope.answer = function() {
		var answer = { type: $scope.compressionType.toLowerCase() };

		if (answer.type === 'gzip'){
			answer.type = 'gz';
		}
		
		$mdDialog.hide(answer);
	};
}

function DialogController($scope, $mdDialog) {

		$scope.checked = false;

		$scope.validateFields = function() {
			return $("#friend-email").val() === "";
		};

		$scope.clickCheckBox = function() {
			$scope.checked = !$scope.checked;
		};

    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function() {
			if ($scope.checked) {
				$scope.checked = 'rw';
			} else {
				$scope.checked = 'r';
			}

			var answer = { email: $('#friend-email').val(), permission: $scope.checked };
      $mdDialog.hide(answer);
    };
}
