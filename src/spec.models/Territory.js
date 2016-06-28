'use strict';

import * as ogm from "../";

@ogm.model("Territory")
export default class Territory extends ogm.V {

  @ogm.property(String)
  name = this.name;

  @ogm.property(Number)
  area = this.area;
}
