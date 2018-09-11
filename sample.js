/**
 * This is Pubus sample
 */

const Pubus = require('./index.js').default;

const bus = new Pubus(5000);

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
  bus.emit('ready');
}, 1500);

setTimeout(() => {
  bus.emit('ready','Hello World!');
  console.log(`I'm fire ready!`);
}, 3000);

setTimeout(() => {
  bus.off('ready', 'ready_tag');
}, 2000);

setTimeout(() => {
  bus.off('ready');
},2500)
