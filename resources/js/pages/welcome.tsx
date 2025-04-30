import type { SharedData } from "@/types"
import { Head, Link, usePage, useRoute } from "@inertiajs/react"
import { ShieldIcon as ShieldHeart, Phone, MessageSquareIcon as MessageSquareHelp } from "lucide-react"

export default function Welcome() {
    const { auth } = usePage<SharedData>().props

    return (
        <>
            <Head title="Welcome - Safe Haven">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route("dashboard")}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <h1 className="mb-1 text-xl font-medium text-purple-800 dark:text-purple-400">Safe Haven GBV Support</h1>
                            <p className="mb-4 text-[#706f6c] dark:text-[#A1A09A]">
                                A safe space for survivors of gender-based violence.
                                <br />
                                We're here to support you through every step of your journey.
                            </p>
                            <ul className="mb-4 flex flex-col lg:mb-6">
                                <li className="relative flex items-center gap-4 py-2 before:absolute before:top-1/2 before:bottom-0 before:left-[0.4rem] before:border-l before:border-purple-200 dark:before:border-purple-900">
                  <span className="relative bg-white py-1 dark:bg-[#161615]">
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-purple-200 bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-purple-900 dark:bg-[#161615]">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-400 dark:bg-purple-600" />
                    </span>
                  </span>
                                    <span>
                    Access
                    <a
                        href="#resources"
                        className="ml-1 inline-flex items-center space-x-1 font-medium text-purple-700 underline underline-offset-4 dark:text-purple-400"
                    >
                      <span>Support Resources</span>
                      <svg
                          width={10}
                          height={11}
                          viewBox="0 0 10 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-2.5 w-2.5"
                      >
                        <path
                            d="M7.70833 6.95834V2.79167H3.54167M2.5 8L7.5 3.00001"
                            stroke="currentColor"
                            strokeLinecap="square"
                        />
                      </svg>
                    </a>
                  </span>
                                </li>
                                <li className="relative flex items-center gap-4 py-2 before:absolute before:top-0 before:bottom-1/2 before:left-[0.4rem] before:border-l before:border-purple-200 dark:before:border-purple-900">
                  <span className="relative bg-white py-1 dark:bg-[#161615]">
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-purple-200 bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-purple-900 dark:bg-[#161615]">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-400 dark:bg-purple-600" />
                    </span>
                  </span>
                                    <span>
                    Connect with
                    <a
                        href="#counselors"
                        className="ml-1 inline-flex items-center space-x-1 font-medium text-purple-700 underline underline-offset-4 dark:text-purple-400"
                    >
                      <span>Trained Counselors</span>
                      <svg
                          width={10}
                          height={11}
                          viewBox="0 0 10 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-2.5 w-2.5"
                      >
                        <path
                            d="M7.70833 6.95834V2.79167H3.54167M2.5 8L7.5 3.00001"
                            stroke="currentColor"
                            strokeLinecap="square"
                        />
                      </svg>
                    </a>
                  </span>
                                </li>
                            </ul>
                            <ul className="flex gap-3 text-sm leading-normal">
                                <li>
                                    <a
                                        href="#emergency"
                                        className="inline-flex items-center gap-2 rounded-sm border border-purple-700 bg-purple-700 px-5 py-1.5 text-sm leading-normal text-white hover:border-purple-800 hover:bg-purple-800 dark:border-purple-600 dark:bg-purple-600 dark:text-white dark:hover:border-purple-500 dark:hover:bg-purple-500"
                                    >
                                        <Phone className="h-4 w-4" />
                                        Emergency Help
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="relative -mb-px aspect-[335/376] w-full shrink-0 overflow-hidden rounded-t-lg bg-purple-50 lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-t-none lg:rounded-r-lg dark:bg-purple-950">
                            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                                <ShieldHeart className="mb-6 h-16 w-16 text-purple-600 dark:text-purple-400" />
                                <h2 className="mb-4 text-2xl font-bold text-purple-800 dark:text-purple-300">Safe Haven</h2>
                                <p className="mb-6 max-w-xs text-purple-700 dark:text-purple-400">
                                    Our platform provides confidential support, resources, and community for those affected by
                                    gender-based violence.
                                </p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <div className="flex items-center rounded-full bg-white px-4 py-2 text-sm text-purple-800 shadow-sm dark:bg-purple-900 dark:text-purple-200">
                                        <MessageSquareHelp className="mr-2 h-4 w-4" />
                                        24/7 Support
                                    </div>
                                    <div className="flex items-center rounded-full bg-white px-4 py-2 text-sm text-purple-800 shadow-sm dark:bg-purple-900 dark:text-purple-200">
                                        <ShieldHeart className="mr-2 h-4 w-4" />
                                        Confidential Help
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    )
}
