import fs from "fs";
import path from "path";

interface ProductSize {
  id: string;
  size: string;
  price: string;
  generalDescription: string;
  priceLivraison: string | null;
  created_at: string;
}

interface Product {
  id: string;
  type: string;
  name: string;
  description: string;
  longDescription: string | null;
  productSizes: ProductSize[];
  [key: string]: any;
}

interface FilteredProduct {
  id: string;
  type: string;
  name: string;
  description: string;
  longDescription: string | null;
  productSizes: {
    size: string;
  }[];
}

const inputFilePath = path.join(__dirname, "..", "data", "products.json");
const outputFilePath = path.join(
  __dirname,
  "..",
  "data",
  "products-filtered.json"
);

fs.readFile(inputFilePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  try {
    const products: Product[] = JSON.parse(data);

    const filteredProducts: FilteredProduct[] = products.map((product) => {
      return {
        id: product.id,
        type: product.type,
        name: product.name,
        description: product.description,
        longDescription: product.longDescription,
        productSizes: product.productSizes.map((size) => ({
          size: size.size,
        })),
      };
    });

    fs.writeFile(
      outputFilePath,
      JSON.stringify(filteredProducts, null, 2),
      "utf8",
      (err) => {
        if (err) {
          console.error("Error writing the file:", err);
          return;
        }
        console.log(
          "Successfully filtered products and saved to",
          outputFilePath
        );
      }
    );
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
});
