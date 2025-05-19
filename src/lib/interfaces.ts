export interface Plan {
  id: string;
  name: string;
  description: string;
  limitMembers: number;
  limitModelUses: number;
  price: number;
  durationInDays: number;
}

export interface Subscription {
  id: string;
  organizationId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  modelUsesCount: number;
  isActive: Boolean;
  createdAt: Date;
  plan: Plan;
}

export interface Organization {
  id: string;
  name: string;
  hostUser: string;
  createdAt: Date;
  updatedAt: Date;
  subscriptions: Subscription[]
}
