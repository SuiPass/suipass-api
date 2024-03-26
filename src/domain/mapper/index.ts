import { Provider, Record, Request, Suipass } from '../contract';
import { ProviderEntity } from '../entity';

export function mapToProviderEntity(provider: Provider): ProviderEntity {
  return {
    id: provider.id,
    name: provider.name,
    submitFee: provider.submitFee,
    updateFee: provider.updateFee,
    balance: provider.balance,
    totalLevels: provider.maxLevel,
    score: provider.maxScore,
  };
}

export function mapRawToProviderEntity(raw: any): ProviderEntity {
  return {
    id: raw.id,
    name: raw.name,
    submitFee: raw.submitFee,
    updateFee: raw.updateFee,
    balance: raw.balance,
    totalLevels: raw.maxLevel,
    score: raw.maxScore,
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
    maxLevel: max_level,
    maxScore: max_score,
    records: records.fields.contents.map(mapToRecord),
    requests: requests.fields.contents.map(mapToRequest),
  };
}

function mapToRecord(raw: any): Record {
  const {
    key,
    value: {
      fields: { evidence, level },
    },
  } = raw.fields;
  return {
    requester: key,
    level,
    evidence,
  };
}

function mapToRequest(raw: any): Request {
  const {
    key,
    value: {
      fields: { requester, proof },
    },
  } = raw.fields;

  return {
    id: key,
    requester,
    proof,
  };
}
