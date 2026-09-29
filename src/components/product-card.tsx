'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/products';
import { formatTaka } from '@/lib/products';

type ProductCardProps = {
  product: Product;
  href?: string;
  onAdd: (product: Product) => void;
};

export function ProductCard({ product, href, onAdd }: ProductCardProps) {
  const image = product.coverImage || '/covers/elden-ring.jpg';
  const badge = product.discountBadge || product.badge;

  const content = (
    <>
      <div className="standard-product-card__image-wrap">
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
          className="standard-product-card__image"
        />
        {badge && (
          <span className="standard-product-card__badge">
            {badge}
          </span>
        )}
      </div>
      <div className="standard-product-card__body">
        <p className="standard-product-card__category">{product.label}</p>
        <h3 className="standard-product-card__name" title={product.name}>{product.name}</h3>
        <div className="standard-product-card__footer">
          <span className="standard-product-card__price">{formatTaka(product.price)}</span>
          <button
            type="button"
            className="standard-product-card__button"
            onClick={(event) => {
              event.preventDefault();
              onAdd(product);
            }}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={13} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </>
  );

  return href ? (
    <Link href={href} className="standard-product-card" data-testid={`card-product-${product.id}`}>
      {content}
    </Link>
  ) : (
    <article className="standard-product-card" data-testid={`card-product-${product.id}`}>
      {content}
    </article>
  );
}
