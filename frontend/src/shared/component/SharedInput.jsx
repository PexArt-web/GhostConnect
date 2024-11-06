import { Input } from "@/components/ui/input"

const SharedInput = ({placeholder, type, id, name, className, autoComplete , required}) => {
  return (
   <Input placeholder={placeholder} type={type} id={id} name={name} className={className}  autoComplete={autoComplete} required={required}/>
  )
}

export default SharedInput
