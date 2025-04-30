"use client"

import { Head, useForm } from "@inertiajs/react"
import { LoaderCircle, ShieldIcon as ShieldHeart } from "lucide-react"
import type { FormEventHandler } from "react"

import InputError from "@/components/input-error"
import TextLink from "@/components/text-link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthLayout from "@/layouts/auth-layout"

type RegisterForm = {
    name: string
    email: string
    password: string
    password_confirmation: string
}

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        })
    }

    return (
        <div className="grid lg:grid-cols-2 min-h-screen">
            {/* Left side image */}
            <div className="hidden lg:block relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 to-purple-900/20 z-10" />
                <img
                    src="/assets/login.jpg"
                    alt="Register background"
                    className="h-screen w-full object-cover"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-center">
                    <ShieldHeart className="h-16 w-16 text-white mx-auto mb-4" />
                    <h2 className="text-white text-3xl font-bold">Safe Haven</h2>
                    <p className="text-white/90 mt-2 max-w-xs">
                        Join our community and access resources to support those affected by gender-based violence.
                    </p>
                </div>
            </div>

            {/* Right side form */}
            <AuthLayout title="Create an account" description="Enter your details below to create your account">
                <Head title="Register" />
                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                disabled={processing}
                                placeholder="Full name"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                disabled={processing}
                                placeholder="email@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                disabled={processing}
                                placeholder="Password"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirm password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData("password_confirmation", e.target.value)}
                                disabled={processing}
                                placeholder="Confirm password"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Create account
                        </Button>
                    </div>

                    <div className="text-muted-foreground text-center text-sm">
                        Already have an account?{" "}
                        <TextLink href={route("login")} tabIndex={6}>
                            Log in
                        </TextLink>
                    </div>
                </form>
            </AuthLayout>
        </div>
    )
}
