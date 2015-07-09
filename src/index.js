'use strict';

var debug = require('debug')('ogm');

import OrientDB from 'orientjs';
import V from './V';
import E from './E';

var classes = {};

export { V, E };

var _db;

function transformer (Cl) {
  return function(obj){
    return new Cl(obj);
  };
}

export var session = {
  get db () {
    return _db;
  },
  set db (value) {
    _db = value;

    Object.keys(classes).forEach( (name) => {
      _db.registerTransformer(name, transformer(classes[name]));
    });
  }
};

export function connect(config) {
  session.server = session.orientServer = OrientDB(config);
  return session.server;
}

export function use(config) {
  session.db = session.orientServer.use(config);
  return session.db;
}

export function getClass(name) {
  return classes[name];
}

export function isRid(q) {
  return q.indexOf('#') === 0;
}

// Decorators
export function type (typeName) {
  return function(target, name, descriptor) {

    debug("Registering prop", typeName, name, target, descriptor);

    if (!target._OGM_PROPS) {
      target._OGM_PROPS = [];
    }

    target._OGM_PROPS.push({
      name: name,
      type: typeName
    });

  };

}

export function className(name) {
  return function(target) {

    debug("Registering class", name, target);

    if (session.db) {
      session.db.registerTransformer(name, transformer(target));
    }

    classes[name] = target;
    target.prototype._OGM_CLASS_NAME = name;
    target._OGM_CLASS_NAME = name;
  };

}

className("V")(V);
className("E")(E);