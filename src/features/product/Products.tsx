import { useEffect, useState } from "react";
import "./Products.css";
import type { MerchantData } from "../../App";
import Pagination from "../../components/commonfeature/pagination";

type ProductData = {
  id: number;
  merchant: string;
  productName: string;
  price: number;
  stock: number;
  description: string;
  productType: string;
  status: string;
  image: string;
};

type ProductProps = {
  merchants: MerchantData[];
};

function Products({ merchants }: ProductProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(
    null
  );

  // Product form fields
  const [merchant, setMerchant] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [productType, setProductType] = useState("");
  const [status, setStatus] = useState("Available");
  const [image, setImage] = useState("");

  // Product listing
  const [products, setProducts] = useState<ProductData[]>(() => {
    const savedProducts = localStorage.getItem("nexora_products");

    if (!savedProducts) {
      return [];
    }

    try {
      return JSON.parse(savedProducts);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "nexora_products",
      JSON.stringify(products)
    );
  }, [products]);

  // Search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const openAddModal = () => {
    setIsEditMode(false);
    setEditingProductId(null);

    setMerchant("");
    setProductName("");
    setPrice("");
    setStock("");
    setDescription("");
    setProductType("");
    setStatus("Available");
    setImage("");

    setIsModalOpen(true);
  };

  const openEditModal = (product: ProductData) => {
    setIsEditMode(true);
    setEditingProductId(product.id);

    setMerchant(product.merchant);
    setProductName(product.productName);
    setPrice(String(product.price));
    setStock(String(product.stock));
    setDescription(product.description);
    setProductType(product.productType);
    setStatus(product.status);
    setImage(product.image);

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingProductId(null);
  };

  const handleSubmitProduct = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isEditMode && editingProductId !== null) {
      setProducts((previousProducts) =>
        previousProducts.map((product) =>
          product.id === editingProductId
            ? {
                ...product,
                merchant,
                productName,
                price: Number(price),
                stock: Number(stock),
                description,
                productType,
                status,
                image,
              }
            : product
        )
      );
    } else {
      const newProduct: ProductData = {
        id: Date.now(),
        merchant,
        productName,
        price: Number(price),
        stock: Number(stock),
        description,
        productType,
        status,
        image,
      };

      setProducts((previousProducts) => [
        ...previousProducts,
        newProduct,
      ]);
    }

    setMerchant("");
    setProductName("");
    setPrice("");
    setStock("");
    setDescription("");
    setProductType("");
    setStatus("Available");
    setImage("");

    closeModal();
  };

  const handleDeleteProduct = (productId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    setProducts((previousProducts) =>
      previousProducts.filter(
        (product) => product.id !== productId
      )
    );
  };

  // Search and Filter
  const filteredProducts = products.filter((product) => {
    const searchValue = searchTerm.toLowerCase();

    const matchesSearch =
      product.productName.toLowerCase().includes(searchValue) ||
      product.merchant.toLowerCase().includes(searchValue) ||
      product.productType.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "All" ||
      product.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const startIndex =
    (currentPage - 1) * productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-page-eyebrow">Management</p>

          <h2>Products</h2>

          <p className="admin-page-description">
            View and manage products in your store.
          </p>
        </div>

        <button
          className="admin-primary-button"
          onClick={openAddModal}
        >
          Add Product
        </button>
      </div>

      <section className="admin-page-card">
        <div className="admin-page-card-header">
          <div>
            <h3>Products</h3>

            <p>
              Products added to your store will appear here.
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <strong>No products yet</strong>

            <span>
              Once products are added, you will be able to view and
              manage them here.
            </span>
          </div>
        ) : (
          <>
            <div className="product-filters">
              <div className="product-search">
                <input
                  type="text"
                  placeholder="Search product..."
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="product-status-filter">
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="All">All Status</option>
                  <option value="Available">Available</option>
                  <option value="NA">NA</option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="empty-state">
                <strong>No products found</strong>

                <span>
                  Try changing your search or filter.
                </span>
              </div>
            ) : (
              <div className="product-table-wrapper">
                <table className="product-table">
                  <thead>
                    <tr>
                      <th>Merchant</th>
                      <th>Product Name</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Product Type</th>
                      <th>Status</th>
                      <th>Image</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.merchant}</td>

                        <td>{product.productName}</td>

                        <td>₹{product.price}</td>

                        <td>{product.stock}</td>

                        <td>{product.productType}</td>

                        <td>
                          <span
                            className={`product-status ${
                              product.status === "Available"
                                ? "available"
                                : "not-available"
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>

                        <td>
                          {product.image ? (
                            <span className="product-image-name">
                              {product.image}
                            </span>
                          ) : (
                            <span className="no-image">
                              No image
                            </span>
                          )}
                        </td>

                        <td>
                          <div className="product-action-buttons">
                            <button
                              className="product-edit-button"
                              onClick={() =>
                                openEditModal(product)
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="product-delete-button"
                              onClick={() =>
                                handleDeleteProduct(product.id)
                              }
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
            )}
          </>
        )}
      </section>

      {filteredProducts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {isModalOpen && (
        <div className="product-modal-overlay">
          <div className="product-modal">
            <div className="product-modal-header">
              <h3>
                {isEditMode ? "Edit Product" : "Add Product"}
              </h3>

              <button
                className="product-modal-close"
                onClick={closeModal}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form
              className="product-form"
              onSubmit={handleSubmitProduct}
            >
              <div className="product-form-field">
                <label htmlFor="merchant">
                  Merchant
                </label>

                <select
                  id="merchant"
                  value={merchant}
                  onChange={(event) =>
                    setMerchant(event.target.value)
                  }
                  required
                >
                  <option value="">
                    Select merchant
                  </option>

                  {merchants.map((merchant) => (
                    <option
                      key={merchant.id}
                      value={merchant.merchantName}
                    >
                      {merchant.merchantName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="product-form-field">
                <label htmlFor="productName">
                  Product Name
                </label>

                <input
                  id="productName"
                  type="text"
                  value={productName}
                  onChange={(event) =>
                    setProductName(event.target.value)
                  }
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="product-form-row">
                <div className="product-form-field">
                  <label htmlFor="price">
                    Price
                  </label>

                  <input
                    id="price"
                    type="number"
                    min="0"
                    value={price}
                    onChange={(event) =>
                      setPrice(event.target.value)
                    }
                    placeholder="Enter price"
                    required
                  />
                </div>

                <div className="product-form-field">
                  <label htmlFor="stock">
                    Stock / Inventory
                  </label>

                  <input
                    id="stock"
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(event) =>
                      setStock(event.target.value)
                    }
                    placeholder="Enter stock"
                    required
                  />
                </div>
              </div>

              <div className="product-form-field">
                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Enter product description"
                  rows={4}
                  required
                />
              </div>

              <div className="product-form-field">
                <label htmlFor="productType">
                  Product Type
                </label>

                <select
                  id="productType"
                  value={productType}
                  onChange={(event) =>
                    setProductType(event.target.value)
                  }
                  required
                >
                  <option value="">
                    Select product type
                  </option>

                  <option value="Electronics">
                    Electronics
                  </option>

                  <option value="Clothing">
                    Clothing
                  </option>

                  <option value="Grocery">
                    Grocery
                  </option>

                  <option value="Home & Living">
                    Home & Living
                  </option>
                </select>
              </div>

              <div className="product-form-field">
                <label htmlFor="productStatus">
                  Status
                </label>

                <select
                  id="productStatus"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                >
                  <option value="Available">
                    Available
                  </option>

                  <option value="NA">
                    NA
                  </option>
                </select>
              </div>

              <div className="product-form-field">
                <label htmlFor="productImage">
                  Images
                </label>

                <input
                  id="productImage"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];

                    if (file) {
                      setImage(file.name);
                    }
                  }}
                />
              </div>

              <div className="product-form-actions">
                <button
                  type="button"
                  className="product-cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                >
                  {isEditMode
                    ? "Update Product"
                    : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Products;