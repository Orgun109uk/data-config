/**
 * Provides the tests for the Config class.
 *
 * @author Orgun109uk <orgun109uk@gmail.com>
 */

const path = require('path');
const fs = require('fs');
const os = require('os');
const test = require('unit.js');
const Config = require('../lib/Config');

/** @test {Config} */
describe('Config', () => {
    const tmpPath = path.join(os.tmpdir(), 'config-test-' + process.pid);

    /** @test {Config#save} */
    describe('Config.save()', () => {
        beforeEach(() => {
            fs.mkdirSync(tmpPath);
        });

        afterEach(() => {
            if (fs.existsSync(path.join(tmpPath, 'config.json'))) {
                fs.unlinkSync(path.join(tmpPath, 'config.json'));
            }

            fs.rmdirSync(path.join(tmpPath));
        });

        it('should save an empty config file', (done) => {
            const config = new Config(path.join(tmpPath, 'config.json'));
            config.save((err) => {
                test.value(err).isNull();
                test.bool(fs.existsSync(config.filename)).isTrue();

                done();
            });
        });

        it('should save a populated config', (done) => {
            const config = new Config(path.join(tmpPath, 'config.json'));
            config.data.test = { value: 'hello' };
            config.save((err) => {
                test.value(err).isNull();
                test.object(JSON.parse(fs.readFileSync(config.filename)))
                    .is(config.data);

                done();
            });
        });

        it('should throw an error if unable to save', (done) => {
            const config = new Config(path.join('/etc', 'config.json'));
            config.save((err) => {
                test.object(err).isInstanceOf(Error);

                done();
            });
        });
    });

    /** @test {Config#saveSync} */
    describe('Config.saveSync()', () => {
        beforeEach(() => {
            fs.mkdirSync(tmpPath);
        });

        afterEach(() => {
            if (fs.existsSync(path.join(tmpPath, 'config.json'))) {
                fs.unlinkSync(path.join(tmpPath, 'config.json'));
            }

            fs.rmdirSync(path.join(tmpPath));
        });

        it('should save an empty config file', () => {
            const config = new Config(path.join(tmpPath, 'config.json'));
            config.saveSync();

            test.bool(fs.existsSync(config.filename)).isTrue();
        });

        it('should save a populated config', () => {
            const config = new Config(path.join(tmpPath, 'config.json'));
            config.data.test = { value: 'hello' };
            config.saveSync();

            test.object(JSON.parse(fs.readFileSync(config.filename)))
                .is(config.data);
        });

        it('should throw an error if unable to save', () => {
            const config = new Config(path.join('/etc', 'config.json'));
            test.exception(() => {
                config.saveSync();
            }).isInstanceOf(Error);
        });
    });

    /** @test {Config#load} */
    describe('Config.load()', () => {
        beforeEach(() => {
            fs.mkdirSync(tmpPath);
            fs.writeFileSync(path.join(tmpPath, 'config.json'), JSON.stringify({
                test: { value: 'hello' }
            }));
        });

        afterEach(() => {
            fs.unlinkSync(path.join(tmpPath, 'config.json'));
            fs.rmdirSync(path.join(tmpPath));
        });

        it('should load from config file', (done) => {
            const config = new Config(path.join(tmpPath, 'config.json'));
            config.load((err) => {
                test.value(err).isNull();
                test.object(config.data).is({
                    test: { value: 'hello' }
                });

                done();
            });
        });

        it('throws an error if the config file is not valid JSON', (done) => {
            fs.writeFileSync(path.join(tmpPath, 'config.json'), 'test');

            const config = new Config(path.join(tmpPath, 'config.json'));
            config.load((err) => {
                test.object(err).isInstanceOf(Error);

                done();
            });
        });

        it('throws an error if the config file doesnt exist', (done) => {
            const config = new Config(path.join(tmpPath, 'unknown.json'));
            config.load((err) => {
                test.object(err).isInstanceOf(Error);

                done();
            });
        });

        it('should auto load from config file', () => {
            const config = new Config(path.join(tmpPath, 'config.json'), true);
            test.object(config.data).is({
                test: { value: 'hello' }
            });
        });
    });

    /** @test {Config#loadSync} */
    describe('Config.loadSync()', () => {
        beforeEach(() => {
            fs.mkdirSync(tmpPath);
            fs.writeFileSync(path.join(tmpPath, 'config.json'), JSON.stringify({
                test: { value: 'hello' }
            }));
        });

        afterEach(() => {
            fs.unlinkSync(path.join(tmpPath, 'config.json'));
            fs.rmdirSync(path.join(tmpPath));
        });

        it('should load from config file', () => {
            const config = new Config(path.join(tmpPath, 'config.json'));
            config.loadSync();

            test.object(config.data).is({
                test: { value: 'hello' }
            });
        });

        it('throws an error if the config file is not valid JSON', () => {
            fs.writeFileSync(path.join(tmpPath, 'config.json'), 'test');

            const config = new Config(path.join(tmpPath, 'config.json'));
            test.exception(() => {
                config.loadSync();
            }).isInstanceOf(Error);
        });

        it('shouldnt throw an error if the file exists and reset', () => {
            const config = new Config(path.join(tmpPath, 'unknown.json'));
            config.set('hello', 'world');

            config.loadSync();
            test.object(config.data).is({});
        });

        it('should auto load from config file', () => {
            const config = new Config(path.join(tmpPath, 'config.json'), true);
            test.object(config.data).is({
                test: { value: 'hello' }
            });
        });
    });
});