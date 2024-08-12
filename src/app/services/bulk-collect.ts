export class BulkCollect<D, R, K extends keyof D, I = D[K]> {
  protected collected: I[];

  public readonly collectedData = new Map<I, R>();

  get collectedIds() {
    return this.collected;
  }

  static from<I>(collected: I[]): BulkCollect<any, any, any> {
    const bulk = new BulkCollect([], 'id');
    bulk.collected = collected;
    return bulk;
  }

  constructor(data: D[], private readonly key: K) {
    this.collected = Array.from(new Set(data.map((d) => d[key]))) as I[];
  }

  async collect(collect: (ids: I[]) => Promise<R[]>, key: keyof R = 'id' as keyof R) {
    return collect(this.collected).then((collected) => {
      (collected || []).forEach((c) => this.collectedData.set(c[key] as I, c));
      return this;
    });
  }

  attach(data: D[], as: string): D[] {
    (data || []).forEach((d) => {
      d[as] = this.collectedData.get(d[this.key] as I);
    });
    return data;
  }
}
