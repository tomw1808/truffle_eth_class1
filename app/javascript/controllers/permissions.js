

var app = angular.module("mySimpleWalletDapp");

app.controller("PermissionsController", function ($scope) {
    SimpleWallet.deployed().then(function(contract) {
        $scope.loading = false;
        $scope.success = false;
        $scope.error = false;

        $scope.changePermission = function(address, allowDisallow) {
            console.log(address);
            $scope.loading = true;
            $scope.success = false;
            $scope.error = false;
            if(allowDisallow == 'allow') {
                contract.allowAddressToSendMoney(address, {from: web3.eth.accounts[0]}).then(function() {
                    $scope.loading = false;
                    $scope.success = true;
                    $scope.$apply();
                }).catch(function(error) {
                    console.error(error);
                    $scope.loading = false;
                    $scope.error = error.message;
                    $scope.$apply();
                });
            } else {
                contract.disallowAddressToSendMoney(address, {from: web3.eth.accounts[0]}).then(function() {
                    $scope.loading = false;
                    $scope.success = true;
                    $scope.$apply();
                }).catch(function(error) {
                    console.error(error);
                    $scope.loading = false;
                    $scope.error = error.message;
                    $scope.$apply();
                });
            }
        }
    });


});