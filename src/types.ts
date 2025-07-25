export interface Queue {
  id: string;
  name: string;
  location: string;
  waiting: number;
  served: number;
  onHold: number;
  avgWaitTime: number;
  status: 'active' | 'paused' | 'stopped';
}

export interface Customer {
  id: string;
  ticketNumber: string;
  name: string;
  purpose: string;
  waitTime: number;
  status: 'waiting' | 'served' | 'parked';
  joinedAt: Date;
  queueId?: string; // Associate customer with specific queue
}

export interface MiniQuest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  icon: string;
}

export interface XPReward {
  id: string;
  title: string;
  description: string;
  cost: number;
  icon: string;
  category: 'discount' | 'boost' | 'cosmetic';
}

export type UserType = 'staff' | 'customer';
export type View = 'home' | 'queues-list' | 'queue-management' | 'join-queue' | 'waiting-room' | 'xp-shop' | 'leave-queue' | 'watch-video' | 'complete-survey' | 'follow-social';