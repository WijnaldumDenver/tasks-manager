"use client";

import { LogoutButton, ProfileButton } from "firebase-nextjs/client/components";
import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { UnstyledButton } from "@mantine/core";
import { auth } from "firebase-nextjs/firebasenextjs-firebase";

export default function Sidebar() {
  const sideBarButtons = [
    {
      icon: "clarity:tasks-line",
      label: "Tasks",
    },
    {
      icon: "carbon:settings",
      label: "Settings",
    },
    {
      icon: "ic:round-logout",
      label: "Log Out",
    },
  ];

  if (auth.currentUser)
    return (
      <div className="relative flex flex-col bg-clip-border rounded-r-xl bg-white text-gray-700 min-h-screen w-full max-w-[20rem] p-4 shadow-[0px_0px_16px_1px_#AAAAAA]">
        <div className="mb-2 p-4 mx-auto flex flex-col justify-center ">
          <h5 className="block antialiased tracking-normal font-sans text-xl font-semibold leading-snug text-gray-900">
            Tasks Manager
          </h5>
          <div className="min-w-16 mx-auto mt-8">
            <ProfileButton size={128} />
          </div>
        </div>
        <nav className="flex flex-col gap-1 min-w-[240px] p-2 font-sans text-base font-normal text-gray-700">
          {sideBarButtons.map((button) => (
            <>
              {button.label !== "Log Out" ? (
                <SideBarButton icon={button.icon} label={button.label} />
              ) : (
                <LogoutButton>
                  <SideBarButton icon={button.icon} label={button.label} />
                </LogoutButton>
              )}
            </>
          ))}
        </nav>
      </div>
    );
}

function SideBarButton({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-blue-50 hover:bg-opacity-80 focus:bg-blue-50 focus:bg-opacity-80 active:bg-blue-50 active:bg-opacity-80 hover:text-blue-900 focus:text-blue-900 active:text-blue-900 outline-none">
      <UnstyledButton variant="filled" className="flex w-full">
        <div className="grid place-items-center mr-4">
          <Icon className="h-5 w-5" icon={icon} />
        </div>
        {label}
      </UnstyledButton>
    </div>
  );
}
