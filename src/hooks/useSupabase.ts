import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Tables = Database['public']['Tables'];

// Custom hooks for database operations
export const useQueues = (locationId?: string) => {
  const [queues, setQueues] = useState<Tables['queues']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        let query = supabase
          .from('queues')
          .select(`
            *,
            locations (
              id,
              name,
              organization_id,
              organizations (
                id,
                name,
                primary_color,
                secondary_color
              )
            )
          `)
          .eq('is_active', true);

        if (locationId) {
          query = query.eq('location_id', locationId);
        }

        const { data, error } = await query;

        if (error) throw error;
        setQueues(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchQueues();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('queues')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'queues' }, () => {
        fetchQueues();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [locationId]);

  return { queues, loading, error };
};

export const useTickets = (queueId?: string) => {
  const [tickets, setTickets] = useState<Tables['tickets']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        let query = supabase
          .from('tickets')
          .select('*')
          .order('joined_at', { ascending: true });

        if (queueId) {
          query = query.eq('queue_id', queueId);
        }

        const { data, error } = await query;

        if (error) throw error;
        setTickets(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('tickets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, () => {
        fetchTickets();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queueId]);

  const createTicket = async (ticketData: Tables['tickets']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert(ticketData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create ticket');
    }
  };

  const updateTicket = async (id: string, updates: Tables['tickets']['Update']) => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update ticket');
    }
  };

  return { tickets, loading, error, createTicket, updateTicket };
};

export const useMiniQuests = (organizationId?: string) => {
  const [quests, setQuests] = useState<Tables['mini_quests']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        let query = supabase
          .from('mini_quests')
          .select('*')
          .eq('is_active', true);

        if (organizationId) {
          query = query.eq('organization_id', organizationId);
        }

        const { data, error } = await query;

        if (error) throw error;
        setQuests(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchQuests();
  }, [organizationId]);

  return { quests, loading, error };
};

export const useXPRewards = (organizationId?: string) => {
  const [rewards, setRewards] = useState<Tables['xp_rewards']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        let query = supabase
          .from('xp_rewards')
          .select('*')
          .eq('is_active', true);

        if (organizationId) {
          query = query.eq('organization_id', organizationId);
        }

        const { data, error } = await query;

        if (error) throw error;
        setRewards(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [organizationId]);

  const purchaseReward = async (customerId: string, rewardId: string, ticketId: string, xpCost: number) => {
    try {
      const { data, error } = await supabase
        .from('customer_purchases')
        .insert({
          customer_id: customerId,
          reward_id: rewardId,
          ticket_id: ticketId,
          xp_cost: xpCost
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to purchase reward');
    }
  };

  return { rewards, loading, error, purchaseReward };
};

export const useCustomer = (customerId?: string) => {
  const [customer, setCustomer] = useState<Tables['customers']['Row'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      setLoading(false);
      return;
    }

    const fetchCustomer = async () => {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('id', customerId)
          .single();

        if (error) throw error;
        setCustomer(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId]);

  const updateCustomerXP = async (customerId: string, xpChange: number) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update({
          total_xp: customer ? customer.total_xp + xpChange : xpChange,
          current_level: customer ? Math.floor((customer.total_xp + xpChange) / 500) + 1 : 1
        })
        .eq('id', customerId)
        .select()
        .single();

      if (error) throw error;
      setCustomer(data);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update customer XP');
    }
  };

  return { customer, loading, error, updateCustomerXP };
};

export const useQueueAnalytics = (queueId: string, days: number = 7) => {
  const [analytics, setAnalytics] = useState<Tables['queue_analytics']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data, error } = await supabase
          .from('queue_analytics')
          .select('*')
          .eq('queue_id', queueId)
          .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
          .order('date', { ascending: true });

        if (error) throw error;
        setAnalytics(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [queueId, days]);

  return { analytics, loading, error };
};