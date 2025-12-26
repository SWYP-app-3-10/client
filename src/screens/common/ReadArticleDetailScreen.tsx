import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useRoute } from '@react-navigation/native';
import { BORDER_RADIUS, COLORS, scaleWidth } from '../../styles/global';
import Header from '../../components/Header';
import Button from '../../components/Button';
import ArticleContent from '../../components/ArticleContent';
import QuizFeedback from '../../components/QuizFeedback';
import Spacer from '../../components/Spacer';
import { useArticles } from '../../hooks/useArticles';
import { Article } from '../../data/mock/missionData';
import { mockQuiz } from '../../data/mock/quizData';

const ReadArticleDetailScreen = () => {
  const route = useRoute();
  const { data: articles = [] } = useArticles();
  const scrollViewRef = useRef<ScrollView>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const lastShowQuizStateRef = useRef(false);
  const quizSectionRef = useRef<View>(null);

  // @ts-ignore
  const articleId = route.params?.articleId;
  const article = articles.find((a: Article) => a.id === articleId);
  const quiz = mockQuiz; // TODO: articleId로 실제 퀴즈 데이터 가져오기

  // 스크롤 이벤트 핸들러
  const handleScroll = (event: any) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const scrollY = contentOffset.y;
    const scrollViewHeight = layoutMeasurement.height;

    // 퀴즈 섹션의 실제 위치 측정
    quizSectionRef.current?.measureLayout(
      scrollViewRef.current as any,
      (_x, y, _width, _height) => {
        const quizSectionStart = y;

        const thresholdDown = quizSectionStart - scrollViewHeight;

        const hysteresisOffset = scrollViewHeight * 0.2;
        const thresholdUp = thresholdDown - hysteresisOffset;

        if (scrollY + scrollViewHeight >= quizSectionStart) {
          // 퀴즈 섹션이 화면에 보임
          if (!lastShowQuizStateRef.current) {
            setShowQuiz(true);
            lastShowQuizStateRef.current = true;
          }
        } else if (scrollY < thresholdUp) {
          // 퀴즈 섹션 위로 충분히 올라감
          if (lastShowQuizStateRef.current) {
            setShowQuiz(false);
            lastShowQuizStateRef.current = false;
          }
        }
      },
      () => {
        const { contentSize } = event.nativeEvent;
        const scrollableHeight = contentSize.height - scrollViewHeight;
        const threshold80Percent = scrollableHeight * 0.8;

        if (scrollY >= threshold80Percent) {
          if (!lastShowQuizStateRef.current) {
            setShowQuiz(true);
            lastShowQuizStateRef.current = true;
          }
        } else if (scrollY < scrollableHeight * 0.7) {
          if (lastShowQuizStateRef.current) {
            setShowQuiz(false);
            lastShowQuizStateRef.current = false;
          }
        }
      },
    );
  };

  // 퀴즈 보기 버튼 클릭 시 퀴즈 섹션으로 스크롤
  const handleQuizButtonPress = () => {
    // 퀴즈 섹션으로 스크롤
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // 글 보기 버튼 클릭 시 상단으로 스크롤
  const handleArticleButtonPress = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  if (!article) {
    return (
      <SafeAreaView style={styles.container}>
        <Header iconColor={COLORS.black} />
        <View style={styles.errorContainer}>
          <Text>기사를 찾을 수 없습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // TODO: 실제 선택한 답안 가져오기
  const selectedAnswerId = 1;

  return (
    <SafeAreaView style={styles.container}>
      <Header iconColor={COLORS.black} />
      <ScrollView
        bounces={false}
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* 기사 내용 */}
        <ArticleContent article={article} />
        <Spacer num={52} />
        {/* 퀴즈 섹션 */}
        <QuizFeedback
          question={quiz.question}
          options={quiz.options}
          correctAnswerId={quiz.correctAnswerId}
          selectedAnswerId={selectedAnswerId}
          showFeedbackMessage={true}
          containerRef={quizSectionRef}
        />
      </ScrollView>

      <View style={styles.fixedButtonContainer}>
        <View style={styles.buttonWrapper}>
          <LinearGradient
            colors={[COLORS.white, COLORS.transparent]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.overlayBackdrop}
          />
          <Button
            title={showQuiz ? '글 보기' : '퀴즈 보기'}
            onPress={
              showQuiz ? handleArticleButtonPress : handleQuizButtonPress
            }
            variant="primary"
            style={styles.fixedButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: scaleWidth(246),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scaleWidth(20),
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: scaleWidth(31),
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrapper: {
    position: 'relative',
    width: scaleWidth(393),
    height: scaleWidth(175),
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: scaleWidth(31),
  },
  overlayBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fixedButton: {
    width: scaleWidth(103),
    height: scaleWidth(47),
    borderRadius: BORDER_RADIUS[30],
    backgroundColor: COLORS.gray800,
    // iOS 그림자
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // Android 그림자
    elevation: 8,
  },
});

export default ReadArticleDetailScreen;
