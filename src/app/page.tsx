"use client";

import { useGetTasksQuery } from "@/queries/getTasks";
import { Image, Skeleton } from "@mantine/core";
import { auth } from "../../firebase-app-config";
import {
  AddButton,
  DeleteButton,
  EditButton,
  StatusButton,
} from "@/components/TaskActionButtons";
import Link from "next/link";

export default function Home() {
  const getUser = auth;
  const { data: tasks } = useGetTasksQuery(getUser as any);
  return (
    <section className="max-h-screen w-full m-20">
      <div className="bg-white p-4 min-h-full max-h-full rounded-tl-xl rounded-br-xl w-full shadow-[0px_0px_16px_1px_#AAAAAA]">
        <AddButton />
        <Skeleton visible={!tasks}>
          {!tasks || tasks.length == 0 ? (
            <div className="w-64 mx-auto my-[10%]">
              <Image fit="cover" src={"/no-tasks.png"} />
            </div>
          ) : (
            <>
              <div className="flex px-8 w-full">
                <div className="w-3/5 grid grid-cols-2">
                  <span>Title</span>
                  <span>Due Date</span>
                </div>
                <span>Status</span>
              </div>
              <div className="w-full flex flex-col gap-4 max-h-[650px] overflow-auto bg-gray-100 rounded-tl-xl shadow-[inset_0px_0px_16px_1px_#AAAAAA] p-4 rounded-br-xl">
                {tasks?.map((task: any, i: any) => (
                  <div
                    className="w-full h-full max-h-64 bg-white rounded-tl-xl p-4 rounded-br-xl"
                    key={i}
                  >
                    <div className="mt-2 h-full flex w-full">
                      <Link
                        href={`/${task.id}`}
                        className="w-3/5 my-auto grid grid-cols-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
                      >
                        <span className="font-bold text-xl max-w-[80%] line-clamp-1">
                          {task?.title}
                        </span>
                        <span className="text-xl opacity-50">
                          {new Date(task?.due_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </Link>
                      <div className="w-2/5 gap-4 grid grid-cols-3">
                        <StatusButton task={task} />
                        <EditButton task={task} />
                        <DeleteButton task={task} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Skeleton>
      </div>
    </section>
  );
}
