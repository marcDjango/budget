"use client";

import { CardWrapper } from "../auth/card-wrapper"
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import {RegisterSchema} from "@/schemas"
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
import { FormError } from "@/components/auth/form-error";
import { FormSucces } from "@/components/auth/form-succes";
import { register } from "@/actions/register";
import { useState, useTransition } from "react";


export const RegisterForm =() =>{
const [error, setError]= useState<string | undefined>("");
const [success, setSuccess] = useState<string | undefined>("");

const [isPending, startTransition] = useTransition();

const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues:{
        email: "",
        password: "",
        name: "",
    } 
})
const onSubmit =( values: z.infer<typeof RegisterSchema>)=>{
    setError("");
    setSuccess("");
   startTransition(()=>{
       register(values)
        .then((data)=>{
            setError(data.error);
            setSuccess(data.success);
        })
   })
}

    return (
        <CardWrapper
        headerLabel="Create an account"
        backButtonLabel="Already have an account?"
        backButtonHref="/auth/login"
        showSocial
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                >
                    <div className="space-y-4">
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                        {...field}
                                        disabled={isPending}
                                        placeholder="john doe"
                                        type="text"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>

                            )}
                        />
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
                        Create account
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}