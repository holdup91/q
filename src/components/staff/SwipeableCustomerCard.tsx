import React, { useState, useRef, useEffect } from 'react';
import { Box, VStack, HStack, Text, Heading, Badge } from '@chakra-ui/react';
import { motion, PanInfo, AnimatePresence } from 'framer-motion';
import type { Database } from '../../lib/supabase';

const MotionBox = motion(Box);

type Ticket = Database['public']['Tables']['tickets']['Row'];

interface SwipeableCustomerCardProps {
  ticket: Ticket;
  onSwipeRight: () => void; // Serve
  onSwipeLeft: () => void;  // Skip
  onSwipeDown: () => void;  // Hold
  isTop: boolean;
  zIndex: number;
  offset: number;
}

export const SwipeableCustomerCard: React.FC<SwipeableCustomerCardProps> = ({
  ticket,
  onSwipeRight,
  onSwipeLeft,
  onSwipeDown,
  isTop,
  zIndex,
  offset
}) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (!isTop) return;

    const threshold = 100;
    const { x, y } = info.offset;
    
    if (Math.abs(x) > threshold && Math.abs(x) > Math.abs(y)) {
      setIsExiting(true);
      if (x > 0) {
        setTimeout(() => onSwipeRight(), 200);
      } else {
        setTimeout(() => onSwipeLeft(), 200);
      }
    } else if (y > threshold) {
      setIsExiting(true);
      setTimeout(() => onSwipeDown(), 200);
    }
  };

  if (isExiting) {
    return null;
  }

  return (
    <MotionBox
      position="absolute"
      left={4}
      right={4}
      bgGradient="linear(to-b, blue.50, white)"
      borderRadius="2xl"
      shadow="xl"
      border="2px solid"
      borderColor="blue.100"
      cursor={isTop ? 'grab' : 'default'}
      zIndex={zIndex}
      drag={isTop}
      dragConstraints={{ left: -200, right: 200, top: 0, bottom: 200 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      whileDrag={{ 
        cursor: 'grabbing',
        scale: 1.05,
        rotate: 5,
        boxShadow: '0 20px 30px rgba(0,0,0,0.2)'
      }}
      exit={{
        x: isExiting ? (Math.random() > 0.5 ? 300 : -300) : 0,
        y: isExiting ? -100 : 0,
        opacity: 0,
        scale: 0.8,
        rotate: isExiting ? (Math.random() > 0.5 ? 15 : -15) : 0,
        transition: { duration: 0.3, ease: "easeInOut" }
      }}
      animate={{
        y: offset * 8,
        scale: 1 - offset * 0.02,
        opacity: 1 - offset * 0.1
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      height="500px"
      overflow="hidden"
    >
      <Box p={6} height="full" display="flex" flexDirection="column" justify="space-between">
        <VStack spacing={6} align="center" flex="1">
          {/* Ticket Number */}
          <Box
            w={24}
            h={24}
            bgGradient="linear(135deg, blue.400, blue.600)"
            borderRadius="2xl"
            display="flex"
            alignItems="center"
            justifyContent="center"
            shadow="lg"
            mt={4}
          >
            <Text fontSize="3xl" fontWeight="bold" color="white">
              {ticket.ticket_number}
            </Text>
          </Box>

          {/* Customer Name */}
          <VStack spacing={3} align="center">
            <Heading size="2xl" color="gray.800" fontWeight="bold" textAlign="center">
              {ticket.customer_name}
            </Heading>
            
            {/* Service & Status */}
            <VStack spacing={2} align="center">
              <Text color="gray.600" fontSize="xl" fontWeight="medium" textAlign="center">
                {ticket.purpose}
              </Text>
              <Badge colorScheme="blue" size="lg" px={4} py={2} borderRadius="full" fontSize="md">
                {ticket.status}
              </Badge>
            </VStack>
          </VStack>

          {/* Wait Time */}
          <VStack spacing={2} align="center" mt={4}>
            <Text fontSize="lg" color="gray.500" fontWeight="medium">
              Wait time
            </Text>
            <Text fontSize="5xl" fontWeight="bold" color="blue.600" lineHeight="1">
              {ticket.actual_wait_time}
            </Text>
            <Text fontSize="xl" color="gray.500" fontWeight="medium" mt="-2">
              minutes
            </Text>
          </VStack>
        </VStack>

        {/* Swipe Indicators - only show for top card */}
        {isTop && (
          <HStack justify="center" spacing={8} py={3} opacity={0.7}>
            <HStack spacing={2}>
              <Box w={2} h={2} bg="red.400" borderRadius="full" />
              <Text fontSize="xs" color="gray.600" fontWeight="medium">Cancel</Text>
            </HStack>
            <HStack spacing={2}>
              <Box w={2} h={2} bg="orange.400" borderRadius="full" />
              <Text fontSize="xs" color="gray.600" fontWeight="medium">Hold</Text>
            </HStack>
            <HStack spacing={2}>
              <Box w={2} h={2} bg="green.400" borderRadius="full" />
              <Text fontSize="xs" color="gray.600" fontWeight="medium">Serve</Text>
            </HStack>
          </HStack>
        )}

        {/* Action Buttons for non-top cards or as fallback */}
        {!isTop && (
          <HStack spacing={3} justify="center" py={4}>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSwipeLeft}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                background: 'white',
                fontSize: '16px',
                fontWeight: '600',
                color: '#718096',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer'
              }}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSwipeDown}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: '2px solid #ffd89b',
                background: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                boxShadow: '0 4px 12px rgba(255, 216, 155, 0.3)',
                cursor: 'pointer'
              }}
            >
              Hold
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSwipeRight}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                cursor: 'pointer'
              }}
            >
              Serve Now
            </motion.button>
          </HStack>
        )}
      </Box>
    </MotionBox>
  );
};