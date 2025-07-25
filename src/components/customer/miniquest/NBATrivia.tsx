import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  IconButton,
  Radio,
  RadioGroup,
  Card,
  CardBody,
  Progress,
  Badge
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight } from 'lucide-react';

const MotionBox = motion(Box);

interface NBATriviaProps {
  onComplete: () => void;
  onBack: () => void;
}

const triviaQuestions = [
  {
    id: 1,
    question: "Which team has won the most NBA championships?",
    options: ["Los Angeles Lakers", "Boston Celtics", "Chicago Bulls", "Golden State Warriors"],
    correct: 1, // Boston Celtics
  },
  {
    id: 2,
    question: "Who holds the record for most points scored in a single NBA game?",
    options: ["Kobe Bryant", "Michael Jordan", "Wilt Chamberlain", "LeBron James"],
    correct: 2, // Wilt Chamberlain
  },
  {
    id: 3,
    question: "What does NBA stand for?",
    options: ["National Basketball Association", "North Basketball Alliance", "National Ball Association", "New Basketball Association"],
    correct: 0, // National Basketball Association
  },
  {
    id: 4,
    question: "Which player is known as 'The King'?",
    options: ["Michael Jordan", "Kobe Bryant", "LeBron James", "Stephen Curry"],
    correct: 2, // LeBron James
  },
  {
    id: 5,
    question: "How many teams are currently in the NBA?",
    options: ["28", "30", "32", "34"],
    correct: 1, // 30
  }
];

export const NBATrivia: React.FC<NBATriviaProps> = ({ onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const progress = ((currentQuestion + 1) / triviaQuestions.length) * 100;

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleNext = () => {
    if (currentQuestion < triviaQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate score
      let correctAnswers = 0;
      triviaQuestions.forEach(q => {
        if (answers[q.id] === q.correct) {
          correctAnswers++;
        }
      });
      setScore(correctAnswers);
      setIsCompleted(true);
      setTimeout(onComplete, 2000);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const currentQ = triviaQuestions[currentQuestion];
  const hasAnswer = answers[currentQ.id] !== undefined;

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
                  <Text fontSize="6xl">🏀</Text>
                </motion.div>
                <VStack spacing={2}>
                  <Heading size="lg">Trivia Complete!</Heading>
                  <Text color="gray.600">
                    You scored {score} out of {triviaQuestions.length}
                  </Text>
                  <Badge colorScheme={score >= 3 ? "green" : score >= 2 ? "yellow" : "red"} size="lg">
                    {score >= 3 ? "Excellent!" : score >= 2 ? "Good Job!" : "Keep Learning!"}
                  </Badge>
                </VStack>
                <Box p={4} bg="gray.50" borderRadius="lg">
                  <HStack justify="center" spacing={2}>
                    <Text fontWeight="bold">+60 XP earned</Text>
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
            <VStack align="start" spacing={0} flex={1}>
              <Heading size="md">NBA Trivia Quiz</Heading>
              <Text fontSize="sm" color="gray.500">
                Question {currentQuestion + 1} of {triviaQuestions.length}
              </Text>
            </VStack>
            <Text fontSize="4xl">🏀</Text>
          </HStack>
          <Progress
            value={progress}
            mt={4}
            colorScheme="orange"
            bg="gray.200"
            borderRadius="full"
            size="sm"
          />
        </Box>
      </Box>

      {/* Content */}
      <Box maxW="md" mx="auto" p={4}>
        <MotionBox
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardBody>
              <VStack spacing={6} align="stretch">
                <VStack align="start" spacing={3}>
                  <Badge colorScheme="orange" size="sm">
                    Question {currentQuestion + 1}
                  </Badge>
                  <Heading size="md" lineHeight="1.4">
                    {currentQ.question}
                  </Heading>
                </VStack>

                <RadioGroup
                  value={answers[currentQ.id]?.toString()}
                  onChange={(value) => handleAnswer(currentQ.id, parseInt(value))}
                >
                  <VStack align="stretch" spacing={3}>
                    {currentQ.options.map((option, index) => (
                      <motion.div
                        key={option}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Box
                          p={4}
                          border="1px solid"
                          borderColor="gray.200"
                          borderRadius="lg"
                          cursor="pointer"
                          _hover={{ bg: "gray.50" }}
                          bg={answers[currentQ.id] === index ? "orange.50" : "white"}
                          borderWidth={answers[currentQ.id] === index ? "2px" : "1px"}
                          borderColor={answers[currentQ.id] === index ? "orange.300" : "gray.200"}
                        >
                          <Radio value={index.toString()} w="full">
                            <Text ml={3} fontWeight={answers[currentQ.id] === index ? "medium" : "normal"}>
                              {option}
                            </Text>
                          </Radio>
                        </Box>
                      </motion.div>
                    ))}
                  </VStack>
                </RadioGroup>
              </VStack>
            </CardBody>
          </Card>
        </MotionBox>

        {/* Navigation */}
        <HStack justify="space-between" mt={6}>
          <Button
            variant="ghost"
            onClick={handlePrevious}
            isDisabled={currentQuestion === 0}
          >
            Previous
          </Button>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleNext}
              isDisabled={!hasAnswer}
              bg="orange.500"
              color="white"
              _hover={{ bg: "orange.600" }}
              rightIcon={<ChevronRight size={16} />}
            >
              {currentQuestion === triviaQuestions.length - 1 ? "Finish Quiz" : "Next"}
            </Button>
          </motion.div>
        </HStack>
      </Box>
    </Box>
  );
};