export abstract class FilterType {
  public readonly colId?: string;

  info(info: any, language: string) {
    return info;
  }

  abstract init(info: any, query: any): this;

  abstract collectInfo(): any;

  abstract serialize(): string | undefined;
}

export class FilterMultiSelect<T> extends FilterType {
  selected: Record<string, any> = {};

  constructor(
    public list: T[] = [],
    public readonly valueKey: keyof T = 'value' as keyof T,
    public readonly colId?: string,
    public readonly idKey: keyof T = 'id' as keyof T,
  ) {
    super();
  }

  info(info: any[], language: string) {
    return (info || []).map((i) => {
      i = i?.setLanguage?.(language) || i;
      return i?.toJson?.() || i;
    });
  }

  init(info: any, query: string): this {
    const selected = (query || '').split(',') || [];
    this.list = info && Array.isArray(info) ? info : [];
    this.selected = this.list.reduce((a, i) => {
      const id = (i as { id: number }).id;
      if ((selected || []).includes(String(id))) {
        a[id] = true;
      }
      return a;
    }, {});
    return this;
  }

  collectInfo() {
    const selectedIds = Object.entries(this.selected || {})
      .filter(([, v]) => v)
      .map(([k]) => k) as T[keyof T][];
    return this.list
      .filter((i) => selectedIds.includes(String(i?.[this.idKey]) as T[keyof T]))
      .map((i) => i?.[this.valueKey]);
  }

  serialize() {
    const value = Object.keys(this.selected).filter((k) => this.selected[k]);
    return value?.length ? value.join(',') : undefined;
  }
}

export class FilterSwitch extends FilterType {
  constructor(
    public checked = false,
    public asNotNull = false,
  ) {
    super();
  }

  collectInfo() {
    return this.checked;
  }

  serialize(): string | undefined {
    return this.checked ? '1' : undefined;
  }

  init(info: any, query: any): this {
    this.checked = query === '1';
    return this;
  }
}

export class FilterRange extends FilterType {
  public selectedMin: number;
  public selectedMax: number;

  constructor(
    public min: number,
    public max: number,
  ) {
    super();
    this.selectedMin = min;
    this.selectedMax = max;
  }

  info(info: any) {
    return {
      min: info?.min || this.min,
      max: info?.max || this.max,
    };
  }

  init(info: any, query: string) {
    this.min = Number(info?.min || this.min);
    this.max = Number(info?.max || this.max);

    const [selectedMin, selectedMax] = (query || '')
      .split(':')
      .map((v) => Number(v))
      .sort((a, b) => a - b);

    this.selectedMin = Number(selectedMin || this.min);
    this.selectedMax = Number(selectedMax || this.max);

    if (this.selectedMin < this.min) {
      this.selectedMin = this.min;
    }

    if (this.selectedMax > this.max) {
      this.selectedMax = this.max;
    }

    return this;
  }

  collectInfo() {
    return {
      min: this.selectedMin,
      max: this.selectedMax,
    };
  }

  serialize() {
    const min = this.selectedMin !== this.min ? this.selectedMin : undefined;
    const max = this.selectedMax !== this.max ? this.selectedMax : undefined;
    return min || max ? [min || this.min, max || this.max].join(':') : undefined;
  }
}
