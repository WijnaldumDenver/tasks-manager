import { taskStatusOptions } from "@/util/Variables";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Modal,
  InputWrapper,
  Input,
  Textarea,
  NativeSelect,
  UnstyledButton,
  HoverCard,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import {
  updateDoc,
  doc,
  deleteDoc,
  collection,
  addDoc,
} from "firebase/firestore";
import { useState } from "react";
import { auth, db } from "../../firebase-app-config";

type ActionButtonProps = {
  className?: string;
  description?: string;
  icon?: string;
  type: "edit" | "delete" | "status" | "add";
  task?: {
    id: string;
    user_id: string;
    [key: string]: any;
  };
} & (
  | { type: "add"; task?: never }
  | {
      type: "edit" | "delete" | "status";
      task: { id: string; user_id: string; [key: string]: any };
    }
);

export default function ActionButton({
  className,
  description,
  icon,
  type,
  task,
}: ActionButtonProps) {
  const user = auth;
  const QueryClient = useQueryClient();

  //  $$$$$$\        $$\       $$\       $$\                   $$\     $$\
  //  $$  __$$\       $$ |      $$ |      $$ |                  $$ |    $$ |
  //  $$ /  $$ | $$$$$$$ | $$$$$$$ |      $$$$$$$\  $$\   $$\ $$$$$$\ $$$$$$\    $$$$$$\  $$$$$$$\
  //  $$$$$$$$ |$$  __$$ |$$  __$$ |      $$  __$$\ $$ |  $$ |\_$$  _|\_$$  _|  $$  __$$\ $$  __$$\
  //  $$  __$$ |$$ /  $$ |$$ /  $$ |      $$ |  $$ |$$ |  $$ |  $$ |    $$ |    $$ /  $$ |$$ |  $$ |
  //  $$ |  $$ |$$ |  $$ |$$ |  $$ |      $$ |  $$ |$$ |  $$ |  $$ |$$\ $$ |$$\ $$ |  $$ |$$ |  $$ |
  //  $$ |  $$ |\$$$$$$$ |\$$$$$$$ |      $$$$$$$  |\$$$$$$  |  \$$$$  |\$$$$  |\$$$$$$  |$$ |  $$ |
  //  \__|  \__| \_______| \_______|      \_______/  \______/    \____/  \____/  \______/ \__|  \__|

  if (type == "add") {
    const [opened, { open, close }] = useDisclosure(false);
    const [form, setForm] = useState(Object);
    const handleInputChange = (e: any) => {
      const { name, value } = e.target;

      setForm((prevForm: typeof form) => ({
        ...prevForm,
        user_id: user.currentUser?.uid,
        [name]: value,
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
            <InputWrapper className="col-span-1" label="Title">
              <Input
                type="text"
                name="title"
                value={form.title}
                onChange={(e) => handleInputChange(e)}
              />
            </InputWrapper>
            <InputWrapper label="Due Date">
              <Input
                className="col-span-1"
                type="date"
                name="due_date"
                value={form.due_date}
                onChange={(e) => handleInputChange(e)}
              />
            </InputWrapper>
            <Textarea
              className="col-span-2"
              label="Description"
              name="description"
              value={form.description}
              autosize
              onChange={(e) => handleInputChange(e)}
            />
            <NativeSelect
              name="status"
              defaultValue={"not_started"}
              value={form.status}
              data={taskStatusOptions}
              label="Task Status"
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
        <div className="rounded-tl-xl rounded-br-xl active:scale-95 transition-all mb-4 w-32 h-24 border-2 border-gray-300 hover:text-primary-900 hover:bg-primary-200 hover:border-primary-800">
          <UnstyledButton onClick={open} className="w-full h-full">
            <Icon
              icon="gridicons:add-outline"
              className="m-auto"
              width={"48"}
            />
          </UnstyledButton>
        </div>
      </>
    );
  }

  // $$$$$$$$\      $$\ $$\   $$\           $$\                   $$\     $$\
  // $$  _____|     $$ |\__|  $$ |          $$ |                  $$ |    $$ |
  // $$ |      $$$$$$$ |$$\ $$$$$$\         $$$$$$$\  $$\   $$\ $$$$$$\ $$$$$$\    $$$$$$\  $$$$$$$\
  // $$$$$\   $$  __$$ |$$ |\_$$  _|        $$  __$$\ $$ |  $$ |\_$$  _|\_$$  _|  $$  __$$\ $$  __$$\
  // $$  __|  $$ /  $$ |$$ |  $$ |          $$ |  $$ |$$ |  $$ |  $$ |    $$ |    $$ /  $$ |$$ |  $$ |
  // $$ |     $$ |  $$ |$$ |  $$ |$$\       $$ |  $$ |$$ |  $$ |  $$ |$$\ $$ |$$\ $$ |  $$ |$$ |  $$ |
  // $$$$$$$$\\$$$$$$$ |$$ |  \$$$$  |      $$$$$$$  |\$$$$$$  |  \$$$$  |\$$$$  |\$$$$$$  |$$ |  $$ |
  // \________|\_______|\__|   \____/       \_______/  \______/    \____/  \____/  \______/ \__|  \__|

  if (type == "edit" && task) {
    const [openedEdit, { open: openEdit, close: closeEdit }] =
      useDisclosure(false);
    const [form, setForm] = useState(Object);
    const handleInputChange = (e?: any, fill?: boolean) => {
      if (!fill) {
        const { name, value } = e.target;
        setForm((prevForm: typeof form) => ({
          ...prevForm,
          [name]: value,
        }));
      } else {
        setForm(() => ({
          ...task,
        }));
      }
    };
    const mutationEdit = useMutation({
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
        closeEdit();
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
      mutationEdit.mutate(form as any);
      QueryClient.invalidateQueries({
        queryKey: ["get-tasks"],
      });
    };

    return (
      <>
        <Modal
          title="Editing Task"
          opened={openedEdit}
          onClose={closeEdit}
          centered
          classNames={{ root: "text-black" }}
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <InputWrapper className="col-span-1" label="Title">
              <Input
                type="text"
                name="title"
                value={form.title}
                onChange={(e) => handleInputChange(e)}
              />
            </InputWrapper>
            <InputWrapper label="Due Date">
              <Input
                className="col-span-1"
                type="date"
                name="due_date"
                value={form.due_date}
                onChange={(e) => handleInputChange(e)}
              />
            </InputWrapper>
            <Textarea
              className="col-span-2"
              label="Description"
              name="description"
              value={form.description}
              autosize
              onChange={(e) => handleInputChange(e)}
            />
            <NativeSelect
              name="status"
              defaultValue={"not_started"}
              value={form.status}
              data={taskStatusOptions}
              label="Task Status"
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
                  openEdit();
                  handleInputChange(null, true);
                }}
                className="w-full h-full"
              >
                <Icon icon={icon ? icon : ""} className="m-auto" width={"48"} />
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

  // $$$$$$$\            $$\            $$\                     $$\                   $$\     $$\
  // $$  __$$\           $$ |           $$ |                    $$ |                  $$ |    $$ |
  // $$ |  $$ | $$$$$$\  $$ | $$$$$$\ $$$$$$\    $$$$$$\        $$$$$$$\  $$\   $$\ $$$$$$\ $$$$$$\    $$$$$$\  $$$$$$$\
  // $$ |  $$ |$$  __$$\ $$ |$$  __$$\\_$$  _|  $$  __$$\       $$  __$$\ $$ |  $$ |\_$$  _|\_$$  _|  $$  __$$\ $$  __$$\
  // $$ |  $$ |$$$$$$$$ |$$ |$$$$$$$$ | $$ |    $$$$$$$$ |      $$ |  $$ |$$ |  $$ |  $$ |    $$ |    $$ /  $$ |$$ |  $$ |
  // $$ |  $$ |$$   ____|$$ |$$   ____| $$ |$$\ $$   ____|      $$ |  $$ |$$ |  $$ |  $$ |$$\ $$ |$$\ $$ |  $$ |$$ |  $$ |
  // $$$$$$$  |\$$$$$$$\ $$ |\$$$$$$$\  \$$$$  |\$$$$$$$\       $$$$$$$  |\$$$$$$  |  \$$$$  |\$$$$  |\$$$$$$  |$$ |  $$ |
  // \_______/  \_______|\__| \_______|  \____/  \_______|      \_______/  \______/    \____/  \____/  \______/ \__|  \__|

  if (type == "delete" && task) {
    const [openedDelete, { open: openDelete, close: closeDelete }] =
      useDisclosure(false);
    const deleteMutation = useMutation({
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
        closeDelete();
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
      deleteMutation.mutate();
      QueryClient.invalidateQueries({
        queryKey: ["get-tasks"],
      });
    };
    return (
      <>
        <Modal
          title="Deleting Task"
          opened={openedDelete}
          onClose={closeDelete}
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
                  openDelete();
                }}
                className="w-full h-full"
              >
                <Icon icon={icon ? icon : ""} className="m-auto" width={"48"} />
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

  //  $$$$$$\    $$\                $$\                               $$\                   $$\     $$\
  //  $$  __$$\   $$ |               $$ |                              $$ |                  $$ |    $$ |
  //  $$ /  \__|$$$$$$\    $$$$$$\ $$$$$$\   $$\   $$\  $$$$$$$\       $$$$$$$\  $$\   $$\ $$$$$$\ $$$$$$\    $$$$$$\  $$$$$$$\
  //  \$$$$$$\  \_$$  _|   \____$$\\_$$  _|  $$ |  $$ |$$  _____|      $$  __$$\ $$ |  $$ |\_$$  _|\_$$  _|  $$  __$$\ $$  __$$\
  //   \____$$\   $$ |     $$$$$$$ | $$ |    $$ |  $$ |\$$$$$$\        $$ |  $$ |$$ |  $$ |  $$ |    $$ |    $$ /  $$ |$$ |  $$ |
  //  $$\   $$ |  $$ |$$\ $$  __$$ | $$ |$$\ $$ |  $$ | \____$$\       $$ |  $$ |$$ |  $$ |  $$ |$$\ $$ |$$\ $$ |  $$ |$$ |  $$ |
  //  \$$$$$$  |  \$$$$  |\$$$$$$$ | \$$$$  |\$$$$$$  |$$$$$$$  |      $$$$$$$  |\$$$$$$  |  \$$$$  |\$$$$  |\$$$$$$  |$$ |  $$ |
  //   \______/    \____/  \_______|  \____/  \______/ \_______/       \_______/  \______/    \____/  \____/  \______/ \__|  \__|

  if (type == "status" && task) {
    const mutation = useMutation({
      mutationFn: async (e: any) => {
        const docRef = await updateDoc(doc(db, "tasks", task.id), {
          ...task,
          status: e.target.value,
        });
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
    const handleComplete = (e: any) => {
      mutation.mutate(e);
    };
    return (
      <NativeSelect
        className="rounded-br-xl rounded-tl-xl mx-2 my-auto transition-all hover:scale-105 text-center font-bold text-xl active:scale-95"
        classNames={{
          input: clsx(
            task.status == "completed" && "bg-primary-600",
            task.status == "started" && "bg-yellow-100",
            task.status == "not_started" && "bg-red-400",
            task.status == "stand_by" && "bg-orange-300",
            task.status == "planning" && "bg-yellow-400"
          ),
        }}
        defaultValue={task.status}
        data={taskStatusOptions}
        onChange={handleComplete}
      />
    );
  }
}
