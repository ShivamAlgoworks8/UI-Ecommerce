import { startTransition, useEffect, useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Plus } from "lucide-react";
import type { MerchantData } from "@/features/merchant/types";
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
import Pagination from "@/components/common/Pagination";

type MerchantProps = {
  merchants: MerchantData[];
  setMerchants: Dispatch<SetStateAction<MerchantData[]>>;
  searchTerm: string;
  createRequest: { page: string; id: number } | null;
  onCreateRequestHandled: (id: number) => void;
};

function Merchant({ merchants, setMerchants, searchTerm, createRequest, onCreateRequestHandled }: MerchantProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingMerchantId, setEditingMerchantId] = useState<number | null>(null);
  const [merchantName, setMerchantName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [productType, setProductType] = useState("");
  const [status, setStatus] = useState("Available");
  const [image, setImage] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const merchantsPerPage = 5;

  const openAddModal = () => {
    setIsEditMode(false);
    setEditingMerchantId(null);
    setMerchantName("");
    setBrandName("");
    setProductType("");
    setStatus("Available");
    setImage("");
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (createRequest?.page !== "merchant") return;
    startTransition(() => {
      openAddModal();
      onCreateRequestHandled(createRequest.id);
    });
  }, [createRequest, onCreateRequestHandled]);

  const openEditModal = (merchant: MerchantData) => {
    setIsEditMode(true);
    setEditingMerchantId(merchant.id);
    setMerchantName(merchant.merchantName);
    setBrandName(merchant.brandName);
    setProductType(merchant.productType);
    setStatus(merchant.status);
    setImage(merchant.image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingMerchantId(null);
  };

  const handleSubmitMerchant = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!merchantName.trim() || !brandName.trim() || !productType) {
      setToastMessage("Complete the required merchant fields before saving");
      return;
    }
    if (isEditMode && editingMerchantId !== null) {
      setMerchants((previousMerchants) => previousMerchants.map((merchant) =>
        merchant.id === editingMerchantId
          ? { ...merchant, merchantName, brandName, productType, status, image }
          : merchant,
      ));
    } else {
      const newMerchant: MerchantData = { id: Date.now(), merchantName, brandName, productType, status, image };
      setMerchants((previousMerchants) => [...previousMerchants, newMerchant]);
    }
    setMerchantName("");
    setBrandName("");
    setProductType("");
    setStatus("Available");
    setImage("");
    closeModal();
    setToastMessage(isEditMode ? "Merchant updated successfully" : "Merchant added successfully");
  };

  const handleDeleteMerchant = (merchantId: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this merchant?");
    if (!confirmDelete) return;
    setMerchants((previousMerchants) => previousMerchants.filter((merchant) => merchant.id !== merchantId));
  };

  const filteredMerchants = merchants.filter((merchant) => {
    const searchValue = searchTerm.toLowerCase();
    const matchesSearch = merchant.merchantName.toLowerCase().includes(searchValue)
      || merchant.brandName.toLowerCase().includes(searchValue)
      || merchant.productType.toLowerCase().includes(searchValue);
    const matchesStatus = statusFilter === "All" || merchant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredMerchants.length / merchantsPerPage);
  const visiblePage = Math.min(currentPage, Math.max(totalPages, 1));
  const startIndex = (visiblePage - 1) * merchantsPerPage;
  const currentMerchants = filteredMerchants.slice(startIndex, startIndex + merchantsPerPage);

  return (
    <AdminPage>
      <AdminPageHeader title="Merchant" description="View and manage merchants connected to your store." action={<Button onClick={openAddModal}><Plus />Add Merchant</Button>} />
      <DataTable
        title="Merchant list"
        description="Merchants connected to your platform will appear here."
        toolbar={
          <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}>
            <SelectTrigger aria-label="Filter by status" className="sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="All">All status</SelectItem><SelectItem value="Available">Available</SelectItem><SelectItem value="NA">NA</SelectItem></SelectContent>
          </Select>
        }
      >
        {merchants.length === 0 ? (
          <EmptyState
            title="No merchants yet"
            description="Once merchants are added, you will be able to view and manage them here."
            action={<Button onClick={openAddModal}><Plus />Add Merchant</Button>}
          />
        ) : (
          filteredMerchants.length === 0 ? (
            <EmptyState title="No merchants found" description="Try changing your search or filter." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-background hover:bg-background">
                  <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Merchant Name</TableHead>
                  <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Brand Name</TableHead>
                  <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Product Type</TableHead>
                  <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Status</TableHead>
                  <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Image</TableHead>
                  <TableHead className="h-12 px-[18px] text-right text-sm font-medium normal-case tracking-normal">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentMerchants.map((merchant) => (
                  <TableRow key={merchant.id} className="border-t border-border">
                    <TableCell className="px-[18px] py-3 font-medium">{merchant.merchantName}</TableCell>
                    <TableCell className="px-[18px] py-3">{merchant.brandName}</TableCell>
                    <TableCell className="px-[18px] py-3">{merchant.productType}</TableCell>
                    <TableCell className="px-[18px] py-3"><StatusPill status={merchant.status} /></TableCell>
                    <TableCell className="max-w-40 truncate px-[18px] py-3 text-muted-foreground">{merchant.image || "No image"}</TableCell>
                    <TableCell className="px-[18px] py-3">
                      <div className="flex justify-end gap-4">
                        <button type="button" className="text-sm font-medium text-primary hover:underline" onClick={() => openEditModal(merchant)}>Edit</button>
                        <button type="button" className="text-sm font-medium text-destructive hover:underline" onClick={() => handleDeleteMerchant(merchant.id)}>Delete</button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )
        )}
      </DataTable>

      {filteredMerchants.length > 0 && <Pagination currentPage={visiblePage} totalPages={totalPages} onPageChange={setCurrentPage} />}

      <FormDrawer
        open={isModalOpen}
        onOpenChange={(open) => !open && closeModal()}
        title={isEditMode ? "Edit Merchant" : "Add Merchant"}
        description={isEditMode ? "Update the merchant details." : "Enter the details for the new merchant."}
        formId="merchant-form"
        submitLabel={isEditMode ? "Save changes" : "Save merchant"}
      >
          <form id="merchant-form" onSubmit={handleSubmitMerchant} className="space-y-5">
            <div className="grid gap-2"><Label htmlFor="merchant-name">Merchant Name</Label><Input id="merchant-name" value={merchantName} onChange={(event) => setMerchantName(event.target.value)} placeholder="Enter merchant name" required /></div>
            <div className="grid gap-2"><Label htmlFor="merchant-brand">Brand Name</Label><Input id="merchant-brand" value={brandName} onChange={(event) => setBrandName(event.target.value)} placeholder="Enter brand name" required /></div>
            <div className="grid gap-2">
              <Label htmlFor="merchant-product-type">Product Type</Label>
              <Select value={productType || "none"} onValueChange={(value) => setProductType(value === "none" ? "" : value)} required>
                <SelectTrigger id="merchant-product-type"><SelectValue placeholder="Select product type" /></SelectTrigger>
                <SelectContent><SelectItem value="none" disabled>Select product type</SelectItem><SelectItem value="Electronics">Electronics</SelectItem><SelectItem value="Clothing">Clothing</SelectItem><SelectItem value="Grocery">Grocery</SelectItem><SelectItem value="Home & Living">Home &amp; Living</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="merchant-status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="merchant-status"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Available">Available</SelectItem><SelectItem value="NA">NA</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="grid gap-2"><Label htmlFor="merchant-image">Images</Label><Input id="merchant-image" type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) setImage(file.name); }} /></div>
          </form>
      </FormDrawer>
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
    </AdminPage>
  );
}

export default Merchant;