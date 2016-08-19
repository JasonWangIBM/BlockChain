/*==========================================================
 Author      : Wang Zulong
 Date Created: 13 Jan 2016
 Description : Controller to handle Home page
 Change Log
 s.no      date    author     description


 ===========================================================*/

dashboard.controller("LiveLogsController", ['$rootScope', '$scope', '$state', '$location', 'dashboardService', 'Flash', 'apiService', '$timeout','appSettings', '$http',
    function ($rootScope, $scope, $state, $location, dashboardService, Flash, apiService, $timeout, appSettings, $http) {
        var vm = this;

        $scope.peerNames = [
            {value: 'ca', selectedFlag: true}
        ];
        $scope.getPeersData = function () {
            apiService.get("/network/peers").then(function (response) {
                $scope.peersData = response;
                for (var i=0; i < $scope.peersData.peers.length; i++) {
                    var peerName = {
                        value : $scope.peersData.peers[i].ID.name,
                        selectedFlag: false
                    }
                    $scope.peerNames.push(peerName)
                }
            },function (error) {
                console.log(error)
            });
        };

        $scope.selectPeer = function (obj) {
            angular.forEach($scope.peerNames,function(peerName){
                peerName.selectedFlag=false;
            })
            obj.selectedFlag = !obj.selectedFlag
            var wslink = appSettings.logapiBase+ obj.value;

            $http({
                method : 'GET',
                url : wslink
            }).success(function(response) {
                var responseArray = response.split('\n');
                // 接收服务端的实时日志并添加到HTML页面中
                $("#logText div").html('');
                for (var i = 0; i< responseArray.length; i++) {
                    $("#logText div").append(responseArray[i]+'<br/>');
                }
                // 滚动条滚动到最低部
                $("#logText").scrollTop($("#logText div").height() - $("#logText").height());
            }).error(function(error) {
                console.log("websocekt error");
            })
        }

        $scope.getPeersData();

        $timeout(function(){
            var wslink = appSettings.logapiBase+ 'ca';
            $http({
                method : 'GET',
                url : wslink
            }).success(function(response) {
                var responseArray = response.split('\n');
                // 接收服务端的实时日志并添加到HTML页面中
                for (var i = 0; i< responseArray.length; i++) {
                    $("#logText div").append(responseArray[i]+'<br/>');
                }
                // 滚动条滚动到最低部
                $("#logText").scrollTop($("#logText div").height() - $("#logText").height());
            }).error(function(error) {
                console.log("websocekt error");
            })
        }, 100);

    }]);

