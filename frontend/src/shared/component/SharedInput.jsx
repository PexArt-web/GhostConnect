import { Input } from "@/components/ui/input";

const SharedInput = ({
  placeholder,
  type,
  id,
  name,
  className,
  autoComplete,
  required,
  onChange,
  onKeyDown,
  value,
  onFocus,
  onBlur
  
}) => {
  return (
    <Input
      placeholder={placeholder}
      type={type}
      id={id}
      name={name}
      value={value}
      className={className}
      autoComplete={autoComplete}
      required={required}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};

export default SharedInput;
