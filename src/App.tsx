import React, { useState, useEffect } from 'react';
import { UserType, View, MiniQuest, XPReward } from './types';
import { mockMiniQuests, mockXPRewards } from './data/mockData';
import { HomeScreen } from './components/HomeScreen';
import { QueuesList } from './components/staff/QueuesList';
import { QueueManagement } from './components/staff/QueueManagement';
import { JoinQueue } from './components/customer/JoinQueue';
import { WaitingRoom } from './components/customer/WaitingRoom';
import { XPShop } from './components/customer/XPShop';
import { WatchVideo } from './components/customer/miniquest/WatchVideo';
import { CompleteSurvey } from './components/customer/miniquest/CompleteSurvey';
import { FollowSocial } from './components/customer/miniquest/FollowSocial';
import { NBATrivia } from './components/customer/miniquest/NBATrivia';
import { useToast } from '@chakra-ui/react';
import { useQueues, useTickets } from './hooks/useSupabase';
import type { Database } from './lib/supabase';

type Queue = Database['public']['Tables']['queues']['Row'] & {
  locations?: Database['public']['Tables']['locations']['Row'] & {
    organizations?: Database['public']['Tables']['organizations']['Row'];
  };
};

type Customer = Database['public']['Tables']['tickets']['Row'];

function App() {
  const [userType, setUserType] = useState<UserType | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null);
  const [currentTicket, setCurrentTicket] = useState<Customer | null>(null);
  
  // Database hooks
  const { queues, loading: queuesLoading } = useQueues();
  const { tickets, loading: ticketsLoading, updateTicket } = useTickets(selectedQueueId || undefined);
  
  // Local state management
  const [queueStatus, setQueueStatus] = useState<'stopped' | 'paused' | 'active'>('active');
  const [miniQuests, setMiniQuests] = useState<MiniQuest[]>(mockMiniQuests);
  const [currentXP, setCurrentXP] = useState(125);
  const [level, setLevel] = useState(1);
  const [actionHistory, setActionHistory] = useState<any[]>([]);
  const [initialEstimatedWait, setInitialEstimatedWait] = useState(0);
  const [initialAheadCount, setInitialAheadCount] = useState(0);
  const [currentEstimatedWait, setCurrentEstimatedWait] = useState(0);
  const [currentAheadCount, setCurrentAheadCount] = useState(0);
  const [hasGoldenTicket, setHasGoldenTicket] = useState(false);
  const [queueStartTime, setQueueStartTime] = useState<Date | null>(null);
  const [timePerPerson, setTimePerPerson] = useState(0);
  
  const toast = useToast();

  // Navigation functions
  const handleSelectUserType = (type: UserType) => {
    setUserType(type);
    if (type === 'staff') {
      setCurrentView('queues-list');
    } else {
      setCurrentView('join-queue');
      if (queues.length > 0) {
        setSelectedQueueId(queues[0].id); // Default to first queue
      }
    }
  };

  const handleBackToHome = () => {
    setUserType(null);
    setCurrentView('home');
    setSelectedQueueId(null);
    setCurrentTicket(null);
  };

  // Staff functions
  const handleAccessQueue = (queueId: string) => {
    setSelectedQueueId(queueId);
    setCurrentView('queue-management');
  };

  const handleCopyLink = (queueId: string) => {
    const queue = queues.find(q => q.id === queueId);
    navigator.clipboard.writeText(`https://queueflow.app/join/${queueId}`);
    toast({
      title: `Link copied for ${queue?.name}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleServeCustomer = (customer: Customer) => {
    setActionHistory(prev => [...prev, { type: 'serve', customer, timestamp: Date.now() }]);
    updateTicket(customer.id, { 
      status: 'served',
      served_at: new Date().toISOString()
    });
    toast({
      title: `${customer.name} has been served`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSkipCustomer = (customer: Customer) => {
    setActionHistory(prev => [...prev, { type: 'cancel', customer, timestamp: Date.now() }]);
    updateTicket(customer.id, { 
      status: 'cancelled'
    });
    toast({
      title: `${customer.name}'s ticket has been cancelled (no-show)`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleHoldCustomer = (customer: Customer) => {
    setActionHistory(prev => [...prev, { type: 'hold', customer, timestamp: Date.now() }]);
    updateTicket(customer.id, { 
      status: 'parked'
    });
    toast({
      title: `${customer.name} has been moved to parked list`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleRequeueCustomer = (customer: Customer) => {
    updateTicket(customer.id, { 
      status: 'waiting'
    });
    toast({
      title: `${customer.name} has been re-queued`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleUndoAction = () => {
    if (actionHistory.length === 0) {
      toast({
        title: 'No actions to undo',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    const lastAction = actionHistory[actionHistory.length - 1];
    setActionHistory(prev => prev.slice(0, -1));
    
    // Restore customer state based on action type
    updateTicket(lastAction.customer.id, { 
      status: 'waiting'
    });
    toast({
      title: 'Action undone',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // Customer functions
  const handleConfirmJoin = () => {
    const currentQueue = getCurrentQueue();
    if (!currentQueue) return;
    
    const waitingTickets = tickets.filter(t => t.status === 'waiting').length;
    const estimatedWait = currentQueue.avg_service_time * waitingTickets + Math.floor(Math.random() * 10);
    const aheadCount = waitingTickets;
    const timePerPersonCalc = aheadCount > 0 ? estimatedWait / aheadCount : 0;
    
    setInitialEstimatedWait(estimatedWait);
    setInitialAheadCount(aheadCount);
    setCurrentEstimatedWait(estimatedWait);
    setCurrentAheadCount(aheadCount);
    setQueueStartTime(new Date());
    setTimePerPerson(timePerPersonCalc);
    
    const newTicket = {
      queue_id: selectedQueueId,
      ticket_number: `A${String(tickets.length + 1).padStart(3, '0')}`,
      customer_name: 'You',
      purpose: 'Service request',
      status: 'waiting',
      priority: 0,
      estimated_wait_time: estimatedWait,
      customer_phone: null,
      customer_email: null
    };
    
    // Note: createTicket would be implemented in useTickets hook
    setCurrentTicket(newTicket as any);
    setCurrentView('waiting-room');
    toast({
      title: 'Successfully joined the queue!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCompleteQuest = (questId: string) => {
    const quest = miniQuests.find(q => q.id === questId);
    if (!quest || quest.completed) return;
    
    setMiniQuests(prev => prev.map(q => 
      q.id === questId ? { ...q, completed: true } : q
    ));
    setCurrentXP(prev => prev + quest.xpReward);
    toast({
      title: `Quest completed! +${quest.xpReward} XP`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handlePurchaseReward = (rewardId: string) => {
    const reward = mockXPRewards.find(r => r.id === rewardId);
    if (!reward || currentXP < reward.cost) return;
    
    setCurrentXP(prev => prev - reward.cost);
    
    // Apply reward effects
    switch (rewardId) {
      case '1': // 10% Service Discount
        toast({
          title: '10% discount applied to your next service!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        break;
      case '2': // Skip 3 Places
        const skipAmount = Math.min(3, currentAheadCount);
        setCurrentAheadCount(prev => Math.max(0, prev - skipAmount));
        setCurrentEstimatedWait(prev => Math.max(0, prev - (skipAmount * timePerPerson)));
        
        // Update the initial counts to maintain simulation accuracy
        setInitialAheadCount(prev => Math.max(0, prev - skipAmount));
        setInitialEstimatedWait(prev => Math.max(0, prev - (skipAmount * timePerPerson)));
        
        toast({
          title: `You skipped ${skipAmount} places in the queue!`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        break;
      case '3': // Golden Ticket Skin
        setHasGoldenTicket(true);
        toast({
          title: 'Golden ticket skin activated!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        break;
      case '4': // Free Coffee Voucher
        toast({
          title: 'Free coffee voucher added to your account!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        break;
    }
    
    toast({
      title: `${reward.title} purchased!`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleLeaveQueue = () => {
    if (currentTicket) {
      updateTicket(currentTicket.id, { status: 'cancelled' });
    }
    setCurrentTicket(null);
    setQueueStartTime(null);
    setTimePerPerson(0);
    handleBackToHome();
    toast({
      title: 'Left the queue',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleOpenMiniQuest = (questType: string) => {
    setCurrentView(questType as View);
  };

  const getCurrentQueue = () => {
    return queues.find(q => q.id === selectedQueueId) || queues[0];
  };

  const getQueuePosition = () => {
    if (!currentTicket) return 0;
    return currentAheadCount + 1;
  };

  const getEstimatedWait = () => {
    return currentEstimatedWait;
  };

  // Update customer wait time and queue progression
  useEffect(() => {
    if (!currentTicket || !queueStartTime || currentAheadCount <= 0) return;

    const interval = setInterval(() => {
      const now = new Date();
      const elapsedMinutes = Math.floor((now.getTime() - queueStartTime.getTime()) / (1000 * 60));
      
      if (timePerPerson > 0) {
        const expectedPosition = Math.max(0, initialAheadCount - Math.floor(elapsedMinutes / timePerPerson));
        const expectedWaitTime = Math.max(0, initialEstimatedWait - elapsedMinutes);
        
        // Update position and wait time based on simulation
        if (expectedPosition !== currentAheadCount) {
          setCurrentAheadCount(expectedPosition);
        }
        
        if (expectedWaitTime !== currentEstimatedWait) {
          setCurrentEstimatedWait(expectedWaitTime);
        }
        
        // Update customer wait time
        const updatedWaitTime = Math.floor((Date.now() - new Date(currentTicket.joined_at || '').getTime()) / 1000 / 60);
        setCurrentTicket(prev => prev ? { ...prev, actual_wait_time: updatedWaitTime } : null);
      }
    }, 30000); // Update every 30 seconds for more responsive simulation

    return () => clearInterval(interval);
  }, [currentTicket, queueStartTime, timePerPerson, initialAheadCount, initialEstimatedWait, currentAheadCount, currentEstimatedWait]);

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeScreen onSelectUserType={handleSelectUserType} />;
      
      case 'queues-list':
        return (
          <QueuesList
            queues={queues}
            onBackToHome={handleBackToHome}
            onAccessQueue={handleAccessQueue}
            onCopyLink={handleCopyLink}
          />
        );
      
      case 'queue-management':
        return (
          <QueueManagement
            queue={getCurrentQueue()}
            tickets={tickets}
            queueStatus={queueStatus}
            onBackToQueues={() => setCurrentView('queues-list')}
            onUpdateQueueStatus={setQueueStatus}
            onServeCustomer={handleServeCustomer}
            onSkipCustomer={handleSkipCustomer}
            onHoldCustomer={handleHoldCustomer}
            onRequeueCustomer={handleRequeueCustomer}
            onUndoAction={handleUndoAction}
          />
        );
      
      case 'join-queue':
        return (
          <JoinQueue
            queue={getCurrentQueue()}
            onBackToHome={handleBackToHome}
            onConfirmJoin={handleConfirmJoin}
          />
        );
      
      case 'waiting-room':
        return (
          <WaitingRoom
            customer={currentTicket!}
            currentXP={currentXP}
            level={level}
            quests={miniQuests}
            queuePosition={getQueuePosition()}
            estimatedWaitTime={getEstimatedWait()}
            hasGoldenTicket={hasGoldenTicket}
            onCompleteQuest={handleCompleteQuest}
            onLeaveQueue={handleLeaveQueue}
            onOpenXPShop={() => setCurrentView('xp-shop')}
            onOpenMiniQuest={handleOpenMiniQuest}
          />
        );
      
      case 'xp-shop':
        return (
          <XPShop
            rewards={mockXPRewards}
            currentXP={currentXP}
            onBackToWaiting={() => setCurrentView('waiting-room')}
            onPurchaseReward={handlePurchaseReward}
          />
        );
      
      case 'watch-video':
        return (
          <WatchVideo
            onComplete={() => {
              handleCompleteQuest('1'); // Watch video quest
              setCurrentView('waiting-room');
            }}
            onBack={() => setCurrentView('waiting-room')}
          />
        );
      
      case 'complete-survey':
        return (
          <CompleteSurvey
            onComplete={() => {
              handleCompleteQuest('2'); // Survey quest
              setCurrentView('waiting-room');
            }}
            onBack={() => setCurrentView('waiting-room')}
          />
        );
      
      case 'follow-social':
        return (
          <FollowSocial
            onComplete={() => {
              handleCompleteQuest('4'); // Social media quest
              setCurrentView('waiting-room');
            }}
            onBack={() => setCurrentView('waiting-room')}
          />
        );
      
      case 'nba-trivia':
        return (
          <NBATrivia
            onComplete={() => {
              handleCompleteQuest('3'); // NBA trivia quest
              setCurrentView('waiting-room');
            }}
            onBack={() => setCurrentView('waiting-room')}
          />
        );
      
      default:
        return <HomeScreen onSelectUserType={handleSelectUserType} />;
    }
  };

  // Show loading state while data is being fetched
  if (queuesLoading && userType === 'staff') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading queues...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="app">
      {renderCurrentView()}
    </div>
  );
}

export default App;