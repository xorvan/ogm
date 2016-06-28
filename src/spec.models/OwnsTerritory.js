'use strict';

import * as ogm from "../";
import {Person, Territory} from "./";

@ogm.model("OwnsTerritory")
export default class OwnsTerritory extends ogm.Edge {

  // @ogm.type(Person)
  // in = this.in;

  // @ogm.type(Territory)
  // out = this.out;

  @ogm.property(Date)
  from = this.from;

  @ogm.property(Date)
  to = this.to;

  @ogm.property(Number)
  influence = this.influence;

}
