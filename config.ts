export const FREE_QUOTA = {
  maxEventsPerMonth: 100,
  maxEventCategories: 10,
} as const;

export const PRO_QUOTA = {
  maxEventsPerMonth: 5000,
  maxEventCategories: 100,
} as const;
