"use client";

import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="bg-blue-600 text-white">
      <div className="px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          大会管理サービス
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm">{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm hover:underline"
              >
                ログアウト
              </button>
            </>
          ) : (
            <Link href="/login" className="text-sm hover:underline">
              ログイン
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
