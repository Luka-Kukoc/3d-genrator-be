import { createZodDto } from 'nestjs-zod/dto';
import z from 'zod';

export const urlSchema = z.string();

const dimensionsSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
});

export const scrapePostSchema = z.object({
  url: z.string(),
});

export const productSchema = z.object({
  name: z.string(),
  price: z.number(),
  dimensions: z.string(),
  imageUrl: z.string(),
  productUrl: z.string(),
});

export class ScrapeDto extends createZodDto(scrapePostSchema) {}
export const saveProductsSchema = z.array(productSchema);

export const generateModelPostSchema = z.object({
  url: z.string(),
  dimensions: dimensionsSchema,
});

export class GnerateModelDto extends createZodDto(generateModelPostSchema) {}
