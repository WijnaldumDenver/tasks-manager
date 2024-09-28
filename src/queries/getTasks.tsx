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
  });
}

export function useGetTaskPageQuery({
  userId,
  doc_id,
}: {
  userId: { currentUser: { uid: string } };
  doc_id: string;
}) {
  return useQuery({
    queryKey: ["get-task", doc_id],
    queryFn: async () => {
      const docRef = doc(db, "tasks", doc_id);

      const docSnap = await getDoc(docRef);

      const task = docSnap.data();
      return { id: docSnap.id, ...task };
    },
  });
}
