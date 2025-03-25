import { createZodDto } from 'nestjs-zod/dto';
import z, { string } from 'zod';

export const urlSchema = z.string();

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
