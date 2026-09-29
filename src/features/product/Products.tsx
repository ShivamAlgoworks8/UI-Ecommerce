import { startTransition, useEffect, useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AdminPage, AdminPageHeader, EmptyState } from "@/components/admin/AdminPage";
import DataTable from "@/components/admin/DataTable";
import FormDrawer from "@/components/admin/FormDrawer";
import StatusPill from "@/components/admin/StatusPill";
import Toast from "@/components/admin/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { MerchantData } from "../../App";
import Pagination from "../../components/commonfeature/pagination";

export type ProductData = {
  id: string;
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
  categories: string[];
  products: ProductData[];
  setProducts: Dispatch<SetStateAction<ProductData[]>>;
  searchTerm: string;
  createRequest: { page: string; id: number } | null;
  onCreateRequestHandled: (id: number) => void;
};

function Products({ merchants, categories, products, setProducts, searchTerm, createRequest, onCreateRequestHandled }: ProductProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [merchant, setMerchant] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [productType, setProductType] = useState("");
  const [status, setStatus] = useState("Available");
  const [image, setImage] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [bulkStock, setBulkStock] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch products");
        return response.json();
      })
      .then((data) => {
        const backendProducts: ProductData[] = data.map((product: {
          id: string;
          name: string;
          price: number;
          stock: number;
          description: string;
          productType: string;
        }) => ({
          id: product.id,
          merchant: "",
          productName: product.name,
          price: product.price,
          stock: product.stock,
          description: product.description,
          productType: product.productType,
          status: "Available",
          image: "",
        }));
        setProducts(backendProducts);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [setProducts]);

  const [statusFilter, setStatusFilter] = useState("All");
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

  useEffect(() => {
    if (createRequest?.page !== "products") return;
    startTransition(() => {
      openAddModal();
      onCreateRequestHandled(createRequest.id);
    });
  }, [createRequest, onCreateRequestHandled]);

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

  const handleSubmitProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productName.trim() || !price || !stock || !description.trim() || !productType) {
      setToastMessage("Complete the required product fields before saving");
      return;
    }
    if (!Number.isFinite(Number(price)) || Number(price) < 0 || !Number.isFinite(Number(stock)) || Number(stock) < 0) {
      setToastMessage("Price and stock must be valid non-negative numbers");
      return;
    }

    if (isEditMode && editingProductId !== null) {
      setProducts((previousProducts) => previousProducts.map((product) =>
        product.id === editingProductId
          ? { ...product, merchant: merchant || product.merchant, productName: productName.trim(), price: Number(price), stock: Number(stock), description: description.trim(), productType, status, image }
          : product,
      ));
      closeModal();
      setToastMessage("Product updated successfully");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: productName,
          price: Number(price),
          stock: Number(stock),
          description,
          productType,
        }),
      });
      if (!response.ok) throw new Error("Failed to create product");
      const savedProduct = await response.json();
      const newProduct: ProductData = {
        id: savedProduct.id,
        merchant,
        productName: savedProduct.name,
        price: savedProduct.price,
        stock: savedProduct.stock,
        description: savedProduct.description,
        productType: savedProduct.productType,
        status,
        image,
      };
      setProducts((previousProducts) => [...previousProducts, newProduct]);
      setMerchant("");
      setProductName("");
      setPrice("");
      setStock("");
      setDescription("");
      setProductType("");
      setStatus("Available");
      setImage("");
      closeModal();
      setToastMessage("Product added successfully");
    } catch (error) {
      console.error("Error creating product:", error);
      setToastMessage(error instanceof Error ? error.message : "Failed to create product");
    }
  };

  const handleDeleteProduct = (productId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;
    setProducts((previousProducts) => previousProducts.filter((product) => product.id !== productId));
    setSelectedProductIds((previous) => previous.filter((id) => id !== productId));
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((previous) => previous.includes(productId)
      ? previous.filter((id) => id !== productId)
      : [...previous, productId],
    );
  };

  const toggleVisibleProducts = () => {
    const visibleIds = currentProducts.map((product) => product.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedProductIds.includes(id));
    setSelectedProductIds((previous) => allSelected
      ? previous.filter((id) => !visibleIds.includes(id))
      : [...new Set([...previous, ...visibleIds])],
    );
  };

  const applyBulkStock = () => {
    if (!bulkStock || Number(bulkStock) < 0 || selectedProductIds.length === 0) return;
    setProducts((previous) => previous.map((product) => selectedProductIds.includes(product.id)
      ? { ...product, stock: Number(bulkStock) }
      : product,
    ));
    setSelectedProductIds([]);
    setBulkStock("");
    setToastMessage("Selected inventory updated");
  };

  const deleteSelectedProducts = () => {
    if (selectedProductIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedProductIds.length} selected product${selectedProductIds.length === 1 ? "" : "s"}?`)) return;
    setProducts((previous) => previous.filter((product) => !selectedProductIds.includes(product.id)));
    setSelectedProductIds([]);
    setToastMessage("Selected products deleted");
  };

  const filteredProducts = products.filter((product) => {
    const searchValue = searchTerm.toLowerCase();
    const matchesSearch = product.productName.toLowerCase().includes(searchValue)
      || product.merchant.toLowerCase().includes(searchValue)
      || product.productType.toLowerCase().includes(searchValue);
    const matchesStatus = statusFilter === "All"
      || (statusFilter === "Low stock" && product.stock > 0 && product.stock <= 5)
      || (statusFilter === "Out of stock" && product.stock <= 0)
      || (statusFilter === "Available" && product.status === "Available" && product.stock > 5)
      || (statusFilter === "NA" && product.status === "NA");
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const visiblePage = Math.min(currentPage, Math.max(totalPages, 1));
  const startIndex = (visiblePage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  return (
    <AdminPage>
      <AdminPageHeader title="Products" description="View and manage products in your store." action={<Button onClick={openAddModal}><Plus />Add Product</Button>} />
      <section className="inventory-summary" aria-label="Inventory overview">
        <article><span>Total units</span><strong>{products.reduce((total, product) => total + product.stock, 0)}</strong></article>
        <article><span>Low stock</span><strong>{products.filter((product) => product.stock > 0 && product.stock <= 5).length}</strong></article>
        <article><span>Out of stock</span><strong>{products.filter((product) => product.stock <= 0).length}</strong></article>
      </section>
      <DataTable
        title="Product list"
        description="Products added to your store will appear here."
        toolbar={
          <div className="product-toolbar">
            <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}>
              <SelectTrigger aria-label="Filter inventory" className="sm:w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All inventory</SelectItem>
                <SelectItem value="Low stock">Low stock (1–5)</SelectItem>
                <SelectItem value="Out of stock">Out of stock</SelectItem>
                <SelectItem value="Available">Available status</SelectItem>
                <SelectItem value="NA">NA status</SelectItem>
              </SelectContent>
            </Select>
            <div className="bulk-actions">
              <span>{selectedProductIds.length} selected</span>
              <Input
                aria-label="Set stock for selected products"
                type="number"
                min="0"
                placeholder="Set stock"
                className="bulk-stock-input"
                value={bulkStock}
                onChange={(event) => setBulkStock(event.target.value)}
              />
              <Button variant="outline" disabled={!bulkStock || selectedProductIds.length === 0} onClick={applyBulkStock}>Update stock</Button>
              <Button variant="outline" disabled={selectedProductIds.length === 0} onClick={deleteSelectedProducts}><Trash2 />Delete selected</Button>
            </div>
          </div>
        }
      >
        {products.length === 0 ? (
          <EmptyState
            title="No products yet"
            description="Once products are added, you will be able to view and manage them here."
            action={<Button onClick={openAddModal}><Plus />Add Product</Button>}
          />
        ) : (
          filteredProducts.length === 0 ? (
            <EmptyState title="No products found" description="Try changing your search or filter." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-background hover:bg-background">
                  <TableHead className="w-12 px-[18px]">
                    <input
                      type="checkbox"
                      aria-label="Select visible products"
                      checked={currentProducts.length > 0 && currentProducts.every((product) => selectedProductIds.includes(product.id))}
                      onChange={toggleVisibleProducts}
                    />
                  </TableHead>
                  <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Merchant</TableHead>
                  <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Product Name</TableHead>
                  <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Price</TableHead>
                  <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Stock</TableHead>
                  <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Product Type</TableHead>
                  <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Status</TableHead>
                  <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Image</TableHead>
                  <TableHead className="h-12 px-[18px] text-right text-sm font-medium normal-case tracking-normal">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProducts.map((product) => (
                  <TableRow key={product.id} className="border-t border-border">
                    <TableCell className="px-[18px] py-3">
                      <input
                        type="checkbox"
                        aria-label={`Select ${product.productName}`}
                        checked={selectedProductIds.includes(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                      />
                    </TableCell>
                    <TableCell className="px-[18px] py-3">{product.merchant || "-"}</TableCell>
                    <TableCell className="px-[18px] py-3 font-medium">{product.productName}</TableCell>
                    <TableCell className="whitespace-nowrap px-[18px] py-3">
                      {product.price.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                    </TableCell>
                    <TableCell className="px-[18px] py-3">{product.stock}</TableCell>
                    <TableCell className="px-[18px] py-3">{product.productType}</TableCell>
                    <TableCell className="px-[18px] py-3">
                      <StatusPill status={product.stock <= 0 ? "Out of stock" : product.stock <= 5 ? "Low stock" : product.status} />
                    </TableCell>
                    <TableCell className="max-w-40 truncate px-[18px] py-3 text-muted-foreground">{product.image || "No image"}</TableCell>
                    <TableCell className="px-[18px] py-3">
                      <div className="flex justify-end gap-4">
                        <button type="button" className="text-sm font-medium text-primary hover:underline" onClick={() => openEditModal(product)}>Edit</button>
                        <button type="button" className="text-sm font-medium text-destructive hover:underline" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        )}
      </DataTable>

      {filteredProducts.length > 0 && <Pagination currentPage={visiblePage} totalPages={totalPages} onPageChange={setCurrentPage} />}

      <FormDrawer
        open={isModalOpen}
        onOpenChange={(open) => !open && closeModal()}
        title={isEditMode ? "Edit Product" : "Add Product"}
        description={isEditMode ? "Update the product details." : "Enter the details for the new product."}
        formId="product-form"
        submitLabel={isEditMode ? "Save changes" : "Save product"}
      >
          <form id="product-form" onSubmit={handleSubmitProduct} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="product-merchant">Merchant</Label>
                <Select value={merchant || "none"} onValueChange={(value) => setMerchant(value === "none" ? "" : value)}>
                  <SelectTrigger id="product-merchant"><SelectValue placeholder="Select merchant" /></SelectTrigger>
                  <SelectContent><SelectItem value="none" disabled>Select merchant</SelectItem>{merchants.map((item) => <SelectItem key={item.id} value={item.merchantName}>{item.merchantName}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 sm:col-span-2"><Label htmlFor="product-name">Product Name</Label><Input id="product-name" value={productName} onChange={(event) => setProductName(event.target.value)} placeholder="Enter product name" required /></div>
              <div className="grid gap-2"><Label htmlFor="product-price">Price</Label><Input id="product-price" type="number" min="0" step="any" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="Enter price" required /></div>
              <div className="grid gap-2"><Label htmlFor="product-stock">Stock / Inventory</Label><Input id="product-stock" type="number" min="0" value={stock} onChange={(event) => setStock(event.target.value)} placeholder="Enter stock" required /></div>
              <div className="grid gap-2 sm:col-span-2"><Label htmlFor="product-description">Description</Label><Textarea id="product-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Enter product description" rows={4} required /></div>
              <div className="grid gap-2">
                <Label htmlFor="product-type">Product Type</Label>
                <Select value={productType || "none"} onValueChange={(value) => setProductType(value === "none" ? "" : value)} required>
                  <SelectTrigger id="product-type"><SelectValue placeholder="Select product type" /></SelectTrigger>
                  <SelectContent><SelectItem value="none" disabled>Select product type</SelectItem>{categories.map((category) => <SelectItem key={category} value={category}>{category}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="product-status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="product-status"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Available">Available</SelectItem><SelectItem value="NA">NA</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 sm:col-span-2"><Label htmlFor="product-image">Images</Label><Input id="product-image" type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) setImage(file.name); }} /></div>
            </div>
          </form>
      </FormDrawer>
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
    </AdminPage>
  );
}

export default Products;