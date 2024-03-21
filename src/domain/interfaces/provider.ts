export interface IProvider<T> {
  verify(payload: { proof: T }): Promise<{
    sucess: boolean;
    message?: string;
    data?: any;
  }>;
  consumeRequest(
    walletAddress: string,
    proof: string,
  ): Promise<{
    sucess: boolean;
    message?: string;
    data?: any;
  }>;
}
