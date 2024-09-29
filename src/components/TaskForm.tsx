import { Icon } from "@iconify/react/dist/iconify.js";
import { Input, InputWrapper, UnstyledButton } from "@mantine/core";
import clsx from "clsx";
import Editor from "react-simple-wysiwyg";
import React from "react";

export default function TaskForm({
  submitHovered,
  form,
  handleOnChange,
  handleOnSubmit,
}: {
  submitHovered: boolean;
  form: any;
  handleOnChange: any;
  handleOnSubmit: any;
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <InputWrapper
          error={!form?.title && submitHovered && "Write the title"}
          className="col-span-1"
          label="Title"
        >
          <Input
            type="text"
            name="title"
            value={form?.title}
            onChange={handleOnChange}
          />
        </InputWrapper>
        <InputWrapper
          error={!form?.due_date && submitHovered && "Select a due date"}
          label="Due Date"
        >
          <Input
            className="col-span-1"
            type="date"
            name="due_date"
            value={form?.due_date}
            onChange={handleOnChange}
          />
        </InputWrapper>
        <InputWrapper
          className="col-span-2"
          error={!form?.description && submitHovered && "Write a description"}
          label="Description"
        >
          <Editor
            name="description"
            value={form?.description}
            onChange={handleOnChange}
          />
        </InputWrapper>
      </div>
      <div
        className={clsx(
          "rounded-tl-xl mb-4 w-16 h-12 transition-all border-2 border-gray-300 rounded-br-xl",
          form?.title && form?.description
            ? "hover:text-primary-900 hover:bg-primary-200 hover:border-primary-800 active:scale-95"
            : "bg-gray-100 text-gray-300"
        )}
      >
        <UnstyledButton onClick={handleOnSubmit} className="w-full h-full">
          <Icon
            icon="material-symbols:save-outline"
            className="m-auto"
            width={"32"}
          />
        </UnstyledButton>
      </div>
    </>
  );
}
