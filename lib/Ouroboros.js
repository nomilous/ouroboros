require('./overrides');
const debug = require('debug')('ouroboros');
const net = require('net');
const defaultPort = 65533;

class Ouroboros {

  constructor({host, port, keyFile, certFile, secret} = {}) {
    debug('constructor');
    this.host = host || '0.0.0.0';
    this.port = port || defaultPort;

    // if present use TLS socket and secret auth
    this.keyFile = keyFile;
    this.certFile = certFile;
    this.secret = secret || 'secret'; // TODO: users?, changing secret on existing network?

    // trick to get promise.all() to run in series
    this.connecting = [];
  }


  start(joinList, seed = false) {
    debug('start');
    // joinList == ['10.0.0.4:65533', '10.0.0.5:65533']
    // ie. at least one existing other node in network

    // if seed == true it accepts failure to join
    // so still attempt to connect to joinList,
    // but on failure become new network

    if (joinList.length < 1) {
      return Promise.reject(new Error('No hosts to join'));
    }

    return Promise.every(joinList.map(this.connect.bind(this)))

      // .then(sockets => {
      //   console.log(sockets);
      //   return sockets;
      // })

      .then(sockets => {
        return sockets.filter(socket => socket instanceof Error == false)
      })

      .then(sockets => {
        debug('connected to %d sockets', sockets.length);
        if (sockets.length == 0) {
          if (seed) return this.startSeed();
          throw new Error('No hosts available');
        }
        return this.startJoin(sockets);
      })
  }


  stop() {
    debug('stop');
    return new Promise((resolve, reject) => {
      if (this.server) {
        this.server.close();

        // TODO: close sockets

      }
      resolve();
    })
  }


  connect(address) {
    debug('attempt connect %s', address);
    return new Promise((resolve, reject) => {
      let parts = address.split(':');
      let port = parseInt(parts.pop());
      let host = parts.join(':');

      // TODO: timeout on long connect attempts

      let socket = net.connect({port: port, host: host});
      socket.once('error', reject);
    });
  }


  listen() {
    debug('attempting listen %s:%d', this.host, this.port);
    return new Promise((resolve, reject) => {
      this.server = net.createServer(this.onConnection.bind(this));

      this.server.once('error', reject);
      this.server.once('listening', resolve);

      this.server.listen(this.port, this.host);
    });
  }

  startSeed() {
    debug('startSeed');
    return this.listen()
  }


  startJoin(sockets) {
    debug('startJoin');
    return this.listen()
  }


  onConnection(socket) {
    debug('onConnection');
  }

}

module.exports = Ouroboros;
