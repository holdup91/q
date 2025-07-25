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
  Textarea,
  Input,
  Card,
  CardBody,
  Progress
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight } from 'lucide-react';

const MotionBox = motion(Box);

interface CompleteSurveyProps {
  onComplete: () => void;
  onBack: () => void;
}

const surveyQuestions = [
  {
    id: 1,
    question: "How would you rate your overall experience with kyu?",
    type: "radio",
    options: ["Excellent", "Good", "Fair", "Poor"],
    required: true
  },
  {
    id: 2,
    question: "What feature do you find most valuable?",
    type: "radio",
    options: ["Real-time updates", "XP rewards", "Queue position tracking", "Mini-quests"],
    required: true
  },
  {
    id: 3,
    question: "How likely are you to recommend kyu to others?",
    type: "radio",
    options: ["Very likely", "Likely", "Neutral", "Unlikely", "Very unlikely"],
    required: true
  },
  {
    id: 4,
    question: "Your email address (optional)",
    type: "email",
    options: [],
    required: false
  },
  {
    id: 5,
    question: "Any additional feedback or suggestions?",
    type: "textarea",
    options: [],
    required: false
  }
];

export const CompleteSurvey: React.FC<CompleteSurveyProps> = ({ onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = ((currentQuestion + 1) / surveyQuestions.length) * 100;

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const submitToBaserow = async (surveyData: Record<number, string>) => {
    try {
      // This would integrate with Baserow API
      // For now, we'll simulate the API call
      const response = await fetch('/api/survey-responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: surveyData[1],
          valuable_feature: surveyData[2],
          recommendation: surveyData[3],
          email: surveyData[4] || '',
          feedback: surveyData[5] || '',
          submitted_at: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit survey');
      }
      
      return true;
    } catch (error) {
      console.error('Survey submission error:', error);
      return false;
    }
  };

  const handleNext = async () => {
    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setIsSubmitting(true);
      
      // Submit to Baserow
      const success = await submitToBaserow(answers);
      
      if (success) {
        setIsCompleted(true);
        setTimeout(onComplete, 1500);
      } else {
        // Handle error - for now just complete anyway
        setIsCompleted(true);
        setTimeout(onComplete, 1500);
      }
      
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const currentQ = surveyQuestions[currentQuestion];
  const hasAnswer = answers[currentQ.id] || (!currentQ.required);

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
                  <Heading size="lg">Survey Complete!</Heading>
                  <Text color="gray.600">
                    Thank you for your valuable feedback
                  </Text>
                </VStack>
                <Box p={4} bg="gray.50" borderRadius="lg">
                  <HStack justify="center" spacing={2}>
                    <Text fontWeight="bold">+75 XP earned</Text>
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
              <Heading size="md">Customer Survey</Heading>
              <Text fontSize="sm" color="gray.500">
                Question {currentQuestion + 1} of {surveyQuestions.length}
              </Text>
            </VStack>
          </HStack>
          <Progress
            value={progress}
            mt={4}
            colorScheme="gray"
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
                  <Text fontSize="sm" color="gray.500" fontWeight="medium">
                    Question {currentQuestion + 1}
                  </Text>
                  <Heading size="md" lineHeight="1.4">
                    {currentQ.question}
                  </Heading>
                </VStack>

                {currentQ.type === "radio" && (
                  <RadioGroup
                    value={answers[currentQ.id] || undefined}
                    onChange={(value) => handleAnswer(currentQ.id, value)}
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
                            bg={answers[currentQ.id] === option ? "gray.50" : "white"}
                          >
                            <Radio value={option} w="full">
                              <Text ml={3}>{option}</Text>
                            </Radio>
                          </Box>
                        </motion.div>
                      ))}
                    </VStack>
                  </RadioGroup>
                )}

                {currentQ.type === "email" && (
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={answers[currentQ.id] || ""}
                    onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                  />
                )}

                {currentQ.type === "textarea" && (
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={answers[currentQ.id] || ""}
                    onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                    rows={4}
                    resize="none"
                  />
                )}
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
              isLoading={isSubmitting}
              loadingText="Submitting..."
              bg="black"
              color="white"
              _hover={{ bg: "gray.800" }}
              rightIcon={<ChevronRight size={16} />}
            >
              {currentQuestion === surveyQuestions.length - 1 ? "Submit Survey" : "Next"}
            </Button>
          </motion.div>
        </HStack>
      </Box>
    </Box>
  );
};