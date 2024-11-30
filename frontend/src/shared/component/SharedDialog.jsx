import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
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
          <AlertDialogCancel>
            <SharedButton label={"Cancel"} handleClick={handleClose} />
          </AlertDialogCancel>
          <AlertDialogAction>
            <SharedButton label={"Continue"} handleClick={sendUpdate}/>
            </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SharedDialog;
