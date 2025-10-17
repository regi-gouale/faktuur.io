"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { signupSchema } from "@/lib/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function RegisterForm() {
  const [name, setName] = useQueryState("name");
  const [email, setEmail] = useQueryState("email");
  const [company, setCompany] = useQueryState("company");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Create Form object
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: name || "",
      email: email || "",
      company: company || "",
      password: password || "",
    },
  });

  async function onSubmit(data: z.infer<typeof signupSchema>) {
    setIsLoading(true);
    // create user account with better auth
    const resultUser = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      callbackURL: `/dashboard`,
    });

    if (resultUser.error) {
      toast.error("Erreur lors de l'inscription : " + resultUser.error.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    toast.success(
      "Inscription réussie ! Un email de confirmation a été envoyé."
    );
    form.reset();
    setName("");
    setEmail("");
    setCompany("");
    setPassword("");
    redirect(`/dashboard`);
  }

  return (
    <Card className="overflow-hidden rounded-4xl w-full">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">
          Inscription
        </CardTitle>
        <CardDescription>
          Veuillez remplir le formulaire ci-dessous pour vous inscrire.
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Prénom & Nom</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Jean Dupont"
                      autoComplete="name"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setName(e.target.value);
                      }}
                      disabled={isLoading}
                      className="rounded-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@example.com"
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
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Entreprise</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Acme Corp"
                      autoComplete="company"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setCompany(e.target.value);
                      }}
                      disabled={isLoading}
                      className="rounded-full"
                    />
                  </FormControl>
                  <FormDescription className="text-muted-foreground text-end text-xs italic">
                    Optionnel, mais recommandé.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type="password"
                      autoComplete="new-password"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setPassword(e.target.value);
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
              {isLoading ? "Inscription..." : "S'inscrire"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-center w-full">
        <div className="text-center text-sm text-muted-foreground w-full">
          Vous avez déjà un compte ?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Connectez vous ici
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export function RegisterFormFallback() {
  return (
    <Card className="overflow-hidden rounded-4xl w-full">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">
          Inscription
        </CardTitle>
        <CardDescription>
          Veuillez remplir le formulaire ci-dessous pour vous inscrire.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 p-4">
          <div className="h-10 bg-muted animate-pulse rounded-full" />
          <div className="h-10 bg-muted animate-pulse rounded-full" />
          <div className="h-10 bg-muted animate-pulse rounded-full" />
          <div className="h-10 bg-muted animate-pulse rounded-full" />
          <div className="h-10 bg-muted animate-pulse rounded-full" />
          <div className="h-10 bg-muted animate-pulse rounded-full" />
          <div className="h-10 bg-muted animate-pulse rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
