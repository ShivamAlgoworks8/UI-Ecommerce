import { startTransition, useEffect, useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Plus,
  Trash2,
} from "lucide-react";

import {
  AdminPage,
  AdminPageHeader,
  EmptyState,
} from "@/components/admin/AdminPage";
import DataTable from "@/components/admin/DataTable";
import FormDrawer from "@/components/admin/FormDrawer";
import StatusPill from "@/components/admin/StatusPill";
import Toast from "@/components/admin/Toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import Pagination from "@/components/common/Pagination";

import type { MerchantData } from "@/features/merchant/types";
import type { ProductData } from "@/features/product/types";
import type { CreateRequest } from "@/app/types";
import { API_BASE_URL } from "@/lib/api";
import { formatINR } from "@/lib/utils";

// Products with stock at or below this value are low-stock.
const LOW_STOCK_THRESHOLD = 5;

// Structure returned by the Spring Boot Product entity.
type BackendProduct = {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string | null;
  productType: string | null;
  merchantName: string | null;
  imageUrl: string | null;
};

// Props received from the parent admin component.
type ProductProps = {
  merchants: MerchantData[];
  categories: string[];
  products: ProductData[];
  setProducts: Dispatch<SetStateAction<ProductData[]>>;
  searchTerm: string;
  createRequest: CreateRequest | null;
  onCreateRequestHandled: (id: number) => void;
};

function Products({
  merchants,
  products,
  setProducts,
  searchTerm,
  createRequest,
  onCreateRequestHandled,
}: ProductProps) {
  // Drawer and editing state.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProductId, setEditingProductId] =
    useState<string | null>(null);

  // Product form values.
  const [merchant, setMerchant] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [productType, setProductType] = useState("");
  const [status, setStatus] = useState("Available");
  const [image, setImage] = useState("");

  // Notifications, selection and bulk stock input.
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [bulkStock, setBulkStock] = useState("");

  // Loading state prevents repeated submissions.
  const [isSaving, setIsSaving] = useState(false);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Search/filter and pagination settings.
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  // Sorting configuration.
  const [sortField, setSortField] = useState<
    "productName" | "price" | "stock" | "productType" | null
  >(null);
  const [sortDirection, setSortDirection] =
    useState<"asc" | "desc">("asc");

  // Convert the backend response into the frontend product structure.
  const mapBackendProduct = (item: BackendProduct): ProductData => ({
    id: item.id,
    merchant: item.merchantName ?? "",
    productName: item.name,
    price: item.price,
    stock: item.stock,
    description: item.description ?? "",
    productType: item.productType ?? "",
    status: item.stock > 0 ? "Available" : "NA",
    image: item.imageUrl ?? "",
  });

  // Fetch products from Spring Boot when the page loads.
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data: BackendProduct[] = await response.json();

        if (isMounted) {
          setProducts(data.map(mapBackendProduct));
        }
      } catch (error) {
        console.error("Error fetching products:", error);

        if (isMounted) {
          setToastMessage("Unable to load products from backend");
        }
      }
    };

    void fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [setProducts]);

  // Reset the form and open the Add Product drawer.
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

  // Handle Add Product requests triggered elsewhere in the admin portal.
  useEffect(() => {
    if (createRequest?.page !== "products") return;

    startTransition(() => {
      openAddModal();
      onCreateRequestHandled(createRequest.id);
    });
  }, [createRequest, onCreateRequestHandled]);

  // Populate the form with the selected product's current values.
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

  // Close the drawer and reset editing identifiers.
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingProductId(null);
  };

  // Submit the form to create or update a product in MongoDB.
  const handleSubmitProduct = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    // Validate required fields, including merchant selection.
    if (
      !merchant ||
      !productName.trim() ||
      !price.trim() ||
      !stock.trim() ||
      !description.trim() ||
      !productType.trim()
    ) {
      setToastMessage("Please complete all required fields");
      return;
    }

    // Match the backend DTO validation rules.
    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0 ||
      !Number.isFinite(numericStock) ||
      !Number.isInteger(numericStock) ||
      numericStock < 0
    ) {
      setToastMessage(
        "Price must be greater than zero and stock must be a non-negative integer",
      );
      return;
    }

    // These property names match ProductRequestDTO.java.
    const requestBody = {
      name: productName.trim(),
      price: numericPrice,
      stock: numericStock,
      description: description.trim(),
      productType,
      merchantName: merchant,
      imageUrl: image.trim(),
    };

    setIsSaving(true);

    try {
      // Update the selected product.
      if (isEditMode && editingProductId !== null) {
        const response = await fetch(
          `${API_BASE_URL}/api/products/${editingProductId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          },
        );

        if (!response.ok) {
          const message = await response.text();

          throw new Error(
            message || "Failed to update product",
          );
        }

        const updatedProduct: BackendProduct = await response.json();

        // Use the saved backend response to update the UI.
        const mappedProduct = mapBackendProduct(updatedProduct);

        setProducts((previous) =>
          previous.map((product) =>
            product.id === editingProductId
              ? mappedProduct
              : product,
          ),
        );

        closeModal();
        setToastMessage("Product updated successfully");
        return;
      }

      // Create a new product in the backend.
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message || "Failed to create product",
        );
      }

      const savedProduct: BackendProduct = await response.json();

      // Append the saved product, including its MongoDB ID.
      const newProduct = mapBackendProduct(savedProduct);

      setProducts((previous) => [...previous, newProduct]);

      closeModal();
      setCurrentPage(1);
      setToastMessage("Product added successfully");
    } catch (error) {
      console.error("Error saving product:", error);

      setToastMessage(
        error instanceof Error
          ? error.message
          : "Failed to save product",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Delete one product through the backend API.
  const handleDeleteProduct = async (productId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products/${productId}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        let message = "Failed to delete product";
        try {
          const errJson = await response.json();
          message = errJson.message || errJson.error || message;
        } catch {
          const text = await response.text();
          if (text) message = text;
        }
        throw new Error(message);
      }

      const deleted: boolean = await response.json();

      if (deleted !== true) {
        throw new Error("Product could not be deleted");
      }

      // Remove the row only after backend deletion succeeds.
      setProducts((previous) =>
        previous.filter((product) => product.id !== productId),
      );

      setSelectedProductIds((previous) =>
        previous.filter((id) => id !== productId),
      );

      setToastMessage("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);

      setToastMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete product",
      );
    }
  };

  // Select or deselect one product.
  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((previous) =>
      previous.includes(productId)
        ? previous.filter((id) => id !== productId)
        : [...previous, productId],
    );
  };

  // Select or deselect all products visible on the current page.
  const toggleVisibleProducts = () => {
    const visibleIds = currentProducts.map((product) => product.id);

    const allSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) => selectedProductIds.includes(id));

    setSelectedProductIds((previous) =>
      allSelected
        ? previous.filter((id) => !visibleIds.includes(id))
        : [...new Set([...previous, ...visibleIds])],
    );
  };

  // Update stock for selected products through the existing PUT endpoint.
  const applyBulkStock = async () => {
    const newStock = Number(bulkStock);

    if (
      bulkStock.trim() === "" ||
      !Number.isInteger(newStock) ||
      newStock < 0 ||
      selectedProductIds.length === 0
    ) {
      setToastMessage("Enter a valid non-negative stock quantity");
      return;
    }

    const selectedProducts = products.filter((product) =>
      selectedProductIds.includes(product.id),
    );

    setIsBulkProcessing(true);

    try {
      // Each request uses the full product payload expected by the DTO.
      const results = await Promise.allSettled(
        selectedProducts.map(async (product) => {
          const response = await fetch(
            `${API_BASE_URL}/api/products/${product.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: product.productName,
                price: product.price,
                stock: newStock,
                description: product.description,
                productType: product.productType,
                merchantName: product.merchant,
                imageUrl: product.image,
              }),
            },
          );

          if (!response.ok) {
            throw new Error(
              `Failed to update ${product.productName}`,
            );
          }

          return mapBackendProduct(
            (await response.json()) as BackendProduct,
          );
        }),
      );

      // Apply only the product updates confirmed by the backend.
      const successfulProducts = results
        .filter(
          (
            result,
          ): result is PromiseFulfilledResult<ProductData> =>
            result.status === "fulfilled",
        )
        .map((result) => result.value);

      setProducts((previous) =>
        previous.map((product) => {
          const updated = successfulProducts.find(
            (item) => item.id === product.id,
          );

          return updated ?? product;
        }),
      );

      const failedCount = results.length - successfulProducts.length;

      if (failedCount > 0) {
        setToastMessage(
          `${successfulProducts.length} updated; ${failedCount} failed. Refresh and verify the product list.`,
        );
      } else {
        setToastMessage("Selected products' stock updated");
      }

      setSelectedProductIds([]);
      setBulkStock("");
    } catch (error) {
      console.error("Bulk stock update failed:", error);

      setToastMessage(
        error instanceof Error
          ? error.message
          : "Bulk stock update failed",
      );
    } finally {
      setIsBulkProcessing(false);
    }
  };

  // Delete selected products through the backend API.
  const deleteSelectedProducts = async () => {
    if (selectedProductIds.length === 0) return;

    const confirmed = window.confirm(
      `Delete ${selectedProductIds.length} selected product${
        selectedProductIds.length === 1 ? "" : "s"
      }?`,
    );

    if (!confirmed) return;

    setIsBulkProcessing(true);

    try {
      // allSettled keeps successful deletions even if some requests fail.
      const results = await Promise.allSettled(
        selectedProductIds.map(async (id) => {
          const response = await fetch(
            `${API_BASE_URL}/api/products/${id}`,
            { method: "DELETE" },
          );

          if (!response.ok) {
            throw new Error(`Failed to delete product ${id}`);
          }

          const deleted: boolean = await response.json();

          if (deleted !== true) {
            throw new Error(`Product ${id} was not deleted`);
          }

          return id;
        }),
      );

      const deletedIds = results
        .filter(
          (result): result is PromiseFulfilledResult<string> =>
            result.status === "fulfilled",
        )
        .map((result) => result.value);

      // Remove only products whose backend deletion succeeded.
      setProducts((previous) =>
        previous.filter((product) => !deletedIds.includes(product.id)),
      );

      setSelectedProductIds([]);

      const failedCount = results.length - deletedIds.length;

      if (failedCount > 0) {
        setToastMessage(
          `${deletedIds.length} deleted; ${failedCount} failed. Refresh and verify the product list.`,
        );
      } else {
        setToastMessage("Selected products deleted successfully");
      }
    } catch (error) {
      console.error("Bulk delete failed:", error);

      setToastMessage(
        error instanceof Error
          ? error.message
          : "Bulk delete failed",
      );
    } finally {
      setIsBulkProcessing(false);
    }
  };

  // Sort the table by the chosen column.
  const handleSort = (
    field: "productName" | "price" | "stock" | "productType",
  ) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortField(null);
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter products by search text and stock/status.
  const filteredProducts = products.filter((product) => {
    const searchValue = searchTerm.toLowerCase();

    const matchesSearch =
      product.productName.toLowerCase().includes(searchValue) ||
      product.merchant.toLowerCase().includes(searchValue) ||
      product.productType.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Low stock" &&
        product.stock > 0 &&
        product.stock <= LOW_STOCK_THRESHOLD) ||
      (statusFilter === "Out of stock" && product.stock <= 0) ||
      (statusFilter === "Available" &&
        product.stock > LOW_STOCK_THRESHOLD) ||
      (statusFilter === "NA" && product.stock <= 0);

    return matchesSearch && matchesStatus;
  });

  // Sort a copy so the original products state is not mutated.
  const sortedProducts = [...filteredProducts].sort((first, second) => {
    if (!sortField) return 0;

    const firstValue = first[sortField];
    const secondValue = second[sortField];

    if (
      typeof firstValue === "number" &&
      typeof secondValue === "number"
    ) {
      return sortDirection === "asc"
        ? firstValue - secondValue
        : secondValue - firstValue;
    }

    const firstString = String(firstValue).toLowerCase();
    const secondString = String(secondValue).toLowerCase();

    return sortDirection === "asc"
      ? firstString.localeCompare(secondString)
      : secondString.localeCompare(firstString);
  });

  // Calculate pagination values.
  const totalPages = Math.ceil(
    sortedProducts.length / productsPerPage,
  );
  const visiblePage = Math.min(
    currentPage,
    Math.max(totalPages, 1),
  );
  const startIndex = (visiblePage - 1) * productsPerPage;

  const currentProducts = sortedProducts.slice(
    startIndex,
    startIndex + productsPerPage,
  );

  // Quick status filter buttons.
  const filterChips = [
    { id: "All", label: "All Items" },
    { id: "Available", label: "In Stock" },
    { id: "Low stock", label: "Low Stock (1-5)" },
    { id: "Out of stock", label: "Out of Stock" },
  ];

  // Render the Products administration page.
  return (
    <AdminPage>
      <AdminPageHeader
        title="Products"
        description="View and manage products, inventories, and pricing across your store."
        action={
          <Button
            size="sm"
            onClick={openAddModal}
            className="gap-1.5 shadow-sm"
          >
            <Plus className="size-4" />
            Add Product
          </Button>
        }
      />

      {/* Inventory summary cards. */}
      <section
        className="inventory-summary"
        aria-label="Inventory overview"
      >
        <article>
          <span>Total catalog units</span>
          <strong>
            {products.reduce(
              (total, product) => total + product.stock,
              0,
            )}
          </strong>
        </article>

        <article>
          <span>Low stock warning</span>
          <strong className="text-amber-600 dark:text-amber-400">
            {
              products.filter(
                (product) =>
                  product.stock > 0 &&
                  product.stock <= LOW_STOCK_THRESHOLD,
              ).length
            }
          </strong>
        </article>

        <article>
          <span>Out of stock</span>
          <strong className="text-destructive">
            {
              products.filter((product) => product.stock <= 0).length
            }
          </strong>
        </article>
      </section>

      {/* Quick filters for product availability. */}
      <div
        className="filter-chips-bar"
        role="group"
        aria-label="Quick status filters"
      >
        {filterChips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            className={`filter-chip ${
              statusFilter === chip.id ? "filter-chip-active" : ""
            }`}
            onClick={() => {
              setStatusFilter(chip.id);
              setCurrentPage(1);
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Product catalog and bulk actions. */}
      <DataTable
        title="Product catalog"
        description="View and manage products in your storefront inventory."
        toolbar={
          <div className="product-toolbar">
            <div className="bulk-actions">
              <span>{selectedProductIds.length} selected</span>

              <Input
                aria-label="Set stock for selected products"
                type="number"
                min="0"
                step="1"
                placeholder="New stock"
                className="bulk-stock-input"
                value={bulkStock}
                onChange={(event) => setBulkStock(event.target.value)}
              />

              <Button
                variant="outline"
                size="sm"
                disabled={
                  isBulkProcessing ||
                  !bulkStock.trim() ||
                  selectedProductIds.length === 0
                }
                onClick={() => void applyBulkStock()}
              >
                Update stock
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={
                  isBulkProcessing ||
                  selectedProductIds.length === 0
                }
                onClick={() => void deleteSelectedProducts()}
              >
                <Trash2 className="size-3.5" />
                Delete selected
              </Button>
            </div>
          </div>
        }
      >
        {products.length === 0 ? (
          <EmptyState
            title="No products yet"
            description="Once products are added, you will be able to view and manage them here."
            action={
              <Button onClick={openAddModal}>
                <Plus className="mr-1.5 size-4" />
                Add Product
              </Button>
            }
          />
        ) : sortedProducts.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Try changing your search term or filter chips."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                {/* Select all rows on the current page. */}
                <TableHead className="w-12 px-4">
                  <input
                    type="checkbox"
                    aria-label="Select visible products"
                    checked={
                      currentProducts.length > 0 &&
                      currentProducts.every((product) =>
                        selectedProductIds.includes(product.id),
                      )
                    }
                    onChange={toggleVisibleProducts}
                  />
                </TableHead>

                <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Merchant
                </TableHead>

                {/* Product name sorting. */}
                <TableHead
                  className="h-11 cursor-pointer select-none px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                  onClick={() => handleSort("productName")}
                >
                  <div className="flex items-center gap-1">
                    Product Name
                    {sortField === "productName" ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="size-3.5 text-primary" />
                      ) : (
                        <ArrowDown className="size-3.5 text-primary" />
                      )
                    ) : (
                      <ArrowUpDown className="size-3 text-muted-foreground/50" />
                    )}
                  </div>
                </TableHead>

                {/* Price sorting. */}
                <TableHead
                  className="h-11 cursor-pointer select-none px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                  onClick={() => handleSort("price")}
                >
                  <div className="flex items-center gap-1">
                    Price
                    {sortField === "price" ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="size-3.5 text-primary" />
                      ) : (
                        <ArrowDown className="size-3.5 text-primary" />
                      )
                    ) : (
                      <ArrowUpDown className="size-3 text-muted-foreground/50" />
                    )}
                  </div>
                </TableHead>

                {/* Stock sorting. */}
                <TableHead
                  className="h-11 cursor-pointer select-none px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                  onClick={() => handleSort("stock")}
                >
                  <div className="flex items-center gap-1">
                    Stock
                    {sortField === "stock" ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="size-3.5 text-primary" />
                      ) : (
                        <ArrowDown className="size-3.5 text-primary" />
                      )
                    ) : (
                      <ArrowUpDown className="size-3 text-muted-foreground/50" />
                    )}
                  </div>
                </TableHead>

                {/* Product category sorting. */}
                <TableHead
                  className="h-11 cursor-pointer select-none px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                  onClick={() => handleSort("productType")}
                >
                  <div className="flex items-center gap-1">
                    Category
                    {sortField === "productType" ? (
                      sortDirection === "asc" ? (
                        <ArrowUp className="size-3.5 text-primary" />
                      ) : (
                        <ArrowDown className="size-3.5 text-primary" />
                      )
                    ) : (
                      <ArrowUpDown className="size-3 text-muted-foreground/50" />
                    )}
                  </div>
                </TableHead>

                <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </TableHead>

                <TableHead className="h-11 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Image URL
                </TableHead>

                <TableHead className="h-11 px-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentProducts.map((product) => (
                <TableRow
                  key={product.id}
                  className="border-t border-border transition-colors hover:bg-muted/30"
                >
                  <TableCell className="px-4 py-3">
                    <input
                      type="checkbox"
                      aria-label={`Select ${product.productName}`}
                      checked={selectedProductIds.includes(product.id)}
                      onChange={() =>
                        toggleProductSelection(product.id)
                      }
                    />
                  </TableCell>

                  <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                    {product.merchant || "-"}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-sm font-semibold">
                    {product.productName}
                  </TableCell>

                  <TableCell className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                    {formatINR(product.price)}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-sm">
                    {product.stock}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-sm">
                    {product.productType || "-"}
                  </TableCell>

                  {/* Stock-aware status display. */}
                  <TableCell className="px-4 py-3">
                    <StatusPill
                      status={
                        product.stock <= 0
                          ? "Out of stock"
                          : product.stock <= LOW_STOCK_THRESHOLD
                            ? "Low stock"
                            : product.status
                      }
                    />
                  </TableCell>

                  <TableCell className="max-w-40 truncate px-4 py-3 text-xs text-muted-foreground">
                    {product.image || "No image"}
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        className="text-xs font-semibold text-primary hover:underline"
                        onClick={() => openEditModal(product)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="text-xs font-semibold text-destructive hover:underline"
                        onClick={() =>
                          void handleDeleteProduct(product.id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTable>

      {/* Pagination for filtered results. */}
      {filteredProducts.length > 0 && (
        <Pagination
          currentPage={visiblePage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add/Edit Product drawer. */}
      <FormDrawer
        open={isModalOpen}
        onOpenChange={(open) => !open && closeModal()}
        title={isEditMode ? "Edit Product" : "Add Product"}
        description={
          isEditMode
            ? "Update the product details."
            : "Enter the details for the new product."
        }
        formId="product-form"
        submitLabel={
          isSaving
            ? "Saving..."
            : isEditMode
              ? "Save changes"
              : "Save product"
        }
      >
        <form
          id="product-form"
          onSubmit={handleSubmitProduct}
          className="space-y-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Select a merchant and populate its product type. */}
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="product-merchant">Merchant</Label>

              <Select
                value={merchant || "none"}
                onValueChange={(value) => {
                  const selectedMerchant = merchants.find(
                    (item) => item.merchantName === value,
                  );

                  setMerchant(value === "none" ? "" : value);

                  setProductType(
                    value === "none"
                      ? ""
                      : selectedMerchant?.productType ?? "",
                  );
                }}
              >
                <SelectTrigger id="product-merchant">
                  <SelectValue placeholder="Select merchant" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="none" disabled>
                    Select merchant
                  </SelectItem>

                  {merchants.map((item) => (
                    <SelectItem
                      key={item.id}
                      value={item.merchantName}
                    >
                      {item.merchantName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Product name. */}
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="product-name">Product Name</Label>
              <Input
                id="product-name"
                value={productName}
                onChange={(event) =>
                  setProductName(event.target.value)
                }
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Product price must be greater than zero. */}
            <div className="grid gap-2">
              <Label htmlFor="product-price">Price</Label>
              <Input
                id="product-price"
                type="number"
                min="0.01"
                step="any"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="Enter price"
                required
              />
            </div>

            {/* Stock must be a non-negative integer. */}
            <div className="grid gap-2">
              <Label htmlFor="product-stock">Stock / Inventory</Label>
              <Input
                id="product-stock"
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(event) => setStock(event.target.value)}
                placeholder="Enter stock"
                required
              />
            </div>

            {/* Product description. */}
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="product-description">Description</Label>
              <Textarea
                id="product-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Enter product description"
                rows={4}
                required
              />
            </div>

            {/* Display the product type associated with the merchant. */}
            <div className="grid gap-2">
              <Label htmlFor="product-type">Product Type</Label>
              <Input
                id="product-type"
                value={productType}
                placeholder="Select a merchant first"
                readOnly
              />
            </div>

            {/* Status selection for the admin interface. */}
            <div className="grid gap-2">
              <Label htmlFor="product-status">Status</Label>

              <Select
                value={status}
                onValueChange={setStatus}
              >
                <SelectTrigger id="product-status">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Available">
                    Available
                  </SelectItem>
                  <SelectItem value="NA">NA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Paste a direct URL; this form does not upload local files. */}
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="product-image">Image URL</Label>
              <Input
                id="product-image"
                type="url"
                value={image}
                onChange={(event) => setImage(event.target.value)}
                placeholder="Paste direct product image URL"
              />
            </div>
          </div>
        </form>
      </FormDrawer>

      {/* Display success and error messages. */}
      <Toast
        message={toastMessage}
        onDismiss={() => setToastMessage(null)}
      />
    </AdminPage>
  );
}

export default Products;