import { Button } from "@/components/ui/button";

const SharedButton = ({ variant, type, className, disabled, label, handleClick }) => {
  return (
    <Button
      type={type}
      className={className}
      disabled={disabled}
      onClick={handleClick}
      variant={variant}
    >
      {label}
    </Button>
  );
};

export default SharedButton;
