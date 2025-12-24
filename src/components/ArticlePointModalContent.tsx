import React from 'react';
import { View, Text } from 'react-native';
import {
  ARTICLE_READ_POINT_COST,
  AD_REWARD_POINTS,
  ARTICLE_READ_EXPERIENCE,
} from '../config/rewards';
import { missionScreenStyles } from '../screens/main/MissionScreen';

export const ArticlePointModalContent: React.FC = () => {
  return (
    <View style={missionScreenStyles.modalContent}>
      <Text style={missionScreenStyles.modalContentText}>
        <Text style={missionScreenStyles.pointText}>
          {ARTICLE_READ_POINT_COST}포인트
        </Text>
        가 사용됩니다
      </Text>
    </View>
  );
};
export const ArticlePointModalContentGet: React.FC = () => {
  return (
    <View style={missionScreenStyles.modalContent}>
      <Text style={missionScreenStyles.modalContentText}>
        <Text style={missionScreenStyles.pointText}>
          {AD_REWARD_POINTS}포인트
        </Text>
        를 받을 수 있어요
      </Text>
    </View>
  );
};

export const ExperienceModalContent: React.FC = () => {
  return (
    <View style={missionScreenStyles.modalContent}>
      <Text style={missionScreenStyles.modalContentText}>
        <Text style={missionScreenStyles.pointText}>
          {ARTICLE_READ_EXPERIENCE}경험치
        </Text>
      </Text>
    </View>
  );
};
