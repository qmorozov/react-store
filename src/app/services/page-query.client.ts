export const PageQuery = new (class PageQuery {
  readonly query = new URLSearchParams(window.location.search);

  set(name: string, value: string | any) {
    if (value === undefined || value === null) {
      this.query.delete(name);
    } else {
      this.query.set(name, String(value));
    }
    this.update();
  }

  update() {
    window.location.search = this.query.toString();
  }
})();
