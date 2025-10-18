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
import { forgotPasswordSchema } from "@/lib/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function ForgotPasswordForm() {
  const [email, setEmail] = useQueryState("email");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: email || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    setIsLoading(true);

    const resultResetPassword = await fetch("/api/auth/forget-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        redirectTo: "/reset-password",
      }),
    });

    if (!resultResetPassword.ok) {
      toast.error("Une erreur est survenue. Veuillez réessayer plus tard.", {
        duration: 5000,
      });
      setIsLoading(false);
      return;
    }

    toast.success(
      "Un email de réinitialisation de mot de passe a été envoyé si l'adresse existe.",
      { duration: 5000 }
    );

    setIsLoading(false);
    redirect("/login");
  };

  return (
    <Card className="overflow-hidden rounded-4xl w-full">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">
          Mot de passe oublié ?
        </CardTitle>
        <CardDescription className="text-left">
          Veuillez entrer votre adresse email pour recevoir un lien de
          réinitialisation de mot de passe.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Entrez votre email"
                      autoComplete="email"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setEmail(e.target.value);
                      }}
                      disabled={isLoading}
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
              {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export const ForgotPasswordFormFallback = () => {
  return (
    <Card className="overflow-hidden rounded-4xl w-full">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">
          Mot de passe oublié ?
        </CardTitle>
        <CardDescription>
          Veuillez entrer votre adresse email pour recevoir un lien de
          réinitialisation de mot de passe.
        </CardDescription>
      </CardHeader>
      <CardContent>
        Veuillez patienter pendant le chargement du formulaire...
      </CardContent>
    </Card>
  );
};
