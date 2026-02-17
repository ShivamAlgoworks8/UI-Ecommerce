/**
 * Static product data array — serves as the mock "database"
 * for the entire application. Each product has a unique ID,
 * title, price, description, category, and a high-quality
 * Unsplash image URL for the product photo.
 */

const products = [
    {
        id: 1,
        title: "Classic Leather Backpack",
        price: 129.99,
        category: "Bags",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop",
        description:
            "Crafted from premium full-grain leather, this backpack blends timeless elegance with everyday utility. Features padded laptop compartment, multiple organizer pockets, and adjustable ergonomic straps for all-day comfort.",
    },
    {
        id: 2,
        title: "Minimalist Ceramic Watch",
        price: 249.99,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop",
        description:
            "A statement of refined simplicity. Japanese quartz movement, scratch-resistant sapphire glass, and a ceramic case that feels feather-light on the wrist. Water-resistant to 50 meters.",
    },
    {
        id: 3,
        title: "Wireless Noise-Cancelling Headphones",
        price: 349.99,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
        description:
            "Immerse yourself in pure sound. Adaptive noise cancellation, 30-hour battery life, and memory-foam ear cushions deliver studio-quality audio whether you're commuting or working from home.",
    },
    {
        id: 4,
        title: "Organic Cotton Hoodie",
        price: 89.99,
        category: "Clothing",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop",
        description:
            "Sustainably sourced 100% organic cotton with a brushed fleece interior. Relaxed fit, ribbed cuffs and hem, and a kangaroo pocket for warmth. Available in neutral earth tones.",
    },
    {
        id: 5,
        title: "Artisan Pour-Over Coffee Set",
        price: 64.99,
        category: "Kitchen",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop",
        description:
            "Elevate your morning ritual. Hand-blown borosilicate glass carafe, stainless-steel reusable filter, and olive-wood handle. Brews 4 cups of perfectly extracted coffee every time.",
    },
    {
        id: 6,
        title: "Premium Sunglasses",
        price: 159.99,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop",
        description:
            "Handcrafted acetate frames with polarized lenses that block 100% of UV rays. Lightweight, durable, and styled with a modern aviator silhouette. Includes a premium carrying case.",
    },
    {
        id: 7,
        title: "Scandinavian Desk Lamp",
        price: 119.99,
        category: "Home",
        image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=600&fit=crop",
        description:
            "Clean lines meet warm illumination. Adjustable arm with 3 color-temperature modes, touch-sensitive dimmer, and a solid oak base. Perfect for focused work or ambient reading light.",
    },
    {
        id: 8,
        title: "Slim Leather Wallet",
        price: 59.99,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop",
        description:
            "RFID-blocking vegetable-tanned leather in a slim bifold design. Six card slots, two bill compartments, and a hidden coin pocket — all in a profile thin enough for your front pocket.",
    },
];

export default products;
