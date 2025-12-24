import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useShowModal } from '../store/modalStore';
import { usePointStore } from '../store/pointStore';
import { RouteNames } from '../../routes';
import { RootStackParamList } from '../navigation/types';
import { ARTICLE_READ_POINT_COST } from '../config/rewards';
import {
  ArticlePointModalContent,
  ArticlePointModalContentGet,
} from '../components/ArticlePointModalContent';

type ReturnTo = 'mission' | 'search';

interface UseArticleNavigationOptions {
  returnTo: ReturnTo;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * 기사 클릭 및 네비게이션 처리 커스텀 훅
 * 포인트 확인, 모달 표시, 네비게이션을 통합 관리
 */
export const useArticleNavigation = ({
  returnTo,
}: UseArticleNavigationOptions): {
  handleArticlePress: (articleId: number) => void;
} => {
  const navigation = useNavigation<NavigationProp>();
  const showModal = useShowModal();
  const { points, subtractPoints } = usePointStore();

  const handleArticlePress = useCallback(
    (articleId: number) => {
      // 포인트 확인
      if (points >= ARTICLE_READ_POINT_COST) {
        // 포인트가 충분한 경우 - 포인트 사용 모달
        showModal({
          title: '새로운 글을 읽으시겠어요?',
          description: `사용 가능 포인트: ${points}p`,
          closeButton: true,
          children: React.createElement(ArticlePointModalContent),
          primaryButton: {
            title: '새 글 읽기',
            onPress: async () => {
              const success = await subtractPoints(ARTICLE_READ_POINT_COST);
              if (success) {
                navigation.navigate(RouteNames.FULL_SCREEN_STACK, {
                  screen: RouteNames.ARTICLE_DETAIL,
                  params: {
                    articleId,
                    returnTo,
                  },
                });
              } else {
                Alert.alert('오류', '포인트 차감에 실패했습니다.');
              }
            },
          },
        });
      } else {
        // 포인트가 부족한 경우 - 광고 시청 모달
        showModal({
          title: '광고를 보고 포인트 받으시겠어요?',
          description: `사용 가능 포인트: ${points}p`,
          closeButton: true,
          children: React.createElement(ArticlePointModalContentGet),
          primaryButton: {
            title: '포인트 받기',
            onPress: () => {
              navigation.navigate(RouteNames.FULL_SCREEN_STACK, {
                screen: RouteNames.AD_LOADING,
                params: {
                  articleId,
                  returnTo,
                },
              });
            },
          },
        });
      }
    },
    [points, showModal, navigation, subtractPoints, returnTo],
  );

  return { handleArticlePress };
};
