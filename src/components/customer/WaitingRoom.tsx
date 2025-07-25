import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  IconButton,
  Progress,
  Card,
  CardBody,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { X, Trophy, Gift, Play, FileText, Users } from 'lucide-react';
import { Customer, MiniQuest } from '../../types';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

interface WaitingRoomProps {
  customer: Customer;
  currentXP: number;
  level: number;
  quests: MiniQuest[];
  queuePosition: number;
  estimatedWaitTime: number;
  hasGoldenTicket: boolean;
  onCompleteQuest: (questId: string) => void;
  onLeaveQueue: () => void;
  onOpenXPShop: () => void;
  onOpenMiniQuest: (questType: string) => void;
}

export const WaitingRoom: React.FC<WaitingRoomProps> = ({
  customer,
  currentXP,
  level,
  quests,
  queuePosition,
  estimatedWaitTime,
  hasGoldenTicket,
  onCompleteQuest,
  onLeaveQueue,
  onOpenXPShop,
  onOpenMiniQuest
}) => {
  const { isOpen: isLeaveOpen, onOpen: onLeaveOpen, onClose: onLeaveClose } = useDisclosure();
  const [animatedPosition, setAnimatedPosition] = useState(queuePosition);

  const completedQuests = quests.filter(q => q.completed).length;

  // Animate position changes
  React.useEffect(() => {
    if (queuePosition !== animatedPosition) {
      const timer = setTimeout(() => {
        setAnimatedPosition(queuePosition);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [queuePosition, animatedPosition]);

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" shadow="sm" position="sticky" top={0} zIndex={10}>
        <Box maxW="md" mx="auto" px={4} py={4}>
          <HStack justify="space-between">
            <VStack spacing={0} flex={1} textAlign="center">
              <Heading 
                size="xl" 
                color={hasGoldenTicket ? "yellow.500" : "black"}
                textShadow={hasGoldenTicket ? "0 0 10px rgba(255, 215, 0, 0.5)" : "none"}
              >
                {customer.ticketNumber}
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Your ticket number
              </Text>
            </VStack>
            <Button
              size="sm"
              variant="outline"
              onClick={onLeaveOpen}
              colorScheme="red"
            >
              Leave Queue
            </Button>
          </HStack>
        </Box>
      </Box>

      {/* Content */}
      <Box maxW="md" mx="auto" p={4}>
        <VStack spacing={6}>
        {/* Enhanced Queue Status */}
          <MotionCard
            w="full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            bg={hasGoldenTicket ? "linear-gradient(135deg, #ffd700, #ffed4e)" : "white"}
            border={hasGoldenTicket ? "2px solid #ffd700" : "1px solid"}
            borderColor={hasGoldenTicket ? "yellow.400" : "gray.200"}
            boxShadow={hasGoldenTicket ? "0 0 30px rgba(255, 215, 0, 0.3)" : "md"}
          >
            <CardBody textAlign="center" py={8}>
              <VStack spacing={6}>
                {/* Status Info */}
                <VStack spacing={2}>
                  {queuePosition === 1 ? (
                    <VStack spacing={2}>
                      <Text 
                        fontSize="4xl" 
                        fontWeight="bold" 
                        color={hasGoldenTicket ? "yellow.600" : "green.600"}
                        textShadow={hasGoldenTicket ? "0 0 10px rgba(255, 215, 0, 0.5)" : "none"}
                      >
                        YOUR TURN NOW!
                      </Text>
                      <Text color="gray.600" fontSize="lg">
                        Please proceed to the counter
                      </Text>
                    </VStack>
                  ) : queuePosition === 2 ? (
                    <VStack spacing={2}>
                      <Text 
                        fontSize="3xl" 
                        fontWeight="bold" 
                        color={hasGoldenTicket ? "yellow.600" : "orange.600"}
                        textShadow={hasGoldenTicket ? "0 0 10px rgba(255, 215, 0, 0.5)" : "none"}
                      >
                        You are the next one
                      </Text>
                      <Text color="gray.600">
                        Get ready, you're up next!
                      </Text>
                    </VStack>
                  ) : (
                    <VStack spacing={2}>
                      <Text 
                        fontSize="5xl" 
                        fontWeight="bold" 
                        color={hasGoldenTicket ? "yellow.600" : "black"}
                        textShadow={hasGoldenTicket ? "0 0 10px rgba(255, 215, 0, 0.5)" : "none"}
                      >
                        {queuePosition - 1}
                      </Text>
                      <Text 
                        fontSize="xl" 
                        color={hasGoldenTicket ? "yellow.700" : "gray.600"}
                        fontWeight="medium"
                      >
                        ahead of you
                      </Text>
                      <Text color="gray.600" fontSize="lg">
                        Estimated wait: {estimatedWaitTime} minutes
                      </Text>
                    </VStack>
                  )}
                  </Text>
                </VStack>
              </VStack>
            </CardBody>
          </MotionCard>

        {/* XP Progress */}
          <MotionCard
            w="full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <CardBody>
              <VStack spacing={3}>
                <HStack justify="space-between" w="full">
                  <Text fontWeight="medium">Level {level}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {currentXP}/500 XP
                  </Text>
                </HStack>
                <Progress
                  value={(currentXP / 500) * 100}
                  colorScheme="gray"
                  bg="gray.200"
                  borderRadius="full"
                  size="md"
                />
              </VStack>
            </CardBody>
          </MotionCard>

        {/* Mini Quests */}
          <MotionCard
            w="full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CardBody>
              <VStack spacing={4}>
                <HStack justify="space-between" w="full">
                  <Heading size="md">Mini Quests</Heading>
                  <Badge colorScheme="gray">
                    {completedQuests}/{quests.length}
                  </Badge>
                </HStack>
                
                <VStack spacing={3} w="full">
                  {quests.map((quest, index) => {
                    const getQuestIcon = (title: string) => {
                      if (title.includes('Video')) return Play;
                      if (title.includes('Survey')) return FileText;
                      if (title.includes('Social')) return Users;
                      return Gift;
                    };

                    const getQuestAction = (title: string) => {
                      if (title.includes('Video')) return () => onOpenMiniQuest('watch-video');
                      if (title.includes('Survey')) return () => onOpenMiniQuest('complete-survey');
                      if (title.includes('NBA')) return () => onOpenMiniQuest('nba-trivia');
                      if (title.includes('Social')) return () => onOpenMiniQuest('follow-social');
                      return () => onCompleteQuest(quest.id);
                    };

                    const QuestIcon = getQuestIcon(quest.title);

                    return (
                      <motion.div
                        key={quest.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{ width: '100%' }}
                      >
                        <Box
                          p={4}
                          border="2px solid"
                          borderColor={quest.completed ? "green.200" : "gray.200"}
                          bg={quest.completed ? "green.50" : "white"}
                          borderRadius="lg"
                          cursor={quest.completed ? "default" : "pointer"}
                          _hover={quest.completed ? {} : { borderColor: "gray.300" }}
                          onClick={quest.completed ? undefined : getQuestAction(quest.title)}
                          w="full"
                        >
                          <HStack justify="space-between">
                            <HStack spacing={3}>
                              <Box
                                w={10}
                                h={10}
                                bg={quest.completed ? "green.100" : "gray.100"}
                                borderRadius="lg"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <QuestIcon size={20} color={quest.completed ? "green" : "gray"} />
                              </Box>
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="medium" color="black">
                                  {quest.title}
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                  {quest.description}
                                </Text>
                              </VStack>
                            </HStack>
                            <VStack spacing={1}>
                              {quest.completed ? (
                                <HStack spacing={1} color="green.600">
                                  <Trophy size={16} />
                                  <Text fontSize="sm" fontWeight="medium">
                                    +{quest.xpReward} XP
                                  </Text>
                                </HStack>
                              ) : (
                                <Button
                                  size="sm"
                                  bg="black"
                                  color="white"
                                  _hover={{ bg: "gray.800" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    getQuestAction(quest.title)();
                                  }}
                                >
                                  +{quest.xpReward} XP
                                </Button>
                              )}
                            </VStack>
                          </HStack>
                        </Box>
                      </motion.div>
                    );
                  })}
                </VStack>
              </VStack>
            </CardBody>
          </MotionCard>
        {/* XP Shop Access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ width: '100%' }}
          >
            <Button
              w="full"
              size="lg"
              variant="outline"
              onClick={onOpenXPShop}
              leftIcon={<Gift size={20} />}
            >
              XP Shop ({currentXP} XP available)
            </Button>
          </motion.div>
        </VStack>
      </Box>

      {/* Leave Queue Modal */}
      <Modal isOpen={isLeaveOpen} onClose={onLeaveClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Leave Queue?</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Text color="gray.600" textAlign="center">
                Are you sure you want to leave the queue? You'll lose your current position.
              </Text>
              <HStack spacing={3} w="full">
                <Button flex={1} variant="ghost" onClick={onLeaveClose}>
                  Stay in Queue
                </Button>
                <Button flex={1} variant="outline" onClick={onLeaveQueue}>
                  Leave Queue
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};