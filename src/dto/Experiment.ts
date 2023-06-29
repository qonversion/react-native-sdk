import ExperimentGroup from "./ExperimentGroup";

class Experiment {
    id: string;
    name: string;
    group: ExperimentGroup;

    constructor(id: string, name: string, group: ExperimentGroup) {
        this.id = id;
        this.name = name;
        this.group = group;
    }
}

export default Experiment;
