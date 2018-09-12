/**
 * This is Pubus sample
 */

const Pubus = require('./index.js').default;

const bus = new Pubus();

/**
 * Example 1
 *
 * You can easily registe an event listener like other event
 * and you can add an additional params 'TAG' for the listener
 * it will be used in remove listener
 *
 */
bus.on('ready', (word) => {console.log('Bus is ready!', word)}, 'ready_tag');

setTimeout(() => {
  bus.emit('ready','Hello World 1');
}, 1500);

setTimeout(() => {
  bus.emit('ready','Hello World 2');
  console.log(`I'm fire ready!`);
}, 3000);

setTimeout(() => {
  bus.off('ready', 'ready_tag');
}, 2000);

setTimeout(() => {
  bus.off('ready');
},2500)

// Event Blood Test

bus.on('blood', (index) => {
  console.log('blood', index);
});

setTimeout(() => {
  console.log('Event Blood Sample');

  [...Array(10).keys()].map(index => {
    bus.emit('blood', index);
  })

}, 5000)
