import React from 'react';
import { ArrowLeft, MapPin, Clock, Users } from 'lucide-react';
import { Queue } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface JoinQueueProps {
  queue: Queue;
  onBackToHome: () => void;
  onConfirmJoin: () => void;
}

export const JoinQueue: React.FC<JoinQueueProps> = ({
  queue,
  onBackToHome,
  onConfirmJoin
}) => {
  const estimatedWait = queue.avgWaitTime + Math.floor(Math.random() * 10);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToHome}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold">Join Queue</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4 space-y-6">
        <Card className="text-center space-y-4" padding="lg">
          <div className="w-16 h-16 bg-coral/10 rounded-full flex items-center justify-center mx-auto">
            <Users size={32} className="text-coral" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{queue.name}</h2>
            <div className="flex items-center justify-center space-x-1 text-gray-600">
              <MapPin size={16} />
              <span>{queue.location}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-gray-500 mb-1">
                <Users size={16} />
                <span className="text-sm">Ahead of You</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{queue.waiting - 1}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-gray-500 mb-1">
                <Clock size={16} />
                <span className="text-sm">Est. Wait</span>
              </div>
              <p className="text-2xl font-bold text-coral">{estimatedWait}m</p>
            </div>
          </div>

          <div className="bg-teal/5 rounded-xl p-4">
            <h3 className="font-semibold text-teal mb-2">While you wait:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Complete mini-quests to earn XP</li>
              <li>• Unlock rewards and discounts</li>
              <li>• Track your position in real-time</li>
            </ul>
          </div>
        </Card>

        <div className="space-y-3">
          <Button
            onClick={onConfirmJoin}
            className="w-full py-4 text-lg"
          >
            Join Queue
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            By joining, you agree to receive notifications about your queue status
          </p>
        </div>
      </div>
    </div>
  );
};