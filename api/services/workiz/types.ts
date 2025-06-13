export interface WorkizJob {
  UUID: string;
  LocationId: number;
  LocationKey: string;
  SerialId: number;
  JobDateTime: string;
  JobEndDateTime: string;
  CreatedDate: string;
  JobTotalPrice: number;
  JobAmountDue: number;
  SubTotal: number;
  item_cost: number;
  tech_cost: number;
  ClientId: number;
  Status: string;
  SubStatus: string;
  PaymentDueDate: string;
  Phone: string;
  SecondPhone: string;
  PhoneExt: string;
  SecondPhoneExt: string;
  Email: string;
  Comments: string;
  FirstName: string;
  LastName: string;
  LineItems: WorkizLineItem[];
  Company: string;
  Address: string;
  City: string;
  State: string;
  PostalCode: string;
  Country: string;
  Latitude: number;
  Longitude: number;
  Unit: string;
  JobType: string;
  JobNotes: string;
  JobSource: string;
  Tags: string[];
  CreatedBy: string;
  LastStatusUpdate: string;
  Team: WorkizTeamMember[];
}

export interface WorkizLineItem {
  Id: number;
  Quantity: number;
  Price: number;
  Cost: number;
  Taxable: number;
  InventorySync: number;
  Name: string;
  Description: string;
  BrandName: string;
  BrandId: string;
  Type: string;
  ModelNum: string;
}

export interface WorkizTeamMember {
  id: number;
  Name: string;
}

export interface WorkizApiResponse {
  flag: boolean;
  data: WorkizJob[];
  has_more: boolean;
  found: number;
  code: number;
} 