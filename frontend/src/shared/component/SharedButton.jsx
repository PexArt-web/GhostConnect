import { Button } from "@/components/ui/button";

const SharedButton = ({ type, className, disabled, label, handleClick }) => {
  return (
    <Button
      type={type}
      className={className}
      disabled={disabled}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
};

export default SharedButton;
