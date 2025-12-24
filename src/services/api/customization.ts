import api from "@/lib/api";

const baseURL = "/customization";

export interface IHeroSection {
  title: string;
  subtitle: string;
  image: string[];
}

export interface IUpdateHeroSection {
  title: string;
  subtitle: string;
  image: File[];
}



export const getHeroSection = async (token: string) => {
  const response = await api.get(`${baseURL}/hero`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateHeroSection = async (params: {
  token: string;
  data: IUpdateHeroSection;
}) => {
  const response = await api.patch(
    `${baseURL}/hero`,
    { ...params.data },
    {
      headers: {
        Authorization: `Bearer ${params.token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
