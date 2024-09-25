import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useGetCollectionQuery(collection: string) {
  return useQuery({
    queryKey: [`collection-${collection}`],
    queryFn: async () => {
      return await axios.get(
        `${process.env.NEXT_PUBLIC_FIREBASE_FIRE_STORE}/${collection}`
      );
    },
  });
}
