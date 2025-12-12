import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {scaleWidth} from '../styles/global';

interface NotificationModalProps {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  onAccept,
  onDecline,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onDecline}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* 이미지 placeholder */}
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>알림 아이콘</Text>
          </View>

          {/* 제목 */}
          <Text style={styles.title}>알림을 받으시겠어요?</Text>

          {/* 설명 텍스트 */}
          <Text style={styles.description}>
            알림을 켜두면 하루 두 번 운루틴을 잊지 않고 평길 수 있어요!
          </Text>

          {/* 버튼 컨테이너 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.declineButton]}
              onPress={onDecline}>
              <Text style={styles.declineButtonText}>괜찮아요</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={onAccept}>
              <Text style={styles.acceptButtonText}>알림 받을래요</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scaleWidth(20),
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: scaleWidth(16),
    padding: scaleWidth(24),
    width: '100%',
    maxWidth: scaleWidth(400),
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: scaleWidth(80),
    height: scaleWidth(80),
    backgroundColor: '#F5F5F5',
    borderRadius: scaleWidth(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleWidth(20),
  },
  placeholderText: {
    color: '#999999',
    fontSize: scaleWidth(12),
  },
  title: {
    fontSize: scaleWidth(20),
    fontWeight: '600',
    color: '#000000',
    marginBottom: scaleWidth(12),
    textAlign: 'center',
  },
  description: {
    fontSize: scaleWidth(14),
    color: '#666666',
    textAlign: 'center',
    lineHeight: scaleWidth(20),
    marginBottom: scaleWidth(24),
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: scaleWidth(12),
  },
  button: {
    flex: 1,
    height: scaleWidth(48),
    borderRadius: scaleWidth(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: '#E0E0E0',
  },
  acceptButton: {
    backgroundColor: '#9B59B6',
  },
  declineButtonText: {
    color: '#666666',
    fontSize: scaleWidth(16),
    fontWeight: '600',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: scaleWidth(16),
    fontWeight: '600',
  },
});

export default NotificationModal;
