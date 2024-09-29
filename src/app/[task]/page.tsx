"use client";

import { useGetTaskPageQuery, useGetTasksQuery } from "@/queries/getTasks";
import { Skeleton, UnstyledButton } from "@mantine/core";
import { auth } from "@/../firebase-app-config";
import {
  DeleteButton,
  EditButton,
  StatusButton,
} from "@/components/TaskActionButtons";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function TaskPage() {
  const getUser = auth;
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const taskID = currentPath.split("/").slice(1).toString();

  const { data: task } = useGetTaskPageQuery({
    userId: getUser as any,
    doc_id: taskID,
  }) as any;

  return (
    <section className="max-h-screen w-full mx-20 mb-32 mt-20">
      <Link
        href="/"
        className="bg-gray-100 flex mb-4 text-gray-400 rounded-tl-xl w-16 h-12 transition-all border-2 border-gray-300 rounded-br-xl hover:scale-105 active:scale-95"
      >
        <UnstyledButton className="w-16 h-12">
          <Icon width={32} className="m-auto" icon="icon-park-outline:back" />
        </UnstyledButton>
      </Link>
      <Skeleton className="h-full max-h-full" visible={!task}>
        <div className="bg-white p-4 h-full max-h-full rounded-tl-xl rounded-br-xl w-full shadow-[0px_0px_16px_1px_#AAAAAA]">
          <span className="text-black font-bold text-6xl line-clamp-2 w-1/2 mb-4">
            {task?.title}
          </span>
          <div className="flex place-content-between place-items-center w-full">
            <div className="mb-4 grid place-items-center grid-flow-col gap-4">
              <span className="font-bold text-xl">
                Due <span className="opacity-50">{task?.due_date}</span>
              </span>
              <StatusButton task={task} />
            </div>
            <div className="mb-4 grid place-items-center grid-flow-col gap-4">
              <EditButton task={task} />
              <DeleteButton task={task} />
            </div>
          </div>
          <div
            className="w-full h max-h-[520px] p-2 rounded-tl-xl rounded-br-xl overflow-y-auto overflow-x-hidden"
            dangerouslySetInnerHTML={{ __html: task?.description }}
          />
        </div>
      </Skeleton>
    </section>
  );
}
