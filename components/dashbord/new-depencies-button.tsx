"use client";
import {useRouter} from "next/navigation";

interface NewButtonProps{
    children:React.ReactNode;
    mode?: "modal" | "redirect",
    asChild?: boolean;
};

export const NewButton = ({
    children,
    mode = "redirect",
    asChild
}:NewButtonProps) => {
    const router = useRouter();
    const onClick = ()=>{
        router.push("/client/dashbord/add");
    }

    if(mode==="modal"){
        return (
            <span>TODO : implement modal</span>
        )
    }

    return (
        <span onClick={onClick} className="cursor-pointer"> 
            {children}
        </span>
    );

};