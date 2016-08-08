/*==========================================================
    Author      : Wang Zulong
    Date Created: 24 Dec 2015
    Description : Base for Dashboard Application module
    
    Change Log
    s.no      date    author     description     
    

 ===========================================================*/

var dashboard = angular.module('dashboard', ['ui.router', 'ngAnimate','ngMaterial']);


dashboard.config(["$stateProvider", function ($stateProvider) {

    $stateProvider.state('app.network', {
        url: '/network',
        templateUrl: 'app/modules/dashboard/views/network.html',
        controller: 'NetworkController',
        controllerAs: 'vm',
        data: {
            pageTitle: 'Network'
        }
    });

    $stateProvider.state('app.liveLogs', {
        url: '/liveLogs',
        templateUrl: 'app/modules/dashboard/views/liveLogs.html',
        controller: 'LiveLogsController',
        controllerAs: 'vm',
        data: {
            pageTitle: 'Live Logs'
        }
    });

    $stateProvider.state('app.blockchain', {
        url: '/blockchain',
        templateUrl: 'app/modules/dashboard/views/blockchain.html',
        controller: 'BlockchainController',
        controllerAs: 'vm',
        data: {
            pageTitle: 'Blockchain'
        }
    });
    
}]);

