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
const Pubus = require('pubus').default;
// Or if you use Typescript you can do this
import Pubus from 'pubus';

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

* constructor(throttle?)
* Pubus#on(eventName, callback, tag?)
* Pubus#addListener(eventName, callback, tag?)
* Pubus#emit(eventName, ...payload)
* Pubus#off(eventName, tag?)
* Pubus#removeListenter(eventName, tag?)

### constructor(throttle?)

This is construct function, the param `throttle` is the wait time for each task, the unit is `ms`
and default vaule is `30ms`, you can adjust it by yourself.

### Pubus#on(eventName, callback, tag?)

Add listenter for event, like other event system, but you can add addtional param `tag`, then you can remove listenter by tag;

```javascript
const bus = new Pubus();
bus.on('ready', () => {console.log('Ready!')}, 'tag-for-ready');
```

YES! you can use anonymous function NOW!��


### Pubus#emit(eventName, ...payload)

This fire event, but event will not work immediately, when the event of same name was fired before,
it will wait `throttle` time, and work. So the blood of event was not be happened.

### Pubus#off(eventName, tag?)

It's used to remove listener, you can add the second param `tag` to remove special listener which registerd with tag.
So anonymous function also can be removed.
