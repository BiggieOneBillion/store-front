"use client";

import { useAuth } from "@/hooks/useAuth";
import { onlineStatus } from "@/services/api/auth";
import { useUserStore } from "@/store/user-store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useRef, useState } from "react";

type UserStatusProps = { children: ReactNode };

const POLL_MS = 2000;

const UserStatus = ({ children }: UserStatusProps) => {
  const user = useUserStore((s) => s.user);
  const updateUser = useUserStore((s) => s.updateUser);
  const { refreshToken: refreshTokenFn } = useAuth();

  const [showDialog, setShowDialog] = useState(false);
  const [dialogBntText, setDialogBntText] = useState("Log In");
  const route = useRouter();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const triedRefreshOnce = useRef(false);
  const qc = useQueryClient();

  const canQuery = !!user?.token && !isRefreshing;

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["user-status", user?.id ?? null], // keep key stable; read token inside fn
    queryFn: async () => {
      // read the freshest token from store when the query runs
      const token = useUserStore.getState().user?.token;
      if (!token) throw new Error("no-token");
      return onlineStatus({ token });
    },
    enabled: canQuery,
    refetchIntervalInBackground: true,
    refetchInterval: POLL_MS,
    // Don't hammer retries on auth errors; let our effect handle 401
    retry: (count, err) => {
      const status = (err as AxiosError | undefined)?.response?.status;
      if (status === 401) return false;
      return count < 3;
    },
    // Optional: keep UI calm between polls
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });

  const logoutUser = async () => {
    setDialogBntText("Processing...");

    await fetch("/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken: user?.refreshToken,
        userId: user?.id,
      }),
    });

    setDialogBntText("Routing Login...");

    setTimeout(() => route.push("auth"), 1500);

    useUserStore.getState().clearUser();
  };

  // When we see a 401 from the status poll, try a single token refresh.
  useEffect(() => {
    const status = (error as AxiosError | undefined)?.response?.status;
    if (!isError || status !== 401) return;
    if (triedRefreshOnce.current) return; // only once per 401 burst

    triedRefreshOnce.current = true;
    setIsRefreshing(true);

    (async () => {
      try {
        const res = await refreshTokenFn({
          refreshToken: user?.refreshToken ?? "",
        });

        // // console.log("refresh token result", res);

        const maybeToken = res.access.token;

        const maybeRefresh = res.refresh.token;

        if (maybeToken || maybeRefresh) {
          updateUser({
            ...(maybeToken ? { token: String(maybeToken) } : {}),
            ...(maybeRefresh ? { refreshToken: String(maybeRefresh) } : {}),
          });
          // re-run the status query with the fresh token
          qc.invalidateQueries({ queryKey: ["user-status", user?.id ?? null] });
        }
      } catch (e) {
        // refresh failed -> show dialog or force logout
        setIsRefreshing(false);
        //
        await logoutUser();
        // (handled below in render)
      } finally {
        setIsRefreshing(false);
        // allow future refresh attempts if another 401 occurs later
        setTimeout(() => (triedRefreshOnce.current = false), 2000);
      }
    })();
  }, [
    isError,
    error,
    refreshTokenFn,
    updateUser,
    qc,
    user?.id,
    user?.refreshToken,
  ]);

  // ---- UI decisions ----

  // If refresh is happening, keep children rendered and avoid extra UI jitter.
  if (isRefreshing) return <>{children}</>;

  // If onlineStatus explicitly signals something (adjust to your API)
  if (data) {
    // Example: if API returns { shouldShowDialog: true }
    // return data.shouldShowDialog ? <p>Show dialog</p> : <>{children}</>;
  }

  // If we still have a 401 after attempted refresh → show dialog / logout prompt
  const status = (error as AxiosError | undefined)?.response?.status;
  if (isError && status === 401) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">Session Expired</h2>
            <p className="mb-4">
              Your session has expired. Please log in again.
            </p>
            <button
              className="bg-zinc-500 text-white px-4 py-2 rounded"
              onClick={async () => {
                await logoutUser();
                setShowDialog(false);
              }}
            >
              {dialogBntText}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserStatus;
