const {basename, dirname, SEP} = require('path');
const filename = basename(__filename);
const expect = require('expect.js');
const {Server} = require('net');

const Ouroboros = require('../');

describe(filename, () => {


  context('validations', () => {

    it('requires a join list', done => {

      let ouroboros = new Ouroboros();

      ouroboros.start([])

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
      ], true)

        .then(() => {
          expect(ouroboros.server.address()).to.eql({
            address: '0.0.0.0',
            family: 'IPv4',
            port: 65533
          })
        })

        .then(() => {
          expect(ouroboros.server).to.be.an(Server);
        })

    });

    it('starts a new closed (encrypted) network', () => {

      ouroboros = new Ouroboros({
        keyFile: dirname(__dirname) + SEP + 'server.key',
        certFile: dirname(__dirname) + SEP + 'server.cert',
        secret: 'secret',
      });

      return ouroboros.start([
        '127.0.0.1:55531',
        '127.0.0.1:55532',
        '127.0.0.1:55533',
        '127.0.0.1:55534'
      ], true)

        .then(() => {
          expect(ouroboros.server.address()).to.eql({
            address: '0.0.0.0',
            family: 'IPv4',
            port: 65533
          })
        })

        .then(() => {
          expect(ouroboros.server).to.be.an(Server);
        })

    });

  });

});
