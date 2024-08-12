import 'reflect-metadata';
import { FilterMultiSelect, FilterRange, FilterSwitch, FilterType } from './filter.type';
import { ProductFilter } from './product.filter';

interface iFilterInfo {
  title: string;
  position?: number;
  group?: boolean;
  visible?: boolean;
  range?: boolean;
  tip?: string;
  forParent?: boolean;
}

export interface iFilterMetadata<T extends FilterType = any> extends iFilterInfo {
  filter: T;
  key: string;
}

export const decoratorFilterInfo = '@filterInfo';

export function FilterInfo(info: iFilterInfo): PropertyDecorator {
  return (target, key) => {
    // if (info?.forParent) {
    //   target = Object.getPrototypeOf(target) || target;
    // }

    const filters = Reflect.getOwnMetadata(decoratorFilterInfo, target) || [];
    filters.push(Object.assign({ key, position: 0, visible: false, group: false }, info));
    Reflect.defineMetadata(decoratorFilterInfo, filters, target);
  };
}

export abstract class Filter {
  readonly #query: Record<string, string>;

  public static MultiSelect<T>(...args: ConstructorParameters<typeof FilterMultiSelect<T>>): FilterMultiSelect<T> {
    return new FilterMultiSelect<T>(...args);
  }

  public static Range(...args: ConstructorParameters<typeof FilterRange>): FilterRange {
    return new FilterRange(...args);
  }

  public static Switch(...args: ConstructorParameters<typeof FilterSwitch>): FilterSwitch {
    return new FilterSwitch(...args);
  }

  constructor(query: string) {
    this.#query = (query || '').split('|').reduce((a, i) => {
      const pos = i.indexOf('=');
      if (pos > 0) {
        a[i.substring(0, pos)] = i.substring(pos + 1);
      }
      return a;
    }, {});
  }

  protected get list(): string[] {
    return Object.keys(this).filter((k) => this[k] instanceof FilterType);
  }

  setInfo(info: Record<string, any>) {
    this.list.forEach((k) => this[k].init(info[k], this.#query[k]));
    return this;
  }

  collect(): Record<string, any> {
    return this.list.reduce((a, k) => {
      const value = this[k].serialize();
      if (value !== undefined) {
        a[k] = value;
      }
      return a;
    }, {});
  }

  activeFilters(): Record<string, FilterType> {
    return Object.keys(this.collect() || {}).reduce((a, c) => {
      a[c] = this[c] as FilterType;
      return a;
    }, {});
  }

  private getFilterMetadata(target = this) {
    return Reflect.getOwnMetadata(decoratorFilterInfo, target) || [];
  }

  getSpecificProductFilters(forParent = false) {
    return (this.getFilterMetadata(Object.getPrototypeOf(this)) || []).filter((f) => !!f.forParent === forParent);
  }

  getGeneralProductFilters() {
    const generalFilters =
      this.constructor === ProductFilter
        ? (this as this).getSpecificProductFilters()
        : this.getFilterMetadata(Object.getPrototypeOf(Object.getPrototypeOf(this)));
    return [...generalFilters, ...this.getSpecificProductFilters(true)];
  }

  getFilterInfo(): iFilterMetadata[] {
    return Array.from(new Set([...this.getGeneralProductFilters(), ...this.getSpecificProductFilters()]))
      .map((f, i) => {
        f.position = f.position || i;
        f.filter = this[f.key];
        return f;
      })
      .sort((a, b) => a.position - b.position);
  }

  serialize(): string | null {
    const object: Record<string, any> = this.collect();
    return (
      Object.entries(object || {})
        .map(([k, v]) => (!(k && v) ? null : `${k}=${v}`))
        .filter(Boolean)
        .join('|') || null
    );
  }
}
