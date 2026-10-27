
import { Link } from "react-router-dom";

function StarRating({ rating }) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    return (
        <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`h-3.5 w-3.5 ${
                        star <= fullStars || (star === fullStars + 1 && hasHalf)
                            ? "text-star"
                            : "text-gray-200"
                    }`}
                    fill={
                        star <= fullStars
                            ? "currentColor"
                            : star === fullStars + 1 && hasHalf
                              ? `url(#half-star-${productRatingId(rating)})`
                              : "currentColor"
                    }
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    {star === fullStars + 1 && hasHalf && (
                        <defs>
                            <linearGradient id={`half-star-${productRatingId(rating)}`}>
                                <stop offset="50%" stopColor="#f59e0b" />
                                <stop offset="50%" stopColor="#e5e7eb" />
                            </linearGradient>
                        </defs>
                    )}
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ))}
        </div>
    );
}

function productRatingId(rating) {
    return String(rating).replace(".", "-");
}

export default function ProductCard({
    product,
    onAddToCart,
    wishlist = [],
    onToggleWishlist,
    animationDelay = "",
}) {
    const isWishlisted = wishlist.some(
        (item) => String(item.id) === String(product.id)
    );

    const price = Number(product.price) || 0;
    const originalPrice = Number(product.originalPrice) || 0;

    const hasDiscount =
        originalPrice > price && originalPrice > 0;

    const discountPercent = hasDiscount
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    const stock = Number(product.stock);
    const isOutOfStock =
        product.inStock === false ||
        (product.stock !== undefined && stock <= 0);

    const imageUrl = product.image || "";

    return (
        <div
            className={`product-card group bg-white rounded-2xl overflow-hidden border border-border-light animate-fade-in-up ${animationDelay}`}
        >
            {/* Product Image */}
            <Link
                to={`/product/${product.id}`}
                aria-label={`View ${product.title}`}
            >
                <div className="relative overflow-hidden bg-surface-soft aspect-square">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={product.title || "Product"}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            onError={(event) => {
                                event.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm text-text-muted">
                            Image unavailable
                        </div>
                    )}

                    {hasDiscount && (
                        <span className="absolute top-3 left-3 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            -{discountPercent}%
                        </span>
                    )}

                    {isOutOfStock && (
                        <span className="absolute bottom-3 left-3 bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            Out of Stock
                        </span>
                    )}

                    {onToggleWishlist && (
                        <button
                            type="button"
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                onToggleWishlist(product);
                            }}
                            aria-label={
                                isWishlisted
                                    ? `Remove ${product.title} from wishlist`
                                    : `Add ${product.title} to wishlist`
                            }
                            aria-pressed={isWishlisted}
                            className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md transition-all duration-200 hover:scale-110 cursor-pointer ${
                                isWishlisted
                                    ? "text-accent"
                                    : "text-gray-300 hover:text-accent"
                            }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill={isWishlisted ? "currentColor" : "none"}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            </Link>

            {/* Product Information */}
            <div className="p-3 sm:p-4">
                <Link to={`/product/${product.id}`}>
                    {product.merchantName && (
                        <p className="text-xs text-primary mb-1 truncate">
                            {product.merchantName}
                        </p>
                    )}
                    <h3 className="text-sm font-semibold text-primary mb-1.5 hover:text-accent transition-colors duration-200 line-clamp-1 leading-tight">
                        {product.title || "Untitled Product"}
                    </h3>
                </Link>

                {Number(product.rating) > 4.5 && (
                    <div className="flex items-center gap-1.5 mb-2">
                        <StarRating rating={Number(product.rating)} />
                        <span className="text-xs font-medium text-star">
                            {product.rating}
                        </span>
                        <span className="text-xs text-text-muted">
                            ({Number(product.reviewCount) || 0})
                        </span>
                    </div>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-base font-bold text-primary">
                        {product.maxPrice
                            ? `₹${price.toLocaleString("en-IN")}–₹${Number(
                                  product.maxPrice
                              ).toLocaleString("en-IN")}`
                            : `₹${price.toLocaleString("en-IN")}`}
                    </span>

                    {hasDiscount && (
                        <span className="text-xs text-text-muted line-through">
                            ₹{originalPrice.toLocaleString("en-IN")}
                        </span>
                    )}
                </div>

                {/* Color Swatches */}
                {Array.isArray(product.colors) && product.colors.length > 0 && (
                    <div className="flex items-center gap-1.5 mb-3">
                        {product.colors.map((color, index) => (
                            <span
                                key={`${color}-${index}`}
                                className="color-swatch"
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                )}

                {/* Add to Cart */}
                <button
                    type="button"
                    id={`add-to-cart-${product.id}`}
                    onClick={() => {
                        if (!isOutOfStock && onAddToCart) {
                            onAddToCart(product);
                        }
                    }}
                    disabled={isOutOfStock || !onAddToCart}
                    className={`btn-cart ${
                        isOutOfStock || !onAddToCart
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                    }`}
                >
                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </button>
            </div>
        </div>
    );
}
