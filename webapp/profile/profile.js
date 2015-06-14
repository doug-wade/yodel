angular.module('profile',[
]).controller('ProfileCtrl', [
    '$scope',
    function($scope) {
        function initialize() {
            $scope.user = {
                name: 'Ivan Melyakov',
                nickname: 'Big Brother',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
            };

            $scope.portfolios = [
                {
                    imageUrl: 'images/jon-snow.jpg',
                    title: 'Spring Collection',
                    caption: 'Flowers, trees, and bees'
                },
                {
                    imageUrl: 'images/sansa.jpg',
                    title: 'Winter Collection',
                    caption: 'Hot cocoa and snow angels'
                },
                {
                    imageUrl: 'images/tyrion.jpg',
                    title: 'Sounds of Seattle',
                    caption: 'There ain\'t no riot here...'
                }
            ];
        }

        initialize();
    }
]);
