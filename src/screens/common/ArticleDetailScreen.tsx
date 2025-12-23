import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  COLORS,
  scaleWidth,
  Heading_18EB_Round,
  Body_16R,
  Caption_14R,
} from '../../styles/global';
import Header from '../../components/Header';
import { useArticles } from '../../hooks/useArticles';
import { Article } from '../../data/mock/missionData';

const ArticleDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { data: articles = [], isLoading } = useArticles();

  // @ts-ignore - route params 타입은 나중에 추가
  const articleId = route.params?.articleId;
  const article = articles.find((a: Article) => a.id === articleId);

  useEffect(() => {
    if (!isLoading && !article) {
      // 아티클을 찾을 수 없으면 뒤로가기
      navigation.goBack();
    }
  }, [isLoading, article, navigation]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.puple.main} />
        </View>
      </SafeAreaView>
    );
  }

  if (!article) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.errorContainer}>
          <Text>기사를 찾을 수 없습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header iconColor={COLORS.gray400} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>
              {article.category} | {article.readTime}
            </Text>
          </View>
          <Text style={styles.date}>{article.date}</Text>
        </View>
        <Text style={styles.title}>{article.title}</Text>
        <View style={styles.divider} />
        <Text style={styles.body}>
          {article.title}
          {'\n\n'}이 기사는 더미 데이터입니다. 실제 API 연동 후 본문 내용이
          표시됩니다.
          {'\n\n'}
          {article.title}에 대한 상세 내용이 여기에 표시됩니다.
        </Text>
      </ScrollView>
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
    paddingHorizontal: scaleWidth(20),
    paddingTop: scaleWidth(20),
    paddingBottom: scaleWidth(40),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scaleWidth(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaleWidth(16),
  },
  tag: {
    paddingHorizontal: scaleWidth(12),
    paddingVertical: scaleWidth(8),
    backgroundColor: COLORS.puple[3],
    borderRadius: scaleWidth(30),
  },
  tagText: {
    ...Caption_14R,
    color: COLORS.puple.main,
  },
  date: {
    ...Caption_14R,
    color: COLORS.gray700,
  },
  title: {
    ...Heading_18EB_Round,
    color: COLORS.black,
    marginBottom: scaleWidth(24),
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray200,
    marginBottom: scaleWidth(24),
  },
  body: {
    ...Body_16R,
    color: COLORS.black,
    lineHeight: scaleWidth(24),
  },
});

export default ArticleDetailScreen;
