'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

      $scope.myInterval = 4000;
      $scope.slides = [{
          image: "modules/core/client/img/Carousel/article.png",
          text: "creates and display article list"
      },
          {
              image: "modules/core/client/img/Carousel/chat.png",
              text: "Allows user to chat globally"
          },
          {
              image: "modules/core/client/img/Carousel/todo1.png",
              text: "Can strike the finished task"
          },
          {
              image: "modules/core/client/img/Carousel/customres.png",
              text: "Create Update and Manage customers"
          },
          {
              image: "modules/core/client/img/Carousel/todo.png",
              text: "A ToDO list allows to set up task"
          }];

  }
]);
