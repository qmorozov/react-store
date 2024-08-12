import type { Product } from '../../product/models/Product.abstract';
import type { Category } from '../../product/models/category.entity';

export const enum SearchSuggestionType {
  Query = 'query',
  QueryInCategory = 'queryInCategory',
  Product = 'product',
  Category = 'category',
}

export class SearchSuggestion {
  static query(query: string) {
    return new SearchSuggestion(query, SearchSuggestionType.Query);
  }

  static product(product: Product<any>) {
    return new SearchSuggestion(product.title, SearchSuggestionType.Product, product.url);
  }

  static queryInCategory(category: Category) {
    return new SearchSuggestion(category.name, SearchSuggestionType.QueryInCategory, category.url);
  }

  static category(category: Category) {
    return new SearchSuggestion(category.name, SearchSuggestionType.Category, category.url);
  }

  protected constructor(
    public readonly suggestion: string,
    public readonly type: SearchSuggestionType,
    public readonly id?: string | number,
  ) {}
}
