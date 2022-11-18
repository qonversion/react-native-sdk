class User {
  qonversionId: string;
  identityId?: string | null;

  constructor(qonversionId: string, identityId?: string | null) {
    this.qonversionId = qonversionId;
    this.identityId = identityId;
  }
}

export default User;
