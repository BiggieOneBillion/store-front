"use client";

import { getUser } from "@/services/api/user";
import { useUserStore } from "@/store/user-store";
import { useQuery } from "@tanstack/react-query";

type Props = {
  buyerId: string;
};
const BuyerInfo = ({ buyerId }: Props) => {
  const { user } = useUserStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["buyerInfo", buyerId],
    queryFn: async () =>
      await getUser("67ae0366152d746382c8d4d3", user?.token!),
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error, Try again!!</p>;
  }

  return <div>{data && data.name}</div>;
};
export default BuyerInfo;
