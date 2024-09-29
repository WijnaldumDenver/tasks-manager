import { useQuery } from "@tanstack/react-query";
import { db } from "@/../firebase-app-config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

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
    meta: {
      onError: (error: any) => {
        console.error("Error fetching task:", error);
      },
    },
  });
}

export function useGetTaskPageQuery({ doc_id }: { doc_id: string }) {
  return useQuery({
    queryKey: ["get-task", doc_id],
    queryFn: async () => {
      const docRef = doc(db, "tasks", doc_id);

      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Task not found");
      }

      const task = docSnap.data();
      return { id: docSnap.id, ...task };
    },
    meta: {
      onError: (error: any) => {
        console.error("Error fetching task:", error);
      },
    },
  });
}
