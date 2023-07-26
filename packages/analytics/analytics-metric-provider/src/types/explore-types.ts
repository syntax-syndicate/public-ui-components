// These enums are exported by the package, but eslint doesn't seem to realize this.
/* eslint-disable no-unused-vars */
export enum EXPLORE_V2_DIMENSIONS {
  API_PRODUCT = 'API_PRODUCT',
  API_PRODUCT_VERSION = 'API_PRODUCT_VERSION',
  RUNTIME_GROUP = 'RUNTIME_GROUP',
  GATEWAY_INSTANCE_ID = 'GATEWAY_INSTANCE_ID',
  GATEWAY_SERVICE = 'GATEWAY_SERVICE',
  ROUTE = 'ROUTE',
  APPLICATION = 'APPLICATION',
  STATUS_CODE = 'STATUS_CODE',
  STATUS_CODE_GROUPED = 'STATUS_CODE_GROUPED',
  TIME = 'TIME',
  ORGANIZATION = 'ORGANIZATION',
}

export enum EXPLORE_V2_AGGREGATIONS {
  REQUEST_COUNT = 'REQUEST_COUNT',
  REQUEST_PER_MINUTE = 'REQUEST_PER_MINUTE',
  RESPONSE_LATENCY_P99 = 'RESPONSE_LATENCY_P99',
  RESPONSE_LATENCY_P95 = 'RESPONSE_LATENCY_P95',
  RESPONSE_LATENCY_P50 = 'RESPONSE_LATENCY_P50',
  RESPONSE_SIZE_P99 = 'RESPONSE_SIZE_P99',
  RESPONSE_SIZE_P95 = 'RESPONSE_SIZE_P95',
  RESPONSE_SIZE_P50 = 'RESPONSE_SIZE_P50',
  REQUEST_SIZE_P99 = 'REQUEST_SIZE_P99',
  REQUEST_SIZE_P95 = 'REQUEST_SIZE_P95',
  REQUEST_SIZE_P50 = 'REQUEST_SIZE_P50',
}

export enum EXPLORE_V2_FILTER_TYPES {
  IN = 'IN',
  NOT_IN = 'NOT_IN',
}

export interface ExploreV2Filter {
  dimension: EXPLORE_V2_DIMENSIONS
  type: EXPLORE_V2_FILTER_TYPES
  values: string[]
}

export interface ExploreV2Query {
  metrics: EXPLORE_V2_AGGREGATIONS[]
  dimensions?: EXPLORE_V2_DIMENSIONS[]
  filter?: ExploreV2Filter[]
  granularityMs?: number
  meta?: {
    queryId: string
  };
}
