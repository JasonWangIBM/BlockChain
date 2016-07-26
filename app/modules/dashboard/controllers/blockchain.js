/*==========================================================
 Author      : Wang Zulong
 Date Created: 13 Jan 2016
 Description : Controller to handle Recent Projects page
 Change Log
 s.no      date    author     description


 ===========================================================*/

dashboard.controller("BlockchainController", ['$rootScope', '$scope', '$state', '$location', 'dashboardService', 'Flash', 'apiService',
    function ($rootScope, $scope, $state, $location, dashboardService, Flash, apiService) {
        var TYPE_DEPLOY = 1;
        var TYPE_INVOKE = 2;
        var TYPE_QUERY = 3;								//i don't think this is in use yet 5/9/2016
        var TYPE_TERMINATE = 4;							//^^ nor this one

        var vm = this;
        vm.home = {};

        vm.home.mainData = [
            {
                title: "blks/hour",
                value: "5",
                theme: "yellow",
                icon: "cubes"
            },
            {
                title: "Deployments",
                value: "2",
                theme: "green",
                icon: "file"
            },
            {
                title: "Invocations",
                value: "3",
                theme: "aqua",
                icon: "arrow-right"
            },
        ];

        $scope.blocks = [

        ];

        $scope.transactions = [

        ];

        $scope.getchainData = function () {
            apiService.get("/chain").then(function (response) {
                $scope.chainData = response;
                var height = $scope.chainData.height -1
                for (var i=height; i >=0; i--) {
                    var block = {
                        value: i,
                        selectedFlag: false
                    }
                    if (i == height) {
                        block.selectedFlag = true
                    }
                    $scope.blocks.push(block)
                }
                $scope.getTransactions(height);
                console.log(response);
            }, function (error) {
                console.log(error);
            });
        };

        $scope.selectBlock = function (obj) {
            angular.forEach($scope.blocks,function(block){
                block.selectedFlag=false;
            })
            obj.selectedFlag = !obj.selectedFlag
            $scope.transactions = []
            $scope.getTransactions(obj.value)
        }

        $scope.getTransactions = function (blockId) {
            apiService.get("/chain/blocks/"+ blockId).then(function (response) {
                $scope.transactions = response.transactions;

                for (var i = 0; i < $scope.transactions.length; i++) {
                    var ccid = atob($scope.transactions[i].chaincodeID);
                    var payload = atob($scope.transactions[i].payload);
                    var pos = payload.indexOf(ccid);
                    var uuid = $scope.transactions[i].uuid;
                    var encrypted = false;
                    if(pos === -1) encrypted = true;
                    if(encrypted){																	//payload is encrypted or malformed, either way leave it
                        payload = '(encrypted) ' + $scope.transactions[i].payload;	//assume encrypted...
                        ccid = '(encrypted) ' + $scope.transactions[i].chaincodeID;
                    }
                    else{
                        payload = payload.substring(pos + ccid.length + 2);
                    }
                    if($scope.transactions[i].type == TYPE_DEPLOY) {					//if its a deploy, switch uuid and ccid for some unkown reason
                        uuid = 'n/a';
                        if(!encrypted) ccid = $scope.transactions[i].uuid;
                    }
                    if(!encrypted) ccid = ccid.substring(0, 12) + '...';

                    $scope.transactions[i].type = $scope.type2word($scope.transactions[i].type);
                    $scope.transactions[i].timestamp.seconds = $scope.formatDate($scope.transactions[i].timestamp.seconds * 1000, '%M/%d %I:%m%p') + ' UTC';
                    $scope.transactions[i].uuid = uuid;
                    $scope.transactions[i].chaincodeID = ccid;
                    $scope.transactions[i].payload = payload;
                }

                console.log(response);
            }, function (error) {
                console.log(error);
            });
        };

        $scope.getchainData();

        $scope.formatTime = function(ms){
            var elasped = Math.floor((Date.now() - ms*1000) / 1000);
            var str = '';
            var levels = 0;

            if(elasped >= 60*60*24){
                levels++;
                str =  Math.floor(elasped / (60*60*24)) + 'days ';
                elasped = elasped % (60*60*24);
            }
            if(elasped >= 60*60){
                levels++;
                if(levels < 2){
                    str =  Math.floor(elasped / (60*60)) + 'hr ';
                    elasped = elasped % (60*60);
                }
            }
            if(elasped >= 60){
                if(levels < 2){
                    levels++;
                    str +=  Math.floor(elasped / 60) + 'min ';
                    elasped = elasped % 60;
                }
            }
            if(levels < 2){
                str +=  elasped + 'sec ';
            }

            return str;
        }

        //convert type to transactions name
        $scope.type2word = function(type){
            if(type === TYPE_DEPLOY) return 'DEPLOY';											//type is numeric
            if(type === TYPE_INVOKE) return 'INVOKE';
            if(type === TYPE_QUERY) return 'QUERY';
            if(type === TYPE_TERMINATE) return 'TERMINATE';
            return type;
        }

        $scope.formatDate = function (date, fmt) {
            date = new Date(date);
            function pad(value) {
                return (value.toString().length < 2) ? '0' + value : value;
            }
            return fmt.replace(/%([a-zA-Z])/g, function (_, fmtCode) {
                var tmp;
                switch (fmtCode) {
                    case 'Y':								//Year
                        return date.getUTCFullYear();
                    case 'M':								//Month 0 padded
                        return pad(date.getUTCMonth() + 1);
                    case 'd':								//Date 0 padded
                        return pad(date.getUTCDate());
                    case 'H':								//24 Hour 0 padded
                        return pad(date.getUTCHours());
                    case 'I':								//12 Hour 0 padded
                        tmp = date.getUTCHours();
                        if(tmp === 0) tmp = 12;				//00:00 should be seen as 12:00am
                        else if(tmp > 12) tmp -= 12;
                        return pad(tmp);
                    case 'p':								//am / pm
                        tmp = date.getUTCHours();
                        if(tmp >= 12) return 'pm';
                        return 'am';
                    case 'P':								//AM / PM
                        tmp = date.getUTCHours();
                        if(tmp >= 12) return 'PM';
                        return 'AM';
                    case 'm':								//Minutes 0 padded
                        return pad(date.getUTCMinutes());
                    case 's':								//Seconds 0 padded
                        return pad(date.getUTCSeconds());
                    case 'r':								//Milliseconds 0 padded
                        return pad(date.getUTCMilliseconds(), 3);
                    case 'q':								//UTC timestamp
                        return date.getTime();
                    default:
                        throw new Error('Unsupported format code: ' + fmtCode);
                }
            });
        }
    }]);

