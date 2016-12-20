const {basename, dirname, sep} = require('path');
const filename = basename(__filename);
const expect = require('expect.js');
const net = require('net');
const tls = require('tls');

const Ouroboros = require('../');

describe(filename, () => {

  context('validations', () => {

    it('requires a join list', done => {

      let ouroboros = new Ouroboros();

      ouroboros.start([], {}, true)

        .catch(error => {
          expect(error.toString()).to.equal('Error: No hosts to join');
        })

        .then(done).catch(done);

    });

  });

  context('seed new network', () => {

    let ouroboros;

    afterEach('stop', () => {
      return ouroboros.stop();
    });

    it('starts a new open (unencrypted) network', () => {

      ouroboros = new Ouroboros();

      return ouroboros.start([
        '127.0.0.1:55531',
        '127.0.0.1:55532',
        '127.0.0.1:55533',
        '127.0.0.1:55534'
      ], {}, true)

        .then(() => {
          expect(ouroboros.server.address()).to.eql({
            address: '0.0.0.0',
            family: 'IPv4',
            port: 65533
          })
        })

        .then(() => {
          expect(ouroboros.server).to.be.an(net.Server);
        })

    });

    it('fails to start on bad listen ', () => {

      ouroboros = new Ouroboros({host: '127.0.0.44'});

      return ouroboros.start([
        '127.0.0.1:55531',
        '127.0.0.1:55532',
        '127.0.0.1:55533',
        '127.0.0.1:55534'
      ], {}, true)

        .catch(error => {
          expect(error.code).to.equal('EADDRNOTAVAIL');
        })

    });

    it('starts a new closed (encrypted) network', () => {

      ouroboros = new Ouroboros({
        keyFile: dirname(__dirname) + sep + 'server.key',
        certFile: dirname(__dirname) + sep + 'server.cert',
        secret: 'secret',
      });

      return ouroboros.start([
        '127.0.0.1:55531',
        '127.0.0.1:55532',
        '127.0.0.1:55533',
        '127.0.0.1:55534'
      ], {}, true)

        .then(() => {
          expect(ouroboros.server.address()).to.eql({
            address: '0.0.0.0',
            family: 'IPv4',
            port: 65533
          })
        })

        .then(() => {
          expect(ouroboros.server).to.be.an(tls.Server);
        })

    });

    it('fails to start on bad keyFile or certFile path', done => {

      ouroboros = new Ouroboros({
        keyFile: dirname(__dirname) + sep + 'server.key',
        certFile: dirname(__dirname) + sep + 'wrong.cert', // <--------
        secret: 'secret',
      });

      ouroboros.start([
        '127.0.0.1:55531',
        '127.0.0.1:55532',
        '127.0.0.1:55533',
        '127.0.0.1:55534'
      ], {}, true)

        .catch(error => {
          expect(error.code).to.equal('ENOENT');
        })

        .then(done).catch(done);


    });

  });

});
