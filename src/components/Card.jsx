import React, { useEffect, useMemo, useState } from 'react';
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import ImageSwiper from "./ImageSwiper";


function Card({ product, addProduct }) {
    const variants = useMemo(() => {
        const p = product ?? {};

        if (Array.isArray(p.variants) && p.variants.length > 0) {
            return p.variants
                .map(v => ({
                    id: v.id ?? String(v.name ?? 'variant'),
                    name: v.name ?? 'Variant',
                    images: (v.images || []).filter(Boolean),
                }))
                .filter(v => v.images.length > 0);
        }

        const fallbackImages = Array.isArray(p.images) && p.images.length > 0
            ? p.images
            : [p.image].filter(Boolean);

        return [{
            id: 'default',
            name: 'Default',
            images: fallbackImages,
        }];
    }, [product]);

    const [variantIndex, setVariantIndex] = useState(0);
    const [imageIndex, setImageIndex] = useState(0);
    const isOutOfStock = product?.stock === 0; // I would add more logic here if had more time

    // Keep image index in sync when variant changes
    useEffect(() => {
        setImageIndex(0);
    }, [variantIndex]);

    useEffect(() => {
        if (variantIndex >= variants.length) {
            setVariantIndex(0);
        }
    }, [variants.length, variantIndex]);

    if (!product) return null;

    const currentVariant = variants[variantIndex] || { images: [], name: 'Default' };
    const images = currentVariant.images || [];
    const currentImage = images[imageIndex];

    const slides = Array.isArray(product?.variants) && product.variants.length
        ? product.variants
            .map((v) => (Array.isArray(v.images) && v.images.length ? v.images[0] : product.image))
            .filter(Boolean)
        : [product?.image].filter(Boolean);

    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card h-100 text-center shadow">
                <div className="p-3">
                    {currentImage ? (
                        <ImageSwiper images={slides} alt={product?.title || "Product image"} />

                    ) : (
                        <div className="d-flex align-items-center justify-content-center w-100 h-100 text-muted">
                            No image
                        </div>
                    )}
                </div>

                <div className="card-body">
                    <h5 className="card-title mb-2 text-truncate" title={product.title}>
                        {product.title}
                    </h5>
                    <p className="card-text text-muted mb-3" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {product.description}
                    </p>
                </div>

                <ul className="list-group list-group-flush">
                    <li className="list-group-item lead">$ {product.price}</li>
                </ul>

                <div className="card-body d-grid gap-2 d-sm-flex justify-content-sm-center">
                    <Link to={`/product/${product.id}`} className="btn btn-dark">
                        Buy Now
                    </Link>

                    <button
                        type="button"
                        onClick={() => {
                            toast.success("Added to cart");
                            addProduct({
                                ...product,
                                selectedVariant: variants[variantIndex],
                                selectedImage: currentImage
                            });
                        }}
                        disabled={isOutOfStock}
                        aria-disabled={isOutOfStock}
                        className={`btn ${isOutOfStock ? "btn-disabled" : "btn-dark"}`}
                        title={isOutOfStock ? "Limit reached for this product" : "Add to cart"}
                    >
                        {isOutOfStock ? "Out of stock" : "Add to cart"}
                    </button>

                </div>
            </div>
        </div>
    );
}

export default Card;