import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/clientApp";

export default function useGetTasksQuery(userId: string) {
  return useQuery({
    queryKey: ["tasks", userId],
    queryFn: async () => {
      const q = query(collection(db, "tasks"), where("user_id", "==", userId));

      const querySnapshot = await getDocs(q);
      const tasks: any = [];
      querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      return tasks;
    },
  });
}
