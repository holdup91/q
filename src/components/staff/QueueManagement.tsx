import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  IconButton,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Card,
  CardBody,
  Badge,
  Divider
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Pause, Square, RotateCcw, Archive } from 'lucide-react';
import type { Database } from '../../lib/supabase';
import { SwipeableCustomerCard } from './SwipeableCustomerCard';

const MotionBox = motion(Box);

type Queue = Database['public']['Tables']['queues']['Row'] & {
  locations?: Database['public']['Tables']['locations']['Row'] & {
    organizations?: Database['public']['Tables']['organizations']['Row'];
  };
};

type Ticket = Database['public']['Tables']['tickets']['Row'];

interface QueueManagementProps {
  queue?: Queue;
  tickets: Ticket[];
  queueStatus: 'stopped' | 'paused' | 'active';
  onBackToQueues: () => void;
  onUpdateQueueStatus: (status: 'stopped' | 'paused' | 'active') => void;
  onServeCustomer: (ticket: Ticket) => void;
  onSkipCustomer: (ticket: Ticket) => void;
  onHoldCustomer: (ticket: Ticket) => void;
  onRequeueCustomer: (ticket: Ticket) => void;
  onUndoAction: () => void;
}

export const QueueManagement: React.FC<QueueManagementProps> = ({
  queue,
  tickets,
  queueStatus,
  onBackToQueues,
  onUpdateQueueStatus,
  onServeCustomer,
  onSkipCustomer,
  onHoldCustomer,
  onRequeueCustomer,
  onUndoAction
}) => {
  const { isOpen: isParkedOpen, onOpen: onParkedOpen, onClose: onParkedClose } = useDisclosure();
  
  if (!queue) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Text fontSize="xl" color="gray.600">Queue not found</Text>
          <Button onClick={onBackToQueues}>Back to Queues</Button>
        </VStack>
      </Box>
    );
  }
  
  // Filter tickets by status
  const waitingTickets = tickets.filter(t => t.status === 'waiting');
  const parkedTickets = tickets.filter(t => t.status === 'parked');
  const servedTickets = tickets.filter(t => t.status === 'served');
  const totalTickets = tickets.length;

  const getStatusColor = () => {
    switch (queueStatus) {
      case 'active': return 'green.500';
      case 'paused': return 'yellow.500';
      case 'stopped': return 'red.500';
    }
  };

  const getStatusText = () => {
    switch (queueStatus) {
      case 'active': return 'Active';
      case 'paused': return 'Paused';
      case 'stopped': return 'Stopped';
    }
  };

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Compact Header */}
      <Box bg="white" shadow="sm" position="sticky" top={0} zIndex={20}>
        <Box maxW="md" mx="auto" px={4} py={3}>
          {/* Title Row */}
          <HStack justify="space-between" mb={2}>
            <HStack spacing={3}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  aria-label="Back"
                  icon={<ArrowLeft size={18} />}
                  variant="ghost"
                  size="sm"
                  onClick={onBackToQueues}
                />
              </motion.div>
              <VStack align="start" spacing={0}>
                <Heading size="md" color="black">
                  {queue.name}
                </Heading>
                <HStack spacing={2} fontSize="xs">
                  <Text color="gray.500">
                    {queue.locations?.name || 'Unknown Location'}
                  </Text>
                  <Text color="gray.300">•</Text>
                  <Badge colorScheme={queueStatus === 'active' ? 'green' : queueStatus === 'paused' ? 'yellow' : 'red'} size="sm">
                    {getStatusText()}
                  </Badge>
                </HStack>
              </VStack>
            </HStack>
          </HStack>

          {/* KPIs Row */}
          <HStack justify="space-between" py={2} borderTop="1px solid" borderColor="gray.100">
            <VStack spacing={0}>
              <Text fontSize="xs" color="gray.500">Served / Total</Text>
              <Text fontSize="sm" fontWeight="semibold">{servedTickets.length} / {totalTickets}</Text>
            </VStack>
            <VStack spacing={0}>
              <Text fontSize="xs" color="gray.500">Avg. Wait</Text>
              <Text fontSize="sm" fontWeight="semibold">{queue.avg_service_time}m</Text>
            </VStack>
          </HStack>

          {/* Action Buttons Row */}
          <HStack justify="space-between" pt={2}>
            <HStack spacing={1}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <IconButton
                  aria-label="Start"
                  icon={<Play size={12} />}
                  size="sm"
                  variant={queueStatus === 'active' ? 'solid' : 'outline'}
                  colorScheme={queueStatus === 'active' ? 'green' : 'gray'}
                  onClick={() => onUpdateQueueStatus('active')}
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <IconButton
                  aria-label="Pause"
                  icon={<Pause size={12} />}
                  size="sm"
                  variant={queueStatus === 'paused' ? 'solid' : 'outline'}
                  colorScheme={queueStatus === 'paused' ? 'yellow' : 'gray'}
                  onClick={() => onUpdateQueueStatus('paused')}
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <IconButton
                  aria-label="Stop"
                  icon={<Square size={12} />}
                  size="sm"
                  variant={queueStatus === 'stopped' ? 'solid' : 'outline'}
                  colorScheme={queueStatus === 'stopped' ? 'red' : 'gray'}
                  onClick={() => onUpdateQueueStatus('stopped')}
                />
              </motion.div>
            </HStack>
            <HStack spacing={1}>
              <Box position="relative">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <IconButton
                    aria-label="Parked"
                    icon={<Archive size={12} />}
                    size="sm"
                    variant="outline"
                    onClick={onParkedOpen}
                  />
                </motion.div>
                {parkedTickets.length > 0 && (
                  <Badge
                    position="absolute"
                    top="-1"
                    right="-1"
                    bg="red.500"
                    color="white"
                    borderRadius="full"
                    fontSize="xs"
                    minW="5"
                    h="5"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {parkedTickets.length}
                  </Badge>
                )}
              </Box>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <IconButton
                  aria-label="Undo"
                  icon={<RotateCcw size={12} />}
                  size="sm"
                  variant="outline"
                  onClick={onUndoAction}
                />
              </motion.div>
            </HStack>
          </HStack>
        </Box>
      </Box>

      {/* Main Content - Card Stack */}
      <Box maxW="md" mx="auto" px={4} pt={6}>
        {waitingTickets.length > 0 ? (
          <MotionBox
            position="relative"
            height="500px"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence mode="popLayout">
              {waitingTickets.slice(0, 3).map((ticket, index) => (
                <SwipeableCustomerCard
                  key={ticket.id}
                  ticket={ticket}
                  onSwipeRight={() => onServeCustomer(ticket)}
                  onSwipeLeft={() => onSkipCustomer(ticket)}
                  onSwipeDown={() => onHoldCustomer(ticket)}
                  isTop={index === 0}
                  zIndex={10 - index}
                  offset={index}
                />
              ))}
            </AnimatePresence>
            
            {/* Queue Count */}
            {waitingTickets.length > 3 && (
              <MotionBox
                position="absolute"
                bottom={-8}
                left="50%"
                transform="translateX(-50%)"
                bg="gray.100"
                px={3}
                py={1}
                borderRadius="full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Text fontSize="sm" color="gray.600">
                  +{waitingTickets.length - 3} more
                </Text>
              </MotionBox>
            )}
          </MotionBox>
        ) : (
          <MotionBox
            textAlign="center"
            py={12}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Box
              w={16}
              h={16}
              bg="gray.50"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mx="auto"
              mb={4}
            >
              <Archive size={24} color="gray.400" />
            </Box>
            <Heading size="md" color="gray.900" mb={2}>
              No customers waiting
            </Heading>
            <Text color="gray.500">The queue is currently empty</Text>
          </MotionBox>
        )}
      </Box>

      {/* Parked Tickets Modal */}
      <Modal isOpen={isParkedOpen} onClose={onParkedClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Parked Tickets</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={3}>
              {parkedTickets.length === 0 ? (
                <Text textAlign="center" color="gray.500" py={8}>
                  No parked tickets
                </Text>
              ) : (
                parkedTickets.map((ticket) => (
                  <Card key={ticket.id} w="full">
                    <CardBody>
                      <HStack justify="space-between">
                        <VStack align="start" spacing={1}>
                          <Heading size="sm">
                            {ticket.ticket_number} - {ticket.customer_name}
                          </Heading>
                          <Text fontSize="sm" color="gray.500">
                            {ticket.purpose}
                          </Text>
                          <Text fontSize="xs" color="gray.400">
                            Waiting {ticket.actual_wait_time} minutes
                          </Text>
                        </VStack>
                        <HStack spacing={2}>
                          <Button size="sm" onClick={() => onRequeueCustomer(ticket)}>
                            Re-queue
                          </Button>
                          <Button size="sm" variant="ghost" onClick={onUndoAction}>
                            Undo
                          </Button>
                        </HStack>
                      </HStack>
                    </CardBody>
                  </Card>
                ))
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};