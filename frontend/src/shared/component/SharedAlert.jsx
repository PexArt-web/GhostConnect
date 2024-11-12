import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const SharedAlert = ({type, label, className}) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{type}</AlertTitle>
      <AlertDescription>
       {label}
      </AlertDescription>
    </Alert>
  );
};

export default SharedAlert;
