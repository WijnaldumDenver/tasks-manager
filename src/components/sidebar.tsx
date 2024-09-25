import { LogoutButton, ProfileButton } from "firebase-nextjs/client/components";
import React, { ReactNode } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, UnstyledButton } from "@mantine/core";

export default function Sidebar() {
  return (
    <>
      <div className="fixed flex flex-col bg-clip-border rounded-r-xl bg-white text-gray-700 min-h-screen w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
        <div className="mb-2 p-4 mx-auto flex flex-col justify-center ">
          <h5 className="block antialiased tracking-normal font-sans text-xl font-semibold leading-snug text-gray-900">
            Tasks Manager
          </h5>
          <div className="min-w-16 mx-auto mt-8">
            <ProfileButton size={128} />
          </div>
        </div>
        <nav className="flex flex-col gap-1 min-w-[240px] p-2 font-sans text-base font-normal text-gray-700">
          <SideBarButton icon={"fa-solid:tasks"} label="Tasks" />
          <LogoutButton>
            <SideBarButton icon="ic:round-logout" label="Log Out" />
          </LogoutButton>
        </nav>
      </div>

      <div className="w-full pt-5 px-4 mb-8 mx-auto ">
        <div className="text-sm text-gray-700 py-1">
          Made with{" "}
          <a
            className="text-gray-700 font-semibold"
            href="https://www.material-tailwind.com/docs/react/sidebar?ref=tailwindcomponents"
            target="_blank"
          >
            Material Tailwind
          </a>{" "}
          by{" "}
          <a
            href="https://www.creative-tim.com?ref=tailwindcomponents"
            className="text-gray-700 font-semibold"
            target="_blank"
          >
            {" "}
            Creative Tim
          </a>
          .
        </div>
      </div>
    </>
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
