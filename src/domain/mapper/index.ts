import { Provider, Record, Request, Suipass } from '../contract';
import { ProviderEntity } from '../entity';

export function mapToProviderEntity(provider: Provider): ProviderEntity {
  return {
    id: provider.id,
    name: provider.name,
    submitFee: provider.submitFee,
    updateFee: provider.updateFee,
    balance: provider.balance,
    totalLevels: provider.totalLevels,
    score: provider.score,
  };
}

export function mapToSuipass(raw: any): Suipass {
  const { id, expiration_period, providers, threshold } =
    raw.data.content.fields;
  return {
    id: id.id,
    providers: mapToListProviders(providers),
    threshold,
    expirationPeriod: expiration_period,
  };
}

function mapToListProviders(raw: any): Provider[] {
  return raw.fields.contents.map((p: any) => mapToProvider(p));
}

function mapToProvider(raw: any): Provider {
  const {
    id,
    name,
    submit_fee,
    update_fee,
    balance,
    max_level,
    max_score,
    records,
    requests,
  } = raw.fields.value.fields;
  return {
    id: id.id,
    name,
    submitFee: submit_fee,
    updateFee: update_fee,
    balance,
    totalLevels: max_level,
    score: max_score,
    records: records.fields.contents.map((val: any): Record => {
      const {
        key,
        value: {
          fields: { evidence, level },
        },
      } = val.fields;
      return {
        requester: key,
        level,
        evidence,
      };
    }),
    requests: requests.fields.contents.map((val: any): Request => {
      const {
        key,
        value: {
          fields: { requester, proof },
        },
      } = val.fields;

      return {
        id: key,
        requester,
        proof,
      };
    }),
  };
}
