import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import SharedInput from "./SharedInput";
import SharedButton from "./SharedButton";
const SharedDialog = ({ open, title, handleClose, sendUpdate, value, editMessage }) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            <SharedInput value={value} onChange={editMessage}/>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <SharedButton label={"Cancel"} handleClick={handleClose} />
            <SharedButton label={"Edit"} handleClick={sendUpdate}/>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SharedDialog;
