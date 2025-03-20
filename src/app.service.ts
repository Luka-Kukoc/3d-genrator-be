import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  scrape(url: string): Array<object> {
    return [];
  }

  saveProducts(): Array<object> {
    return [];
  }
}
