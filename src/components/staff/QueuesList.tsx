import React from 'react';
import { ArrowLeft, Play, Pause, Square, Copy, Users, Clock } from 'lucide-react';
import type { Database } from '../../lib/supabase';
import { useTickets } from '../../hooks/useSupabase';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

type Queue = Database['public']['Tables']['queues']['Row'] & {
  locations?: Database['public']['Tables']['locations']['Row'] & {
    organizations?: Database['public']['Tables']['organizations']['Row'];
  };
};

interface QueuesListProps {
  queues: Queue[];
  onBackToHome: () => void;
  onAccessQueue: (queueId: string) => void;
  onCopyLink: (queueId: string) => void;
}

export const QueuesList: React.FC<QueuesListProps> = ({
  queues,
  onBackToHome,
  onAccessQueue,
  onCopyLink
}) => {
  // Get tickets for all queues to calculate stats
  const { tickets: allTickets } = useTickets();

  const getQueueStats = (queueId: string) => {
    const queueTickets = allTickets.filter(ticket => ticket.queue_id === queueId);
    const totalTickets = queueTickets.length;
    const servedTickets = queueTickets.filter(ticket => ticket.status === 'served').length;
    const waitingTickets = queueTickets.filter(ticket => ticket.status === 'waiting').length;
    
    return { totalTickets, servedTickets, waitingTickets };
  };

  if (queues.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackToHome}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-semibold">My Queues</h1>
            </div>
          </div>
        </div>
        <div className="max-w-md mx-auto p-4 text-center mt-12">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Queues Available</h2>
          <p className="text-gray-600">Please set up your queues in the database first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-minimal">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToHome}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold">My Queues</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4 space-y-4">
        {queues.map((queue) => (
          (() => {
            const stats = getQueueStats(queue.id);
            return (
          <Card key={queue.id} className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{queue.name}</h3>
                <p className="text-sm text-gray-500">
                  {queue.locations?.name || 'Unknown Location'}
                  {queue.locations?.organizations?.name && (
                    <span className="text-gray-400"> • {queue.locations.organizations.name}</span>
                  )}
                </p>
              </div>
            </div>

            {/* Minimalist KPIs */}
            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Served / Total</p>
                <p className="text-lg font-semibold text-gray-900">{stats.servedTickets} / {stats.totalTickets}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Waiting</p>
                <p className="text-lg font-semibold text-gray-900">{stats.waitingTickets}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Button
                onClick={() => onAccessQueue(queue.id)}
                className="flex-1"
              >
                Access Queue
              </Button>
              <Button
                onClick={() => onCopyLink(queue.id)}
                variant="outline"
                className="px-3"
              >
                <Copy size={16} />
              </Button>
            </div>
          </Card>
            );
          })()
        ))}
      </div>
    </div>
  );
};