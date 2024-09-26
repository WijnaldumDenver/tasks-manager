"use client";

import Sidebar from "@/components/sidebar";
import useGetTasksQuery from "@/queries/getTasks";
import { auth } from "../../firebase/clientApp";
import { HoverCard, Image, Text, UnstyledButton } from "@mantine/core";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function Home() {
  const current_user_id = auth?.currentUser?.uid;

  const { data: tasks } = useGetTasksQuery(current_user_id as string);

  return (
    <main className="flex">
      <Sidebar />
      <section className="max-h-screen w-full m-20">
        <div className="bg-white p-4 min-h-full max-h-full rounded-tl-xl rounded-br-xl w-full shadow-[0px_0px_16px_1px_#AAAAAA]">
          <div className="rounded-tl-xl mb-4 w-32 h-24 transition-all border-2 border-gray-300 hover:text-primary-900 hover:bg-primary-200 hover:border-primary-800 active:scale-95 rounded-br-xl">
            <UnstyledButton className="w-full h-full">
              <Icon
                icon="gridicons:add-outline"
                className="m-auto"
                width={"48"}
              />
            </UnstyledButton>
          </div>
          {!tasks ? (
            <div className="w-64 mx-auto my-[10%]">
              <Image fit="cover" src={"/no-tasks.png"} />
            </div>
          ) : (
            <div className="w-full max-h-full overflow-y-scroll bg-gray-100 rounded-tl-xl shadow-[inset_0px_0px_16px_1px_#AAAAAA] p-4 rounded-br-xl">
              {tasks?.map((task: any, i: any) => (
                <div
                  className="w-full max-h-64 bg-white rounded-tl-xl p-4 rounded-br-xl"
                  key={i}
                >
                  <div className="mt-2 flex w-full">
                    <div className="w-3/4">
                      <span className="font-bold text-xl">{task?.title}</span>
                      <p className="mt-2">{task?.description}</p>
                    </div>
                    <div className="w-1/4 gap-4 grid grid-cols-2">
                      <ActionButton
                        icon="tdesign:edit"
                        description="Edit"
                        className="rounded-br-xl rounded-tl-xl transition-all border-2 border-gray-300 hover:text-primary-900 hover:bg-primary-200 hover:border-primary-800 active:scale-95"
                      />
                      <ActionButton
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
        </div>
      </section>
    </main>
  );
}

function ActionButton({
  className,
  description,
  icon,
}: {
  className?: string;
  description: string;
  icon: string;
}) {
  return (
    <HoverCard shadow="md">
      <HoverCard.Target>
        <div className={className}>
          <UnstyledButton className="w-full h-full">
            <Icon icon={icon} className="m-auto" width={"48"} />
          </UnstyledButton>
        </div>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size="sm">{description}</Text>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
