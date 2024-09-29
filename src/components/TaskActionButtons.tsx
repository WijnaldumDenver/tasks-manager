import { taskStatusOptions } from "@/util/Variables";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Modal, NativeSelect, UnstyledButton } from "@mantine/core";
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
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase-app-config";
import TaskForm from "./TaskForm";

type ActionButtonProps = {
  className?: string;
  description?: string;
  icon?: string;
  task?: {
    id: string;
    user_id: string;
    [key: string]: any;
  };
};

//  $$$$$$\        $$\       $$\       $$\                   $$\     $$\
//  $$  __$$\       $$ |      $$ |      $$ |                  $$ |    $$ |
//  $$ /  $$ | $$$$$$$ | $$$$$$$ |      $$$$$$$\  $$\   $$\ $$$$$$\ $$$$$$\    $$$$$$\  $$$$$$$\
//  $$$$$$$$ |$$  __$$ |$$  __$$ |      $$  __$$\ $$ |  $$ |\_$$  _|\_$$  _|  $$  __$$\ $$  __$$\
//  $$  __$$ |$$ /  $$ |$$ /  $$ |      $$ |  $$ |$$ |  $$ |  $$ |    $$ |    $$ /  $$ |$$ |  $$ |
//  $$ |  $$ |$$ |  $$ |$$ |  $$ |      $$ |  $$ |$$ |  $$ |  $$ |$$\ $$ |$$\ $$ |  $$ |$$ |  $$ |
//  $$ |  $$ |\$$$$$$$ |\$$$$$$$ |      $$$$$$$  |\$$$$$$  |  \$$$$  |\$$$$  |\$$$$$$  |$$ |  $$ |
//  \__|  \__| \_______| \_______|      \_______/  \______/    \____/  \____/  \______/ \__|  \__|

export function AddButton() {
  const user = auth;
  const QueryClient = useQueryClient();
  const [submitHovered, setSubmitHovered] = useState(false);

  const [opened, { open, close }] = useDisclosure(false);
  const [form, setForm] = useState<any>({
    title: "",
    due_date: "",
    status: "not_started",
    description: "",
  });

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
        message: `Task "${form?.title}" has been added.`,
      });
      close();
      QueryClient.invalidateQueries({
        queryKey: ["get-tasks"],
        refetchType: "all",
      });
      setForm({
        title: "",
        due_date: "",
        status: "not_started",
        description: "",
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
        message: `Task "${form?.title}" couldn't be added. Error: ${error}`,
      });
    },
  });

  const handleSubmit = () => {
    mutation.mutate(form as any);
  };
  return (
    <>
      <Modal
        title="Create a Task"
        size={"72%"}
        opened={opened}
        onClose={() => {
          close();
          setSubmitHovered(false);
          setForm(null);
        }}
        centered
        classNames={{ root: "text-black" }}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <TaskForm
          form={form}
          handleOnChange={(e: any) => handleInputChange(e)}
          handleOnSubmit={() =>
            !form?.description || !form?.title || !form?.due_date
              ? setSubmitHovered(true)
              : handleSubmit()
          }
          submitHovered={submitHovered}
        />
      </Modal>
      <div className="flex mb-4 place-items-center">
        <div className="rounded-tl-xl mr-4 rounded-br-xl w-32 h-12 active:scale-95 transition-all border-2 border-gray-300 hover:text-primary-900 hover:bg-primary-200 hover:border-primary-800">
          <UnstyledButton onClick={open} className="w-full h-full">
            <Icon
              icon="gridicons:add-outline"
              className="m-auto"
              width={"32"}
            />
          </UnstyledButton>
        </div>
        <span className="font-bold text-lg">Add a task</span>
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

export function EditButton({ task }: ActionButtonProps) {
  const QueryClient = useQueryClient();
  const [submitHovered, setSubmitHovered] = useState(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [formEdit, setFormEdit] = useState(Object);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);
  const handleInputChangeEdit = (e?: any, fill?: boolean) => {
    if (!fill) {
      const { name, value } = e.target;
      setFormEdit((prevForm: typeof formEdit) => ({
        ...prevForm,
        [name]: value,
      }));
    } else {
      setFormEdit(() => ({
        ...task,
      }));
    }
  };
  const mutationEdit = useMutation({
    mutationFn: async (Task) => {
      const docRef = await updateDoc(
        doc(db, "tasks", task?.id as string),
        Task as any
      );
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
        message: `Task "${formEdit.title}" has been updated.`,
      });
      closeEdit();
      if (currentPath == "/") {
        QueryClient.invalidateQueries({
          queryKey: ["get-tasks"],
          refetchType: "all",
        });
      } else {
        QueryClient.invalidateQueries({
          queryKey: ["get-task", task?.id],
          refetchType: "all",
        });
      }
    },
    onError: (error) => {
      notifications.show({
        color: "red",
        icon: (
          <div className="font-bold">
            <Icon width={"32px"} icon={"healthicons:no-outline"} />
          </div>
        ),
        message: `Task "${formEdit.title}" couldn't be updated. Error: ${error}`,
      });
    },
  });
  const handleUpdate = () => {
    mutationEdit.mutate(formEdit as any);
  };
  return (
    <>
      <Modal
        title="Editing Task"
        size={"72%"}
        opened={openedEdit}
        onClose={closeEdit}
        centered
        classNames={{ root: "text-black" }}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <TaskForm
          form={formEdit}
          handleOnChange={(e: any) => handleInputChangeEdit(e)}
          handleOnSubmit={() =>
            !formEdit?.description ||
            !formEdit?.title ||
            !formEdit?.due_date ||
            !formEdit?.status
              ? setSubmitHovered(true)
              : handleUpdate()
          }
          submitHovered={submitHovered}
        />
      </Modal>
      <div className="rounded-br-xl rounded-tl-xl min-w-24 transition-all border-2 border-gray-300 hover:text-primary-900 hover:bg-primary-200 hover:border-primary-800 active:scale-95">
        <UnstyledButton
          onClick={() => {
            openEdit();
            handleInputChangeEdit(null, true);
          }}
          className="w-full h-full flex place-items-center"
        >
          <Icon icon="tdesign:edit" className="m-auto" width={"32"} />
        </UnstyledButton>
      </div>
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

export function DeleteButton({ task }: ActionButtonProps) {
  const QueryClient = useQueryClient();
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const docRef = await deleteDoc(
        doc(db as any, "tasks", task?.id as string)
      );
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
        message: `Task "${task?.title}" has been deleted succesfully.`,
      });
      closeDelete();
      if (currentPath == "/") {
        QueryClient.invalidateQueries({
          queryKey: ["get-tasks"],
          refetchType: "all",
        });
      } else {
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      }
    },
    onError: (error) => {
      notifications.show({
        color: "red",
        icon: (
          <div className="font-bold">
            <Icon width={"32px"} icon={"healthicons:no-outline"} />
          </div>
        ),
        message: `Task "${task?.title}" couldn't be deleted. Error: ${error}`,
      });
    },
  });
  const handleDelete = () => {
    deleteMutation.mutate();
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
          Are you sure you want to delete "{task?.title}"?
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
      <div className="rounded-br-xl rounded-tl-xl min-w-24 transition-all border-2 border-gray-300 hover:text-red-950 hover:bg-red-400 hover:border-red-500 active:scale-95">
        <UnstyledButton
          onClick={() => {
            openDelete();
          }}
          className="w-full h-full flex place-items-center"
        >
          <Icon icon="ic:baseline-delete" className="m-auto" width={"32"} />
        </UnstyledButton>
      </div>
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

export function StatusButton({ task }: ActionButtonProps) {
  const QueryClient = useQueryClient();
  const [status, setStatus] = useState("");
  const mutationStatus = useMutation({
    mutationFn: async (e: any) => {
      const docRef = await updateDoc(doc(db, "tasks", task?.id as string), {
        ...task,
        status: e.target.value,
      });
      return docRef;
    },
    onSuccess: () => {
      QueryClient.invalidateQueries({
        queryKey: ["get-tasks"],
        refetchType: "all",
      });
      notifications.show({
        color: "lime",
        icon: (
          <div className="font-bold">
            <Icon width={"32px"} icon={"simple-line-icons:check"} />
          </div>
        ),
        message: statusResponses({ task, status }),
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
  const handleStatus = (e: any) => {
    mutationStatus.mutate(e);
  };
  if (!task) return null;
  return (
    <NativeSelect
      className="rounded-br-xl rounded-tl-xl mx-2 my-auto transition-all hover:scale-105 text-center font-bold text-xl active:scale-95"
      classNames={{
        input: clsx(
          status == "" && task?.status == "completed" && "bg-primary-600",
          status == "" && task?.status == "started" && "bg-yellow-100",
          status == "" && task?.status == "not_started" && "bg-red-400",
          status == "" && task?.status == "stand_by" && "bg-orange-300",
          status == "" && task?.status == "planning" && "bg-yellow-400",
          status == "completed" && "bg-primary-600",
          status == "started" && "bg-yellow-100",
          status == "not_started" && "bg-red-400",
          status == "stand_by" && "bg-orange-300",
          status == "planning" && "bg-yellow-400"
        ),
        section: "bg-white",
      }}
      defaultValue={task?.status}
      data={taskStatusOptions}
      onChange={(e) => {
        handleStatus(e);
        setStatus(e.target.value);
      }}
    />
  );
}

function statusResponses({ task, status }: { task: any; status: string }) {
  switch (status) {
    case "completed":
      return `Task "${task?.title}" has been completed.`;
    case "started":
      return `Task "${task?.title}" has been set to started.`;
    case "not_started":
      return `Task "${task?.title}" has been set to not started.`;
    case "stand_by":
      return `Task "${task?.title}" has been set on stand by.`;
    case "planning":
      return `Task "${task?.title}" has been set to planning.`;
  }
}
