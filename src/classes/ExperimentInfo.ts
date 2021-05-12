import ExperimentGroup from "./ExperimentGroup";

class ExperimentInfo {
  identifier: string;
  group: ExperimentGroup;

  constructor(identifier: string, group: ExperimentGroup) {
    this.identifier = identifier;
    this.group = group;
  }
}

export default ExperimentInfo;
