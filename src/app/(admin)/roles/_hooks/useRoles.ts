import { useQuery } from "@tanstack/react-query";
import { getRoles } from "../actions";

export const useRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getRoles
  });
};
