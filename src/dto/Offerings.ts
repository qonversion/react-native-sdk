import Offering from "./Offering";

class Offerings {
  main: Offering | null;
  availableOffering: Array<Offering>;

  constructor(main: Offering | null, availableOfferings: Array<Offering>) {
    this.main = main;
    this.availableOffering = availableOfferings;
  }

  offeringForIdentifier(identifier: string): Offering | undefined {
    return this.availableOffering.find((object) => object.id === identifier);
  }
}

export default Offerings;
