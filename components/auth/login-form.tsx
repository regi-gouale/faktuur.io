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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { loginSchema } from "@/lib/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function LoginForm() {
  const [email, setEmail] = useQueryState("email");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Create Form object
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: email || "",
      password: password || "",
    },
  });

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    setIsLoading(true);

    const result = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: "/dashboard",
      rememberMe: true,
    });

    if (result.error) {
      toast.error("Erreur lors de la connexion : " + result.error);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    toast.success("Connexion réussie ! Vous allez être redirigé(e).");
    form.reset();
    setEmail("");
    setPassword("");
  }

  return (
    <Card className="overflow-hidden rounded-4xl w-full">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">
          Connexion
        </CardTitle>
        <CardDescription>
          Veuillez remplir le formulaire ci-dessous pour vous connecter.
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
            <div className="flex items-center justify-between">
              <Link
                href="/forgot-password"
                className="text-sm text-muted-foreground hover:underline cursor-pointer ml-auto"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full mt-4 cursor-pointer"
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-center w-full">
        <div className="text-center text-sm text-muted-foreground w-full">
          Vous n&apos;avez pas de compte ?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Inscrivez vous ici
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export function LoginFormFallback() {
  return (
    <Card className="overflow-hidden rounded-4xl w-full">
      <CardHeader>
        <CardTitle className="text-center text-xl font-bold">
          Connexion
        </CardTitle>
        <CardDescription>
          Veuillez remplir le formulaire ci-dessous pour vous connecter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-10 bg-gray-300 rounded-full"></div>
            <div className="h-10 bg-gray-300 rounded-full"></div>
            <div className="h-10 bg-gray-300 rounded-full"></div>
          </div>
          <div className="h-10 bg-gray-300 rounded-full mt-4 w-full animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  );
}
