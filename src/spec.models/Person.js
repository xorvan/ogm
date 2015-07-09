'use strict';

import * as ogm from "../";

@ogm.className("Person")
export default class Person extends ogm.V {

  @ogm.type(String)
  name = this.name;
 
  @ogm.type(Number)
  age = this.age;
}
