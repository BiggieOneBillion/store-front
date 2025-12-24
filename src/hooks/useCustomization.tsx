import {
  updateHeroSection,
  IUpdateHeroSection,
} from "@/services/api/customization";
import { useMutation } from "@tanstack/react-query";

export const useCustomization = () => {
  const {
    mutateAsync: updatingHeroSectionFn,
    isPending: isUpdatingHeroSection,
    error: updatingHeroSectionError,
  } = useMutation({
    mutationFn: async (params: { token: string; data: IUpdateHeroSection }) =>
      updateHeroSection(params),
  });

  return {
    // create store
    updatingHeroSectionFn,
    isUpdatingHeroSection,
    updatingHeroSectionError,
  };
};
