"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import UserSVG from "../svgicons/usersvg"
import { LogoutButton } from "./LogoutButton"

export default function UserAvatarWithSettings() {
  const [isOpen, setIsOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  const toggleMenu = () => setIsOpen(!isOpen)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="hidden md:block relative">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full bg-zinc-300 p-0"
        onClick={toggleMenu}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <UserSVG className="h-5 w-5 text-zinc-600" />
        <span className="sr-only">Open user settings</span>
      </Button>
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {/* <Button
              variant="ghost"
              className="w-full justify-start text-sm px-4 py-2"
              role="menuitem"
            >
              Profile
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm px-4 py-2"
              role="menuitem"
            >
              Preferences
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm px-4 py-2"
              role="menuitem"
            >
              Logout
            </Button> */}
            <LogoutButton></LogoutButton>
          </div>
        </div>
      )}
    </div>
  )
}