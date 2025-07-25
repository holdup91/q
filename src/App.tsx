import React, { useState, useEffect } from 'react';
import { UserType, View, Queue, Customer, MiniQuest, XPReward } from './types';
import { mockQueues, mockCustomers, mockMiniQuests, mockXPRewards } from './data/mockData';
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

function App() {
  const [userType, setUserType] = useState<UserType | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  
  // State management
  const [queues, setQueues] = useState<Queue[]>(mockQueues);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
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
  
  const toast = useToast();

  // Navigation functions
  const handleSelectUserType = (type: UserType) => {
    setUserType(type);
    if (type === 'staff') {
      setCurrentView('queues-list');
    } else {
      setCurrentView('join-queue');
      setSelectedQueueId(mockQueues[0].id); // Default to first queue
    }
  };

  const handleBackToHome = () => {
    setUserType(null);
    setCurrentView('home');
    setSelectedQueueId(null);
    setCurrentCustomer(null);
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
    setCustomers(prev => prev.map(c => 
      c.id === customer.id ? { ...c, status: 'served' } : c
    ));
    updateQueueStats();
    toast({
      title: `${customer.name} has been served`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSkipCustomer = (customer: Customer) => {
    setActionHistory(prev => [...prev, { type: 'cancel', customer, timestamp: Date.now() }]);
    setCustomers(prev => prev.filter(c => c.id !== customer.id));
    updateQueueStats();
    toast({
      title: `${customer.name}'s ticket has been cancelled (no-show)`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleHoldCustomer = (customer: Customer) => {
    setActionHistory(prev => [...prev, { type: 'hold', customer, timestamp: Date.now() }]);
    setCustomers(prev => prev.map(c => 
      c.id === customer.id ? { ...c, status: 'parked' } : c
    ));
    updateQueueStats();
    toast({
      title: `${customer.name} has been moved to parked list`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleRequeueCustomer = (customer: Customer) => {
    setCustomers(prev => prev.map(c => 
      c.id === customer.id ? { ...c, status: 'waiting' } : c
    ));
    updateQueueStats();
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
    setCustomers(prev => prev.map(c => 
      c.id === lastAction.customer.id ? { ...lastAction.customer, status: 'waiting' } : c
    ));
    updateQueueStats();
    toast({
      title: 'Action undone',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // Customer functions
  const handleConfirmJoin = () => {
    const estimatedWait = getCurrentQueue().avgWaitTime + Math.floor(Math.random() * 10);
    const aheadCount = getCurrentQueue().waiting - 1;
    setInitialEstimatedWait(estimatedWait);
    setInitialAheadCount(aheadCount);
    setCurrentEstimatedWait(estimatedWait);
    setCurrentAheadCount(aheadCount);
    
    const newCustomer: Customer = {
      id: Date.now().toString(),
      ticketNumber: `A${String(customers.length + 1).padStart(3, '0')}`,
      name: 'You',
      purpose: 'Service request',
      waitTime: 0,
      status: 'waiting',
      joinedAt: new Date()
    };
    
    setCustomers(prev => [...prev, newCustomer]);
    setCurrentCustomer(newCustomer);
    setCurrentView('waiting-room');
    updateQueueStats();
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
        setCurrentAheadCount(prev => Math.max(0, prev - 3));
        setCurrentEstimatedWait(prev => Math.max(1, prev - 9)); // Assume 3 minutes per person
        toast({
          title: 'You skipped 3 places in the queue!',
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
    if (currentCustomer) {
      setCustomers(prev => prev.filter(c => c.id !== currentCustomer.id));
      updateQueueStats();
    }
    setCurrentCustomer(null);
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

  // Helper functions
  const updateQueueStats = () => {
    const queueCustomers = customers.filter(c => c.queueId === selectedQueueId);
    setQueues(prev => prev.map(queue => ({
      ...queue,
      waiting: queue.id === selectedQueueId ? queueCustomers.filter(c => c.status === 'waiting').length : queue.waiting,
      onHold: queue.id === selectedQueueId ? queueCustomers.filter(c => c.status === 'parked').length : queue.onHold,
      served: queue.id === selectedQueueId ? queueCustomers.filter(c => c.status === 'served').length : queue.served
    })));
  };

  const getCurrentQueue = () => {
    return queues.find(q => q.id === selectedQueueId) || queues[0];
  };

  const getQueuePosition = () => {
    if (!currentCustomer) return 0;
    return currentAheadCount + 1;
  };

  const getEstimatedWait = () => {
    return currentEstimatedWait;
  };

  // Update queue stats when customers change
  useEffect(() => {
    updateQueueStats();
  }, [customers]);

  // Update customer wait time and queue progression
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentCustomer) {
        const updatedWaitTime = Math.floor((Date.now() - currentCustomer.joinedAt.getTime()) / 1000 / 60);
        setCurrentCustomer(prev => prev ? { ...prev, waitTime: updatedWaitTime } : null);
        
        // Simulate queue progression (every 3 minutes on average)
        if (updatedWaitTime > 0 && updatedWaitTime % 3 === 0 && currentAheadCount > 0) {
          setCurrentAheadCount(prev => Math.max(0, prev - 1));
          setCurrentEstimatedWait(prev => Math.max(1, prev - 3));
        }
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [currentCustomer]);

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
            customers={customers}
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
            customer={currentCustomer!}
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

  return (
    <div className="app">
      {renderCurrentView()}
    </div>
  );
}

export default App;