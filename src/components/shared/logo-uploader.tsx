'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { ImageIcon, Link2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

interface LogoUploaderProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function LogoUploader({ value, onChange, disabled }: LogoUploaderProps) {
  const [logoUrl, setLogoUrl] = useState(value || '');
  const [urlInput, setUrlInput] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérification du type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }

    // Vérification de la taille (max 1MB)
    if (file.size > 1 * 1024 * 1024) {
      alert("L'image doit faire moins de 1 MB");
      return;
    }

    // Conversion en Data URL pour prévisualisation
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setLogoUrl(result);
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;

    // Validation basique de l'URL
    try {
      new URL(urlInput);
      setLogoUrl(urlInput);
      onChange(urlInput);
    } catch {
      alert('Veuillez entrer une URL valide');
    }
  };

  const handleRemove = () => {
    setLogoUrl('');
    setUrlInput('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Prévisualisation du logo */}
      {logoUrl && (
        <div className="relative mx-auto h-32 w-32">
          <div className="border-muted-foreground/25 bg-muted/50 relative h-full w-full overflow-hidden rounded-lg border-2 border-dashed">
            <Image
              src={logoUrl}
              alt="Logo de l'organisation"
              fill
              className="object-contain p-2"
              unoptimized={logoUrl.startsWith('data:')}
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Onglets pour choisir la méthode */}
      {!logoUrl && (
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'upload' | 'url')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" disabled={disabled}>
              <Upload className="mr-2 h-4 w-4" />
              Télécharger
            </TabsTrigger>
            <TabsTrigger value="url" disabled={disabled}>
              <Link2 className="mr-2 h-4 w-4" />
              URL
            </TabsTrigger>
          </TabsList>

          {/* Tab: Upload depuis l'appareil */}
          <TabsContent value="upload" className="space-y-4">
            <div className="flex flex-col items-center justify-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="logo-file-input"
                disabled={disabled}
              />
              <Label
                htmlFor="logo-file-input"
                className={cn(
                  'hover:bg-muted/50 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors',
                  disabled && 'cursor-not-allowed opacity-50'
                )}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="text-muted-foreground mb-2 h-8 w-8" />
                  <p className="text-muted-foreground px-4 text-center text-sm">
                    <span className="font-semibold">Cliquez pour télécharger</span> ou
                    glissez-déposez
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">PNG, JPG, SVG (max. 1MB)</p>
                </div>
              </Label>
            </div>
          </TabsContent>

          {/* Tab: URL externe */}
          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo-url">URL du logo</Label>
              <div className="flex gap-2">
                <Input
                  id="logo-url"
                  type="url"
                  placeholder="https://exemple.com/logo.png"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleUrlSubmit();
                    }
                  }}
                  disabled={disabled}
                />
                <Button
                  type="button"
                  onClick={handleUrlSubmit}
                  disabled={!urlInput.trim() || disabled}
                >
                  Valider
                </Button>
              </div>
              <p className="text-muted-foreground text-xs">
                Entrez l&apos;URL complète de votre logo (doit commencer par https://)
              </p>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
