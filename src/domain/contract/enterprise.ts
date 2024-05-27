export type ProviderConfigContractDto = { dummyField: boolean };
export type EnterpriseContractDto = {
  id: string;
  name: string;
  metadata: string;
  providers: { [key: string]: ProviderConfigContractDto }; // Any
  threshold: number;
};
