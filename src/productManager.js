import fs from "fs";

class ProductManager {
  static #path = "./mock/products.json";
  constructor() {
    this.products = [];
    ProductManager.#path;
  }

  _getNextId = () => {
    const data = fs.readFileSync(ProductManager.#path);
    const products = JSON.parse(data);

    const count = products.length;
    const nextId = count > 0 ? products[count - 1].id + 1 : 1;

    return nextId;
  };

  _getLocaleTime = () => {
    const time = new Date().toLocaleTimeString();
    return time;
  };

  _createFile = async () => {
    try {
      await fs.promises.access(ProductManager.#path);
    } catch (error) {
      await fs.promises.writeFile(ProductManager.#path, "[]");

      console.log(`Archivo creado correctamente.`);
    }
  };

  _saveData = async (data) => {
    try {
      await fs.promises.writeFile(
        ProductManager.#path,
        JSON.stringify(data, null, 2)
      );
    } catch (error) {
      console.log(err);
    }
  };

  _readData = async () => {
    try {
      const data = await fs.promises.readFile(ProductManager.#path, "utf-8");
      const products = JSON.parse(data);
      return products;
    } catch (error) {
      console.log(err);
    }
  };

  addProduct = async (title, description, price, thumbnail, code, stock) => {
    try {
      const fileExist = fs.existsSync(ProductManager.#path);

      if (!fileExist) {
        await this._createFile();
      }

      const products = await this.getProducts();

      const product = {
        id: this._getNextId(),
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };

      if (products.find((product) => product.code === code)) {
        console.log(
          `Product with code ${
            product.code
          } already exists - ${this._getLocaleTime()}`
        );
      } else {
        products.push(product);
        await this._saveData(products);

        console.log(
          `Producto Cargado - ${this._getLocaleTime()}`
        );
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  getProducts = async () => {
    try {
      const fileExist = fs.existsSync(ProductManager.#path);

      if (!fileExist) {
        await this._createFile();

        console.log(`[] - ${this._getLocaleTime()}`);
      } else {
        const products = await this._readData();

        return products;
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  getProductById = async (id) => {
    try {
      const products = await this.getProducts();
      const product = Object.values(products).find((i) => i.id === id);

      if (product === undefined) {
        console.log(`No Encontrado - ${this._getLocaleTime()}`);
      } else {
        console.log(product);
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  updateProduct = async (id, props) => {
    try {
      const products = await this.getProducts();

      const ix = await products.findIndex((product) => product.id === id);

      if (ix === -1) {
        console.log("El Producto NO Existe");
      } else if (props.hasOwnProperty("id") || props.hasOwnProperty("code")) {
        console.log("No se puede cargar 'id' o 'code'");
      } else {
        Object.assign(products[ix], props);
        const updatedProduct = products[ix];
        await this._saveData(products);

        console.log(updatedProduct);
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  deleteProduct = async (id) => {
    try {
      let products = await this.getProducts();

      const product = Object.values(products).find((i) => i.id === id);

      if (product !== undefined) {
        products = products.filter((i) => i.id !== id);
        await this._saveData(products);

        console.log(`Producto Eliminado - ${this._getLocaleTime()}`);
      } else {
        console.log(`El Producto NO Existe - ${this._getLocaleTime()}`);
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };
}

const productManager = new ProductManager();
