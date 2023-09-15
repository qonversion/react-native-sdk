import {RemoteConfigurationAssignmentType, RemoteConfigurationSourceType} from "./enums";


class RemoteConfigurationSource {
    id: string;
    name: string;
    type: RemoteConfigurationSourceType;
    assignmentType: RemoteConfigurationAssignmentType;

    constructor(id: string, name: string, type: RemoteConfigurationSourceType, assignmentType: RemoteConfigurationAssignmentType) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.assignmentType = assignmentType;
    }
}

export default RemoteConfigurationSource;
