export class Qualification {
  public id: number;
  public name: string;
  public seq: number;
  public parentId: number;
  public required: boolean;
  public active: boolean;
  public first: any;
  public breadcrumbNamePath: string;

  getFormatedPath( separator: string ) {
    return ( this.breadcrumbNamePath ? this.breadcrumbNamePath.replace( /,/g, separator ) : "-" );
  }
}
