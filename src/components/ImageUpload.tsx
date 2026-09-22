import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CloudUpload,
  Image as ImageIcon,
  Loader2,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import type { ImageBucket } from "@/lib/storageImages";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface ImageUploadProps {
  bucket: ImageBucket;
  value: string | null;
  onChange: (url: string) => void;
  onRemove?: () => void;
  folder?: string;
  className?: string;
  label?: string;
}

function normalizeFolder(folder?: string) {
  if (!folder) return "";

  return folder
    .split("/")
    .filter(Boolean)
    .map((part) => part.replace(/[^a-zA-Z0-9_-]/g, "-"))
    .filter((part) => part && part !== "..")
    .join("/");
}

export function ImageUpload({
  bucket,
  value,
  onChange,
  onRemove,
  folder,
  className = "",
  label = "Upload de Imagem",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        toast.error("Use uma imagem JPG, PNG, WEBP ou GIF.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error("A imagem deve ter no máximo 5 MB.");
        return;
      }

      const fileExt = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const safeFolder = normalizeFolder(folder);
      const filePath = safeFolder ? `${safeFolder}/${fileName}` : fileName;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { cacheControl: "31536000", upsert: false });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath);

      onChange(publicUrl);
      toast.success("Imagem enviada com sucesso!");
    } catch (error: unknown) {
      console.error("Error uploading image:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao enviar imagem.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {value ? (
        <div className="group relative overflow-hidden rounded-xl border border-border">
          <img src={value} alt="Imagem enviada" className="max-h-[300px] w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
              Trocar
            </Button>
            {onRemove && (
              <Button type="button" variant="destructive" size="sm" onClick={onRemove}>
                Remover
              </Button>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 p-6 text-center transition-colors hover:border-muted-foreground/40"
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 size={32} className="mb-2 animate-spin text-muted-foreground" />
          ) : (
            <CloudUpload size={32} className="mb-2 text-muted-foreground" />
          )}
          <span className="text-sm font-medium text-foreground">
            {isUploading ? "Enviando..." : label}
          </span>
          <span className="mt-1 text-xs text-muted-foreground">JPG, PNG, WEBP ou GIF até 5 MB</span>
        </button>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept={ALLOWED_MIME_TYPES.join(",")}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
}

interface MultiImageUploadProps {
  bucket: ImageBucket;
  values?: string[];
  onChange: (urls: string[]) => void;
  onRemoveImage?: (url: string) => void;
  folder?: string;
  className?: string;
}

export function MultiImageUpload({
  bucket,
  values = [],
  onChange,
  onRemoveImage,
  folder,
  className = "",
}: MultiImageUploadProps) {
  const handleAdd = (url: string) => onChange([...values, url]);

  const handleRemove = (index: number) => {
    const url = values[index];
    onChange(values.filter((_, currentIndex) => currentIndex !== index));
    onRemoveImage?.(url);
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= values.length) return;

    const reordered = [...values];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    onChange(reordered);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {values.map((url, index) => (
          <div key={`${url}-${index}`} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
            <img src={url} alt={`Foto ${index + 1} da galeria`} className="h-full w-full object-cover" />
            <div className="absolute inset-x-2 bottom-2 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
              <div className="flex gap-1">
                <Button type="button" variant="secondary" size="icon" className="h-8 w-8" disabled={index === 0} onClick={() => moveImage(index, -1)} aria-label={`Mover foto ${index + 1} para trás`}>
                  <ArrowLeft size={15} />
                </Button>
                <Button type="button" variant="secondary" size="icon" className="h-8 w-8" disabled={index === values.length - 1} onClick={() => moveImage(index, 1)} aria-label={`Mover foto ${index + 1} para frente`}>
                  <ArrowRight size={15} />
                </Button>
              </div>
              <Button type="button" variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleRemove(index)} aria-label={`Remover foto ${index + 1}`}>
                <X size={15} />
              </Button>
            </div>
            <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white">{index + 1}</span>
          </div>
        ))}
        <ImageUpload
          bucket={bucket}
          folder={folder}
          value={null}
          onChange={handleAdd}
          label="Adicionar foto"
          className="aspect-square [&>button]:h-full [&>button]:p-2"
        />
      </div>
      {values.length > 1 && (
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <ImageIcon size={13} /> Use as setas sobre as fotos para alterar a ordem de exibição.
        </p>
      )}
    </div>
  );
}
