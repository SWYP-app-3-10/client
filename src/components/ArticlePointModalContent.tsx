import React from 'react';
import { View, Text } from 'react-native';
import { missionScreenStyles } from '../screens/main/MissionScreen';
import { ARTICLE_POINT_COST } from '../screens/main/MissionScreen';

export const ArticlePointModalContent: React.FC = () => {
  return (
    <View style={missionScreenStyles.modalContent}>
      <Text style={missionScreenStyles.modalContentText}>
        <Text style={missionScreenStyles.pointText}>
          {ARTICLE_POINT_COST}포인트
        </Text>
        가 사용됩니다
      </Text>
    </View>
  );
};
