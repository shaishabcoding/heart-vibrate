import { useState } from "react";
import {
  Sidebar as SBar,
  SidebarBody,
  SidebarLink,
} from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconMessageChatbot,
  IconMessageCircle,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link, Outlet } from "react-router-dom";

export default function Sidebar() {
  const links = [
    {
      label: "Chats",
      href: "/chat",
      icon: (
        <IconMessageCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Sign Up",
      href: "signup",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-screen border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-full" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <SBar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </SBar>
      <div className="w-full h-full">
        <Outlet />
      </div>
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20 animate-vibrate"
    >
      <IconMessageChatbot />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold text-black dark:text-white whitespace-pre hover:text-blue-600"
      >
        Heart Vibrate
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <IconMessageChatbot />
    </Link>
  );
};
