"use client";
import {useRouter} from "next/navigation";

interface DashBordButtonProps{
    children:React.ReactNode;
    mode?: "modal" | "redirect",
    asChild?: boolean;
};

export const DashBord = ({
    children,
    mode = "redirect",
    asChild
}:DashBordButtonProps) => {
    const router = useRouter();
    const onClick = ()=>{
        router.push("/client/dashbord");
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