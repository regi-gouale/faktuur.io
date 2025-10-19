'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createOrganizationAction } from '@/lib/actions/organization';
import { createOrganizationSchema } from '@/lib/schemas/organization';
import { generateSlug } from '@/lib/utils/slug';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { LogoUploader } from './logo-uploader';

type CreateOrganizationFormData = z.infer<typeof createOrganizationSchema>;

export function CreateOrganizationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedSlug, setGeneratedSlug] = useState('');

  const form = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: '',
      logo: '',
    },
  });

  const handleNameChange = (value: string) => {
    // Génère le slug en temps réel pendant que l'utilisateur tape
    if (value.trim()) {
      setGeneratedSlug(generateSlug(value));
    } else {
      setGeneratedSlug('');
    }
  };

  const onSubmit = async (data: CreateOrganizationFormData) => {
    setIsSubmitting(true);

    try {
      await createOrganizationAction(data);
      // La redirection est gérée dans la Server Action
    } catch (error) {
      console.error('Error creating organization:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l&apos;organisation</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex: Mon Entreprise"
                  onChange={(e) => {
                    field.onChange(e);
                    handleNameChange(e.target.value);
                  }}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Le nom de votre entreprise tel qu&apos;elle apparaîtra sur vos factures et devis.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo (optionnel)</FormLabel>
              <FormControl>
                <LogoUploader
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Ajoutez le logo de votre organisation depuis votre appareil ou via une URL.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {generatedSlug && (
          <div className="bg-muted/50 rounded-lg border p-4">
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground">URL de votre entreprise :</span>
              <code className="bg-background text-primary rounded px-2 py-0.5 font-mono">
                /dashboard/{generatedSlug}
              </code>
            </div>
          </div>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Création en cours...
            </>
          ) : (
            <>
              <Building2 className="mr-2 h-4 w-4" />
              Créer l&apos;organisation
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
