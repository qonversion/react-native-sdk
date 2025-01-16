import Experiment from "./Experiment";
import RemoteConfigurationSource from "./RemoteConfigurationSource";

class RemoteConfig {
    payload: Record<string, Object>;
    experiment?: Experiment | null;
    source: RemoteConfigurationSource;

    constructor(payload: Record<string, Object>, experiment: Experiment | null, source: RemoteConfigurationSource) {
        this.payload = payload;
        this.experiment = experiment;
        this.source = source;
    }
}

export default RemoteConfig;
