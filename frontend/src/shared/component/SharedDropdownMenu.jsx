import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
// import { DialogCloseButton } from "./SharedDialogue";

const ComboboxDropdownMenu = ({ handleClick, handleDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <p className="text-sm font-medium leading-none"></p>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuGroup>
            <DropdownMenuItem>
             <p onClick={handleClick}>Edit Text</p> 
            </DropdownMenuItem>
            <DropdownMenuItem>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <span onClick={handleDelete}>Delete</span>
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default ComboboxDropdownMenu;
