"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPasswordSchema } from "@/lib/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: password || "",
      confirmPassword: confirmPassword || "",
    },
  });
  const router = useRouter();

  const token = searchParams.get("token");

  if (!token) {
    return (
      <Card className="overflow-hidden rounded-4xl w-full">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            Réinitialiser votre mot de passe
          </CardTitle>
          <CardDescription>
            Le lien de réinitialisation est invalide ou a expiré.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsLoading(true);

    const result = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        newPassword: data.confirmPassword,
      }),
    });

    if (!result.ok) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
      setIsLoading(false);
      return;
    }
    toast.success("Mot de passe réinitialisé avec succès !");
    form.reset();
    setIsLoading(false);
    router.push("/login");
  };

  return (
    <Card className="overflow-hidden rounded-4xl w-full">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">
          Réinitialiser votre mot de passe
        </CardTitle>
        <CardDescription>
          Veuillez entrer votre nouveau mot de passe ci-dessous.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-4 p-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Nouveau mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••••••••••"
                      {...field}
                      disabled={isLoading}
                      onChange={(e) => {
                        field.onChange(e);
                        setPassword(e.target.value);
                      }}
                      className="rounded-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••••••••••"
                      {...field}
                      disabled={isLoading}
                      onChange={(e) => {
                        field.onChange(e);
                        setConfirmPassword(e.target.value);
                      }}
                      className="rounded-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full mt-4 cursor-pointer"
            >
              {isLoading
                ? "Réinitialisation..."
                : "Réinitialiser le mot de passe"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export const ResetPasswordFormFallback = () => {
  return (
    <Card className="overflow-hidden rounded-4xl w-full">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">
          Réinitialiser votre mot de passe
        </CardTitle>
        <CardDescription>
          Veuillez entrer votre nouveau mot de passe ci-dessous.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-10 w-full rounded-full bg-gray-300" />
            <div className="h-10 w-full rounded-full bg-gray-300" />
            <div className="h-10 w-full rounded-full bg-gray-300" />
          </div>
          <div className="h-10 w-full animate-pulse rounded-full bg-gray-300" />
        </div>
      </CardContent>
    </Card>
  );
};
