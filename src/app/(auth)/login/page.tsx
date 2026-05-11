import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-secondary/10 blur-[100px]"></div>
      </div>

      <Link href="/" className="flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity">
        <div className="bg-white p-2 rounded-xl shadow-sm border">
          <Image src="/logo-bps.svg" alt="Logo" width={40} height={40} className="h-10 w-auto" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-primary leading-none">Humas</span>
          <span className="text-sm font-medium text-muted-foreground">Badan Pusat Statistik</span>
        </div>
      </Link>
      
      <Card className="w-full max-w-md border-muted/50 shadow-xl shadow-primary/5 backdrop-blur-sm bg-background/95">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight">Login Petugas</CardTitle>
          <CardDescription className="text-base">
            Masukkan email dan password Anda untuk masuk ke dashboard manajemen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-semibold">Email</Label>
            <Input id="email" type="email" placeholder="nama@bps.go.id" className="h-11 bg-muted/50 focus:bg-background transition-colors" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="font-semibold">Password</Label>
              <Link href="/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors">
                Lupa password?
              </Link>
            </div>
            <Input id="password" type="password" className="h-11 bg-muted/50 focus:bg-background transition-colors" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-5 pt-2">
          <Link href="/dashboard" className="w-full">
            <Button className="w-full h-11 text-base font-medium shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all">
              Masuk Dashboard
            </Button>
          </Link>
          <div className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
            <span className="h-px flex-1 bg-border"></span>
            <span className="px-2">Sistem Informasi Layanan BPS</span>
            <span className="h-px flex-1 bg-border"></span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
