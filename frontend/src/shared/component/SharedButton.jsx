import { Button } from "@/components/ui/button"


const SharedButton = ({type, className, disabled, label}) => {
  return (
  <Button type={type} className={className} disabled={disabled}>
    {label}
  </Button>
  ) 
}

export default SharedButton
