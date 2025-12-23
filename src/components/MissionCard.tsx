import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  COLORS,
  scaleWidth,
  BORDER_RADIUS,
  Heading_18B,
  Body_16M,
  Caption_12SB,
} from '../styles/global';
import Spacer from './Spacer';

interface Mission {
  id: number | string;
  title: string;
  status: string;
  current: number;
  total: number;
}

interface MissionCardProps {
  mission: Mission;
}

const MissionCard = React.memo<MissionCardProps>(({ mission }) => {
  const progressPercentage = (mission.current / mission.total) * 100;

  return (
    <View style={styles.missionCard}>
      <LinearGradient
        colors={['#845DFF', '#6F44F5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.missionCardGradient}
      >
        <View style={styles.progressInfo}>
          <Text style={styles.missionCardTitle}>{mission.title}</Text>
          <View style={styles.progressStatusContainer}>
            <Text style={styles.progressStatus}>{mission.status}</Text>
          </View>
        </View>
        <Spacer num={16} />
        {/* 진행 바 */}
        <View style={styles.progressBarWrapper}>
          <View style={styles.progressBarContainer}>
            <LinearGradient
              colors={['#FFE682', '#FCB000']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBar, { width: `${progressPercentage}%` }]}
            />
          </View>
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressText}>
              {mission.current}/{mission.total}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
});

MissionCard.displayName = 'MissionCard';

const styles = StyleSheet.create({
  missionCard: {
    borderRadius: BORDER_RADIUS[20],
    overflow: 'hidden',
  },
  missionCardGradient: {
    borderRadius: BORDER_RADIUS[20],
    paddingHorizontal: scaleWidth(20),
    paddingVertical: scaleWidth(24),
  },
  missionCardTitle: {
    ...Heading_18B,
    color: COLORS.white,
  },
  progressBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleWidth(16),
    height: scaleWidth(24),
  },
  progressBarContainer: {
    backgroundColor: COLORS.gray100,
    width: scaleWidth(274),
    height: scaleWidth(14),
    borderRadius: scaleWidth(9.5),
  },
  progressBar: {
    height: '100%',
    borderRadius: scaleWidth(9.5),
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressStatusContainer: {
    backgroundColor: COLORS.puple[5],
    borderRadius: BORDER_RADIUS[30],
    width: scaleWidth(50),
    height: scaleWidth(26),
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStatus: {
    ...Caption_12SB,
    color: COLORS.white,
  },
  progressTextContainer: {
    justifyContent: 'center',
  },
  progressText: {
    ...Body_16M,
    color: COLORS.white,
    textAlign: 'center',
  },
});

export default MissionCard;
