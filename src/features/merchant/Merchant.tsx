import { startTransition, useEffect, useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";

import { Plus } from "lucide-react";

import type { MerchantData } from "@/features/merchant/types";

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

import Pagination from "@/components/common/Pagination";

type MerchantProps = {
  merchants: MerchantData[];
  setMerchants: Dispatch<SetStateAction<MerchantData[]>>;
  searchTerm: string;
  createRequest: { page: string; id: number } | null;
  onCreateRequestHandled: (id: number) => void;
};

function Merchant({
  merchants,
  setMerchants,
  searchTerm,
  createRequest,
  onCreateRequestHandled,
}: MerchantProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Stores the id of the merchant currently being edited.
  const [editingMerchantId, setEditingMerchantId] = useState<string | null>(
    null
  );

  const [merchantName, setMerchantName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [productType, setProductType] = useState("");
  const [status, setStatus] = useState("Available");
  const [image, setImage] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const merchantsPerPage = 5;

  // Opens a clean form for adding a new merchant.
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

  // Opens the form with the selected merchant's existing details.
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

  // Closes the drawer and clears the current edit state.
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingMerchantId(null);
  };

  // Opens Add Merchant when another component sends a create request.
  useEffect(() => {
    if (createRequest?.page !== "merchant") return;

    startTransition(() => {
      openAddModal();
      onCreateRequestHandled(createRequest.id);
    });
  }, [createRequest, onCreateRequestHandled]);

  // Loads existing merchants from the backend when the page opens.
  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/merchants"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch merchants");
        }

        const data: MerchantData[] = await response.json();

        setMerchants(data);
      } catch (error) {
        console.error("Failed to fetch merchants:", error);

        setToastMessage("Unable to load merchants");
      }
    };

    fetchMerchants();
  }, [setMerchants]);

  // Handles merchant creation and the current frontend edit behavior.
  const handleSubmitMerchant = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // Required fields must be filled before saving.
    if (
      !merchantName.trim() ||
      !brandName.trim() ||
      !productType
    ) {
      setToastMessage(
        "Complete the required merchant fields before saving"
      );
      return;
    }

    if (isEditMode && editingMerchantId !== null) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/merchants/${editingMerchantId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              merchantName,
              brandName,
              productType,
              status,
              image,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update merchant");
        }

        const updatedMerchant: MerchantData = await response.json();

        setMerchants((previousMerchants) =>
          previousMerchants.map((merchant) =>
            merchant.id === editingMerchantId
              ? updatedMerchant
              : merchant
          )
        );

        setToastMessage("Merchant updated successfully");
      } catch (error) {
        console.error("Failed to update merchant:", error);
        setToastMessage("Unable to update merchant");
        return;
      }
    }

    else {
      try {
        // Send the new merchant details to the Spring Boot backend.
        const response = await fetch(
          "http://localhost:8080/api/merchants",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              merchantName,
              brandName,
              productType,
              status,
              image,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create merchant");
        }

        // The backend returns the merchant including its MongoDB id.
        const savedMerchant: MerchantData =
          await response.json();

        // Add the saved merchant to the table.
        setMerchants((previousMerchants) => [
          ...previousMerchants,
          savedMerchant,
        ]);

        setToastMessage("Merchant added successfully");
      } catch (error) {
        console.error("Failed to add merchant:", error);

        setToastMessage("Unable to add merchant");
        return;
      }
    }

    // Reset the form after a successful save.
    setMerchantName("");
    setBrandName("");
    setProductType("");
    setStatus("Available");
    setImage("");

    closeModal();
  };

  const handleDeleteMerchant = async (merchantId: string) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this merchant?"
  );

  if (!confirmDelete) return;

  try {
    // Delete the merchant from the backend.
    const response = await fetch(
      `http://localhost:8080/api/merchants/${merchantId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete merchant");
    }

    // Remove the merchant from the frontend after backend deletion.
    setMerchants((previousMerchants) =>
      previousMerchants.filter(
        (merchant) => merchant.id !== merchantId
      )
    );

    setToastMessage("Merchant deleted successfully");
  } catch (error) {
    console.error("Failed to delete merchant:", error);
    setToastMessage("Unable to delete merchant");
  }
};
  // Applies the search and status filter to the merchant list.
  const filteredMerchants = merchants.filter((merchant) => {
    const searchValue = searchTerm.toLowerCase();

    const matchesSearch =
      merchant.merchantName
        .toLowerCase()
        .includes(searchValue) ||
      merchant.brandName
        .toLowerCase()
        .includes(searchValue) ||
      merchant.productType
        .toLowerCase()
        .includes(searchValue);

    const matchesStatus =
      statusFilter === "All" ||
      merchant.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculates the number of pages required for the filtered data.
  const totalPages = Math.ceil(
    filteredMerchants.length / merchantsPerPage
  );

  const visiblePage = Math.min(
    currentPage,
    Math.max(totalPages, 1)
  );

  const startIndex = (visiblePage - 1) * merchantsPerPage;

  const currentMerchants = filteredMerchants.slice(
    startIndex,
    startIndex + merchantsPerPage
  );

  return (
    <AdminPage>
      <AdminPageHeader
        title="Merchant"
        description="View and manage merchants connected to your store."
        action={
          <Button onClick={openAddModal}>
            <Plus />
            Add Merchant
          </Button>
        }
      />

      <DataTable
        title="Merchant list"
        description="Merchants connected to your platform will appear here."
        toolbar={
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger
              aria-label="Filter by status"
              className="sm:w-44"
            >
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="All">
                All status
              </SelectItem>

              <SelectItem value="Available">
                Available
              </SelectItem>

              <SelectItem value="NA">
                NA
              </SelectItem>
            </SelectContent>
          </Select>
        }
      >
        {merchants.length === 0 ? (
          <EmptyState
            title="No merchants yet"
            description="Once merchants are added, you will be able to view and manage them here."
            action={
              <Button onClick={openAddModal}>
                <Plus />
                Add Merchant
              </Button>
            }
          />
        ) : filteredMerchants.length === 0 ? (
          <EmptyState
            title="No merchants found"
            description="Try changing your search or filter."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-background hover:bg-background">
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">
                  Merchant Name
                </TableHead>

                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">
                  Brand Name
                </TableHead>

                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">
                  Product Type
                </TableHead>

                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">
                  Status
                </TableHead>

                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">
                  Image
                </TableHead>

                <TableHead className="h-12 px-[18px] text-right text-sm font-medium normal-case tracking-normal">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentMerchants.map((merchant) => (
                <TableRow
                  key={merchant.id}
                  className="border-t border-border"
                >
                  <TableCell className="px-[18px] py-3 font-medium">
                    {merchant.merchantName}
                  </TableCell>

                  <TableCell className="px-[18px] py-3">
                    {merchant.brandName}
                  </TableCell>

                  <TableCell className="px-[18px] py-3">
                    {merchant.productType}
                  </TableCell>

                  <TableCell className="px-[18px] py-3">
                    <StatusPill status={merchant.status} />
                  </TableCell>

                  <TableCell className="max-w-40 truncate px-[18px] py-3 text-muted-foreground">
                    {merchant.image || "No image"}
                  </TableCell>

                  <TableCell className="px-[18px] py-3">
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        className="text-sm font-medium text-primary hover:underline"
                        onClick={() => openEditModal(merchant)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="text-sm font-medium text-destructive hover:underline"
                        onClick={() =>
                          handleDeleteMerchant(merchant.id)
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

      {filteredMerchants.length > 0 && (
        <Pagination
          currentPage={visiblePage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <FormDrawer
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeModal();
          }
        }}
        title={isEditMode ? "Edit Merchant" : "Add Merchant"}
        description={
          isEditMode
            ? "Update the merchant details."
            : "Enter the details for the new merchant."
        }
        formId="merchant-form"
        submitLabel={
          isEditMode ? "Save changes" : "Save merchant"
        }
      >
        <form
          id="merchant-form"
          onSubmit={handleSubmitMerchant}
          className="space-y-5"
        >
          <div className="grid gap-2">
            <Label htmlFor="merchant-name">
              Merchant Name
            </Label>

            <Input
              id="merchant-name"
              value={merchantName}
              onChange={(event) =>
                setMerchantName(event.target.value)
              }
              placeholder="Enter merchant name"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="merchant-brand">
              Brand Name
            </Label>

            <Input
              id="merchant-brand"
              value={brandName}
              onChange={(event) =>
                setBrandName(event.target.value)
              }
              placeholder="Enter brand name"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="merchant-product-type">
              Product Type
            </Label>

            <Select
              value={productType || "none"}
              onValueChange={(value) =>
                setProductType(
                  value === "none" ? "" : value
                )
              }
            >
              <SelectTrigger id="merchant-product-type">
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="none" disabled>
                  Select product type
                </SelectItem>

                <SelectItem value="Electronics">
                  Electronics
                </SelectItem>

                <SelectItem value="Clothing">
                  Clothing
                </SelectItem>

                <SelectItem value="Grocery">
                  Grocery
                </SelectItem>

                <SelectItem value="Home & Living">
                  Home & Living
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="merchant-status">
              Status
            </Label>

            <Select
              value={status}
              onValueChange={setStatus}
            >
              <SelectTrigger id="merchant-status">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Available">
                  Available
                </SelectItem>

                <SelectItem value="NA">
                  NA
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="merchant-image">
              Images
            </Label>

            <Input
              id="merchant-image"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (file) {
                  // For now, the backend receives the selected file name.
                  setImage(file.name);
                }
              }}
            />
          </div>
        </form>
      </FormDrawer>

      <Toast
        message={toastMessage}
        onDismiss={() => setToastMessage(null)}
      />
    </AdminPage>
  );
}

export default Merchant;