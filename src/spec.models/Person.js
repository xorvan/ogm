'use strict';

import * as ogm from "../";

@ogm.model("Person")
export default class Person extends ogm.V {

  @ogm.property(String)
  name = this.name;

  @ogm.property(Number)
  age = this.age;
}
