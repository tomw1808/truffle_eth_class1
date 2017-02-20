

var app = angular.module("mySimpleWalletDapp");

app.controller("MainController", function ($scope) {
    SimpleWallet.deployed().then(function(contract) {
        $scope.balanceInEther = web3.fromWei(web3.eth.getBalance(contract.address).toNumber(), "ether");

        $scope.contract_address = contract.address;
        $scope.contract_abi = JSON.stringify(contract.contract.abi);

        $scope.accounts = [];
        angular.forEach(web3.eth.accounts, function(obj) {
            contract.isAllowedToSend.call(obj).then(function(isAllowed) {
                $scope.accounts.push({address: obj, isAllowed:isAllowed});
                $scope.$apply();
            })
        });
    });


});