import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  IconButton,
  Card,
  CardBody,
  Badge,
  Link
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Check } from 'lucide-react';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

interface FollowSocialProps {
  onComplete: () => void;
  onBack: () => void;
}

const socialPlatforms = [
  {
    id: 'twitter',
    name: 'Twitter',
    handle: '@kyu_app',
    icon: '🐦',
    url: 'https://twitter.com/kyu_app',
    followers: '2.1K',
    description: 'Latest updates and queue management tips'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@kyu.app',
    icon: '📸',
    url: 'https://instagram.com/kyu.app',
    followers: '1.8K',
    description: 'Behind the scenes and customer stories'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    handle: 'kyu-app',
    icon: '💼',
    url: 'https://linkedin.com/company/kyu-app',
    followers: '950',
    description: 'Business insights and industry news'
  }
];

export const FollowSocial: React.FC<FollowSocialProps> = ({ onComplete, onBack }) => {
  const [followedPlatforms, setFollowedPlatforms] = useState<Set<string>>(new Set());
  const [isCompleted, setIsCompleted] = useState(false);

  const handleFollow = (platformId: string, url: string) => {
    // Open social media link
    window.open(url, '_blank');
    
    // Mark as followed
    setFollowedPlatforms(prev => new Set([...prev, platformId]));
  };

  const handleComplete = () => {
    if (followedPlatforms.size >= 2) {
      setIsCompleted(true);
      setTimeout(onComplete, 1500);
    }
  };

  const canComplete = followedPlatforms.size >= 2;

  if (isCompleted) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <MotionBox
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card maxW="md" mx="auto">
            <CardBody textAlign="center" py={12}>
              <VStack spacing={6}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  <Text fontSize="6xl">🎉</Text>
                </motion.div>
                <VStack spacing={2}>
                  <Heading size="lg">Social Quest Complete!</Heading>
                  <Text color="gray.600">
                    Thanks for following us on social media
                  </Text>
                </VStack>
                <Box p={4} bg="gray.50" borderRadius="lg">
                  <HStack justify="center" spacing={2}>
                    <Text fontWeight="bold">+25 XP earned</Text>
                    <Text fontSize="lg">🏆</Text>
                  </HStack>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </MotionBox>
      </Box>
    );
  }

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
              <Heading size="md">Follow Social Media</Heading>
              <Text fontSize="sm" color="gray.500">
                Follow 2+ accounts to earn 25 XP
              </Text>
            </VStack>
          </HStack>
        </Box>
      </Box>

      {/* Content */}
      <Box maxW="md" mx="auto" p={4}>
        <VStack spacing={6}>
          {/* Progress */}
          <MotionBox
            w="full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardBody>
                <VStack spacing={3}>
                  <HStack justify="space-between" w="full">
                    <Text fontWeight="medium">Progress</Text>
                    <Badge colorScheme={canComplete ? "green" : "gray"}>
                      {followedPlatforms.size} / 2 followed
                    </Badge>
                  </HStack>
                  <Box w="full" bg="gray.200" borderRadius="full" h={2}>
                    <Box
                      bg={canComplete ? "green.500" : "gray.400"}
                      h="full"
                      borderRadius="full"
                      width={`${(followedPlatforms.size / 2) * 100}%`}
                      transition="all 0.3s"
                    />
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>

          {/* Social Platforms */}
          <VStack spacing={4} w="full">
            {socialPlatforms.map((platform, index) => {
              const isFollowed = followedPlatforms.has(platform.id);
              
              return (
                <MotionCard
                  key={platform.id}
                  w="full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <CardBody>
                    <HStack spacing={4} align="start">
                      <Box
                        w={12}
                        h={12}
                        bg="gray.50"
                        borderRadius="xl"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="2xl"
                      >
                        {platform.icon}
                      </Box>
                      
                      <VStack align="start" flex={1} spacing={1}>
                        <HStack spacing={2}>
                          <Heading size="sm">{platform.name}</Heading>
                          <Text fontSize="sm" color="gray.500">
                            {platform.handle}
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          {platform.description}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {platform.followers} followers
                        </Text>
                      </VStack>
                      
                      <VStack spacing={2}>
                        {isFollowed ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <Box
                              w={10}
                              h={10}
                              bg="green.500"
                              borderRadius="full"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              color="white"
                            >
                              <Check size={20} />
                            </Box>
                          </motion.div>
                        ) : (
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              size="sm"
                              onClick={() => handleFollow(platform.id, platform.url)}
                              rightIcon={<ExternalLink size={14} />}
                              bg="black"
                              color="white"
                              _hover={{ bg: "gray.800" }}
                            >
                              Follow
                            </Button>
                          </motion.div>
                        )}
                      </VStack>
                    </HStack>
                  </CardBody>
                </MotionCard>
              );
            })}
          </VStack>

          {/* Complete Button */}
          {canComplete && (
            <MotionBox
              w="full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button
                w="full"
                size="lg"
                onClick={handleComplete}
                bg="black"
                color="white"
                _hover={{ bg: "gray.800" }}
              >
                Claim Reward (+25 XP)
              </Button>
            </MotionBox>
          )}

          {/* Info */}
          <MotionBox
            w="full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardBody>
                <VStack spacing={3} align="start">
                  <Heading size="sm">Stay Connected</Heading>
                  <Text fontSize="sm" color="gray.600">
                    Follow our social media accounts to stay updated with the latest 
                    features, tips, and community highlights. We regularly share 
                    queue management best practices and customer success stories.
                  </Text>
                  <Box p={3} bg="gray.50" borderRadius="lg" w="full">
                    <Text fontSize="xs" color="gray.500">
                      💡 Tip: Following our accounts helps us build a stronger 
                      community and improve our services based on your feedback.
                    </Text>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>
        </VStack>
      </Box>
    </Box>
  );
};