import apiService from "@/comon/api/apiService";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const res = await apiService.get("/user/me");
      return res.data.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });
};
