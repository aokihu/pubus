# pubus 

Yes, this is an other event bus system.

Sometime we don't need the event be sent immediately, maybe hoped it can be slowly,
so the `Pubus` bus can do it.

Now, every event will be controlled by event loop manager, after one event listenter is done,
the next listenter will not work immediately, it will wait sometimes for work, the blood of event will not be happened.

And I was hate the remove listener method in other event manager, you have to pass the `callback function` for the param, so you can not use anonymous function, because it only not have function's name, why we have to use outdated way? so I use `TAG` instead of `callback function`, you can remove 
listenter use `TAG`, it is string, it is so easily to use, you can use anonymous function now!

## Install

You can install use `npm` or `yarn`

```bash
npm install pubus
```

OR 

```bash
yarn add pubus
```

## Usage

```javascript
const Pubus = require('pubus');

// Initialize
const bus = new Pubus();

// Register listenter with anonymous function
bus.on('event-one', () => 
  console.log('Event One Emitted by anonymous function!')
})

// Register listenter with named function
function handlerEvent() {console.log('Event One Emitted by hadlerEvent')}
bus.on('event-one', handlerEvent);

// Add tag
bus.on('event-one', handlerEvent, 'event-one-tag');

// Emit event without payload
bus.emit('event-one')

// Emit event with payload
bus.emit('event-one', 'hello wold')

// Remove listener by tag
bus.off('event-one', 'event-one-tag')
```

## API

* on(eventName, callback, tag?)
* addListener(eventName, callback, tag?)
* emit(eventName, ...payload)
* off(eventName, tag?)
* removeListenter(eventName, tag?)