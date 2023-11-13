import {ProductPeriodUnit} from "./enums";

class ProductPeriod {
    count: number;
    iso: string;
    unit: ProductPeriodUnit;

    constructor(
        count: number,
        iso: string,
        unit: ProductPeriodUnit
    ) {
        this.count = count;
        this.iso = iso;
        this.unit = unit;
    }
}

export default ProductPeriod;
