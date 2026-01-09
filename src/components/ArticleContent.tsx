import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import {
  COLORS,
  scaleWidth,
  Body_16R,
  Caption_14R,
  BORDER_RADIUS,
  Heading_20EB_Round,
} from '../styles/global';
import Spacer from './Spacer';
import { ContentDetail } from '../api/missionApi';
import { ViewIcon } from '../icons';

interface ArticleContentProps {
  content?: ContentDetail;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ content }) => {
  return (
    <>
      {/* 이미지 */}
      {content?.imageUrl && (
        <Image
          source={{ uri: content?.imageUrl }}
          style={styles.articleImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.infoContainer}>
        {/* 카테고리 */}
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{content?.categoryName}</Text>
        </View>
        <Spacer num={8} />
        <Text style={styles.title}>{content?.title}</Text>
        <View style={styles.metaWrapper}>
          <View style={styles.metaContainer}>
            <Text style={styles.meta}>{content?.contentDate}</Text>
            <Text style={styles.meta}> | </Text>
            <View style={styles.viewIconContainer}>
              <ViewIcon />
            </View>
            <Text style={styles.meta}> {content?.hits}</Text>
          </View>
        </View>
        <Spacer num={40} />

        {/* 본문 */}
        <Text style={styles.body}>{content?.content}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  articleImage: {
    width: '100%',
    height: scaleWidth(220),
    backgroundColor: COLORS.gray200,
  },
  infoContainer: {
    borderRadius: BORDER_RADIUS[20],
    top: -scaleWidth(27),
    backgroundColor: COLORS.white,
    paddingHorizontal: scaleWidth(20),
    paddingTop: scaleWidth(27),
  },
  categoryContainer: {
    width: scaleWidth(49),
    height: scaleWidth(35),
    backgroundColor: COLORS.puple[3],
    borderRadius: BORDER_RADIUS[30],
    justifyContent: 'center',
    alignItems: 'center',
  },
  category: {
    ...Caption_14R,
    color: COLORS.puple.main,
  },
  title: {
    ...Heading_20EB_Round,
    color: COLORS.black,
    marginBottom: scaleWidth(12),
  },
  meta: {
    ...Caption_14R,
    color: COLORS.gray600,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  body: {
    ...Body_16R,
    color: COLORS.black,
  },
  viewIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaWrapper: {
    flex: 1,
  },
});

export default ArticleContent;
