/*==========================================================
 Author      : Wang Zulong
 Date Created: 13 Jan 2016
 Description : Controller to handle Home page
 Change Log
 s.no      date    author     description


 ===========================================================*/

dashboard.controller("NetworkController", ['$rootScope', '$scope', '$state', '$location', '$q', 'dashboardService', 'Flash', 'apiService', '$timeout',
    function ($rootScope, $scope, $state, $location, $q, dashboardService, Flash, apiService, $timeout) {
        var vm = this;

        $scope.getPeersData = function () {
            apiService.get("/network/peers").then(function (response) {
                $scope.peersData = response;

                var count = $scope.peersData.peers.length;
                $timeout(function(){
                    var canvas = document.getElementById('canvas');
                    var stage = new JTopo.Stage(canvas);
                    stage.eagleEye.visible = false;

                    //显示工具栏
                    var scene = new JTopo.Scene(stage);
                    scene.background = 'img/bg.jpg';

                    var n = 0;
                    var nodes = [];
                    for(var i=0; i<count/2; i++){
                        for(var j=0; j<count/2; j++){
                            var name = $scope.peersData.peers[n++].ID.name;
                            var Node = new JTopo.Node(name);

                            Node.fillColor = '0, 0, 255';
                            Node.setLocation(450 + j*140, 100 + i* 140);
                            Node.setImage('img/host.png', true);
                            Node.textPosition = 'Bottom_Center';
                            scene.add(Node);
                            nodes.push(Node);
                        }
                    }

                    if(n != count) {
                        var name = $scope.peersData.peers[n++].ID.name;
                        var Node = new JTopo.Node(name);

                        Node.fillColor = '0, 0, 255';
                        Node.setLocation(450 + count/2 * 140, 100 + count/2 * 140);
                        Node.setImage('img/host.png', true);
                        Node.textPosition = 'Bottom_Center';
                        scene.add(Node);
                        nodes.push(Node);
                    }

                    for (var i=0; i < count; i++) {
                        for (var j=i + 1; j< count; j++) {
                            var link = $scope.addLink(nodes[i], nodes[j]);
                            scene.add(link);
                        }
                    }
                    
                });

            },function (error) {
                console.log(error)
            });
        };

        $scope.addLink = function (nodeFrom, nodeTo) {
            var link = new JTopo.Link(nodeFrom, nodeTo);
            link.lineWidth = 3; // 线宽
            link.bundleOffset = 60; // 折线拐角处的长度
            link.bundleGap = 20; // 线条之间的间隔
            link.textOffsetY = 3; // 文本偏移量（向下3个像素）
            link.strokeColor = '0,200,255';
            return link;
        }

        $scope.getPeersData();


    }]);

