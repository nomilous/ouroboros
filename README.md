[![Build Status](https://travis-ci.org/nomilous/ouroboros.svg?branch=master)](https://travis-ci.org/nomilous/ouroboros)[![Coverage Status](https://coveralls.io/repos/github/nomilous/ouroboros/badge.svg?branch=master)](https://coveralls.io/github/nomilous/ouroboros?branch=master)

# ouroboros

Network peer membership discovery and dissemination.

### Introduction



### Installation

Not yet published to npm, point package.json directly to github repo.

```json
{
  "dependencies": {
    "ouroboros": "nomilous/ouroboros"
  }
}
```



### Usage

```javascript
const Ouroboros = require('ouroboros');
const ouroboros = new Ouroboros(config);

ouroboros.on('member-join', member => {});
ouroboros.on('member-leave', member => {});

ouroboros.start(joinList, meta, seed)
  .then(...
```



#### constructor(config)

```javascript
config = {
  host: '0.0.0.0'
  port: 65533
  keyFile:
  certFile: 
  secret: 'secret'
}
```

##### host and port

*optional, default shown above*

The listening host and port of this service. The defaults shown above.

##### keyFile and certFile

*optional, no default*

If present the service listens with a TLS server. Must point to valid key and cert file. No Default.

##### secret

*optional, default shown above*

Set the shared secret that all hosts in the network should know. Use with TLS.



#### .start(joinList, meta, seed)

*returns Promise of connected network membership*

##### joinList

*required*

Array of addresses of the other network nodes to use in the join attempt.

eg

```javascript
joinList = ['10.0.0.45:65533', '10.0.0.46:65533', '10.0.0.47:65533']
```

##### meta

*optional, default {}*

Object containing meta information about this member that is shared with all outher members.

##### seed

*optional, default false*

If true then if this member's attempt to join the cluster failed, this becomes the first member in a new cluster.

