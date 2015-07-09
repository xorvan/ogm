'use strict';

import _ from 'lodash';
import {isRid, session} from './';

export default class V {

  constructor (obj) {
    if (obj && typeof obj === 'object') {
      this.object = obj;
    }
  }

  static async sync() {

    //TODO: Checking for class existence and syncing properties
    var Class = await session.db.class.create(this._OGM_CLASS_NAME, this.__proto__._OGM_CLASS_NAME);
    return Class;
  }

  static get(rid) {
    return session.db.record.get(rid);
  }

  static select(s) {
    return session.db.select(s).from(this._OGM_CLASS_NAME);
  }

  static query(q) {
    var r = session.db.select().from(this._OGM_CLASS_NAME);

    if (q && !_.isEmpty(q)) {
      r = r.where(q);
    }

    return r;
  }

  static create (...args) {
    var vertex = new this(...args);
    return vertex.save();
  }

  static delete(q) {
    if (isRid(q + '')) {
      return session.db.record.delete(q);
    } else {
      var r = session.db.delete().from(this._OGM_CLASS_NAME);
      if (q) {
        r = r.where(q);
      }
      return r;
    }
  }

  get object () {
    var r = {};
    this._OGM_PROPS.forEach(prop => {
      r[prop.name] = this[prop.name];
    }.bind(this));

    return r;
  }

  set object (value) {
    Object.keys(value).forEach(key => {
      this[key] = value[key];
    }.bind(this));

  }

  select (s) {
    if (!this['@rid']) {
      throw new Error('Cannot query from unsaved vertex!');
    }

    return session.db.select(s).from(this['@rid']);
  }

  selectNeighbour (dir, cl, ...criterions) {
    var exp = '';

    //TODO: handlig object criterias
    criterions.forEach(criteria => {
      exp += '[' + criteria + ']';
    });

    var clName = typeof cl === 'string' ? cl : cl._OGM_CLASS_NAME;

    return this.select('expand(' + dir + '(' + clName + ')' + exp +  ')');
  }

  outV (edge, ...criterions) {
    return this.selectNeighbour('out', edge, ...criterions);
  }

  inV (edge, ...criterions) {
    return this.selectNeighbour('in', edge, ...criterions);
  }

  bothV (edge, ...criterions) {
    return this.selectNeighbour('both', edge, ...criterions);
  }

  outE (edge, ...criterions) {
    return this.selectNeighbour('outE', edge, ...criterions);
  }

  inE (edge, ...criterions) {
    return this.selectNeighbour('inE', edge, ...criterions);
  }

  bothE (edge, ...criterions) {
    return this.selectNeighbour('bothE', edge, ...criterions);
  }

  async save () {
    if (this['@rid']) {
      return session.db.update(this['@rid']).set(this.object).scalar();
    } else {
      var obj = await session.db.insert().into(this._OGM_CLASS_NAME).set(this.object).one();
      this.object = obj;
      return obj;
    }
  }

  delete () {
    return this.constructor.delete(this['@rid']);
  }

}
