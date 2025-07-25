import React from 'react';
import { Box, VStack, HStack, Text, Heading, Card, CardBody, Icon } from '@chakra-ui/react';
import { Users, UserCheck, Gift } from 'lucide-react';
import { UserType } from '../types';

interface HomeScreenProps {
  onSelectUserType: (type: UserType) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectUserType }) => {
  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center" p={4}>
      <VStack maxW="md" w="full" spacing={8}>
        {/* Logo and Title */}
        <Box>
          <VStack spacing={4}>
            <Box>
              <Box
                w={20}
                h={20}
                bg="white"
                borderRadius="2xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                shadow="lg"
                border="1px solid"
                borderColor="gray.100"
              >
                <Icon as={Users} boxSize={8} color="gray.700" />
              </Box>
            </Box>
            <VStack spacing={2}>
              <Heading size="2xl" className="kyu-title" color="black">
                kyu
              </Heading>
              <Text color="gray.600" textAlign="center">
                Smart queue management system
              </Text>
            </VStack>
          </VStack>
        </Box>

        {/* User Type Selection */}
        <VStack spacing={4} w="full">
          <Card
            w="full"
            cursor="pointer"
            onClick={() => onSelectUserType('staff')}
            _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
          >
            <CardBody>
              <HStack spacing={4}>
                <Box
                  w={12}
                  h={12}
                  bg="gray.50"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={UserCheck} boxSize={6} color="gray.600" />
                </Box>
                <VStack align="start" flex={1} spacing={1}>
                  <Heading size="md" color="gray.900">
                    Staff Portal
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Manage queues and serve customers
                  </Text>
                </VStack>
                <Text color="gray.400" fontSize="xl">
                  →
                </Text>
              </HStack>
            </CardBody>
          </Card>

          <Card
            w="full"
            cursor="pointer"
            onClick={() => onSelectUserType('customer')}
            _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
          >
            <CardBody>
              <HStack spacing={4}>
                <Box
                  w={12}
                  h={12}
                  bg="gray.50"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={Gift} boxSize={6} color="gray.600" />
                </Box>
                <VStack align="start" flex={1} spacing={1}>
                  <Heading size="md" color="gray.900">
                    Join Queue
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    Enter queue and earn rewards
                  </Text>
                </VStack>
                <Text color="gray.400" fontSize="xl">
                  →
                </Text>
              </HStack>
            </CardBody>
          </Card>
        </VStack>

        {/* Features */}
        <Box>
          <HStack spacing={6} justify="center">
            <VStack spacing={2}>
              <Box>
                <Box
                  w={8}
                  h={8}
                  bg="gray.50"
                  borderRadius="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize="lg">⚡</Text>
                </Box>
              </Box>
              <Text fontSize="xs" color="gray.600" textAlign="center">
                Fast & Efficient
              </Text>
            </VStack>
            <VStack spacing={2}>
              <Box>
                <Box
                  w={8}
                  h={8}
                  bg="gray.50"
                  borderRadius="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize="lg">🎯</Text>
                </Box>
              </Box>
              <Text fontSize="xs" color="gray.600" textAlign="center">
                Real-time Updates
              </Text>
            </VStack>
            <VStack spacing={2}>
              <Box>
                <Box
                  w={8}
                  h={8}
                  bg="gray.50"
                  borderRadius="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize="lg">🏆</Text>
                </Box>
              </Box>
              <Text fontSize="xs" color="gray.600" textAlign="center">
                Reward System
              </Text>
            </VStack>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};