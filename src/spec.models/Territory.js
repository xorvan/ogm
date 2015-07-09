'use strict';

import * as ogm from "../";

@ogm.className("Territory")
export default class Territory extends ogm.V {

  @ogm.type(String)
  name = this.name;
 
  @ogm.type(Number)
  area = this.area;
}
