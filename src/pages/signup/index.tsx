import Head from 'next/head';

export default function SignupPage() {
    return (
        <>
            <Head>
                <title>Sign Up | Bhagavad Gita</title>
                <meta name="description" content="Create an account or log in to access your Bhagavad Gita reading progress and features." />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold">Sign Up</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Use the login button in the navigation to get started
                    </p>
                </div>
            </main>
        </>
    )
}
