import { ParsedOptions } from "qs-to-mongo/lib/query/options-to-mongo";
import { CreateProductInput, UpdateProductInput } from "../custom-type";
import { ProductRepository } from "../repositories/product.repository";
import { formateData } from "../utils/formate-data";
import { Category } from "../models/product.model";
import { GetProductDto, GetProductQueryDto } from "../dtos/product.dto";
import qsToMongo from "qs-to-mongo";
import { BadRequestException, NotFoundException } from "../HttpException";
import client from "../redis";
import { RedisClientType } from "redis";
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
      await this.deleteKeysByPattern("filteredProducts");
      return formateData(true, "create product successfully", product);
    } catch (error) {
      throw error;
    }
  }

  async getProducts(query: {
    search?: string | undefined;
    category?: string | undefined;
    sort?: string | undefined;
    limit?: string | undefined;
    skip?: string | undefined;
  }) {
    try {
      const { search, category, sort, limit, skip } = query;
      const cacheKey = `filteredProducts:${search}_${category}_${sort}_${limit}_${skip}`;
      const cacheData = await client.get(cacheKey);
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

      await client.set(cacheKey, JSON.stringify(products));

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
      console.log(updatedProduct);
      await client.set(`product:${productId}`, JSON.stringify(updatedProduct));
      await this.deleteKeysByPattern("filteredProducts");
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
      await client.del(`product:${productId}`);
      await this.deleteKeysByPattern("filteredProducts");
      return formateData(true, "delete product successfully", null);
    } catch (error) {
      throw error;
    }
  }

  async deleteKeysByPattern(pattern: string) {
    const keys = await client.keys(`*${pattern}*`);
    console.log(keys);
    keys.forEach((key) => {
      client
        .del(key)
        .then((res) => console.log(`Deleted Redis cache for key: ${key}`))
        .catch((err) => console.log(err));
    });
  }
}
