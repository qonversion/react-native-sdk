import RemoteConfig from './RemoteConfig';

class RemoteConfigList {
    remoteConfigs: Array<RemoteConfig>;

    constructor(remoteConfigs: Array<RemoteConfig>) {
        this.remoteConfigs = remoteConfigs;
    }

    remoteConfigForContextKey(contextKey: string): RemoteConfig | undefined {
        return this.findRemoteConfigForContextKey(contextKey);
    }

    remoteConfigForEmptyContextKey(): RemoteConfig | undefined {
        return this.findRemoteConfigForContextKey(null);
    }

    private findRemoteConfigForContextKey(contextKey: string | null): RemoteConfig | undefined {
        return this.remoteConfigs.find(config => config.source.contextKey == contextKey);
    }
}

export default RemoteConfigList;
