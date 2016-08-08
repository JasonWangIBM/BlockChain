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
                var avd = 360/count;
                if (count%2 == 0) {
                    avd = 360/(count+1);
                }
                var ahd = (avd)*Math.PI/180;
                var radius = 120;
                $timeout(function(){
                    var canvas = document.getElementById('canvas');
                    var stage = new JTopo.Stage(canvas);
                    stage.eagleEye.visible = false;

                    //显示工具栏
                    var scene = new JTopo.Scene(stage);
                    scene.background = 'img/bg.jpg';

                    var n = 0;
                    var nodes = [];
                    for(var i=0; i<count; i++){
                            var name = $scope.peersData.peers[i].ID.name;
                            var Node = new JTopo.Node(name);

                            Node.fillColor = '0, 0, 255';
                            // Node.setLocation(450 + j*140, 100 + i* 140);
                            // if (i==0) {
                            //     Node.setLocation(350, 80);
                            // } else if (i==1) {
                            //     Node.setLocation(750, 80);
                            // } else if (i==2) {
                            //     Node.setLocation(450, 240);
                            // } else if (i==3) {
                            //     Node.setLocation(650, 240);
                            // }

                            Node.setLocation(Math.sin((ahd*i))*radius + 550, Math.cos((ahd*i))*radius + 130);
                            Node.setImage('img/host.png', true);
                            Node.textPosition = 'Bottom_Center';
                            scene.add(Node);
                            nodes.push(Node);
                    }

                    var MemberServiceNode = new JTopo.Node('Member Service');
                    MemberServiceNode.fillColor = '0, 0, 255';
                    MemberServiceNode.setLocation(550, 130);
                    MemberServiceNode.setImage('img/host.png', true);
                    MemberServiceNode.textPosition = 'Bottom_Center';
                    scene.add(MemberServiceNode);


                    for (var i=0; i < count; i++) {
                        var memberServiceLink = $scope.addLink(MemberServiceNode, nodes[i]);
                        scene.add(memberServiceLink);
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

