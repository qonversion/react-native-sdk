import Experiment from "./Experiment";

class RemoteConfig {
    payload: Map<string, Object>;
    experiment?: Experiment | null;

    constructor(payload: Map<string, Object>, experiment: Experiment | null) {
        this.payload = payload;
        this.experiment = experiment;
    }
}

export default RemoteConfig;
