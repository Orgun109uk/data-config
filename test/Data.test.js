/**
 * Provides the tests for the Data class.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

const test = require('unit.js');
const Data = require('../lib/Data');

/** @test {Data} */
describe('Data', () => {

  /** @test {Data#seperator} */
  describe('Data.seperator', () => {

    it('should return the default seperator', () => {

      var config = {},
          data = new Data(config);

      test.string(
        data.seperator
      ).is('.');

    });

    it('should return the provided seperator', () => {

      var config = {},
          data = new Data(config, '/');

      test.string(
        data.seperator
      ).is('/');

    });

  });

  /** @test {Data#has} */
  describe('Data.has()', () => {

    it('should return false if property doesnt exist', () => {

      var config = {},
          data = new Data(config);

      test.bool(
        data.has('test')
      ).isNotTrue();

    });

    it('should find the first level property of single level', () => {

      var config = {'test': 'hello'},
          data = new Data(config);

      test.bool(
        data.has('test')
      ).isTrue();

    });

    it('should find the first level property of multi level', () => {

      var config = {'test': {'value': 'hello'}},
          data = new Data(config);

      test.bool(
        data.has('test')
      ).isTrue();

    });

    it('should find the second level property of multi level', () => {

      var config = {'test': {'value': 'hello'}},
          data =new Data(config);

      test.bool(
        data.has('test.value')
      ).isTrue();

    });

    it('shouldnt find deep property', () => {

      var config = {},
          data = new Data(config);

      test.bool(
        data.has('test.hello.world.foo')
      ).isNotTrue();

    });

    it('should find deep property', () => {

      var config = {test: {hello: {world: {foo: 'bar'}}}},
          data = new Data(config);

      test.bool(
        data.has('test.hello.world.foo')
      ).isTrue();

    });

  });

  /** @test {Data#get} */
  describe('Data.get()', () => {

    it('should return null if doesnt exist', () => {

      var config = {},
          data = new Data(config);

      test.value(
        data.get('test')
      ).isNull();

    });

    it('should return the default value if doesnt exist', () => {

      var config = {},
          data = new Data(config);

      test.bool(
        data.get('test', true)
      ).isTrue();

    });

    it('should return the first level property of single level', () => {

      var config = {'test': 'value'},
          data = new Data(config);

      test.string(
        data.get('test')
      ).is('value');

    });

    it('should return the first level property of multi level', () => {

      var config = {'test': {'value': 'hello'}},
          data = new Data(config);

      test.object(
        data.get('test')
      ).is({'value': 'hello'});

    });

    it('should return the second level property of multi level', () => {

      var config = {'test': {'value': 'hello'}},
          data = new Data(config);

      test.string(
        data.get('test.value')
      ).is('hello');

    });

    it('should return null from unknown deep level value', () => {

      var config = {},
          data = new Data(config);

      test.value(
        data.get('test.hello.world.foo')
      ).isNull();

    });

    it('should return value from deep level value', () => {

      var config = {test: {hello: {world: {foo: 'bar'}}}},
          data = new Data(config);

      test.string(
        data.get('test.hello.world.foo')
      ).is('bar');

    });

  });

  /** @test {Data#set} */
  describe('Data.set()', () => {

    it('should set the value', () => {

      var config = {},
          data = new Data(config);

      data.set('test', 'hello');
      test.object(
        config
      ).is({
        'test': 'hello'
      });

    });

    it('should set the value with chaining', () => {

      var config = {},
          data = new Data(config);

      data
        .set('test', 'hello')
        .set('test2', 'world');

      test.object(
        config
      ).is({
        'test': 'hello',
        'test2': 'world'
      });

    });

    it('should set the multi level value', () => {

      var config = {},
          data = new Data(config);

      data.set('test.value', 'hello');
      test.object(
        config
      ).is({
        'test': {
          'value': 'hello'
        }
      });

    });

    it('should set the deep level value', () => {

      var config = {},
          data = new Data(config);

      data.set('test.hello.world.foo', 'bar');
      test.object(
        config
      ).is({
        'test': {
          'hello': {
            'world': {
              'foo': 'bar'
            }
          }
        }
      });

    });

  });

  /** @test {Data#del} */
  describe('Data.del()', () => {

    it('should delete the value', () => {

      var config = {'test': 'hello'},
          data = new Data(config);

      data.del('test');
      test.object(
        config
      ).is({});

    });

    it('should delete the value with chaining', () => {

      var config = {'test': 'hello', 'test2': 'world'},
          data = new Data(config);

      data
        .del('test')
        .del('test2');

      test.object(
        config
      ).is({});

    });

    it('should delete the multi value', () => {

      var config = {'test': {'value': 'hello'}},
          data = new Data(config);

      data.del('test');
      test.object(
        config
      ).is({});

    });

    it('should delete the multi values value', () => {

      var config = {'test': {'value': 'hello'}},
          data = new Data(config);

      data.del('test.value');
      test.object(
        config
      ).is({
        'test': {}
      });

    });

  });

  /** @test {Data#ref} */
  describe('Data.ref()', () => {

    it('should throw an error if not an object', () => {

      var config = {
            hello: 'world',
            foo: {
              bar: 'bar'
            }
          },
          data = new Data(config);

      test.error(() => {
        data.ref('hello');
      }).isInstanceOf(Error)
        .hasKey('message', 'The value "hello" can not be used as a reference as its a "string".');

    });

    it('should generate reference to undefined', () => {

      var config = {
            hello: 'world',
            foo: {
              bar: 'bar'
            }
          },
          data = new Data(config);

      test.object(
        data.ref('bingo')
      ).isInstanceOf(Data)
        .hasKey('parent', data)
        .hasKey('xpath', 'bingo');

      test.object(
        config
      ).hasKey('bingo');

    });

    it('should generate reference to undefined with default', () => {

      var config = {
            hello: 'world',
            foo: {
              bar: 'bar'
            }
          },
          data = new Data(config);

      test.object(
        data.ref('bingo', {
          test: 'test'
        })
      ).isInstanceOf(Data)
        .hasKey('parent', data)
        .hasKey('xpath', 'bingo');

      test.object(
        config.bingo
      ).is({
        test: 'test'
      });

    });

    it('should generate reference', () => {

      var config = {
            hello: 'world',
            foo: {
              bar: 'bar'
            }
          },
          data = new Data(config);

      test.object(
        data.ref('foo')
      ).isInstanceOf(Data)
        .hasKey('parent', data)
        .hasKey('xpath', 'foo');

    });

    it('should alter parent after set', () => {

      var config = {
            hello: 'world',
            foo: {
              bar: 'bar'
            }
          },
          data = new Data(config),
          ref = data.ref('foo');

      ref
        .set('bar', 'something')
        .set('something', 'bar');

      test.object(
        config
      ).is({
        hello: 'world',
        foo: {
          bar: 'something',
          something: 'bar'
        }
      });

    });

    it('should alter parent after delete', () => {

      var config = {
            hello: 'world',
            foo: {
              bar: 'bar'
            }
          },
          data = new Data(config),
          ref = data.ref('foo');

      ref.del('bar');

      test.object(
        config
      ).is({
        hello: 'world',
        foo: {}
      });

    });

    it('should alter parent after set of child ref', () => {

      var config = {
            hello: 'world',
            foo: {
              bar: 'bar'
            }
          },
          data = new Data(config),
          ref1 = data.ref('foo'),
          ref2 = ref1.ref('something');

      ref1
        .set('bar', 'someone')
        .set('someone', 'bar');

      ref2
        .set('bingo', 'bongo');

      test.object(
        config
      ).is({
        hello: 'world',
        foo: {
          bar: 'someone',
          someone: 'bar',
          something: {
            bingo: 'bongo'
          }
        }
      });

    });

  });

});
