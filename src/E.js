'use strict';

import {session} from './';

var debug = require("debug")("ogm");

export default class E{

  constructor (inV, outV, props) {

    var _this = this;

    if (inV && typeof inV === 'object') {
      Object.keys(inV).forEach(key => {
        _this[key] = inV[key];
      });
    } else {
      this.in = inV;
      this.out = outV;
      this.props = props;
    }

  }

  save () {
    debug('saving edge', this);
    var r = session.db.create('EDGE', this._OGM_CLASS_NAME)
      .from(typeof this.inV === 'object' ? this.inV['@rid'] : this.inV)
      .to(typeof this.outV === 'object' ? this.outV['@rid'] : this.outV);

    if (this.props) {
      r.set(this.props);
    }

    return r.one();
  }

  static delete (q) {
    var r = session.db.delete().from(this._OGM_CLASS_NAME || 'E');
    if (q) {
      r = r.where(q);
    }

    return r;
  }

  static create (...args){
    var edge = new this(...args);
    return edge.save();
  }

}
