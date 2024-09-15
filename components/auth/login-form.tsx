"use client";

import { useRouter } from "next/router";
import { CardWrapper } from "./card-wrapper"
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import {LoginSchema} from "@/schemas"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "./form-error";
import { FormSucces } from "./form-succes";
import { login } from "@/actions/login";
import { useState, useTransition } from "react";
import { redirectAfterDelay } from '@/lib/utils';

export const LoginForm =() =>{
const [error, setError]= useState<string | undefined>("");
const [success, setSuccess] = useState<string | undefined>("");

const [isPending, startTransition] = useTransition();
// const router = useRouter();

const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues:{
        email: "",
        password: "",
    } 
})
const onSubmit =( values: z.infer<typeof LoginSchema>)=>{
    setError("");
    setSuccess("");
    startTransition(()=>{
        login(values)
            .then((data)=>{
                if(data){
                    setError(data.error);
                    setSuccess(data.success);
                    // redirectAfterDelay(router,"/client/dashbord",2000)
                }
            })
    })
}

    return (
        <CardWrapper
        headerLabel="Welcome Back"
        backButtonLabel="Don't have an account?"
        backButtonHref="/auth/register"
        showSocial
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                >
                    <div className="space-y-4">
                        <FormField 
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                        {...field}
                                        disabled={isPending}
                                        placeholder="john.doe@email.com"
                                        type="email"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>

                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input 
                                        {...field}
                                        disabled={isPending}
                                        placeholder="*******"
                                        type="password"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>

                            )}
                        />
                           

                    </div>
                    <FormError message={error}/>
                    <FormSucces message={success}/>
                    <Button 
                    type="submit"
                    className="w-full"
                    disabled={isPending}
                    >
                        Login
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}