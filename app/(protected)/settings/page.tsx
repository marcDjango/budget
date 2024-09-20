"use client";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useSession } from 'next-auth/react';
import { useCallback } from "react";

const SettingPage =  () => {
    const { data: session } = useSession();
    // Handler for sign out
    const handleSignOut = useCallback(async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Error signing out:", error);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <Card className="bg-white shadow-md rounded-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center text-gray-800">Paramètres du compte</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-md">
                                <h3 className="text-sm font-medium text-gray-500">Informations de session</h3>
                                <pre className="mt-2 text-sm text-gray-700 whitespace-pre-wrap break-words">
                                    {JSON.stringify(session, null, 2)}
                                </pre>
                            </div>
                            {session?.user?.image && (
                                <div className="flex justify-center">
                                    {/* Uncomment and use the image if needed */}
                                    {/* <img 
                                        src={session.user.image} 
                                        alt="Profile" 
                                        className="h-24 w-24 rounded-full"
                                    /> */}
                                </div>
                            )}
                            {session?.user?.name && (
                                <p className="text-center text-lg font-medium text-gray-700">
                                    {session.user.name}
                                </p>
                            )}
                            {session?.user?.email && (
                                <p className="text-center text-sm text-gray-500">
                                    {session.user.email}
                                </p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={handleSignOut}>
                            Déconnexion
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default SettingPage;
