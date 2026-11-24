import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ProductForm } from "@/components/admin/ProductForm";
import { db } from "@/lib/db";
import { updateProductAction } from "../../actions";

export const instant = false;

export default async function EditProductPage({
  params,
}: PageProps<"/admin/products/[id]/edit">) {
  await connection();

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isSafeInteger(id) || id < 1) {
    notFound();
  }

  const product = await db.product.findUnique({
    where: { id },
    include: {
      images: {
        where: { isPrimary: true },
        orderBy: { sortOrder: "asc" },
      },
      scents: { select: { scentId: true } }, // Fetch currently assigned scents
    },
  });
  if (!product) {
    notFound();
  }

  const [categories, allScents] = await Promise.all([
    db.category.findMany({
      where: {
        OR: [{ isActive: true }, { id: product.categoryId }],
      },
      orderBy: { sortOrder: "asc" },
    }),
    db.scent.findMany({ orderBy: { name: "asc" } }),
  ]);

  const updateAction = updateProductAction.bind(null, product.id);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="text-sm font-medium text-rose-500 hover:text-rose-600"
        >
          Back to products
        </Link>
        <h1 className="mt-3 text-2xl font-display text-ink">Edit Product</h1>
      </div>
      <ProductForm
        categories={categories}
        allScents={allScents}
        initialData={product}
        action={updateAction}
      />
    </div>
  );
}