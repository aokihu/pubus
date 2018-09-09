/**
 * This is Pubus sample
 */

const Pubus = require('./index');

const bus = new Pubus();

/**
 * Example 1
 *
 * You can easily registe an event listener like other event
 * and you can add an additional params 'TAG' for the listener
 * it will be used in remove listener
 *
 */
bus.on('ready', () => {console.log('Bus is ready!')}, 'ready_tag');

setTimeout(() => {
  bus.emit('ready');
}, 1500);

setTimeout(() => {
  console.log(`I'm fire ready!`);
  bus.emit('ready');
}, 3000);

setTimeout(() => {
  bus.off('ready', 'ready_tag');
}, 2000);
