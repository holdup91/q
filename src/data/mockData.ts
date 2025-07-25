import { Queue, Customer, MiniQuest, XPReward } from '../types';

// Helper function to generate random data
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min: number, max: number) => Math.random() * (max - min) + min;

const queueNames = [
  'Customer Service', 'Account Opening', 'Loan Applications', 'Investment Consultation',
  'Technical Support', 'Premium Services', 'Business Banking', 'Mortgage Center',
  'Insurance Claims', 'Financial Planning'
];

const locations = [
  'Main Branch', 'Downtown', 'Financial Center', 'North Plaza', 'South Mall',
  'City Center', 'Business District', 'Shopping Complex', 'Corporate Tower', 'Metro Station'
];

const statuses: Array<'active' | 'paused' | 'stopped'> = ['active', 'active', 'active', 'paused', 'stopped'];

// Generate randomized queue data
const generateRandomQueues = (): Queue[] => {
  const numQueues = getRandomInt(3, 6);
  const queues: Queue[] = [];
  
  for (let i = 0; i < numQueues; i++) {
    const waiting = getRandomInt(0, 25);
    const served = getRandomInt(10, 80);
    const onHold = getRandomInt(0, 5);
    
    queues.push({
      id: (i + 1).toString(),
      name: queueNames[getRandomInt(0, queueNames.length - 1)],
      location: locations[getRandomInt(0, locations.length - 1)],
      waiting,
      served,
      onHold,
      avgWaitTime: getRandomInt(5, 45),
      status: statuses[getRandomInt(0, statuses.length - 1)]
    });
  }
  
  return queues;
};

export const mockQueues: Queue[] = [
  ...generateRandomQueues()
];

// Generate customers for each queue
const customerNames = [
  'Sarah Johnson', 'Mike Chen', 'Emily Rodriguez', 'David Kim', 'Lisa Wang',
  'James Brown', 'Maria Garcia', 'Robert Taylor', 'Jennifer Lee', 'Michael Davis',
  'Ashley Wilson', 'Christopher Moore', 'Amanda Jackson', 'Daniel Martinez', 'Jessica Thompson'
];

const servicePurposes = [
  'Account inquiry', 'Credit card application', 'Balance inquiry', 'Loan consultation',
  'Investment advice', 'Mortgage application', 'Insurance claim', 'Business banking',
  'Wire transfer', 'Account opening', 'Card replacement', 'Statement request'
];

const generateCustomersForQueue = (queueId: string, queueData: Queue): Customer[] => {
  const customers: Customer[] = [];
  const totalCustomers = queueData.waiting + queueData.served + queueData.onHold;
  
  for (let i = 0; i < totalCustomers; i++) {
    const customerId = `${queueId}-${i + 1}`;
    const ticketPrefix = String.fromCharCode(65 + parseInt(queueId) - 1); // A, B, C, etc.
    const ticketNumber = `${ticketPrefix}${String(i + 1).padStart(3, '0')}`;
    const waitTime = getRandomInt(1, 30);
    
    let status: 'waiting' | 'served' | 'parked';
    if (i < queueData.waiting) {
      status = 'waiting';
    } else if (i < queueData.waiting + queueData.served) {
      status = 'served';
    } else {
      status = 'parked';
    }
    
    customers.push({
      id: customerId,
      ticketNumber,
      name: customerNames[getRandomInt(0, customerNames.length - 1)],
      purpose: servicePurposes[getRandomInt(0, servicePurposes.length - 1)],
      waitTime,
      status,
      joinedAt: new Date(Date.now() - waitTime * 60 * 1000),
      queueId // Add queueId to associate customer with specific queue
    });
  }
  
  return customers;
};

// Generate customers for all queues
export const mockCustomers: Customer[] = mockQueues.flatMap(queue => 
  generateCustomersForQueue(queue.id, queue)
);

export const mockMiniQuests: MiniQuest[] = [
  {
    id: '1',
    title: 'Watch Promo Video',
    description: 'Learn about our new services',
    xpReward: 50,
    completed: false,
    icon: '📺'
  },
  {
    id: '2',
    title: 'Complete Survey',
    description: 'Help us improve our service',
    xpReward: 75,
    completed: false,
    icon: '📝'
  },
  {
    id: '3',
    title: 'NBA Trivia Quiz',
    description: 'Test your basketball knowledge',
    xpReward: 60,
    completed: false,
    icon: '🏀'
  },
  {
    id: '4',
    title: 'Follow Social Media',
    description: 'Stay updated with our news',
    xpReward: 25,
    completed: false,
    icon: '📱'
  }
];

export const mockXPRewards: XPReward[] = [
  {
    id: '1',
    title: '10% Service Discount',
    description: 'Save on your next transaction',
    cost: 200,
    icon: '🎁',
    category: 'discount'
  },
  {
    id: '2',
    title: 'Skip 3 Places',
    description: 'Move ahead in the queue',
    cost: 150,
    icon: '🚀',
    category: 'boost'
  },
  {
    id: '3',
    title: 'Golden Ticket Skin',
    description: 'Customize your ticket appearance',
    cost: 100,
    icon: '🎨',
    category: 'cosmetic'
  },
  {
    id: '4',
    title: 'Free Coffee Voucher',
    description: 'Enjoy complimentary refreshments',
    cost: 75,
    icon: '☕',
    category: 'discount'
  }
];