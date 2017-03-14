"use strict";
var app = angular.module("mySimpleWalletDapp");


app.controller("ShoweventsController", function($scope) {

    $scope.ourEvents = [];
    $scope.ourDepositEvents = [];
    $scope.withdrawls = [];

    SimpleWallet.deployed().then(function(myContract) {

        var events = myContract.allEvents({fromBlock: 0, toBlock: 'latest'});

        events.watch(function(error, result) {

            $scope.ourEvents.push(result);
            $scope.$apply();
        });

        var depositEvents = myContract.Deposit(null, {fromBlock: 0, toBlock: 'latest'}, function(error, result) {
            $scope.ourDepositEvents.push(result);
            $scope.$apply();
        });

        $scope.$on('$destroy', function() {
            events.stopWatching();
            depositEvents.stopWatching();
        });

        myContract.getAmountOfWithdrawls.call(web3.eth.accounts[0]).then(function(result) {
            var numberOfWithdrawls = result.toNumber();
            for(var i = 1; i <= numberOfWithdrawls; i++) {
                myContract.getWithdrawlForAddress.call(web3.eth.accounts[0], i).then(function(result_withdrawl) {
                    result_withdrawl[1] = web3.fromWei(result_withdrawl[1], "ether").toNumber();
                    $scope.withdrawls.push(result_withdrawl);
                    $scope.$apply();
                });
            }

            return this;
        });

    });



});