export namespace GithubService {
  export type VerifyInput = { token: string };
  export type VerifyOutput = void;
  export function verify(input: VerifyInput): Promise<VerifyOutput> {
    return;
  }
}
