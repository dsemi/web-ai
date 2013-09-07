(function() {
    var Foo = include('tests.helpers.Foo');
    var Bar = include('tests.helpers.Bar');

    describe('App.js', function() {

        describe('When creating an app,', function() {
            var TITLE = 'Test Title';

            it('the title should be changed.', function() {
                App.setTitle(TITLE);

                var title = document.getElementsByTagName('title')[0].text;

                expect(title).toBe(TITLE);
            });
        });

        describe('When defining a class,', function() {
            it('that class should exist', function() {
                expect(tests).toEqual(jasmine.any(Object));
                expect(tests.helpers).toEqual(jasmine.any(Object));
                expect(tests.helpers.Foo).toEqual(jasmine.any(Function));
            });

            it('all members should be defined', function() {
                expect(tests.helpers.Foo.prototype.string).toEqual(jasmine.any(String));
                expect(tests.helpers.Foo.prototype.method).toEqual(jasmine.any(Function));
                expect(tests.helpers.Foo.prototype.object).toEqual(jasmine.any(Object));
                expect(tests.helpers.Foo.prototype.array).toEqual(jasmine.any(Array));
            });

        });

        describe('When instantiating an object', function() {
            var foo, bar;

            beforeEach(function() {
                foo = new Foo('foo');
                bar = new Bar('Bar');
            });

            it('its initializer should be called', function() {
                expect(foo.string).toBe('foo');
            });

            it('called methods should call the correct function and return the correct value', function() {
                expect(foo.method()).toBe('foo');
            });

            it('called super constructors should apply changes to subclass', function() {
                expect(bar.string).toBe('Bar');
                expect(bar.method()).toBe('Bar');
                expect(bar.upper()).toBe('BAR');
                expect(bar.lower()).toBe('bar');
            });

        });

    });
})();
