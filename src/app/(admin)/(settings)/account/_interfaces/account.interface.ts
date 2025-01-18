import { components } from "@/types/api";

export type ResponseProfile = components["schemas"]["UserProfileResponseDto"];

export type Profile = Omit<ResponseProfile, 'id'> & {
  roles: { name: string }[];
}