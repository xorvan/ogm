'use strict';

import * as ogm from "../";
import {Person} from "./";

@ogm.model("HasVassal")
export default class HasVassal extends ogm.Edge {

  // @ogm.type(Person)
  // in = this.in;

  // @ogm.type(Person)
  // out = this.out;

  @ogm.property(Number)
  control = this.control;

}
