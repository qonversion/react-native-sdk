import { ExperimentGroupType } from "./enums";

class ExperimentGroup {
    id: string;
    name: string;
    type: ExperimentGroupType;

    constructor(id: string, name: string, type: ExperimentGroupType) {
        this.id = id;
        this.name = name;
        this.type = type;
    }
}

export default ExperimentGroup;
