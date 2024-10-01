import { useGetUsersQuery } from "@/redux/services/usersApi";

export const useUsers = () => {
  const { data, error, isLoading } = useGetUsersQuery();

  return {
    data,
    error,
    isLoading,
  };
};
