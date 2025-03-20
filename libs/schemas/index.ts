import { createZodDto } from 'nestjs-zod/dto';
import z, { string } from 'zod';

export const urlSchema = z.string();

export const scrapePostSchema = z.object({
  url: z.string(),
});
export class ScrapeDto extends createZodDto(scrapePostSchema) {}
