'use strict'
const config = require('./config')
const jimbo = require('jimbo')

let server = jimbo()

server.connection({
  channel: 'sitegate-oauth',
  amqpURL: 'amqp://guest:guest@localhost:5672',
})

server
  .register([
    {
      register: require('./models'),
      options: {
        mongoURI: config.get('mongodbURI'),
      },
    },
    {
      register: require('jimbo-client'),
    },
    {
      register: require('./clients'),
      options: {
        amqpURL: config.get('amqpURI'),
      },
    },
    {
      register: require('./app/methods/auth-token'),
    },
    {
      register: require('./app/methods/create-code'),
    },
    {
      register: require('./app/methods/exchange'),
    },
    {
      register: require('./app/methods/is-trusted'),
    },
  ])
  .then(() => server.start())
  .then(() => console.log('oauth server started'))
  .catch(err => {throw err})
