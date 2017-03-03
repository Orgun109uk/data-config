/**
 * Provides the tests for the Data class.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

const test = require('unit.js');
const Data = require('../lib/Data');
const EInvalidReferenceType = require('../lib/EInvalidReferenceType');

/** @test {Data} */
describe('Data', () => {
    /** @test {Data#seperator} */
    describe('Data.seperator', () => {
        it('should return the default seperator', () => {
            const config = {};
            const data = new Data(config);

            test.string(data.seperator).is('.');
        });

        it('should return the provided seperator', () => {
            const config = {};
            const data = new Data(config, '/');

            test.string(data.seperator).is('/');
        });
    });

    /** @test {Data#has} */
    describe('Data.has()', () => {
        it('should return false if property doesnt exist', () => {
            const config = {};
            const data = new Data(config);

            test.bool(data.has('test')).isNotTrue();
        });

        it('should find the first level property of single level', () => {
            const config = { 'test': 'hello' };
            const data = new Data(config);

            test.bool(data.has('test')).isTrue();
        });

        it('should find the first level property of multi level', () => {
            const config = { 'test': { 'value': 'hello' } };
            const data = new Data(config);

            test.bool(data.has('test')).isTrue();
        });

        it('should find the second level property of multi level', () => {
            const config = { 'test': { 'value': 'hello' } };
            const data = new Data(config);

            test.bool(data.has('test.value')).isTrue();
        });

        it('shouldnt find deep property', () => {
            const config = {};
            const data = new Data(config);

            test.bool(data.has('test.hello.world.foo')).isNotTrue();
        });

        it('should find deep property', () => {
            const config = { test: { hello: { world: { foo: 'bar' } } } };
            const data = new Data(config);

            test.bool(data.has('test.hello.world.foo')).isTrue();
        });
    });

    /** @test {Data#get} */
    describe('Data.get()', () => {
        it('should return null if doesnt exist', () => {
            const config = {};
            const data = new Data(config);

            test.value(data.get('test')).isNull();
        });

        it('should return the default value if doesnt exist', () => {
            const config = {};
            const data = new Data(config);

            test.bool(data.get('test', true)).isTrue();
        });

        it('should return the first level property of single level', () => {
            const config = { 'test': 'value' };
            const data = new Data(config);

            test.string(data.get('test')).is('value');
        });

        it('should return the first level property of multi level', () => {
            const config = { 'test': { 'value': 'hello' } };
            const data = new Data(config);

            test.object(data.get('test')).is({ 'value': 'hello' });
        });

        it('should return the second level property of multi level', () => {
            const config = { 'test': { 'value': 'hello' } };
            const data = new Data(config);

            test.string(data.get('test.value')).is('hello');
        });

        it('should return null from unknown deep level value', () => {
            const config = {};
            const data = new Data(config);

            test.value(data.get('test.hello.world.foo')).isNull();
        });

        it('should return value from deep level value', () => {
            const config = { test: { hello: { world: { foo: 'bar' } } } };
            const data = new Data(config);

            test.string(data.get('test.hello.world.foo')).is('bar');
        });
    });

    /** @test {Data#set} */
    describe('Data.set()', () => {
        it('should set the value', () => {
            const config = {};
            const data = new Data(config);

            data.set('test', 'hello');
            test.object(config).is({ 'test': 'hello' });
        });

        it('should set the value with chaining', () => {
            const config = {};
            const data = new Data(config);

            data.set('test', 'hello')
                .set('test2', 'world');

            test.object(config).is({ 'test': 'hello', 'test2': 'world' });
        });

        it('should set the multi level value', () => {
            const config = {};
            const data = new Data(config);

            data.set('test.value', 'hello');
            test.object(config).is({
                'test': { 'value': 'hello' }
            });
        });

        it('should set the deep level value', () => {
            const config = {};
            const data = new Data(config);

            data.set('test.hello.world.foo', 'bar');
            test.object(config).is({
                'test': {
                    'hello': {
                        'world': { 'foo': 'bar' }
                    }
                }
            });
        });
    });

    /** @test {Data#del} */
    describe('Data.del()', () => {
        it('should delete the value', () => {
            const config = { 'test': 'hello' };
            const data = new Data(config);

            data.del('test');
            test.object(config).is({});
        });

        it('should delete the value when setting with null', () => {
            const config = { 'test': 'hello' };
            const data = new Data(config);

            data.set('test', null);
            test.object(config).is({});
        });

        it('should delete the value with chaining', () => {
            const config = { 'test': 'hello', 'test2': 'world' };
            const data = new Data(config);

            data.del('test').del('test2');
            test.object(config).is({});
        });

        it('should delete the multi value', () => {
            const config = { 'test': { 'value': 'hello' } };
            const data = new Data(config);

            data.del('test');
            test.object(config).is({});
        });

        it('should delete the multi values value', () => {
            const config = { 'test': { 'value': 'hello' } };
            const data = new Data(config);

            data.del('test.value');
            test.object(config).is({
                'test': {}
            });
        });
    });

    /** @test {Data#ref} */
    describe('Data.ref()', () => {
        it('should throw an error if not an object', () => {
            const config = { hello: 'world', foo: { bar: 'bar' } };
            const data = new Data(config);

            test.error(() => {
                    data.ref('hello');
                })
                .isInstanceOf(EInvalidReferenceType)
                .hasKey(
                    'message',
                    'The value "hello" can not be used as a reference as it ' +
                    'is of type "string", and must be an Object.'
                )
                .hasKey('fieldName', 'hello')
                .hasKey('fieldValueType', 'string');
        });

        it('should generate reference to undefined', () => {
            const config = { hello: 'world', foo: { bar: 'bar' } };
            const data = new Data(config);

            test.object(data.ref('bingo'))
                .isInstanceOf(Data)
                .hasKey('parent', data)
                .hasKey('xpath', 'bingo');

            test.object(config).hasKey('bingo');
        });

        it('should generate reference to undefined with default', () => {
            const config = { hello: 'world', foo: { bar: 'bar' } };
            const data = new Data(config);

            test.object(data.ref('bingo', { test: 'test' }))
                .isInstanceOf(Data)
                .hasKey('parent', data)
                .hasKey('xpath', 'bingo');

            test.object(config.bingo).is({ test: 'test' });
        });

        it('should generate reference', () => {
            const config = { hello: 'world', foo: { bar: 'bar' } };
            const data = new Data(config);

            test.object(data.ref('foo'))
                .isInstanceOf(Data)
                .hasKey('parent', data)
                .hasKey('xpath', 'foo');
        });

        it('should alter parent after set', () => {
            const config = { hello: 'world', foo: { bar: 'bar' } };
            const data = new Data(config);
            const ref = data.ref('foo');

            ref.set('bar', 'something')
                .set('something', 'bar');

            test.object(config).is({
                hello: 'world',
                foo: {
                    bar: 'something',
                    something: 'bar'
                }
            });
        });

        it('should alter parent after delete', () => {
            const config = { hello: 'world', foo: { bar: 'bar' } };
            const data = new Data(config);
            const ref = data.ref('foo');

            ref.del('bar');
            test.object(config).is({
                hello: 'world',
                foo: {}
            });
        });

        it('should alter parent after set of child ref', () => {
            const config = { hello: 'world', foo: { bar: 'bar' } };
            const data = new Data(config);
            const ref1 = data.ref('foo');
            const ref2 = ref1.ref('something');

            ref1.set('bar', 'someone')
                .set('someone', 'bar');

            ref2.set('bingo', 'bongo');

            test.object(config).is({
                hello: 'world',
                foo: {
                    bar: 'someone',
                    someone: 'bar',
                    something: { bingo: 'bongo' }
                }
            });
        });
    });
});