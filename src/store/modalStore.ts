import { create } from 'zustand';
import {
  ModalButton,
  NotificationModalProps,
} from '../components/NotificationModal';
import { StyleProp, TextStyle } from 'react-native';

interface ModalState {
  visible: boolean;
  title: string;
  description?: string;
  image?: NotificationModalProps['image'];
  imageSize?: { width: number; height: number };
  closeButton?: boolean;
  primaryButton?: ModalButton;
  secondaryButton?: ModalButton;
  children?: React.ReactNode;
  titleDescriptionGapSize?: number;
  descriptionColor?: string;
  titleStyle?: StyleProp<TextStyle>;
}

interface ModalStore {
  modalState: ModalState;
  showModal: (config: Omit<ModalState, 'visible'>) => void;
  hideModal: () => void;
}

const defaultModalState: ModalState = {
  visible: false,
  title: '',
  titleStyle: undefined,
};

export const useModalStore = create<ModalStore>(set => ({
  modalState: defaultModalState,
  showModal: config =>
    set({
      modalState: {
        ...config,
        visible: true,
      },
    }),
  hideModal: () =>
    set(state => ({
      modalState: {
        ...state.modalState,
        visible: false,
      },
    })),
}));

// 편의 훅: showModal만 필요한 경우
export const useShowModal = () => useModalStore(state => state.showModal);

// 편의 훅: hideModal만 필요한 경우
export const useHideModal = () => useModalStore(state => state.hideModal);

// 편의 훅: 모달 상태만 필요한 경우 (리렌더링 최적화)
export const useModalState = () => useModalStore(state => state.modalState);
