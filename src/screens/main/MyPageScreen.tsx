import {Text, View} from 'react-native';
import {useUserProfile} from '../../hooks/queries/useUserQuery';

const MyPageScreen = () => {
  const {data, isLoading, error} = useUserProfile();
  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>MyPageScreen</Text>
      <Text>마이페이지</Text>
      <Text>{data?.name}</Text>
    </View>
  );
};

export default MyPageScreen;
