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
import { Article } from '../data/mock/missionData';

interface ArticleContentProps {
  article: Article;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ article }) => {
  return (
    <>
      {/* 이미지 */}
      {article.imageUrl && (
        <Image
          source={{ uri: article.imageUrl }}
          style={styles.articleImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.infoContainer}>
        {/* 카테고리 */}
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{article.category}</Text>
        </View>
        <Spacer num={8} />
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.meta}>{article.date} | 조회수 2,000</Text>
        <Spacer num={40} />

        {/* 본문 */}
        <Text style={styles.body}>
          록히드 마틴이 F-35 전투기 관련 총 11억 4천만 달러 규모의 대형 계약을
          추가로 확보하면서 글로벌 방산 산업에 다시 한 번 강한 신호를 보냈다.
          이번 계약은 단순한 무기 판매를 넘어, 미·중·러를 축으로 한 패권 경쟁이
          얼마나 구조적으로 고착화되고 있는지를 보여주는 상징적 사건이다.
          {'\n\n'}
          미국은 동맹국 중심의 군사 블록화를 강화하고 있고, 중국과 러시아는 이에
          대응해 군사력 현대화와 전략무기 개발에 막대한 자금을 투입하고 있다.
          이처럼 충돌 가능성이 상존하는 국제 질서 속에서 각 국가는 '전쟁 억지'를
          명분으로 군사 예산을 더욱 확대하고 있으며, 그 수혜는 자연스럽게 글로벌
          방산 기업들로 향한다.
          {'\n\n'}
          아이러니하게도 국제 정세의 불안은 금융시장에서는 불확실성이지만, 방산
          업종에는 오히려 '확실한 수요'로 작용한다. 미·중·러 간 갈등이 단기간에
          완화될 가능성은 크지 않으며, 우주·사이버·무인 전력까지 경쟁 영역이
          확장되는 흐름도 뚜렷하다. 이러한 구조 속에서 록히드 마틴을 비롯한
          글로벌 방산 기업들의 중장기 전망은 당분간 낙관적인 흐름을 이어갈
          가능성이 높다. 전쟁을 원치 않는 국제 사회의 역설적인 선택이, 결국 더
          많은 무기와 더 강한 군사력을 요구하고 있는 셈이다.
        </Text>
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
    borderRadius: scaleWidth(12),
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
  body: {
    ...Body_16R,
    color: COLORS.black,
  },
});

export default ArticleContent;
