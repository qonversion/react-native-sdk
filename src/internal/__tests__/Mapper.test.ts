import Mapper from '../Mapper';
import { RemoteConfigurationAssignmentType } from '../../dto/enums';

describe('remote configuration assignment provenance', () => {
  it('preserves frozen and keeps unknown values fail-safe', () => {
    expect(Mapper.convertRemoteConfigurationAssignmentType('frozen')).toBe(
      RemoteConfigurationAssignmentType.FROZEN
    );
    expect(Mapper.convertRemoteConfigurationAssignmentType('future')).toBe(
      RemoteConfigurationAssignmentType.UNKNOWN
    );
  });
});
