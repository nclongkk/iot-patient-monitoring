export enum GENDER {
  MALE = 'male',
  FEMALE = 'female',
}

// pagination
export const PAGINATION_DEFAULT_PAGE = 1;
export const PAGINATION_DEFAULT_LIMIT = 10;
export const PAGINATION_MIN_PAGE = 1;
export const PAGINATION_MIN_LIMIT = 1;
export const PAGINATION_MAX_PAGE = 1e6;
export const PAGINATION_MAX_LIMIT = 100;
export const AMOUNT_TO_SWITCH_TO_IN_REVIEW_ADS = 10; // $


export enum EVENT_TYPE {
  EQUIPMENT_STATUS = 'equipment-status',
  SENSOR_DATA = 'sensor-data',
}

export enum EQUIPMENT_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}


