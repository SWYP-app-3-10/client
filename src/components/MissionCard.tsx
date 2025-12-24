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
import { Mission } from '../data/mock/missionData';
import { LockIcon } from '../icons/commonIcons/simpleImages';

const MissionCard = React.memo(({ mission }: { mission: Mission }) => {
  const progressPercentage =
    mission.status === '완료' ? 100 : (mission.current / mission.total) * 100;
  const isNotStarted = mission.status === null;
  const isCompleted = mission.status === '완료';

  // 상태별 그라데이션 색상
  const gradientColors = isCompleted
    ? ['#845DFF', '#764CF8', '#6F44F5']
    : ['#845DFF', '#6F44F5'];
  return (
    <View
      style={[
        styles.missionCard,
        {
          opacity: isNotStarted ? 0.3 : 1,
        },
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.missionCardGradient}
      >
        <View style={styles.progressInfo}>
          <Text
            style={[
              styles.missionCardTitle,
              isCompleted && styles.missionCardTitleCompleted,
            ]}
          >
            {mission.title}
          </Text>
          {mission.status && (
            <View style={styles.progressStatusContainer}>
              <Text style={styles.progressStatus}>{mission.status}</Text>
            </View>
          )}
        </View>
        <Spacer num={16} />
        {/* 진행 바 영역 */}
        <View style={styles.progressBarWrapper}>
          <View style={styles.progressBarContainerWrapper}>
            <View
              style={[
                styles.progressBarContainer,
                isCompleted && styles.progressBarContainerCompleted,
              ]}
            >
              {/* 진행 바 */}
              {!isNotStarted && (
                <LinearGradient
                  colors={
                    isCompleted
                      ? ['#9B7BFF', '#9B7BFF'] // 완료: #9B7BFF
                      : ['#FFE682', '#FCB000'] // 진행 중: 노란색
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.progressBar,
                    { width: `${progressPercentage}%` },
                  ]}
                />
              )}
            </View>
          </View>

          <View style={styles.progressTextContainer}>
            <Text
              style={[
                styles.progressText,
                isCompleted && styles.progressTextCompleted,
              ]}
            >
              {mission.current}/{mission.total}
            </Text>
          </View>
        </View>
        {/* 시작 전 상태: 자물쇠 아이콘 중앙에 표시 */}
        {isNotStarted && (
          <View style={styles.lockIconOverlay}>
            <LockIcon />
          </View>
        )}
      </LinearGradient>
    </View>
  );
});

MissionCard.displayName = 'MissionCard';

const styles = StyleSheet.create({
  missionCard: {
    borderRadius: BORDER_RADIUS[20],
    overflow: 'hidden',
    position: 'relative',
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
  missionCardTitleCompleted: {
    color: '#BFABFF', // 완료 상태 타이틀 색상
  },
  progressBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleWidth(16),
    height: scaleWidth(24),
  },
  progressBarContainerWrapper: {
    width: scaleWidth(274),
    height: scaleWidth(14),
  },
  progressBarContainer: {
    backgroundColor: COLORS.gray100,
    width: '100%',
    height: '100%',
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
  progressTextCompleted: {
    color: '#BFABFF', // 완료 상태 진행률 텍스트 색상
  },
  progressBarContainerCompleted: {
    backgroundColor: '#CACED9', // 완료 상태 프로그래스바 배경색 (gray400)
  },
  lockIconOverlay: {
    position: 'absolute',
    bottom: scaleWidth(32),
    left: scaleWidth(157),
  },
});

export default MissionCard;
