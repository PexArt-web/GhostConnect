import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { data } from "autoprefixer";

const SharedDropDown = ({label, loadIcon1, loadLabel1, loadIcon2, loadLabel2}) => {
  const getData = (data)=>{
console.log(data, "LABEL")  }
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>{label}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={(event)=>getData({loadLabel1})}>{loadIcon1} <span>{loadLabel1}</span></DropdownMenuItem>
          <DropdownMenuItem onClick={()=>alert("Delete")}>{loadIcon2} <span>{loadLabel2}</span></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SharedDropDown;
