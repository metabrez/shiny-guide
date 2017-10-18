// angular.module('app.controllers', ['ngFileUpload','pubnub.angular.service'])
angular.module('app.controllers', ['app.services','ngFileUpload'])
    .controller('MainCtrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($rootScope,$scope, $stateParams,$ionicModal,$log,$ionicPopup) {
        //badge number
            $rootScope.numOfunConsulted = 0;
           $log.info("MainCtrl...");
            //root scope variables for modal.
            $rootScope.consultingModal = null;
            $rootScope.userInfos = [];
            $rootScope.allInstructions = [];
            $rootScope.allPescriptions = [];
            $rootScope.consultEinstrMpres = {id:-1,eiid:-1,mpid:-1,einame:"",mpname:"",eicontent:"",mpcontent:""};
            $rootScope.consultEinstrMpresz = [{id:-1,eiid:-1,mpid:-1,einame:"",mpname:"",eicontent:"",mpcontent:""}];
            $rootScope.consultInfofull = {eInstruction:{},mPrescription:{}};
            //selected
            $rootScope.unconsultUserInfos = [];
            $rootScope.selectedUserInfo = {};
            $rootScope.selectedItemInfo = {};
            $rootScope.selectedItemDetail = {};
            $rootScope.selectedConsultInfo = {pid:-1,iid:-1};
            $rootScope.selectedInstruction = null;
            $rootScope.selectedPrescription = null;
            //ConsultModal
            $ionicModal.fromTemplateUrl('templates/modal-consulting.html', {
                scope: $scope,
                backdropClickToClose: false
            }).then(function (modal) {
//        console.log("modal-login.html init!!!");
                $rootScope.consultingModal = modal;
                //
            });
            $rootScope.consultingAutoModal = null;
            $ionicModal.fromTemplateUrl('templates/modal-consulting-auto.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $rootScope.consultingAutoModal = modal;
            });
            $rootScope.consultingStaticModal = null;
            $ionicModal.fromTemplateUrl('templates/modal-consulting-static.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $rootScope.consultingStaticModal = modal;
            });
            //NewInstructionModal
            $rootScope.newInstructionModal = null;
            $ionicModal.fromTemplateUrl('templates/modal-instruction-new.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $rootScope.newInstructionModal = modal;
                // console.log(" $rootScope.newInstructionModal:"+ $rootScope.newInstructionModal);
            });
            //PrescriptionModal
            $rootScope.newPrescriptionModal = null;
            $ionicModal.fromTemplateUrl('templates/modal-prescription-new.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $rootScope.newPrescriptionModal = modal;
                // console.log(" $rootScope.newPrescriptionModal:"+ $rootScope.newPrescriptionModal);
            });
            //PrintPreviewModal
            $rootScope.newPrintPreviewModal = null;
            $ionicModal.fromTemplateUrl('templates/modal-print-preview.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $rootScope.newPrintPreviewModal = modal;
                // console.log(" $rootScope.newPrescriptionModal:"+ $rootScope.newPrescriptionModal);
            });
            // A Simple alert
            $rootScope.showAlert = function($msg) {
                var alertPopup = $ionicPopup.alert({
                    title: $msg
                    // template: 'It might taste good'
                });

                alertPopup.then(function (res) {
                    // console.log('Thank you for not eating my delicious ice cream cone');
                });
            }

            // A confirm dialog
            $rootScope.showPrompt = function($title) {
                var confirmPopup = $ionicPopup.confirm({
                    title: $title,
                    template: '立即问诊?',
                    buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                        text: '取消',
                        type: 'button-default',
                        onTap: function(e) {
                            // e.preventDefault() will stop the popup from closing when tapped.
                            // e.preventDefault();
                        }
                    }, {
                        text: '确定',
                        type: 'button-positive',
                        onTap: function(e) {
                            // Returning a value will cause the promise to resolve with the given value.
                            $rootScope.getDiagnosis();
                            //
                            return null;
                        }
                    }]
                });

                confirmPopup.then(function(res) {
                    if(res) {
                        // console.log('You are sure');
                    } else {
                        // console.log('You are not sure');

                    }
                })
            };
        })
//
.controller('page3Ctrl', function ($rootScope,$scope,$stateParams,$ionicModal,CONFIG_ENV,Upload,$ionicLoading,$log,
                                   UpdateItemInfoService,UserInfoService,Enum,$timeout,
                                   RecommendUserService,RecommendItemService,DiagnosisService) {
//
// //PubNub
//     Pubnub.init({
//         publishKey: CONFIG_ENV.pubnub_key,
//         subscribeKey: CONFIG_ENV.pubnub_secret
//     });
    $log.info("CONFIG_ENV:",CONFIG_ENV);
    //ng-model
    $scope.userInfo = {id:Enum.getUUID(),name:"", gender:1,age:50, itemId: "",itemDetailId:""};
    $log.info("default userInfo:",$scope.userInfo);
    $scope.yearsR = "中年";
        //age drag input
        $scope.drag = function(value) {
            $scope.years = Math.floor(value / 12);
            if(value<=44){
                $scope.yearsR = "青年";
            }else if(value>=60){
                $scope.yearsR = "老年";
            }else {
                $scope.yearsR = "中年";
            }
        };
//
        //FileUploader,@see:https://github.com/danialfarid/ng-file-upload
        // upload on file select or drop
        $scope.uploadItemInfo = function (file) {

            if(!file){
                $log.error("None file selected.");
            }
            Upload.upload({
                url: CONFIG_ENV.api_endpoint+'upload/timage',
                data: {file: file}
            }).then(function (resp) {
                //
                $log.info('Success ' + resp.config.data.file.name + ',uploaded. Response: ');
                $scope.userInfo.itemId = resp.data.data.id;
            }, function (resp) {
                $log.error('Error status: ' + resp.status);
            }, function (evt) {
                // console.log('evt:'+evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                //
                $log.info('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        };

        // upload on file select or drop
        $scope.uploadItemDetail = function (file) {
            if(!file){
                $log.error("None file selected.");
            }
            Upload.upload({
                url: CONFIG_ENV.api_endpoint+'upload/tcsv/false',
                data: {file: file}
            }).then(function (resp) {
                //
                $log.debug('Success ' + resp.config.data.file.name + ',uploaded. Response: ');
                $log.info(resp.data.data);
                $scope.userInfo.itemDetailId = resp.data.data[0].id;
                //UPDATE
                var updateItemInfo = new UpdateItemInfoService();
                updateItemInfo.$update({"Id":$scope.userInfo.itemId,"dId":$scope.userInfo.itemDetailId},function (resp) {
                    $log.info("updateItemInfo() success, response:", resp);
                }, function (resp) {
                    $log.error('Error status: ' + resp.status);
                });
            }, function (resp) {
                $log.error('Error status: ' + resp.status);
            }, function (evt) {

                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        };
    // upload on file select or drop
    $scope.uploadUserItemDetail = function (file) {
        if(!file){
            $log.error("None file selected.");
        }
        Upload.upload({
            url: CONFIG_ENV.api_endpoint+'upload/tcsv/true',
            data: {file: file}
        }).then(function (resp) {
            //
            $log.debug('Success ' + resp.config.data.file.name + ',uploaded. Response: ');
            $log.info(resp.data.data);
            // $scope.userInfo.itemDetailId = resp.data.data.id;
            //
        }, function (resp) {
            $log.error('Error status: ' + resp.status);
        }, function (evt) {

            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };
        //Select bind
        $scope.preferencesItemType = Enum.genderType;
        $scope.prefGender = Enum.genderType[0];//Default male.
        $scope.setTypeSelected = function (type) {
            $scope.prefGender = type;
            $scope.userInfo.gender = type.data;
        }

        $scope.savedUserID = 0;
        //CREATE,
        $scope.createUserInfo = function () {
            //
            console.log($scope.userInfo);
            var anewUserInfo = new UserInfoService();
            anewUserInfo.age = $scope.userInfo.age;
            anewUserInfo.name = $scope.userInfo.name;
            anewUserInfo.gender = $scope.userInfo.gender;
            anewUserInfo.itemId = $scope.userInfo.itemId;
            //return $log.debug("createItem(),$scope.newItem:", anewItem);
            //Save
            anewUserInfo.$save(function (resp) {
                $log.info("createUserInfo("+$scope.savedUserID+") success, response:", resp);
                $scope.savedUserID = resp.data.id;
                // $rootScope.showPrompt("采集成功!");
                $rootScope.showAlert("采集成功!");
               //Auto diagnosis testing

            }, function (resp) {
                $log.error('Error status: ' + resp.status);
            });
        }
        $rootScope.getDiagnosis = function(){
             DiagnosisService.get({id:$scope.savedUserID}, function (response) {
                 $log.debug("DiagnosisService.get("+$scope.savedUserID+") success!", response);
                 //
                 $rootScope.consultInfofull = response;
                 //
                 $rootScope.consultingAutoModal.show();
             }, function (error) {
                 // failure handler
                 $log.error("DiagnosisService.get() failed:", JSON.stringify(error));
             });
        }
})

    .controller('page4Ctrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($rootScope,$scope, $stateParams,$log,Enum,ConsultUserInfoService,ItemInfoService
            ,UserInfoService,ItemDetailService,ConsultInfoService,InstructionService,PrescriptionService) {
            $scope.userInfos = [
                {
                    id:Enum.getUUID(),name:"", gender:1,age:50, itemId: "",itemDetailId:""
                }
            ];
            //Select binding
            $scope.selectedUserInfo = $rootScope.userInfos[0];//Default 0ne.

            //GET where none consulting.
            $scope.loadUserInfos = function () {

                ConsultUserInfoService.get({"id":-1}, function (response) {
                    $log.debug("ConsultUserInfoService.get() success!", response.data);
                    $scope.userInfos = response.data;
                    //
                    $rootScope.unconsultUserInfos =  response.data;
                    $rootScope.numOfunConsulted =  $rootScope.unconsultUserInfos.length;
                }, function (error) {
                    // failure handler
                    $log.error("ConsultUserInfoService.get() failed:", JSON.stringify(error));
                });

            };
            $scope.loadAllUserInfos = function () {

                UserInfoService.get({}, function (response) {
                    $log.debug("UserInfoService.get() success!", response.data);
                    $scope.userInfos = response.data;
                }, function (error) {
                    // failure handler
                    $log.error("UserInfoService.get() failed:", JSON.stringify(error));
                });

            };

            $scope.loadConsultInfo = function () {

                //drill down the item detail for select.
                ConsultInfoService.get({id:$rootScope.selectedUserInfo.consultId}, function (response) {
                    $log.debug("ConsultInfoService.get("+$rootScope.selectedUserInfo.consultId+") success!", response.data);
                    $rootScope.selectedConsultInfo = response.data;
                    $log.debug(" $rootScope.selectedConsultInfo:",  $rootScope.selectedConsultInfo);
                    //
                    $rootScope.setInstructionSelected();
                    $rootScope.setPrescrptionSelected();
                    //
                }, function (error) {
                    // failure handler
                    $log.error("ConsultInfoService.get() failed:", JSON.stringify(error));
                });
            }

            $scope.loadItemDetailOne = function (userInfo) {

                //drill down the item detail for select.
                ItemDetailService.get({id:$rootScope.selectedItemInfo.detailId}, function (response) {
                    $log.debug("ItemDetailService.get("+$rootScope.selectedItemInfo.detailId+") success!", response.data);
                    $rootScope.selectedItemDetail = response.data;
                    $log.debug(" $rootScope.selectedItemDetail:",  $rootScope.selectedItemDetail);
                    //next
                    $scope.loadConsultInfo();
                }, function (error) {
                    // failure handler
                    $log.error("ItemDetailService.get() failed:", JSON.stringify(error));
                });
            }

            $scope.getUserItemInfo = function(userInfo){
               //
                $rootScope.selectedUserInfo = userInfo;
                ItemInfoService.get({id:userInfo.itemId}, function (response) {
                    $log.debug("ItemInfoService.get("+userInfo.itemId+") success!", response.data);
                    $rootScope.selectedItemInfo = response.data;
                    //Select binding
                    $log.debug("$rootScope.selectedItemInfo:",$rootScope.selectedItemInfo);
                    //
                    $rootScope.consultingStaticModal.show();
                    //item related detail
                    $scope.loadItemDetailOne();

                }, function (error) {
                    // failure handler
                    $log.error("ItemInfoService.get() failed:", JSON.stringify(error));
                });
            }

            $scope.deleteUserInfo = function (userInfo) {
                UserInfoService.delete({id:userInfo.id}, function (response) {
                    $log.info("UserInfoService.delete() success!", response.data);
                   //refresh
                    $scope.loadUserInfos();
                }, function (error) {
                    // failure handler
                    $log.error("UserInfoService.get() failed:", JSON.stringify(error));
                });
            }

            //default behaviors
            console.log("loadUnConsultUsers...");
            $scope.loadUserInfos();


        })
   
.controller('ConsultingAutoCtrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName

function ($rootScope,$scope, $stateParams,$ionicModal,$log,DiagnosisInferService,ConsultInfoService) {
    $log.info("ConsultingAutoCtrl init...");
//by mahout recommend
    $scope.getOtherConsultInfo = function () {
        // $rootScope.getConsultEinstrMpres($order);
        index = $rootScope.consultEinstrMpresz.indexOf($rootScope.consultEinstrMpres);
        length =  $rootScope.consultEinstrMpresz.length;
        if(index >= 0 && index < length - 1) {
            $rootScope.consultEinstrMpres = $rootScope.consultEinstrMpresz[index + 1];
        }else{
            $rootScope.consultEinstrMpres = $rootScope.consultEinstrMpresz[0];
        }
    }
    //CREATE,by drools infered.
    $scope.createConsultInfoAuto = function () {
        $log.info("$scope.createConsultInfoAuto called.");
        $rootScope.selectedInstruction = {id:-1};
        $rootScope.selectedInstruction.id = $rootScope.consultEinstrMpres.eiid;
        $rootScope.selectedPrescription = {id:-1};
        $rootScope.selectedPrescription.id = $rootScope.consultEinstrMpres.mpid;
        $rootScope.createConsultInfo();
    };
})
    .controller('ConsultingCtrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($rootScope,$scope, $stateParams,$log,$ionicModal,
                  UserInfoService,ItemInfoService,ItemDetailService,
                  InstructionService,PrescriptionService,
                  ConsultInfoService,UpdateUserInfoService,
                  ConsultUserInfoService,DiagnosisInferService) {
        //
            //Select binding
            $scope.selectedUserInfo = null;
            $scope.selectedItemInfo= null;
            $scope.selectedInstruction = null;
            $scope.selectedPrescription = null;
            //GET where none consulting.
            $scope.loadUserInfos = function () {

                // UserInfoService.get({}, function (response) {
                //     $log.info("UserInfoService.get() success!", response.data);
                //     $rootScope.userInfos = response.data;
                //     //Select binding
                //     $scope.selectedUserInfo = $rootScope.userInfos[0];//Default 0ne.
                //     $log.debug("selectedUserInfo:",$scope.selectedUserInfo);
                // }, function (error) {
                //     // failure handler
                //     $log.error("UserInfoService.get() failed:", JSON.stringify(error));
                // });
                //
                ConsultUserInfoService.get({"id":-1}, function (response) {
                    $log.info("ConsultUserInfoService.get() success!", response.data);
                    $rootScope.userInfos = response.data;
                    //Select binding
                    $scope.selectedUserInfo = $rootScope.userInfos[0];//Default 0ne.
                    $log.debug("selectedUserInfo:",$scope.selectedUserInfo);
                    //default trigger.
                    // $scope.setUserInfoSelected($scope.selectedUserInfo);
                }, function (error) {
                    // failure handler
                    $log.error("UserInfoService.get() failed:", JSON.stringify(error));
                });

            };
            //GET
            $scope.loadItemInfos = function () {
                ItemInfoService.get({}, function (response) {
                    $log.debug("ItemInfoService.get() success!", response.data);
                    $rootScope.itemInfos = response.data;
                    //Select binding
                    // $scope.selectedItemInfo= $rootScope.itemInfos[0];//Default 0ne.
                    $log.debug("selectedItemInfo:",$scope.selectedItemInfo);
                }, function (error) {
                    // failure handler
                    $log.error("ItemInfoService.get() failed:", JSON.stringify(error));
                });
            };
            //GET
            $rootScope.loadAllInstructions = function () {
                InstructionService.get({}, function (response) {
                    $log.info("InstructionService.get() success!", response.data);
                    $rootScope.allInstructions = response.data;
                    //Select binding
                    $rootScope.selectedInstruction = $scope.selectedInstruction = $rootScope.allInstructions[0];//Default 0ne.
                    $log.debug("selectedInstruction:",$rootScope.selectedInstruction);
                }, function (error) {
                    // failure handler
                    $log.error("InstructionService.get() failed:", JSON.stringify(error));
                });
            };
            //GET
            $rootScope.loadAllPrescriptions = function () {
                PrescriptionService.get({}, function (response) {
                    $log.info("PrescriptionService.get() success!", response);
                    $rootScope.allPrescriptions = response.data;
                    //Select binding
                    $rootScope.selectedPrescription = $scope.selectedPrescription = $rootScope.allPescriptions[0];//Default 0ne.
                    $log.debug("selectedPrescription:",$rootScope.selectedPrescription);
                }, function (error) {
                    // failure handler
                    $log.error("PrescriptionService.get() failed:", JSON.stringify(error));
                });
            }

            $scope.loadUserAndItemInfos = function () {
                console.log("loadUserAndItemInfos...");
                $scope.loadUserInfos();//FIXME: load a sequence chain.
                $scope.loadItemInfos();
            }
            $scope.loadInsAndPres = function () {
                console.log("loadInsAndPres...");
                $rootScope.loadAllInstructions();//FIXME: load a sequence chain.
                $rootScope.loadAllPrescriptions();
            }
            //CREATE
            $rootScope.createConsultInfo  = function () {
                //
                var anewConsultInfo = new ConsultInfoService();
                $log.info("$rootScope.selectedInstruction:",$rootScope.selectedInstruction);
                $log.info("$rootScope.selectedPrescription:",$rootScope.selectedPrescription);
                anewConsultInfo.iid = $rootScope.selectedInstruction.id;
                anewConsultInfo.pid = $rootScope.selectedPrescription.id;
                $log.info("anewConsultInfo:",anewConsultInfo);
                //Save
                anewConsultInfo.$save(function (resp) {
                    $log.info("CREATE ConsultInfoService() success, response:", resp);
                    var savedConsultId = resp.data.id;
                    //
                    $scope.updateUserInfo(savedConsultId);
                }, function (resp) {
                    $log.error('Error status: ' + resp.status);
                });
            };
           //UPDATE
            $scope.updateUserInfo = function ($cid) {
                var updateUserInfo = new UpdateUserInfoService();
                updateUserInfo.$update({"Id":$rootScope.selectedUserInfo.id,"cId":$cid},function (resp) {
                    $log.info("updateUserInfo() success, response:", resp);
                    //alert success.
                    $rootScope.showAlert("答诊成功!");
                    //reload
                    // $scope.loadUserAndItemInfos();
                    //hide consulting modal.
                    $rootScope.consultingStaticModal.hide();
                }, function (resp) {
                    $log.error('Error status: ' + resp.status);
                });
            };
            //
            $scope.loadItemDetailOne = function () {
                $log.debug("SELECTED itemInfo's itemDetailId:",$scope.selectedItemInfo.detailId);
                //drill down the item detail for select.
                ItemDetailService.get({id:$scope.selectedItemInfo.detailId}, function (response) {
                    $log.debug("ItemDetailService.get(one) success!", response.data);
                    $scope.itemDetail = response.data;
                }, function (error) {
                    // failure handler
                    $log.error("ItemInfoService.get() failed:", JSON.stringify(error));
                });
            }
            //SELECT change
            $rootScope.setUserInfoSelected = function ($selected) {
                $scope.selectedUserInfo = $selected;//refresh.
                $log.debug("SELECTED userInfo:",$scope.selectedUserInfo);
                //drill down the item info for select.
                ItemInfoService.get({id:$selected.itemId}, function (response) {
                    $log.debug("ItemInfoService.get(",$selected.itemId,") success!", response.data);
                    //
                    $scope.selectedItemInfo = response.data;
                   //
                    $scope.loadItemDetailOne();
                }, function (error) {
                    // failure handler
                    $log.error("ItemInfoService.get() failed:", JSON.stringify(error));
                });
            }

            $scope.updateInstructionSelected = function () {
                //
                $log.debug("SELECTED instruction:",$rootScope.selectedInstruction);
            }

            $scope.updatePrescriptionSelected = function () {
                //
                $log.debug("SELECTED prescription:",$rootScope.selectedPrescription);
                //

            }

            //Manually set up selections
            $rootScope.setInstructionSelected = function () {
                if($rootScope.selectedConsultInfo) {//Only show diagnosised.
                    InstructionService.get({id: $rootScope.selectedConsultInfo.iid}, function (response) {
                        $log.debug("InstructionService.get(" + $rootScope.selectedConsultInfo.iid + ") success!", response.data);
                        $rootScope.selectedInstruction = response.data;
                        $log.debug(" $rootScope.selectedInstruction:", $rootScope.selectedInstruction);
                    }, function (error) {
                        // failure handler
                        $log.error("InstructionService.get() failed:", JSON.stringify(error));
                    });
                }
            }

            $rootScope.setPrescrptionSelected = function () {
                if($rootScope.selectedConsultInfo) {//Only show diagnosised.
                    PrescriptionService.get({id: $rootScope.selectedConsultInfo.pid}, function (response) {
                        $log.debug("PrescriptionService.get(" + $rootScope.selectedConsultInfo.pid + ") success!", response.data);
                        $rootScope.selectedPrescription = response.data;
                        $log.debug("$rootScope.selectedPrescription:", $rootScope.selectedPrescription);
                    }, function (error) {
                        // failure handler
                        $log.error("PrescriptionService.get() failed:", JSON.stringify(error));
                    });
                }
            }

            $scope.printConsultInfo = function(){
                $rootScope.newPrintPreviewModal.show();
            }

            //
            $log.info("ConsultCtrl initialize...");
            // $scope.loadUserAndItemInfos();
            $scope.loadInsAndPres();
//
            $rootScope.getConsultEinstrMpres = function ($order) {
                console.log("$scope.getConsultEinstrMpres called,order:",$order);
                $rootScope.consultingAutoModal.show();
                $rootScope.consultEinstrMpres = {};//clear history data.
                //
                $uid = $rootScope.selectedUserInfo.id;
                $log.info("$rootScope.selectedUserInfo.id:",$uid);
                DiagnosisInferService.query({"id":$uid,"order":$order}, function (response) {
                    $log.info("DiagnosisInferService.get() success!", response);
                    $rootScope.consultEinstrMpresz = response;
                    $log.debug("consultEinstrMpresz :",$scope.consultEinstrMpresz );
                    $rootScope.consultEinstrMpres =  $rootScope.consultEinstrMpresz[0];
                    $log.debug("consultEinstrMpres :",$scope.consultEinstrMpres );
                    //default trigger.

                }, function (error) {
                    // failure handler
                    $log.error("DiagnosisInferService.get() failed:", JSON.stringify(error));
                });
            }
        })
    .controller('NewInstructionCtrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($rootScope,$scope, $stateParams,$ionicModal,InstructionService,$log) {
            $scope.newInstruction = {name:null,content:null};
            //CREATE,
            $scope.createInstruction = function () {
                //
                var anewInstruction = new InstructionService();
                anewInstruction.name = $scope.newInstruction.name;
                anewInstruction.content = $scope.newInstruction.content;
                //Save
                anewInstruction.$save(function (resp) {
                    $log.info("createInstruction success, response:", resp);
                    $scope.savedUserID = resp.data.id;
                    //refresh.
                    $rootScope.loadAllInstructions();

                }, function (resp) {
                    $log.error('Error status: ' + resp.status);
                });
            }
            //DELETE,
            $scope.deleteInstruction = function ($item) {
                //
                var deleteInstruction = new InstructionService();
                //Delete
                deleteInstruction.$delete({ id: $item.id },function (resp) {
                    $log.info("deleteInstruction $delete success, response:", resp);
                    //refresh.
                    $rootScope.loadAllInstructions();

                }, function (resp) {
                    $log.error('Error status: ' + resp.status);
                });
            }
        })
    .controller('NewPrescriptionCtrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($rootScope,$scope, $stateParams,$ionicModal,PrescriptionService,$log) {
        $scope.newPrescription = {name:null,content:null};
            //CREATE,
            $scope.createPrescription = function () {
                //
                var anewPrescription = new PrescriptionService();
                anewPrescription.name = $scope.newPrescription.name;
                anewPrescription.content = $scope.newPrescription.content;
                //Save
                anewPrescription.$save(function (resp) {
                    $log.info("createPrescription success, response:", resp);
                    $scope.savedUserID = resp.data.id;
                    //refresh.
                    $rootScope.loadAllPrescriptions();

                }, function (resp) {
                    $log.error('Error status: ' + resp.status);
                });
            }
            //DELETE,
            $scope.deletePrescription = function ($item) {
                //
                var deletePrescription = new PrescriptionService();
                //Delete
                deletePrescription.$delete({ id: $item.id },function (resp) {
                    $log.info("PrescriptionService $delete success, response:", resp);
                    //refresh.
                    $rootScope.loadAllPrescriptions();
                }, function (resp) {
                    $log.error('Error status: ' + resp.status);
                });
            }
        })
        .controller('PrintPreviewCtrl', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
    function ($rootScope,$scope, $stateParams,$ionicModal,UserInfoService,PrescriptionService,$log) {
        //Display UserInfo,prescription,instruction ,and other information.
        //
        $scope.printNow = function (divID) {
            //HIDE MODAL FIRST OFF.
            $rootScope.newPrintPreviewModal.hide();
            //Get the HTML of div
            var divElements = document.getElementById(divID).innerHTML;
            //Get the HTML of whole page
            var oldPage = document.body.innerHTML;

            //Reset the page's HTML with div's HTML only
            document.body.innerHTML =
                "<html><head><title></title></head><body>" +
                divElements + "</body>";

            //Print Page
            window.print();

            //Restore orignal HTML
            document.body.innerHTML = oldPage;
        }

    })