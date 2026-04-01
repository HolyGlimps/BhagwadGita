import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback, Button } from '@/components/ui';
import { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, LogOut, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [nameError, setNameError] = useState('');
  const [nameSuccess, setNameSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    setMounted(true);
    if (session?.user?.name) {
      setDisplayName(session.user.name);
    }
  }, [session?.user?.name]);

  const handleUpdateName = async () => {
    setNameError('');
    setNameSuccess('');

    if (!displayName.trim()) {
      setNameError('Display name cannot be empty');
      return;
    }

    if (displayName.length > 100) {
      setNameError('Name is too long (max 100 characters)');
      return;
    }

    setIsUpdatingName(true);

    try {
      const response = await axios.put('/api/user/update-name', {
        name: displayName.trim(),
      });

      await update({name: displayName})

      setNameSuccess('Display name updated successfully!');
      console.log("name updated")
      setIsEditingName(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setNameError(error.response.data.error || "Failed to update Name!");
      } else {
        setNameError("An Error Occurred!");
      }
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError('');
    setIsDeletingAccount(true);

    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete account');
      }

      // Sign out and redirect
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'An error occurred');
      setIsDeletingAccount(false);
    }
  };

  if (status === 'loading') {
    return (
      <>
        <Head>
          <title>Profile - Bhagavad Gita</title>
        </Head>
        <main className="min-h-screen bg-background">
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto"></div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!session) {
    router.push('/');
    return null;
  }

  return (
    <>
      <Head>
        <title>Profile Settings - Bhagavad Gita</title>
        <meta name="description" content="Manage your profile and settings" />
      </Head>

      <main className="bg-background py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Profile Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account and preferences
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-4">
            <div className="px-6 sm:px-8 py-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-start gap-4 sm:gap-6">
                {/* Avatar */}
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0">
                  <AvatarImage src={session.user?.image || undefined} alt={session.user?.name || 'User'} />
                  <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 text-white font-bold text-2xl">
                    {(displayName || session.user?.email || 'U')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {displayName || 'User'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base truncate">
                    {session.user?.email}
                  </p>
                  <span className="text-xs sm:text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-400 animate-pulse">
                    ✧ Exploring the Gita's wisdom ✧
                  </span>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="px-6 sm:px-8 py-6 space-y-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Account Information
              </h3>

              <div className="space-y-4">
                {/* Display Name */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Display Name
                  </label>
                  {isEditingName ? (
                    <div className="mt-2 space-y-2">
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => {
                          setDisplayName(e.target.value);
                          setNameError('');
                          setNameSuccess('');
                        }}
                        maxLength={100}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Enter your display name"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleUpdateName}
                          disabled={isUpdatingName}
                          className="px-3 py-1 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 rounded transition-colors disabled:opacity-50"
                        >
                          {isUpdatingName ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                          onClick={() => {
                            setIsEditingName(false);
                            setDisplayName(session.user?.name || '');
                            setNameError('');
                            setNameSuccess('');
                          }}
                          disabled={isUpdatingName}
                          className="px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </Button>
                      </div>
                      {nameError && (
                        <p className="text-sm text-red-600 dark:text-red-400">{nameError}</p>
                      )}
                      {nameSuccess && (
                        <p className="text-sm text-green-600 dark:text-green-400">{nameSuccess}</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-x-2 mt-1">
                      <p className="text-gray-900 dark:text-white">{displayName || 'Not set'}</p>
                      <Button
                        onClick={() => setIsEditingName(true)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400  hover:text-amber-700 dark:hover:text-amber-300 rounded transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email Address
                  </label>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {session.user?.email}
                  </p>
                </div>

                {/* Sign In Method */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Sign In Method
                  </label>
                  <p className="text-gray-900 dark:text-white mt-1 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Google OAuth
                  </p>
                </div>
              </div>
            </div>



            {/* Danger Zone */}
            <div className="px-6 sm:px-8 py-6 space-y-4">
              <h3 className="text-sm font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Danger Zone
              </h3>

              {/* Sign Out Button */}
              <Button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full px-4 py-3 text-sm text-foreground bg-red-300 hover:bg-red-400 dark:bg-red-400 dark:hover:bg-red-500 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out of Your Account
              </Button>

              {/* Delete Account Button */}
              {!showDeleteConfirm ? (
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full px-4 py-3 text-foreground bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Account Permanently
                </Button>
              ) : (
                <div className="space-y-3 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200/70 dark:border-red-800/50 rounded-lg">
                  <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                    Are you sure you want to delete your account?
                  </p>
                  <p className="text-xs text-red-800 dark:text-red-300">
                    This action cannot be undone. Your account will be permanently deleted.
                  </p>
                  {deleteError && (
                    <p className="text-sm text-red-600 dark:text-red-400">{deleteError}</p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      onClick={handleDeleteAccount}
                      disabled={isDeletingAccount}
                      className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 rounded transition-colors disabled:opacity-50"
                    >
                      {isDeletingAccount ? 'Deleting...' : 'Yes, Delete'}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteError('');
                      }}
                      disabled={isDeletingAccount}
                      className="flex-1 px-4 py-2 text-sm font-semibold text-red-700 dark:text-red-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}