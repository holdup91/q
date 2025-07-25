import React from 'react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { XPReward } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface XPShopProps {
  rewards: XPReward[];
  currentXP: number;
  onBackToWaiting: () => void;
  onPurchaseReward: (rewardId: string) => void;
}

export const XPShop: React.FC<XPShopProps> = ({
  rewards,
  currentXP,
  onBackToWaiting,
  onPurchaseReward
}) => {
  const getCategoryColor = (category: XPReward['category']) => {
    switch (category) {
      case 'discount': return 'bg-green-100 text-green-800';
      case 'boost': return 'bg-blue-100 text-blue-800';
      case 'cosmetic': return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackToWaiting}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center space-x-2">
                <ShoppingBag size={20} className="text-coral" />
                <h1 className="text-xl font-semibold">XP Shop</h1>
              </div>
            </div>
            <div className="bg-coral/10 px-3 py-1 rounded-full">
              <span className="text-coral font-semibold">{currentXP} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">
        <div className="space-y-4">
          {rewards.map((reward) => {
            const canAfford = currentXP >= reward.cost;
            
            return (
              <Card key={reward.id} className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-3xl">{reward.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{reward.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(reward.category)}`}>
                        {reward.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{reward.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-coral">{reward.cost} XP</span>
                    {!canAfford && (
                      <span className="text-xs text-red-500">Insufficient XP</span>
                    )}
                  </div>
                  <Button
                    onClick={() => onPurchaseReward(reward.id)}
                    disabled={!canAfford}
                    size="sm"
                  >
                    {canAfford ? 'Purchase' : 'Need more XP'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Complete more mini-quests to earn XP and unlock rewards!
          </p>
        </div>
      </div>
    </div>
  );
};