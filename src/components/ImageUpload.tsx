import { useState, useRef } from "react";
import { CloudUpload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploadProps {
    bucket: "avatars" | "destinations" | "packages" | "galleries";
    value: string | null;
    onChange: (url: string) => void;
    onRemove?: () => void;
    className?: string;
    label?: string;
}

export function ImageUpload({ bucket, value, onChange, onRemove, className = "", label = "Upload de Imagem" }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setIsUploading(true);
            const file = event.target.files?.[0];
            if (!file) return;

            // Validação básica
            if (!file.type.startsWith("image/")) {
                toast.error("Por favor, selecione apenas arquivos de imagem.");
                return;
            }

            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("A imagem deve ter no máximo 5MB.");
                return;
            }

            // Gera nome de arquivo único
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Faz upload para o Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            onChange(publicUrl);
            toast.success("Imagem enviada com sucesso!");
        } catch (error: any) {
            console.error("Error uploading image:", error);
            toast.error(error.message || "Erro ao enviar imagem.");
        } finally {
            setIsUploading(false);
            // Reseta o input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {value ? (
                <div className="relative group rounded-xl overflow-hidden border border-border">
                    <img
                        src={value}
                        alt="Uploaded representation"
                        className="w-full h-auto object-cover max-h-[300px]"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Trocar
                        </Button>
                        {onRemove && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={onRemove}
                            >
                                Remover
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-muted-foreground/40 transition-colors cursor-pointer bg-muted/20"
                >
                    {isUploading ? (
                        <Loader2 size={32} className="text-muted-foreground mb-2 animate-spin" />
                    ) : (
                        <CloudUpload size={32} className="text-muted-foreground mb-2" />
                    )}
                    <p className="text-sm font-medium text-foreground">
                        {isUploading ? "Enviando..." : label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG até 5MB
                    </p>
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                accept="image/*"
                className="hidden"
                disabled={isUploading}
            />
        </div>
    );
}

export function MultiImageUpload({ bucket, values = [], onChange, className = "" }: { bucket: "avatars" | "destinations" | "packages" | "galleries", values: string[], onChange: (urls: string[]) => void, className?: string }) {
    const handleAdd = (url: string) => {
        onChange([...values, url]);
    };

    const handleRemove = (index: number) => {
        const newValues = [...values];
        newValues.splice(index, 1);
        onChange(newValues);
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {values.map((url, index) => (
                    <div key={`${url}-${index}`} className="relative group rounded-lg overflow-hidden border border-border aspect-square">
                        <img
                            src={url}
                            alt={`Gallery image ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
                <ImageUpload
                    bucket={bucket}
                    value={null}
                    onChange={handleAdd}
                    label="Adicionar Foto"
                    className="aspect-square [&>div]:h-full [&>div]:p-2"
                />
            </div>
        </div>
    );
}
