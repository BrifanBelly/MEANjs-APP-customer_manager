'use strict';

describe('Helps E2E Tests:', function () {
  describe('Test Helps page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/helps');
      expect(element.all(by.repeater('help in helps')).count()).toEqual(0);
    });
  });
});
