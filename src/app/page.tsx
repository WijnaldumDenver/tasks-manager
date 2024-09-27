"use client";

import Sidebar from "@/components/sidebar";
import { useGetTasksQuery } from "@/queries/getTasks";
import {
  Checkbox,
  HoverCard,
  Image,
  Input,
  InputWrapper,
  Modal,
  Skeleton,
  Text,
  Textarea,
  UnstyledButton,
} from "@mantine/core";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { clsx } from "clsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase-app-config";
import { notifications } from "@mantine/notifications";

export default function Home() {
  const getUser = auth;
  const { data: tasks } = useGetTasksQuery(getUser as any);
  return (
    <section className="max-h-screen w-full m-20">
      <div className="bg-white p-4 min-h-full max-h-full rounded-tl-xl rounded-br-xl w-full shadow-[0px_0px_16px_1px_#AAAAAA]">
        <AddTaskButton />
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
                      <StatusButton task={task} />
                      <EditButton
                        type="edit"
                        task={task}
                        icon="tdesign:edit"
                        description="Edit"
                        className="rounded-br-xl rounded-tl-xl transition-all border-2 border-gray-300 hover:text-primary-900 hover:bg-primary-200 hover:border-primary-800 active:scale-95"
                      />
                      <DeleteButton
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

function AddTaskButton() {
  const user = auth;
  const QueryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: false,
    user_id: user.currentUser?.uid,
  });
  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const mutation = useMutation({
    mutationFn: async (newTask) => {
      const docRef = await addDoc(
        collection(db as any, "tasks"),
        newTask as any
      );
      return docRef.id;
    },
    onSuccess: () => {
      notifications.show({
        color: "lime",
        icon: (
          <div className="font-bold">
            <Icon width={"32px"} icon={"simple-line-icons:check"} />
          </div>
        ),
        message: `Task "${form.title}" has been added.`,
      });
      close();
      QueryClient.invalidateQueries({
        queryKey: ["get-tasks"],
      });
    },
    onError: (error) => {
      notifications.show({
        color: "red",
        icon: (
          <div className="font-bold">
            <Icon width={"32px"} icon={"healthicons:no-outline"} />
          </div>
        ),
        message: `Task "${form.title}" couldn't be added. Error: ${error}`,
      });
    },
  });

  const handleSubmit = () => {
    if (form.title && form.description) {
      mutation.mutate(form as any);
    }
  };

  return (
    <>
      <Modal
        title="Create a Task"
        opened={opened}
        onClose={close}
        centered
        classNames={{ root: "text-black" }}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <div className="grid grid-cols-2 gap-4 mb-4">
          <InputWrapper className="col-span-1" label="title">
            <Input
              type="text"
              name="title"
              value={form.title}
              onChange={(e) => handleInputChange(e)}
            />
          </InputWrapper>
          <InputWrapper className="col-span-2" label="description">
            <Textarea
              name="description"
              value={form.description}
              autosize
              onChange={(e) => handleInputChange(e)}
            />
          </InputWrapper>
          <Checkbox
            name="status"
            checked={form.status}
            label="Task completed?"
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div
          className={clsx(
            "rounded-tl-xl mb-4 w-16 h-12 transition-all border-2 border-gray-300 rounded-br-xl",
            form.title && form.description
              ? "hover:text-primary-900 hover:bg-primary-200 hover:border-primary-800 active:scale-95"
              : "bg-gray-100 text-gray-300"
          )}
        >
          <UnstyledButton
            disabled={!form.description || !form.title}
            onClick={handleSubmit}
            className="w-full h-full"
          >
            <Icon
              icon="material-symbols:save-outline"
              className="m-auto"
              width={"32"}
            />
          </UnstyledButton>
        </div>
      </Modal>
      <div className="rounded-tl-xl mb-4 w-32 h-24 transition-all border-2 border-gray-300 hover:text-primary-900 hover:bg-primary-200 hover:border-primary-800 active:scale-95 rounded-br-xl">
        <UnstyledButton onClick={open} className="w-full h-full">
          <Icon icon="gridicons:add-outline" className="m-auto" width={"48"} />
        </UnstyledButton>
      </div>
    </>
  );
}

function EditButton({
  className,
  description,
  icon,
  type,
  task,
}: {
  className?: string;
  description: string;
  icon: string;
  type: "edit" | "delete";
  task: {
    id: string;
    user_id: string;
    description: string;
    title: string;
    status: boolean;
  };
}) {
  const user = auth;
  const QueryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: false,
    user_id: user.currentUser?.uid,
  });
  const handleInputChange = (e?: any, fill?: boolean) => {
    if (!fill) {
      const { name, value, type, checked } = e.target;
      setForm((prevForm) => ({
        ...prevForm,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        user_id: task.user_id,
        description: task.description,
        title: task.title,
        status: task.status,
      }));
    }
    console.log(form);
  };
  const mutation = useMutation({
    mutationFn: async (Task) => {
      const docRef = await updateDoc(doc(db, "tasks", task.id), Task as any);
      return docRef;
    },
    onSuccess: () => {
      notifications.show({
        color: "lime",
        icon: (
          <div className="font-bold">
            <Icon width={"32px"} icon={"simple-line-icons:check"} />
          </div>
        ),
        message: `Task "${form.title}" has been updated.`,
      });
      close();
      QueryClient.invalidateQueries({
        queryKey: ["get-tasks"],
      });
    },
    onError: (error) => {
      notifications.show({
        color: "red",
        icon: (
          <div className="font-bold">
            <Icon width={"32px"} icon={"healthicons:no-outline"} />
          </div>
        ),
        message: `Task "${form.title}" couldn't be updated. Error: ${error}`,
      });
    },
  });

  const handleUpdate = () => {
    if (form.title && form.description) {
      mutation.mutate(form as any);
    }
  };
  return (
    <>
      <Modal
        title="Editing Task"
        opened={opened}
        onClose={close}
        centered
        classNames={{ root: "text-black" }}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <div className="grid grid-cols-2 gap-4 mb-4">
          <InputWrapper className="col-span-1" label="title">
            <Input
              type="text"
              name="title"
              value={form.title}
              onChange={(e) => handleInputChange(e)}
            />
          </InputWrapper>
          <InputWrapper className="col-span-2" label="description">
            <Textarea
              name="description"
              value={form.description}
              autosize
              onChange={(e) => handleInputChange(e)}
            />
          </InputWrapper>
          <Checkbox
            name="status"
            checked={form.status}
            label="Task completed?"
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        <div
          className={clsx(
            "rounded-tl-xl mb-4 w-16 h-12 transition-all border-2 border-gray-300 rounded-br-xl",
            form.title && form.description
              ? "hover:text-primary-900 hover:bg-primary-200 hover:border-primary-800 active:scale-95"
              : "bg-gray-100 text-gray-300"
          )}
        >
          <UnstyledButton
            disabled={!form.description || !form.title}
            onClick={handleUpdate}
            className="w-full h-full"
          >
            <Icon
              icon="material-symbols:save-outline"
              className="m-auto"
              width={"32"}
            />
          </UnstyledButton>
        </div>
      </Modal>
      <HoverCard shadow="md">
        <HoverCard.Target>
          <div className={className}>
            <UnstyledButton
              onClick={() => {
                open();
                handleInputChange(null, true);
              }}
              className="w-full h-full"
            >
              <Icon icon={icon} className="m-auto" width={"48"} />
            </UnstyledButton>
          </div>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Text size="sm">{description}</Text>
        </HoverCard.Dropdown>
      </HoverCard>
    </>
  );
}

function DeleteButton({
  className,
  description,
  icon,
  type,
  task,
}: {
  className?: string;
  description: string;
  icon: string;
  type: "edit" | "delete";
  task: {
    id: string;
    user_id: string;
    description: string;
    title: string;
    status: boolean;
  };
}) {
  const user = auth;
  const QueryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const mutation = useMutation({
    mutationFn: async () => {
      const docRef = await deleteDoc(doc(db as any, "tasks", task.id));
      return docRef;
    },
    onSuccess: () => {
      notifications.show({
        color: "lime",
        icon: (
          <div className="font-bold">
            <Icon width={"32px"} icon={"simple-line-icons:check"} />
          </div>
        ),
        message: `Task "${task.title}" has been deleted succesfully.`,
      });
      close();
      QueryClient.invalidateQueries({
        queryKey: ["get-tasks"],
      });
    },
    onError: (error) => {
      notifications.show({
        color: "red",
        icon: (
          <div className="font-bold">
            <Icon width={"32px"} icon={"healthicons:no-outline"} />
          </div>
        ),
        message: `Task "${task.title}" couldn't be deleted. Error: ${error}`,
      });
    },
  });

  const handleDelete = () => {
    mutation.mutate();
  };
  return (
    <>
      <Modal
        title="Deleting Task"
        opened={opened}
        onClose={close}
        centered
        classNames={{ root: "text-black" }}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <h1 className="font-bold text-xl mb-4">
          Are you sure you want to delete "{task.title}"?
        </h1>
        <div
          className={clsx(
            "rounded-tl-xl mb-4 w-16 h-12 border-2 text-red-950 bg-red-400 border-red-500 active:scale-95 rounded-br-xl"
          )}
        >
          <UnstyledButton onClick={handleDelete} className="w-full h-full">
            <Icon icon="ic:baseline-delete" className="m-auto" width={"32"} />
          </UnstyledButton>
        </div>
      </Modal>
      <HoverCard shadow="md">
        <HoverCard.Target>
          <div className={className}>
            <UnstyledButton
              onClick={() => {
                open();
              }}
              className="w-full h-full"
            >
              <Icon icon={icon} className="m-auto" width={"48"} />
            </UnstyledButton>
          </div>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Text size="sm">{description}</Text>
        </HoverCard.Dropdown>
      </HoverCard>
    </>
  );
}

function StatusButton({ task }: { task: any }) {
  const QueryClient = useQueryClient();
  const updatedTask = { ...task, status: !task.status };
  const mutation = useMutation({
    mutationFn: async () => {
      const docRef = await updateDoc(doc(db, "tasks", task.id), updatedTask);
      return docRef;
    },
    onSuccess: () => {
      notifications.show({
        color: "lime",
        icon: (
          <div className="font-bold">
            <Icon width={"32px"} icon={"simple-line-icons:check"} />
          </div>
        ),
        message: `Task "${task.title}" has been completed.`,
      });
      QueryClient.invalidateQueries({
        queryKey: ["get-tasks"],
      });
    },
    onError: (error) => {
      notifications.show({
        color: "red",
        icon: (
          <div className="font-bold">
            <Icon width={"32px"} icon={"healthicons:no-outline"} />
          </div>
        ),
        message: `Error: ${error}`,
      });
    },
  });
  const handleComplete = () => {
    mutation.mutate();
  };
  return (
    <UnstyledButton
      className={clsx(
        "rounded-br-xl rounded-tl-xl m-2 transition-all hover:scale-105 text-center font-bold text-xl active:scale-95",
        task.status ? "bg-primary-600" : "bg-red-400"
      )}
      onClick={handleComplete}
    >
      {task.status ? "Completed" : "Unfinished"}
    </UnstyledButton>
  );
}
