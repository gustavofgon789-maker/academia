import { useState, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Upload, Star, Trash2, GripVertical } from 'lucide-react';
import { api, imageUrl } from '@/lib/api';
import type { VehicleImage } from '@/types';

export default function ImageUploader({
  vehicleId,
  images,
  onChange,
}: {
  vehicleId: string;
  images: VehicleImage[];
  onChange: (next: VehicleImage[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append('images', f));
      const { data } = await api.post<VehicleImage[]>(`/admin/vehicles/${vehicleId}/images`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange([...images, ...data].sort((a, b) => a.sort_order - b.sort_order));
    } catch (e) {
      alert('Erro ao enviar imagens. Verifique o tamanho (máx. 5MB) e formato (JPG/PNG/WebP).');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const setMain = async (id: string) => {
    try {
      await api.patch(`/admin/vehicle-images/${id}/main`);
      onChange(images.map((img) => ({ ...img, is_main: img.id === id })));
    } catch {
      alert('Erro ao definir imagem principal');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Remover esta imagem?')) return;
    try {
      await api.delete(`/admin/vehicle-images/${id}`);
      onChange(images.filter((img) => img.id !== id));
    } catch {
      alert('Erro ao remover');
    }
  };

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = images.findIndex((i) => i.id === active.id);
    const newIndex = images.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(images, oldIndex, newIndex).map((img, idx) => ({
      ...img,
      sort_order: idx,
    }));
    onChange(reordered);
    try {
      await api.patch(`/admin/vehicle-images/reorder`, {
        images: reordered.map((img) => ({ id: img.id, sort_order: img.sort_order })),
      });
    } catch {
      alert('Erro ao reordenar');
    }
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="cursor-pointer rounded-xl border-2 border-dashed border-border-light bg-bg-800 p-8 text-center transition-colors hover:border-accent/50"
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={28} className="mx-auto text-white/50" />
        <div className="mt-3 text-sm font-semibold">
          {uploading ? 'Enviando...' : 'Clique ou arraste imagens aqui'}
        </div>
        <div className="mt-1 text-xs text-white/40">JPG, PNG ou WebP · até 5MB cada</div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={images.map((i) => i.id)} strategy={rectSortingStrategy}>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {images.map((img) => (
                <SortableImage
                  key={img.id}
                  img={img}
                  onMain={() => setMain(img.id)}
                  onRemove={() => remove(img.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

function SortableImage({
  img,
  onMain,
  onRemove,
}: {
  img: VehicleImage;
  onMain: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: img.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className={`group relative aspect-[4/3] overflow-hidden rounded-lg border-2 bg-bg-800 ${
        img.is_main ? 'border-accent' : 'border-border'
      }`}
    >
      <img src={imageUrl(img.image_url)} alt="" className="h-full w-full object-cover" />

      <button
        {...attributes}
        {...listeners}
        className="absolute left-1.5 top-1.5 rounded-md bg-black/70 p-1 text-white/80 opacity-0 transition-opacity group-hover:opacity-100"
        title="Arrastar para reordenar"
      >
        <GripVertical size={14} />
      </button>

      {img.is_main && (
        <span className="badge absolute bottom-1.5 left-1.5 bg-accent text-white">Principal</span>
      )}

      <div className="absolute right-1.5 top-1.5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {!img.is_main && (
          <button
            onClick={onMain}
            className="rounded-md bg-black/70 p-1.5 text-amber-400 hover:bg-black/90"
            title="Definir como principal"
          >
            <Star size={14} />
          </button>
        )}
        <button
          onClick={onRemove}
          className="rounded-md bg-black/70 p-1.5 text-red-400 hover:bg-black/90"
          title="Remover"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
