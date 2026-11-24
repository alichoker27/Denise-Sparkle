"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PiCircleNotchLight, PiPlusLight, PiCheckCircleFill, PiTrashLight, PiWarningCircleLight } from "react-icons/pi";
import { Button } from "@/components/ui/Button";
import { Scent } from "@/generated/prisma/client";
import { createScentAction, deleteScentAction } from "./actions";

export function ScentManagerClient({ scents }: { scents: Scent[] }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  // State for the custom delete modal
  const [deleteTarget, setDeleteTarget] = useState<Scent | null>(null);
  
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    const result = await createScentAction(formData);
    
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      router.refresh(); 
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    
    setDeletingId(deleteTarget.id);
    setError(null);
    
    const result = await deleteScentAction(deleteTarget.id);
    
    if (result?.error) {
      setError(result.error);
      setDeletingId(null);
      setDeleteTarget(null);
    } else {
      setDeleteTarget(null);
      setDeletingId(null);
      router.refresh();
    }
  }

  return (
    <div className="space-y-8">
      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 animate-in fade-in slide-in-from-top-2">
          <PiCheckCircleFill className="h-5 w-5 text-green-500" />
          Scent added successfully!
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          name="name"
          placeholder="e.g. Vanille, Eghraa"
          required
          className="flex-1 rounded-xl border border-border-strong bg-white px-4 py-3 text-ink transition-colors focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
        />
        <Button type="submit" disabled={loading} className="sm:min-w-32">
          {loading ? (
            <PiCircleNotchLight className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <PiPlusLight className="mr-2 h-4 w-4" /> Add Scent
            </>
          )}
        </Button>
      </form>

      <div className="rounded-2xl border border-border bg-white p-2 shadow-sm">
        <ul className="divide-y divide-border">
          {scents.map((scent) => (
            <li key={scent.id} className="flex items-center justify-between px-4 py-3 text-sm text-ink">
              <span>{scent.name}</span>
              <button
                onClick={() => setDeleteTarget(scent)}
                disabled={deletingId === scent.id}
                className="p-2 text-ink-muted hover:text-red-500 transition-colors disabled:opacity-50"
                aria-label={`Delete ${scent.name}`}
              >
                {deletingId === scent.id ? (
                  <PiCircleNotchLight className="h-4 w-4 animate-spin" />
                ) : (
                  <PiTrashLight className="h-5 w-5" />
                )}
              </button>
            </li>
          ))}
          {scents.length === 0 && (
             <li className="px-4 py-3 text-sm text-ink-muted">No scents created yet.</li>
          )}
        </ul>
      </div>

      {/* Custom Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl animate-in zoom-in-95">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <PiWarningCircleLight className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-center font-display text-lg text-ink">Delete Scent</h3>
            <p className="mt-2 text-center text-sm text-ink-soft">
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>? It will be immediately removed from all products.
            </p>
            <div className="mt-6 flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => setDeleteTarget(null)}
                disabled={deletingId !== null}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-red-500 hover:bg-red-600 text-white" 
                onClick={confirmDelete}
                disabled={deletingId !== null}
              >
                {deletingId ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}