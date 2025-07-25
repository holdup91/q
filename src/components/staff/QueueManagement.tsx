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
import { Queue, Customer } from '../../types';
import { SwipeableCustomerCard } from './SwipeableCustomerCard';

const MotionBox = motion(Box);

interface QueueManagementProps {
  queue: Queue;
  customers: Customer[];
  queueStatus: 'stopped' | 'paused' | 'active';
  onBackToQueues: () => void;
  onUpdateQueueStatus: (status: 'stopped' | 'paused' | 'active') => void;
  onServeCustomer: (customer: Customer) => void;
  onSkipCustomer: (customer: Customer) => void;
  onHoldCustomer: (customer: Customer) => void;
  onRequeueCustomer: (customer: Customer) => void;
  onUndoAction: () => void;
}

export const QueueManagement: React.FC<QueueManagementProps> = ({
  queue,
  customers,
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
  
  // Filter customers for this specific queue
  const queueCustomers = customers.filter(c => c.queueId === queue.id);
  const waitingCustomers = queueCustomers.filter(c => c.status === 'waiting');
  const parkedCustomers = queueCustomers.filter(c => c.status === 'parked');

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
                  <Text color="gray.500">{queue.location}</Text>
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
              <Text fontSize="sm" fontWeight="semibold">{queue.served} / {queue.served + queue.waiting}</Text>
            </VStack>
            <VStack spacing={0}>
              <Text fontSize="xs" color="gray.500">Avg. Wait</Text>
              <Text fontSize="sm" fontWeight="semibold">{queue.avgWaitTime}m</Text>
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
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <IconButton
                  aria-label="Parked"
                  icon={<Archive size={12} />}
                  size="sm"
                  variant="outline"
                  onClick={onParkedOpen}
                />
              </motion.div>
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
        {waitingCustomers.length > 0 ? (
          <MotionBox
            position="relative"
            height="500px"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence>
              {waitingCustomers.slice(0, 3).map((customer, index) => (
                <SwipeableCustomerCard
                  key={customer.id}
                  customer={customer}
                  onSwipeRight={() => onServeCustomer(customer)}
                  onSwipeLeft={() => onSkipCustomer(customer)}
                  onSwipeDown={() => onHoldCustomer(customer)}
                  isTop={index === 0}
                  zIndex={10 - index}
                  offset={index}
                />
              ))}
            </AnimatePresence>
            
            {/* Queue Count */}
            {waitingCustomers.length > 3 && (
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
                  +{waitingCustomers.length - 3} more
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
              {parkedCustomers.length === 0 ? (
                <Text textAlign="center" color="gray.500" py={8}>
                  No parked tickets
                </Text>
              ) : (
                parkedCustomers.map((customer) => (
                  <Card key={customer.id} w="full">
                    <CardBody>
                      <HStack justify="space-between">
                        <VStack align="start" spacing={1}>
                          <Heading size="sm">
                            {customer.ticketNumber} - {customer.name}
                          </Heading>
                          <Text fontSize="sm" color="gray.500">
                            {customer.purpose}
                          </Text>
                          <Text fontSize="xs" color="gray.400">
                            Waiting {customer.waitTime} minutes
                          </Text>
                        </VStack>
                        <HStack spacing={2}>
                          <Button size="sm" onClick={() => onRequeueCustomer(customer)}>
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