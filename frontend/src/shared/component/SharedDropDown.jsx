import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const SharedDropDown = ({label, loadIcon1, loadLabel1, loadIcon2, loadLabel2, handleUpdate, handleDelete}) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>{label}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleUpdate}>{loadIcon1} <span>{loadLabel1}</span></DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>{loadIcon2} <span>{loadLabel2}</span></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SharedDropDown;
