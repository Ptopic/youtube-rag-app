import { useQuery } from '@tanstack/react-query';
import authClientRequests from '../authClientRequests';
import { IUser } from '../types';
import { CURRENT_USER } from '@shared/queryKeys';

const useGetCurrentUser = () =>
  useQuery<IUser>({
    queryKey: [CURRENT_USER],
    queryFn: authClientRequests.getCurrentUser,
  });

export default useGetCurrentUser;
