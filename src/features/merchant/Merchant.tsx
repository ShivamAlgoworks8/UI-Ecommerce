import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { MerchantData } from "../../App";
import "./Merchant.css";

type MerchantProps = {
  merchants: MerchantData[];
  setMerchants: Dispatch<SetStateAction<MerchantData[]>>;
};

function Merchant({
  merchants,
  setMerchants,
}: MerchantProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingMerchantId, setEditingMerchantId] = useState<number | null>(
    null
  );

  const [merchantName, setMerchantName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [productType, setProductType] = useState("");
  const [status, setStatus] = useState("Available");
  const [image, setImage] = useState("");

  // Search and Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
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

  const handleSubmitMerchant = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isEditMode && editingMerchantId !== null) {
      setMerchants((previousMerchants) =>
        previousMerchants.map((merchant) =>
          merchant.id === editingMerchantId
            ? {
                ...merchant,
                merchantName,
                brandName,
                productType,
                status,
                image,
              }
            : merchant
        )
      );
    } else {
      const newMerchant: MerchantData = {
        id: Date.now(),
        merchantName,
        brandName,
        productType,
        status,
        image,
      };

      setMerchants((previousMerchants) => [
        ...previousMerchants,
        newMerchant,
      ]);
    }

    setMerchantName("");
    setBrandName("");
    setProductType("");
    setStatus("Available");
    setImage("");

    closeModal();
  };

  const handleDeleteMerchant = (merchantId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this merchant?"
    );

    if (!confirmDelete) {
      return;
    }

    setMerchants((previousMerchants) =>
      previousMerchants.filter(
        (merchant) => merchant.id !== merchantId
      )
    );
  };

  // Search and Filter Logic
  const filteredMerchants = merchants.filter((merchant) => {
    const searchValue = searchTerm.toLowerCase();

    const matchesSearch =
      merchant.merchantName.toLowerCase().includes(searchValue) ||
      merchant.brandName.toLowerCase().includes(searchValue) ||
      merchant.productType.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "All" ||
      merchant.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(
    filteredMerchants.length / merchantsPerPage
  );

  const startIndex =
    (currentPage - 1) * merchantsPerPage;

  const currentMerchants = filteredMerchants.slice(
    startIndex,
    startIndex + merchantsPerPage
  );

  return (
    <main className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-page-eyebrow">Management</p>

          <h2>Merchant</h2>

          <p className="admin-page-description">
            View and manage merchants connected to your store.
          </p>
        </div>

        <button
          className="admin-primary-button"
          onClick={openAddModal}
        >
          Add Merchant
        </button>
      </div>

      <section className="admin-page-card">
        <div className="admin-page-card-header">
          <div>
            <h3>Merchants</h3>

            <p>
              Merchants connected to your platform will appear here.
            </p>
          </div>
        </div>

        {merchants.length === 0 ? (
          <div className="empty-state">
            <strong>No merchants yet</strong>

            <span>
              Once merchants are added, you will be able to view and
              manage them here.
            </span>
          </div>
        ) : (
          <>
            <div className="merchant-filters">
              <div className="merchant-search">
                <input
                  type="text"
                  placeholder="Search merchant..."
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="merchant-status-filter">
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

            {filteredMerchants.length === 0 ? (
              <div className="empty-state">
                <strong>No merchants found</strong>

                <span>
                  Try changing your search or filter.
                </span>
              </div>
            ) : (
              <>
                <div className="merchant-table-wrapper">
                  <table className="merchant-table">
                    <thead>
                      <tr>
                        <th>Merchant Name</th>
                        <th>Brand Name</th>
                        <th>Product Type</th>
                        <th>Status</th>
                        <th>Image</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {currentMerchants.map((merchant) => (
                        <tr key={merchant.id}>
                          <td>{merchant.merchantName}</td>

                          <td>{merchant.brandName}</td>

                          <td>{merchant.productType}</td>

                          <td>
                            <span
                              className={`merchant-status ${
                                merchant.status === "Available"
                                  ? "available"
                                  : "not-available"
                              }`}
                            >
                              {merchant.status}
                            </span>
                          </td>

                          <td>
                            {merchant.image ? (
                              <span className="merchant-image-name">
                                {merchant.image}
                              </span>
                            ) : (
                              <span className="no-image">
                                No image
                              </span>
                            )}
                          </td>

                          <td>
                            <div className="merchant-action-buttons">
                              <button
                                className="merchant-edit-button"
                                onClick={() =>
                                  openEditModal(merchant)
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="merchant-delete-button"
                                onClick={() =>
                                  handleDeleteMerchant(merchant.id)
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

                {totalPages > 1 && (
                  <div className="merchant-pagination">
                    <button
                      className="pagination-button"
                      onClick={() =>
                        setCurrentPage(
                          (previousPage) => previousPage - 1
                        )
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>

                    <div className="pagination-pages">
                      {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                      ).map((page) => (
                        <button
                          key={page}
                          className={`pagination-page ${
                            currentPage === page
                              ? "active"
                              : ""
                          }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      className="pagination-button"
                      onClick={() =>
                        setCurrentPage(
                          (previousPage) => previousPage + 1
                        )
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </section>

      {isModalOpen && (
        <div className="merchant-modal-overlay">
          <div className="merchant-modal">
            <div className="merchant-modal-header">
              <h3>
                {isEditMode ? "Edit Merchant" : "Add Merchant"}
              </h3>

              <button
                className="merchant-modal-close"
                onClick={closeModal}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form
              className="merchant-form"
              onSubmit={handleSubmitMerchant}
            >
              <div className="merchant-form-field">
                <label htmlFor="merchantName">
                  Merchant Name
                </label>

                <input
                  id="merchantName"
                  type="text"
                  value={merchantName}
                  onChange={(event) =>
                    setMerchantName(event.target.value)
                  }
                  placeholder="Enter merchant name"
                  required
                />
              </div>

              <div className="merchant-form-field">
                <label htmlFor="brandName">
                  Brand Name
                </label>

                <input
                  id="brandName"
                  type="text"
                  value={brandName}
                  onChange={(event) =>
                    setBrandName(event.target.value)
                  }
                  placeholder="Enter brand name"
                  required
                />
              </div>

              <div className="merchant-form-field">
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

              <div className="merchant-form-field">
                <label htmlFor="status">
                  Status
                </label>

                <select
                  id="status"
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

              <div className="merchant-form-field">
                <label htmlFor="merchantImage">
                  Images
                </label>

                <input
                  id="merchantImage"
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

              <div className="merchant-form-actions">
                <button
                  type="button"
                  className="merchant-cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                >
                  {isEditMode
                    ? "Update Merchant"
                    : "Add Merchant"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Merchant;