import {
    useProfileQuery,
} from "@/redux/services/adminApi";


export const useProfile = () => {

    const { data: user, refetch } = useProfileQuery();

    return {
        user,
        refetch,
    };
};
