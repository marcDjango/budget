import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

const SettingPage = async () => {

    const session = await auth();

    return (
        <div>
           {JSON.stringify(session)}
           <form action={async ()=>{
                "use server";
                await signOut();
           }}>
                <Button className="w-[250px] mx-auto flex" type="submit">
                    Sign Out
                </Button>
           </form>
        </div>
    )
}
export default SettingPage;