/*==========================================================
 Author      : Wang Zulong
 Date Created: 13 Jan 2016
 Description : Controller to handle Home page
 Change Log
 s.no      date    author     description


 ===========================================================*/

dashboard.controller("LiveLogsController", ['$rootScope', '$scope', '$state', '$location', 'dashboardService', 'Flash','$timeout',
    function ($rootScope, $scope, $state, $location, dashboardService, Flash, $timeout) {
        var vm = this;

        vm.showDetails = true;
        vm.home = {};

        vm.home.mainData = [
            {
                title: "Peer1",
                value: "30+",
                theme: "aqua",
                icon: "puzzle-piece"
            },
            {
                title: "Peer2",
                value: "250+",
                theme: "red",
                icon: "paint-brush"
            },
            {
                title: "Peer3",
                value: "50+",
                theme: "green",
                icon: "trophy"
            },
            {
                title: "Peer4",
                value: "0",
                theme: "yellow",
                icon: "glass"
            },
        ];

        $timeout(function(){
            var websocket = new WebSocket('ws://localhost:8080/log');
            websocket.onmessage = function(event) {
                // 接收服务端的实时日志并添加到HTML页面中
                $("#logText div").append(event.data);
                // 滚动条滚动到最低部
                $("#logText").scrollTop($("#logText div").height() - $("#logText").height());
            };
        }, 100);

    }]);

