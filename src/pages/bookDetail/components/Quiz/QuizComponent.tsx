import React, { useState, useEffect, FC } from "react";
import { Form, Button, Tag, Typography, Row, Col } from "antd";
import Quiz from "react-quiz-component";
import styles from "./QuizComponent.module.less";

interface QuizComponentProps {
  sourceLanguage: string;
  libraryId?: string;
  snapshot: any; // Ideally, you would define a more specific type for snapshot
}

const QuizComponent: FC<QuizComponentProps> = ({
  sourceLanguage,
  libraryId,
  snapshot,
}) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [quizData, setQuizData] = useState<any>(null);
  const [quizTopics, setQuizTopics] = useState<string[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);

  // On component mount, extract quiz topics from the snapshot
  /* useEffect(() => {
    if (snapshot?.quizzes) {
      const topics = snapshot.quizzes.map((quiz: any) => quiz.quizTopic);
      setQuizTopics(topics);
    } else {
      console.log(
        "No quizzes found in snapshot or snapshot structure is not as expected"
      );
    }
  }, [snapshot]); */

  // Handle selection of quiz topics
  const handleTagChange = (tag: string, checked: boolean): void => {
    if (checked) {
      setSelectedTag(tag);
      const quiz = snapshot.quizzes.find((q: any) => q.quizTopic === tag);
      setCurrentQuiz(quiz);
    } else {
      setSelectedTag(null);
      setCurrentQuiz(null);
    }
  };

  // Handle the submission to generate the quiz based on the selected topic
  const handleSubmit = async () => {
    setLoading(true);

    if (currentQuiz) {
      const quizDataWithExtraInfo = {
        quizTitle: currentQuiz.quizTopic || "Vocabu Quiz",
        quizSynopsis:
          "Welcome to the Vocabu Quiz! This engaging quiz is designed to test and expand your vocabulary knowledge across various levels of difficulty.",
        nrOfQuestions: currentQuiz.quizQuestions.length.toString(),
        questions: currentQuiz.quizQuestions,
      };

      setQuizData(quizDataWithExtraInfo);
    } else {
      console.error("No quiz data available for the selected topic.");
    }

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <Row justify="center">
      <Col span={24}>
        {!submitted ? (
          <Form onFinish={handleSubmit}>
            <Typography.Title level={4}>Take a VocabuQuiz</Typography.Title>
            <br />
            {quizTopics.map((tag) => (
              <Tag.CheckableTag
                key={tag}
                checked={selectedTag === tag}
                onChange={(checked) => handleTagChange(tag, checked)}
                style={{
                  margin: "4px",
                  padding: "8px 15px",
                  fontSize: "16px",
                  borderRadius: "10px",
                  backgroundColor:
                    selectedTag === tag ? "#4CAF50" : "Gainsboro",
                  transition: "none",
                  //maxWidth: "440px", // Set the maximum width of each tag to 430px
                  whiteSpace: "normal", // Allows text to wrap within the tag
                  overflow: "hidden", // Prevents the content from overflowing the tag boundary
                  textOverflow: "ellipsis",
                }}
              >
                {tag}
              </Tag.CheckableTag>
            ))}
            <br />
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={!selectedTag}
              style={{
                borderRadius: "10px",
                marginTop: "30px",
                marginLeft: "5px",
                padding: "8px 15px",
                height: "40px",
                backgroundColor: "#2C4E80",
                color: "white",
              }}
            >
              Show Quiz
            </Button>
          </Form>
        ) : (
          <div className={styles.reactQuizContainer}>
            <Quiz
              quiz={quizData}
              showInstantFeedback={true}
              continueTillCorrect={false}
              shuffle={true}
              shuffleAnswer={true}
              className={styles.reactQuizContainer}
              disableSynopsis={true}
            />
          </div>
        )}
      </Col>
    </Row>
  );
};

export default QuizComponent;
