import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SharedAvatar = ({className, alt }) => {
    const imageSrc = "https://github.com/shadcn.png"
    const avatarFallback = "CN"
  return (
    <div>
      <Avatar>
        <AvatarImage className = {className} src= {imageSrc} alt = {alt} />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default SharedAvatar;
