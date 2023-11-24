import { ParsedOptions } from "qs-to-mongo/lib/query/options-to-mongo";
import { CreateProductInput, UpdateProductInput } from "../custom-type";
import { ProductRepository } from "../repositories/product.repository";
import { formateData } from "../utils/formate-data";
import { Category } from "../models/product.model";
import { GetProductDto, GetProductQueryDto } from "../dtos/product.dto";
import qsToMongo from "qs-to-mongo";
import { BadRequestException, NotFoundException } from "../HttpException";
import client from "../redis";

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async createProduct(data: CreateProductInput) {
    try {
      const product = await this.productRepository.createProduct(data);

      if (!product) {
        throw new BadRequestException("create product fail");
      }

      await client.set(`product:${product._id}`, JSON.stringify(product));
      return formateData(true, "create product successfully", product);
    } catch (error) {
      throw error;
    }
  }

  async getProducts(query: any) {
    try {
      const cacheData = await client.get(`product-${query}`);
      if (cacheData) {
        return formateData(
          true,
          "Fetch product successfully",
          JSON.parse(cacheData).products
        );
      }
      const { criteria, options, links } = qsToMongo(query);
      console.log(qsToMongo(query));
      const products = await this.productRepository.getProducts(
        criteria,
        options
      );

      if (products.total === 0) {
        throw new NotFoundException("products not found");
      }

      await client.set(`product-${query}`, JSON.stringify(products));

      return formateData(true, "Fetch product successfully", products.products);
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id: string) {
    try {
      const cacheData = await client.get(`product:${id}`);
      if (cacheData) {
        return formateData(
          true,
          "fetch product by id successfully",
          JSON.parse(cacheData)
        );
      }
      const product = await this.productRepository.getProductById(id);

      if (!product) {
        throw new NotFoundException("product not found");
      }

      await client.set(`product:${product._id}`, JSON.stringify(product));

      return formateData(true, "fetch product by id successfully", product);
    } catch (error) {
      throw error;
    }
  }

  async getProductByCategory(category: Category) {
    // try {
    //   const products = []
    //   await client.scan('0', )
    //   const cacheData = await client.get(`products:${category}`);
    //   if (cacheData) {
    //     return formateData(
    //       true,
    //       "fetch product by id successfully",
    //       JSON.parse(cacheData)
    //     );
    //   }
    //   const products = await this.productRepository.getProductByCategory(
    //     category
    //   );
    //   if (!products.length) {
    //     throw new NotFoundException("product not found");
    //   }
    //   await client.set(`products:${category}`, JSON.stringify(products));
    //   return formateData(true, "fetch product by id successfully", products);
    // } catch (error) {
    //   throw error;
    // }
  }

  async updateProduct(productId: string, data: UpdateProductInput) {
    try {
      const product = await this.productRepository.getProductById(productId);

      if (!product) {
        throw new NotFoundException("product not found");
      }

      const updatedProduct = await this.productRepository.updateProduct(
        product._id.toString(),
        data
      );

      await client.set(`product:${productId}`, JSON.stringify(product));
      await client.set(`products:${product.category}`, JSON.stringify(product));

      return formateData(true, "update product successfully", updatedProduct);
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(productId: string) {
    try {
      const product = await this.productRepository.deleteProduct(productId);

      if (!product) {
        throw new NotFoundException("product not found");
      }

      return formateData(true, "delete product successfully", null);
    } catch (error) {
      throw error;
    }
  }
}
