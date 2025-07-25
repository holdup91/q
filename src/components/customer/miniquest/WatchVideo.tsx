import React, { useState, useEffect } from 'react';
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
  CardBody
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, Volume2 } from 'lucide-react';

const MotionBox = motion(Box);

interface WatchVideoProps {
  onComplete: () => void;
  onBack: () => void;
}

export const WatchVideo: React.FC<WatchVideoProps> = ({ onComplete, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const videoDuration = 30; // 30 seconds

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          const newProgress = (newTime / videoDuration) * 100;
          setProgress(newProgress);
          
          if (newProgress >= 100) {
            setIsPlaying(false);
            setTimeout(onComplete, 1000);
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, progress, onComplete]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" shadow="sm" position="sticky" top={0} zIndex={10}>
        <Box maxW="md" mx="auto" px={4} py={4}>
          <HStack spacing={4}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton
                aria-label="Back"
                icon={<ArrowLeft size={20} />}
                variant="ghost"
                onClick={onBack}
              />
            </motion.div>
            <VStack align="start" spacing={0}>
              <Heading size="md">Watch Promo Video</Heading>
              <Text fontSize="sm" color="gray.500">
                Earn 50 XP by watching our latest promo
              </Text>
            </VStack>
          </HStack>
        </Box>
      </Box>

      {/* Content */}
      <Box maxW="md" mx="auto" p={4}>
        <VStack spacing={6}>
          {/* Video Player */}
          <MotionBox
            w="full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardBody p={0}>
                <Box
                  position="relative"
                  w="full"
                  h="200px"
                  bg="black"
                  borderRadius="lg"
                  overflow="hidden"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {/* Video Placeholder */}
                  <Box
                    position="absolute"
                    inset={0}
                    bg="gradient-to-br"
                    bgGradient="linear(to-br, gray.800, gray.900)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <VStack spacing={4} color="white">
                      <Text fontSize="6xl">🎬</Text>
                      <Text fontSize="lg" fontWeight="semibold">
                        kyu Promo Video
                      </Text>
                      <Text fontSize="sm" opacity={0.8}>
                        Discover the future of queue management
                      </Text>
                    </VStack>
                  </Box>

                  {/* Play Button Overlay */}
                  {!isPlaying && progress < 100 && (
                    <MotionBox
                      position="absolute"
                      inset={0}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bg="blackAlpha.300"
                      cursor="pointer"
                      onClick={togglePlay}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Box
                        w={16}
                        h={16}
                        bg="whiteAlpha.900"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Play size={24} color="black" />
                      </Box>
                    </MotionBox>
                  )}

                  {/* Completion Overlay */}
                  {progress >= 100 && (
                    <MotionBox
                      position="absolute"
                      inset={0}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bg="blackAlpha.700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <VStack spacing={4} color="white">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <Text fontSize="4xl">✅</Text>
                        </motion.div>
                        <Text fontSize="lg" fontWeight="semibold">
                          Video Complete!
                        </Text>
                        <Text fontSize="sm" opacity={0.8}>
                          +50 XP earned
                        </Text>
                      </VStack>
                    </MotionBox>
                  )}
                </Box>

                {/* Video Controls */}
                <Box p={4}>
                  <VStack spacing={3}>
                    <Progress
                      value={progress}
                      w="full"
                      colorScheme="gray"
                      bg="gray.200"
                      borderRadius="full"
                      size="sm"
                    />
                    
                    <HStack justify="space-between" w="full">
                      <HStack spacing={3}>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <IconButton
                            aria-label={isPlaying ? "Pause" : "Play"}
                            icon={isPlaying ? <Pause size={16} /> : <Play size={16} />}
                            size="sm"
                            variant="ghost"
                            onClick={togglePlay}
                            isDisabled={progress >= 100}
                          />
                        </motion.div>
                        <IconButton
                          aria-label="Volume"
                          icon={<Volume2 size={16} />}
                          size="sm"
                          variant="ghost"
                        />
                      </HStack>
                      
                      <Text fontSize="sm" color="gray.500">
                        {formatTime(currentTime)} / {formatTime(videoDuration)}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
              </CardBody>
            </Card>
          </MotionBox>

          {/* Quest Info */}
          <MotionBox
            w="full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardBody>
                <VStack spacing={4} align="start">
                  <VStack align="start" spacing={2}>
                    <Heading size="md">About this video</Heading>
                    <Text color="gray.600" fontSize="sm">
                      Learn about kyu's innovative features that make queue management 
                      seamless for both businesses and customers. Discover how our 
                      gamification system keeps customers engaged while they wait.
                    </Text>
                  </VStack>
                  
                  <Box w="full" p={3} bg="gray.50" borderRadius="lg">
                    <HStack justify="space-between">
                      <Text fontSize="sm" fontWeight="medium">
                        Quest Reward
                      </Text>
                      <HStack spacing={1}>
                        <Text fontSize="sm" fontWeight="bold">
                          +50 XP
                        </Text>
                        <Text fontSize="lg">🏆</Text>
                      </HStack>
                    </HStack>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>

          {/* Action Button */}
          {progress >= 100 && (
            <MotionBox
              w="full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button
                w="full"
                size="lg"
                onClick={onComplete}
                bg="black"
                color="white"
                _hover={{ bg: "gray.800" }}
              >
                Claim Reward & Continue
              </Button>
            </MotionBox>
          )}
        </VStack>
      </Box>
    </Box>
  );
};