import Permission from "./Permission";
import Product from "./Product";

class LaunchResult {
  uid: string;
  timestamp: number;
  products: Map<string, Product>;
  permissions: Map<string, Permission>;
  userProducts: Map<string, Product>;

  constructor(
    uid: string,
    timestamp: number,
    products: Map<string, Product>,
    permissions: Map<string, Permission>,
    userProducts: Map<string, Product>
  ) {
    this.uid = uid;
    this.timestamp = timestamp;
    this.products = products;
    this.permissions = permissions;
    this.userProducts = userProducts;
  }
}

export default LaunchResult;
