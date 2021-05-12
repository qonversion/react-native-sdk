import { ExperimentGroupType } from "../enums";

class ExperimentGroup {
  type: ExperimentGroupType;

  constructor(type: ExperimentGroupType) {
    this.type = type;
  }
}

export default ExperimentGroup;
