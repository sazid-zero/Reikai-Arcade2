import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getAdminSession } from '@lib/admin-auth'
import { NewProductForm } from './new-product-form'

export default async function NewProductPage() {
  const session = await getAdminSession()
  if (!session?.user) redirect('/admin/sign-in')

  return (
    <main className="site-shell min-h-screen px-5 py-8 md:px-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/admin/products" className="text-sm text-primary hover:underline">
          ← Products
        </Link>
        <h1 className="mt-5 text-4xl font-bold">Add Product</h1>
        <p className="mt-2 text-muted-foreground">
          Create a game or accessory with local image upload. You can configure editions and variants right after saving.
        </p>

        <NewProductForm />
      </div>
    </main>
  )
}
