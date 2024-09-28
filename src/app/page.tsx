"use client";

import { useGetTasksQuery } from "@/queries/getTasks";
import { Image, Skeleton } from "@mantine/core";
import { auth } from "../../firebase-app-config";
import ActionButton from "@/components/TaskActionButtons";

export default function Home() {
  const getUser = auth;
  const { data: tasks } = useGetTasksQuery(getUser as any);
  return (
    <section className="max-h-screen w-full m-20">
      <div className="bg-white p-4 min-h-full max-h-full rounded-tl-xl rounded-br-xl w-full shadow-[0px_0px_16px_1px_#AAAAAA]">
        <ActionButton type="add" />
        <Skeleton visible={!tasks}>
          {!tasks || tasks.length == 0 ? (
            <div className="w-64 mx-auto my-[10%]">
              <Image fit="cover" src={"/no-tasks.png"} />
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4 max-h-[650px] overflow-auto bg-gray-100 rounded-tl-xl shadow-[inset_0px_0px_16px_1px_#AAAAAA] p-4 rounded-br-xl">
              {tasks?.map((task: any, i: any) => (
                <div
                  className="w-full max-h-64 bg-white rounded-tl-xl p-4 rounded-br-xl"
                  key={i}
                >
                  <div className="mt-2 flex w-full">
                    <div className="w-3/5">
                      <span className="font-bold text-xl">{task?.title}</span>
                      <p className="mt-2">{task?.description}</p>
                    </div>
                    <div className="w-2/5 gap-4 grid grid-cols-3">
                      <ActionButton type="status" task={task} />
                      <ActionButton
                        type="edit"
                        task={task}
                        icon="tdesign:edit"
                        description="Edit"
                        className="rounded-br-xl rounded-tl-xl transition-all border-2 border-gray-300 hover:text-primary-900 hover:bg-primary-200 hover:border-primary-800 active:scale-95"
                      />
                      <ActionButton
                        type="delete"
                        task={task}
                        icon="ic:baseline-delete"
                        description="Delete"
                        className="rounded-br-xl rounded-tl-xl transition-all border-2 border-gray-300 hover:text-red-950 hover:bg-red-400 hover:border-red-500 active:scale-95"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Skeleton>
      </div>
    </section>
  );
}
