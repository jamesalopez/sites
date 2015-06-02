describe('Global test', function() {
    it('should greet the named user', function() {

        //Get the app running
        browser.get('http://localhost:3001/');

        // Find the element with binding matching 'greeting' - this will
        // find the <h1>Hello {{greeting}}</h1> element.
        var greeting = element(by.binding('greeting'));

        expect(greeting.getText()).toEqual('Hi, the app');
    });
});
