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

const MissionCard = React.memo(
  ({ mission, myPage = false }: { mission: Mission; myPage?: boolean }) => {
    const progressPercentage =
      mission.status === '완료' ? 100 : (mission.current / mission.total) * 100;
    const isNotStarted = mission.status === null;
    const isCompleted = mission.status === '완료';

    // 상태별 그라데이션 색상
    const gradientColors = isCompleted
      ? [COLORS.puple.light, COLORS.puple.lighter, COLORS.puple.main]
      : [COLORS.puple.light, COLORS.puple.main];

    // 공통 콘텐츠
    const cardContent = (
      <>
        <View style={styles.progressInfo}>
          <Text
            style={[
              styles.missionCardTitle,
              isCompleted && styles.missionCardTitleCompleted,
              myPage && styles.missionCardTitleMyPage,
            ]}
          >
            {mission.title}
          </Text>
          {mission.status && (
            <View
              style={[
                styles.progressStatusContainer,
                myPage &&
                  (isCompleted
                    ? styles.progressStatusContainerMyPageCompleted
                    : styles.progressStatusContainerMyPageInProgress),
              ]}
            >
              <Text
                style={[
                  styles.progressStatus,
                  myPage && [
                    isCompleted
                      ? { color: COLORS.gray800 }
                      : { color: COLORS.puple.main },
                  ],
                ]}
              >
                {mission.status}
              </Text>
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
                myPage && styles.progressBarContainerMyPageCompleted,
              ]}
            >
              {/* 진행 바 */}
              {!isNotStarted && (
                <LinearGradient
                  colors={
                    myPage && isCompleted
                      ? [COLORS.yellow.light, COLORS.yellow.main] // 마이페이지 완료: 노란색
                      : isCompleted
                      ? [COLORS.puple[5], COLORS.puple[5]] // 완료: #9B7BFF
                      : [COLORS.yellow.light, COLORS.yellow.main] // 진행 중: 노란색
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
                myPage && styles.progressTextMyPage,
              ]}
            >
              {mission.current}/{mission.total}
            </Text>
          </View>
        </View>
      </>
    );

    return (
      <View style={styles.missionCard}>
        {myPage ? (
          <>
            <View
              style={[
                styles.missionCardWhite,
                {
                  opacity: isNotStarted ? 0.3 : 1,
                },
              ]}
            >
              {cardContent}
            </View>
            {/* 보더는 opacity 적용 안 됨 */}
            <View style={styles.missionCardWhiteBorder} />
            {/* 자물쇠 아이콘은 opacity 적용 안 됨 */}
            {isNotStarted && (
              <View style={styles.lockIconOverlay}>
                <LockIcon />
              </View>
            )}
          </>
        ) : (
          <>
            <View
              style={{
                opacity: isNotStarted ? 0.3 : 1,
              }}
            >
              <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.missionCardGradient}
              >
                {cardContent}
              </LinearGradient>
            </View>
            {/* 자물쇠 아이콘은 opacity 적용 안 됨 */}
            {isNotStarted && (
              <View style={styles.lockIconOverlay}>
                <LockIcon />
              </View>
            )}
          </>
        )}
      </View>
    );
  },
);

MissionCard.displayName = 'MissionCard';

const styles = StyleSheet.create({
  missionCard: {
    borderRadius: BORDER_RADIUS[20],

    position: 'relative',
  },
  missionCardGradient: {
    borderRadius: BORDER_RADIUS[20],
    paddingHorizontal: scaleWidth(20),
    paddingVertical: scaleWidth(24),
  },
  missionCardWhite: {
    borderRadius: BORDER_RADIUS[16],
    paddingHorizontal: scaleWidth(20),
    paddingVertical: scaleWidth(24),
    backgroundColor: COLORS.white,
  },
  missionCardWhiteBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BORDER_RADIUS[16],
    borderWidth: 1,
    borderColor: COLORS.gray300,
    pointerEvents: 'none',
  },
  missionCardTitle: {
    ...Heading_18B,
    color: COLORS.white,
  },
  missionCardTitleCompleted: {
    color: COLORS.puple.completed, // 완료 상태 타이틀 색상
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
    color: COLORS.puple.completed, // 완료 상태 진행률 텍스트 색상
  },
  missionCardTitleMyPage: {
    color: COLORS.black,
  },
  progressTextMyPage: {
    color: COLORS.black,
  },
  progressStatusContainerMyPageInProgress: {
    backgroundColor: COLORS.puple[3],
  },
  progressStatusContainerMyPageCompleted: {
    backgroundColor: COLORS.gray200,
  },
  progressStatusMyPage: {
    color: COLORS.puple.main,
  },
  progressBarContainerCompleted: {
    backgroundColor: COLORS.gray400,
  },
  progressBarContainerMyPageCompleted: {
    backgroundColor: COLORS.gray200,
  },
  lockIconOverlay: {
    position: 'absolute',
    bottom: scaleWidth(32),
    left: scaleWidth(157),
  },
});

export default MissionCard;
