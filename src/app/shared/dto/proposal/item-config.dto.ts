export class ItemConfigDTO {
  constructor(
    public cod?: string,
    public label?: string) {
      this.cod = cod.toLowerCase();
      this.label = label.toLowerCase();
  }
}
