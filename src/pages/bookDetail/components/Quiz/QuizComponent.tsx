import React, { useState, FC, useEffect } from 'react';
import { Form, Input, Button, Tag, Spin, Row, Col, Typography } from 'antd';
import Quiz from 'react-quiz-component';
import { getQuiz } from '@/services/aiService';

interface QuizComponentProps {
  sourceLanguage: string;
  libraryId?: string;
}

const QuizComponent: FC<QuizComponentProps> = (props) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [quizData, setQuizData] = useState<any>();

  const [allAspects, setAllAspects] = useState<string[]>([]);

    useEffect(() => {
      const aspectsArray: string[] = [];
      Object.values(englishLearningAspects).forEach(category => {
        aspectsArray.push(...category);
      });
      setAllAspects(aspectsArray);
    }, []);
    
    const handleTagChange = (aspectCategory: string, tag: string, checked: boolean): void => {
      const nextSelectedTags = checked
        ? [...selectedTags, `${aspectCategory}: ${tag}`]
        : selectedTags.filter(t => t !== `${aspectCategory}: ${tag}`);
      setSelectedTags(nextSelectedTags);
    };
  
    const handleSubmit = async() => {
      setLoading(true);

      let quiz = await getQuiz(
        props.sourceLanguage,
        "sk",
        props.libraryId!,
        selectedTags
      );

      
      // Assuming the JSON starts with '{' for simplicity. Adjust if it could start with '['
      const indexOfJsonStart = quiz.indexOf('{');
      const indexOfJsonEnd = quiz.lastIndexOf('}');

      if (indexOfJsonStart === -1 || indexOfJsonEnd === -1) {
        throw new Error('Valid JSON structure not found in quiz response');
      }
  
      const jsonString = quiz.substring(indexOfJsonStart, indexOfJsonEnd + 1);

      console.log(jsonString)
      const quizResponse = JSON.parse(jsonString);

      const quizDataWithExtraInfo = {
        quizTitle: "Vocabu Quiz",
        quizSynopsis: "Welcome to the Vocabu Quiz! This engaging quiz is designed to test and expand your vocabulary knowledge across various levels of difficulty.",
        nrOfQuestions: quizResponse.questions ? quizResponse.questions.length.toString() : "0",
        questions: quizResponse.questions
      };
      
      setQuizData(quizDataWithExtraInfo);
      setLoading(false);
      setSubmitted(true);
    };

    const englishLearningAspects = {
      Tenses: [
        'Simple Present', 'Present Continuous (Progressive)', 'Present Perfect',
        'Present Perfect Continuous', 'Simple Past', 'Past Continuous (Progressive)',
        'Past Perfect', 'Past Perfect Continuous', 'Simple Future',
        'Future Continuous (Progressive)', 'Future Perfect', 'Future Perfect Continuous',
        'Simple Conditional', 'Conditional Perfect'
      ],
      Moods: [
        'Imperative Mood', // Commands, requests
        'Subjunctive Mood' // Wishes, hypotheticals, demands, and after certain expressions
      ],
      VerbForms: [
        'Modal Verbs', // Can, could, may, might, must, shall, should, will, would
        'Passive Voice', // Focus on the action rather than who performs it
        'Gerunds and Infinitives', // Verbs acting as nouns, to + verb
        'Regular and Irregular Verbs' // Patterns of past tense and past participle forms
      ],
      Speech: [
        'Reported Speech', // Converting from direct to indirect speech
        'Direct Speech' // Quoting the exact words spoken
      ],
      SentenceStructures: [
        'Question Forms', // Different ways to form questions
        'Negative Forms', // Constructing negative sentences
        'Relative Clauses', // Clauses that provide extra information about a noun
        'Direct and Indirect Objects', // Objects receiving the action of the verb
        'Subject-Verb Agreement', // Matching the verb with the subject in number (singular/plural)
        'Compound and Complex Sentences' // Using conjunctions to combine clauses
      ],
      PartsOfSpeech: [
        'Prepositions', // Words that show relationships between nouns or pronouns and other words
        'Phrasal Verbs', // Verbs combined with prepositions or adverbs
        'Articles (a, an, the)', // Definite and indefinite articles
        'Pronouns', // Words standing in for nouns
        'Conjunctions', // Words that connect clauses, sentences, or words
        'Adverbs', // Words that modify verbs, adjectives, or other adverbs
        'Adjectives', // Words that describe nouns
        'Nouns', // Person, place, thing, or idea
        'Determiners', // Words that introduce nouns
        'Interjections' // Words or phrases that express emotion or exclamation
      ],
      Comparison: [
        'Comparatives and Superlatives' // Comparing two or more things or actions
      ],
      Punctuation: [
        'Commas', 'Periods', 'Question Marks', 'Exclamation Points', 'Quotation Marks', 'Apostrophes', 'Colons', 'Semicolons', 'Dashes', 'Parentheses'
      ],
    }
  
    const quiz =  {
        "quizTitle": "React Quiz Component Demo",
        "quizSynopsis": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim",
        "nrOfQuestions": "4",
        "questions": [
          {
            "question": "What led the speaker to contemplate the meaning of life?",
            "questionType": "text",
            "answerSelectionType": "single",
            "answers": [
              "An existential crisis during teenage years.",
              "Reading religious texts.",
              "Encountering philosophical ideas.",
              "Reading German philosophers."
            ],
            "correctAnswer": "1",
            "messageForCorrectAnswer": "Correct answer. Good job.",
            "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
            "explanation": "The speaker mentioned having an existential crisis during their teenage years, which led them to contemplate the meaning of life.",
            "point": "20"
          },
          {
            "question": "What book inspired the speaker's understanding of formulating questions about the universe?",
            "questionType": "text",
            "answerSelectionType": "single",
            "answers": [
              "The Hitchhiker's Guide to the Galaxy.",
              "A Brief History of Time.",
              "The God Delusion.",
              "Thus Spoke Zarathustra."
            ],
            "correctAnswer": "1",
            "messageForCorrectAnswer": "Correct answer. Good job.",
            "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
            "explanation": "The speaker mentioned that reading The Hitchhiker's Guide to the Galaxy inspired their understanding of formulating questions about the universe.",
            "point": "20"
          },
          {
            "question": "What does the speaker believe expanding consciousness will help humanity achieve?",
            "questionType": "text",
            "answerSelectionType": "single",
            "answers": [
              "A better understanding of the universe.",
              "Advanced technology.",
              "World peace.",
              "Colonization of other planets."
            ],
            "correctAnswer": "1",
            "messageForCorrectAnswer": "Correct answer. Good job.",
            "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
            "explanation": "The speaker believes expanding consciousness will help humanity achieve a better understanding of the universe.",
            "point": "20"
          },
          {
            "question": "According to the speaker, why is it important to ensure things are good on Earth?",
            "questionType": "text",
            "answerSelectionType": "single",
            "answers": [
              "To sustain humanity.",
              "To prevent despair.",
              "To achieve sustainability.",
              "To prepare for colonization."
            ],
            "correctAnswer": "2",
            "messageForCorrectAnswer": "Correct answer. Good job.",
            "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
            "explanation": "According to the speaker, it is important to ensure things are good on Earth to prevent despair.",
            "point": "20"
          }
        ]
      }

      return (
        <Row justify="center">
          <Col span={24}>
            {!submitted ? (
              <Form onFinish={handleSubmit}>
                <Typography.Title level={4}>Select Quiz Topics:</Typography.Title>
                <br />
                {Object.entries(englishLearningAspects).map(([category, tags]) => (
                  <Form.Item key={category}>
                    <Typography.Text strong>{category.replace(/([A-Z])/g, ' $1').trim()}:</Typography.Text>
                    {tags.map(tag => (
                      <Tag.CheckableTag
                        key={tag}
                        checked={selectedTags.includes(`${category}: ${tag}`)}
                        onChange={checked => handleTagChange(category, tag, checked)}
                      >
                        {tag}
                      </Tag.CheckableTag>
                    ))}
                  </Form.Item>
                ))}
                <br />
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Generate Quiz
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              <Quiz quiz={quizData} showInstantFeedback={true} continueTillCorrect={true} />
            )}
          </Col>
        </Row>
      );
  };

  export default QuizComponent;
