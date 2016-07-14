(function () {
  'use strict';

  angular
    .module('todos')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Todos',
      state: 'todos',
      //type: 'dropdown',
      roles: ['user']
    });
/*
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'todos', {
      title: 'List Todos',
      state: 'todos.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'todos', {
      title: 'Create Todo',
      state: 'todos.create',
      roles: ['user']
    });
    */
  }
})();
