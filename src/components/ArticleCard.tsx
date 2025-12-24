import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  COLORS,
  scaleWidth,
  BORDER_RADIUS,
  Heading_18EB_Round,
  Caption_14R,
} from '../styles/global';
import Spacer from './Spacer';

interface Article {
  id: number | string;
  title: string;
  category: string;
  readTime: string;
  date: string;
}

interface ArticleCardProps {
  article: Article;
  onPress: () => void;
}

const ArticleCard = React.memo<ArticleCardProps>(({ article, onPress }) => {
  return (
    <TouchableOpacity style={styles.articleCardWrapper} onPress={onPress}>
      <View style={styles.articleCard}>
        {/* 이미지 플레이스홀더 */}
        <View style={styles.articleImageContainer}>
          <View style={styles.articleImagePlaceholder} />
          <View style={styles.articleTag}>
            <Text style={styles.articleTagText}>
              {article.category} | {article.readTime}
            </Text>
          </View>
        </View>
        {/* 아티클 정보 */}
        <View style={styles.articleInfo}>
          <Text style={styles.articleTitle} numberOfLines={2}>
            {article.title}
          </Text>
          <Spacer num={12} />
          <Text style={styles.articleDate}>{article.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

ArticleCard.displayName = 'ArticleCard';

const styles = StyleSheet.create({
  articleCardWrapper: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS[16],
    // iOS 그림자
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: scaleWidth(2),
    },
    shadowOpacity: 0.2,
    elevation: 2,
  },
  articleCard: {
    borderRadius: BORDER_RADIUS[16],
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    height: scaleWidth(292),
  },
  articleImageContainer: {
    position: 'relative',
    width: '100%',
    height: scaleWidth(175),
  },
  articleImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#D9D9D9',
  },
  articleTag: {
    position: 'absolute',
    top: scaleWidth(20),
    right: scaleWidth(20),
    paddingHorizontal: scaleWidth(12),
    paddingVertical: scaleWidth(8),
    backgroundColor: COLORS.puple[3],
    borderRadius: BORDER_RADIUS[30],
  },
  articleTagText: {
    ...Caption_14R,
    color: COLORS.puple.main,
  },
  articleInfo: {
    paddingVertical: scaleWidth(16),
    paddingHorizontal: scaleWidth(24),
  },
  articleTitle: {
    ...Heading_18EB_Round,
    color: COLORS.black,
  },
  articleDate: {
    ...Caption_14R,
    color: COLORS.gray700,
  },
});

export default ArticleCard;
