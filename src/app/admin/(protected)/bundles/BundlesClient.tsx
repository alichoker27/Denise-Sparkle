"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PiPackageLight,
  PiPencilSimpleLight,
  PiPlusLight,
  PiTrashLight,
  PiWarningLight,
} from "react-icons/pi";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { deleteBundleAction } from "./actions";
import { Bundle, BundleItem } from "@/generated/prisma/client";

interface BundleWithItems extends Bundle {
  items: BundleItem[];
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-pill px-2.5 py-1 text-xs font-semibold ${
        status === "PUBLISHED"
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

export default function BundlesClient({
  bundles,
}: {
  bundles: BundleWithItems[];
}) {
  const [bundleToDelete, setBundleToDelete] = useState<
    Pick<Bundle, "id" | "name"> | null
  >(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const deleteTriggerRef = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!bundleToDelete) return;

    cancelButtonRef.current?.focus();
    return () => {
      deleteTriggerRef.current?.focus();
    };
  }, [bundleToDelete]);

  useEffect(() => {
    if (!bundleToDelete) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && deletingId === null) {
        setBundleToDelete(null);
        setError(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [bundleToDelete, deletingId]);

  function keepFocusInsideDialog(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key !== "Tab") return;
    if (deletingId !== null) {
      event.preventDefault();
      return;
    }

    if (event.shiftKey && document.activeElement === cancelButtonRef.current) {
      event.preventDefault();
      confirmButtonRef.current?.focus();
    } else if (
      !event.shiftKey &&
      document.activeElement === confirmButtonRef.current
    ) {
      event.preventDefault();
      cancelButtonRef.current?.focus();
    }
  }

  async function handleDelete() {
    if (!bundleToDelete) return;

    const bundleId = bundleToDelete.id;
    setDeletingId(bundleId);
    setError(null);

    try {
      await deleteBundleAction(bundleId);
      setBundleToDelete(null);
      router.refresh();
    } catch (deleteError) {
      console.error("Failed to delete bundle:", deleteError);
      setError("We couldn't delete this bundle. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  function closeDeleteDialog() {
    if (deletingId !== null) return;
    setBundleToDelete(null);
    setError(null);
  }

  function openDeleteDialog(
    event: React.MouseEvent<HTMLButtonElement>,
    bundle: BundleWithItems,
  ) {
    deleteTriggerRef.current = event.currentTarget;
    setError(null);
    setBundleToDelete({ id: bundle.id, name: bundle.name });
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-display leading-tight text-ink">
            Bundles
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Manage your collections ({bundles.length} total)
          </p>
        </div>
        <Button href="/admin/bundles/new" className="w-full sm:w-auto">
          <span className="inline-flex items-center justify-center gap-2">
            <PiPlusLight className="h-4 w-4" aria-hidden="true" />
            Add new bundle
          </span>
        </Button>
      </header>

      {error && !bundleToDelete && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      {bundles.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white px-6 py-16 text-center shadow-sm">
          <span
            className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blush-100 text-ink"
            aria-hidden="true"
          >
            <PiPackageLight className="h-7 w-7" />
          </span>
          <h2 className="mb-2 text-xl font-display text-ink">
            No bundles yet
          </h2>
          <p className="mb-6 text-sm text-ink-muted">
            Create your first bundle from published products.
          </p>
          <Button href="/admin/bundles/new">Add new bundle</Button>
        </div>
      ) : (
        <>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:hidden">
            {bundles.map((bundle) => (
              <li
                key={bundle.id}
                className="rounded-2xl border border-border bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 break-words font-medium text-ink">
                    {bundle.name}
                  </p>
                  <StatusBadge status={bundle.status} />
                </div>
                <p className="mt-1 text-sm text-ink-soft">
                  {bundle.items.length}{" "}
                  {bundle.items.length === 1 ? "product" : "products"}
                </p>
                <p className="mt-3 text-lg font-medium text-ink">
                  {formatPrice(bundle.priceCents)}
                </p>

                <div className="mt-4 flex gap-3 border-t border-border pt-4">
                  <Link
                    href={`/admin/bundles/${bundle.id}/edit`}
                    className="focus-ring inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-pill border border-border-strong px-4 text-sm font-medium text-rose-500 transition-colors hover:bg-blush-50 hover:text-rose-600"
                  >
                    <PiPencilSimpleLight
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={(event) => openDeleteDialog(event, bundle)}
                    aria-label={`Delete ${bundle.name}`}
                    className="focus-ring inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-pill border border-border-strong px-4 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                  >
                    <PiTrashLight className="h-4 w-4" aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-hidden rounded-2xl border border-border bg-white shadow-sm lg:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-blush-50 font-medium text-ink">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Bundle
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Products
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bundles.map((bundle) => (
                  <tr
                    key={bundle.id}
                    className="transition-colors hover:bg-surface-soft/50"
                  >
                    <td className="px-6 py-4 font-medium text-ink">
                      {bundle.name}
                    </td>
                    <td className="px-6 py-4 text-ink-soft">
                      {bundle.items.length}{" "}
                      {bundle.items.length === 1 ? "item" : "items"}
                    </td>
                    <td className="px-6 py-4 text-ink-soft">
                      {formatPrice(bundle.priceCents)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={bundle.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-4">
                        
                        <button
                          type="button"
                          onClick={(event) =>
                            openDeleteDialog(event, bundle)
                          }
                          aria-label={`Delete ${bundle.name}`}
                          className="focus-ring rounded font-medium text-red-500 transition-colors hover:text-red-700 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {bundleToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/45 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeDeleteDialog();
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-busy={deletingId !== null}
            aria-labelledby="delete-bundle-title"
            aria-describedby="delete-bundle-description"
            className="my-auto w-full max-w-md overflow-hidden rounded-3xl border border-blush-100 bg-white shadow-2xl"
            onKeyDown={keepFocusInsideDialog}
          >
            <div className="flex items-start gap-4 p-6 sm:p-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <PiWarningLight
                  aria-hidden="true"
                  className="h-6 w-6"
                />
              </div>
              <div className="min-w-0 pt-1">
                <h2
                  id="delete-bundle-title"
                  className="text-xl font-display text-ink"
                >
                  Remove this bundle?
                </h2>
                <p
                  id="delete-bundle-description"
                  className="mt-2 text-sm leading-6 text-ink-soft"
                >
                  You’re about to delete{" "}
                  <span className="font-semibold text-ink">
                    {bundleToDelete.name}
                  </span>
                  . This action can’t be undone.
                </p>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="mx-6 mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:mx-8"
              >
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-border bg-surface-soft/70 p-6 sm:flex-row sm:justify-end sm:p-8">
              <button
                ref={cancelButtonRef}
                type="button"
                onClick={closeDeleteDialog}
                aria-disabled={deletingId !== null}
                className="rounded-pill border border-border-strong bg-white px-5 py-3 text-sm font-medium text-ink-soft transition-colors hover:bg-blush-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 aria-disabled:cursor-not-allowed aria-disabled:opacity-60"
              >
                Keep bundle
              </button>
              <button
                ref={confirmButtonRef}
                type="button"
                onClick={() => {
                  if (deletingId === null) void handleDelete();
                }}
                aria-disabled={deletingId !== null}
                className="inline-flex items-center justify-center gap-2 rounded-pill bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-60"
              >
                <PiTrashLight aria-hidden="true" size={16} />
                {deletingId === bundleToDelete.id
                  ? "Removing..."
                  : "Delete bundle"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
