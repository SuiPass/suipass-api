export type ProviderConfigContractDto = { dummyField: boolean };
export type EnterpriseContractDto = {
  id: string;
  name: string;
  metadata: string;
  providers: Map<string, ProviderConfigContractDto>; // Any
  threshold: number;
};
