import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  ARTICLE_READ_POINT_COST,
  AD_REWARD_POINTS,
  ARTICLE_READ_EXPERIENCE,
} from '../config/rewards';

import { COLORS, scaleWidth, Body_16M, BORDER_RADIUS } from '../styles/global';
export const ArticlePointModalContent: React.FC = () => {
  return (
    <View style={styles.modalContent}>
      <Text style={styles.modalContentText}>
        <Text style={styles.pointText}>{ARTICLE_READ_POINT_COST}포인트</Text>가
        사용됩니다
      </Text>
    </View>
  );
};
export const ArticlePointModalContentGet: React.FC = () => {
  return (
    <View style={styles.modalContent}>
      <Text style={styles.modalContentText}>
        <Text style={styles.pointText}>{AD_REWARD_POINTS}포인트</Text>를 받을 수
        있어요
      </Text>
    </View>
  );
};

export const ExperienceModalContent: React.FC<{ point?: boolean }> = ({
  point = false,
}) => {
  return (
    <View style={styles.modalContent}>
      {point && (
        <View
          style={[
            styles.modalContentTextWrap,
            { backgroundColor: COLORS.blue[5] },
          ]}
        >
          <Text style={styles.getPointText}>
            {ARTICLE_READ_POINT_COST}포인트
          </Text>
        </View>
      )}
      <View style={styles.modalContentTextWrap}>
        <Text style={styles.pointText}>{ARTICLE_READ_EXPERIENCE}경험치</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContentTextWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    width: scaleWidth(111),
    height: scaleWidth(36),
    borderRadius: BORDER_RADIUS[30],
  },
  modalContentText: {
    ...Body_16M,
    color: COLORS.gray700,
  },
  pointText: {
    ...Body_16M,
    color: COLORS.puple.main,
  },
  getPointText: {
    ...Body_16M,
    color: COLORS.blue[6],
  },
  modalContent: {
    marginTop: scaleWidth(4),
    flexDirection: 'row',
    alignItems: 'center',
  },
});
