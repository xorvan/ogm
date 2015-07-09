'use strict';

import * as ogm from "../";
import {Person, Territory} from "./";

@ogm.className("OwnsTerritory")
export default class OwnsTerritory extends ogm.Edge {

  // @ogm.type(Person)
  // in = this.in;
 
  // @ogm.type(Territory)
  // out = this.out;

  @ogm.type(Date)
  from = this.from;

  @ogm.type(Date)
  to = this.to;

  @ogm.type(Number)
  influence = this.influence;

}
