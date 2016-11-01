app.controller("myCtrl", function ($scope) {
    $scope.firstname = "John";
    $scope.lastname  = "Doe";
});

app.controller("UserInfoCtrl", function($scope){
    $scope.userInfo = {
        "email": "xiaomada315@163.com",
        "password": "xml315",
        "autoLogin": true
    };
    $scope.getFormData = function(){
        console.log($scope.userInfo);
    };
    $scope.setFormData = function(){
        $scope.userInfo = {
            "email": "xiaomada315@555.com",
            "password": "yuanlong",
            "autoLogin": false
        };
    };
    $scope.resetForm = function(){
        $scope.userInfo = {
            "email": "xiaomada315@163.com",
            "password": "xml315",
            "autoLogin": true
        };
    };
});