import { Approval, Provider, Record, Request, Suipass } from '../contract';
import { ProviderEntity } from '../entity';

export function base64ToString(src: string): string {
  return Buffer.from(src, 'base64').toString('utf8');
}

export function mapToProviderEntity(provider: Provider): ProviderEntity {
  return {
    id: provider.id,
    name: provider.name,
    desc: provider.desc,
    logoUrl: provider.logoUrl,
    submitFee: provider.submitFee,
    updateFee: provider.updateFee,
    balance: provider.balance,
    maxLevel: provider.maxLevel,
    maxScore: provider.maxScore,
  };
}

export function mapRawToProviderEntity(raw: any): ProviderEntity {
  return {
    id: raw.id,
    name: raw.name,
    desc: raw.desc,
    logoUrl: raw.logoUrl,
    submitFee: raw.submitFee,
    updateFee: raw.updateFee,
    balance: raw.balance,
    maxLevel: raw.maxLevel,
    maxScore: raw.maxScore,
  };
}

export function mapToApproval(raw): Approval {
  const {
    id,
    provider,
    level,
    evidence,
    issued_date: issuedDate,
  } = raw.data.content.fields;
  return { id, provider, level, issuedDate, evidence };
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
    metadata,
    submit_fee,
    update_fee,
    balance,
    max_level,
    max_score,
    records,
    requests,
  } = raw.fields.value.fields;
  const objMetadata = JSON.parse(base64ToString(metadata));
  return {
    id: id.id,
    name,
    desc: objMetadata.desc,
    logoUrl: objMetadata.logoUrl,
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
