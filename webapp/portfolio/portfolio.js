function PortfolioCtrl($http, $ionicActionSheet, $ionicModal, $q, $rootScope, $scope, $stateParams, $log) {
    function addItemToPortfolio(form, params, file, username, portfolio, existingItems) {
        // TODO there is a bug: client-side form validation isn't presented to user if a file upload is not provided
        if (form && form.$valid) {
            var options = {
                headers: { 'Content-Type': undefined },
                transformRequest: function(data) {
                    var formData = new FormData();
                    formData.append('createParams', angular.toJson(data.createParams));
                    if (data.file) {
                        formData.append('file', data.file);
                    }
                    return formData;
                }
            };

            $http.post('/user/' + username + '/portfolio/' + portfolio + '/item', { createParams: params, file: file }, options).then(
                function(response) {
                    if (response.data) {
                        existingItems.unshift(response.data);
                    }
                    $scope.addItemModal.hide();
                },
                function(response) {
                    console.log('unable to add item to portfolio', response);
                    $scope.showValidation = true;
                });
        } else {
            $scope.showValidation = true;
        }
    }

    function fileNameChanged(element) {
        $scope.file = element.files[0];
        $scope.$apply();
    }

    function getPortfolioItems(username, portfolio, existingItems, nextToken) {
        // TODO there is a bug where if a user adds a new item it gets put at the front of the existingItems list but then the user can scroll down and end up loading the item again (thus seeing it twice)
        $scope.portfolioHasMoreItems = false;
        $http.get('/user/' + username + '/portfolio/' + portfolio + '/nextToken/' + nextToken).then(
            function(response) {
                $scope.nextToken = null;
                if (response.data.items && response.data.items.length > 0) {
                    existingItems.push(response.data.items);
                    $scope.offset += response.data.items.length;
                    $scope.nextToken = response.data.nextToken;
                    $scope.portfolioHasMoreItems = !!response.data.nextToken;
                }
            },
            function(response) {
                console.log('unable to retrieve items from portfolio', response);
            }).finally(function() {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
    }

    function deleteItemFromPortfolio(/* String */ username, /* Object */ item, /* String */ portfolio) {
        var hideSheet = $ionicActionSheet.show({
            destructiveText: 'Delete',
            titleText: 'Are you sure you want to remove "' + item.caption + '" from the portfolio?',
            cancelText: 'Cancel',
            cancel: function() {
                hideSheet();
            },
            destructiveButtonClicked: function(index) {
                // TODO make rest call to remove item from portfolio

                $http.delete('/user/' + username + '/portfolio/' + portfolio + '/item/' + item.itemId).then(
                    function(response) {
                        $scope.portfolioItems.splice(index, 1);
                        $log.info('deletesd irem: ', response);
                        hideSheet();
                    },
                    function(response) {
                        $log.info('unable to delete item from portfolio', response);
                    }
                );
            }
        });
    }

    function initialize() {
        $scope.username = $stateParams.username;
        $scope.portfolioItems = [];
        $scope.portfolio = $stateParams.portfolio;
        $scope.isOwner = $rootScope.username === $stateParams.username;
        $scope.deleteItemFromPortfolio = deleteItemFromPortfolio;
        $scope.portfolioHasMoreItems = true;
        $scope.getPortfolioItems = getPortfolioItems;
        $scope.showValidation = false;
        $scope.fileNameChanged = fileNameChanged;

        $ionicModal.fromTemplateUrl('/partials/portfolio/add-item/add-item.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.addItemModal = modal;
        });
        $scope.openAddItemModal = function() {
            $scope.addItemModal.show();
        };

        $scope.cancelAddItemModal = function() {
            $scope.addItemModal.hide();
        };

        $scope.$on('$destroy', function() {
            $scope.addItemModal.remove();
        });

        $scope.addItemToPortfolio = addItemToPortfolio;

        getPortfolioItems($stateParams.username, $stateParams.portfolio, $scope.portfolioItems, null);
    }

    initialize();
}

angular.module('portfolio', ['create-portfolio']).controller('PortfolioCtrl', ['$http', '$ionicActionSheet',
  '$ionicModal', '$q', '$rootScope', '$scope', '$stateParams', '$log', PortfolioCtrl]);
