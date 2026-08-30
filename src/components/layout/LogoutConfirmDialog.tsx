"use client";

import React, { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut, Loader2 } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";

interface LogoutConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogoutConfirmDialog({ open, onOpenChange }: LogoutConfirmDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-border/80 shadow-lg sm:max-w-[425px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-3 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
              <LogOut className="h-5 w-5" />
            </div>
            <div>
              <AlertDialogTitle className="text-lg font-extrabold text-foreground">
                Konfirmasi Keluar
              </AlertDialogTitle>
              <p className="text-xs text-muted-foreground">SIPASTI — BPS Kabupaten Tangerang</p>
            </div>
          </div>
          <AlertDialogDescription className="text-sm text-muted-foreground pt-2">
            Apakah Anda yakin ingin keluar dari akun ini? Anda harus melakukan login kembali untuk mengakses sistem.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0 pt-2">
          <AlertDialogCancel disabled={isPending} className="rounded-xl font-bold border-border/80">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
            disabled={isPending}
            className="rounded-xl font-bold bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-2xs"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Keluar...
              </span>
            ) : (
              "Ya, Keluar"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
