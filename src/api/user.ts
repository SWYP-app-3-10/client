import client from './client';

export const getUserProfile = async () => {
  const response = await client.get('/user/profile');
  return response.data;
};
