import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { db } from "@/../firebase-app-config";
import { collection, getDocs, query, where } from "firebase/firestore";

export function useGetTasksQuery(userId: { currentUser: { uid: string } }) {
  return useQuery({
    queryKey: ["get-tasks"],
    queryFn: async () => {
      const q = query(
        collection(db, "tasks"),
        where("user_id", "==", userId.currentUser?.uid)
      );

      const querySnapshot = await getDocs(q);
      const tasks: any = [];
      querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      return tasks;
    },
  });
}
