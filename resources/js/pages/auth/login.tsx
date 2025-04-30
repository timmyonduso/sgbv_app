"use client"

import { Head, useForm } from "@inertiajs/react"
import { LoaderCircle } from "lucide-react"
import type { FormEventHandler } from "react"

import InputError from "@/components/input-error"
import TextLink from "@/components/text-link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthLayout from "@/layouts/auth-layout"

type LoginForm = {
    email: string
    password: string
    remember: boolean
}

interface LoginProps {
    status?: string
    canResetPassword: boolean
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: "",
        password: "",
        remember: false,
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        post(route("login"), {
            onFinish: () => reset("password"),
        })
    }

    return (
        <div className="grid lg:grid-cols-2 min-h-screen">
            <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
                <Head title="Log in" />

                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                placeholder="email@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                {canResetPassword && (
                                    <TextLink href={route("password.request")} className="ml-auto text-sm" tabIndex={5}>
                                        Forgot password?
                                    </TextLink>
                                )}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                placeholder="Password"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onClick={() => setData("remember", !data.remember)}
                                tabIndex={3}
                            />
                            <Label htmlFor="remember">Remember me</Label>
                        </div>

                        <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Log in
                        </Button>
                    </div>

                    <div className="text-muted-foreground text-center text-sm">
                        Don't have an account?{" "}
                        <TextLink href={route("register")} tabIndex={5}>
                            Sign up
                        </TextLink>
                    </div>
                </form>

                {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
            </AuthLayout>

            {/* Right side image */}
            <div className="hidden lg:block relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/20 to-gray-900/60 z-10" />
                <img
                    src="/assets/login.jpg"
                    alt="Login background"
                    className="h-screen w-full object-cover"
                />
                <div className="absolute bottom-8 left-8 z-20">
                    <h2 className="text-white text-2xl font-bold">Welcome back</h2>
                    <p className="text-white/80 mt-2">Sign in to continue to your account</p>
                </div>
            </div>
        </div>
    )
}
