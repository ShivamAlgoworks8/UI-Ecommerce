import { useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AdminPage, AdminPageHeader, EmptyState } from "@/components/admin/AdminPage";
import DataTable from "@/components/admin/DataTable";
import FormDrawer from "@/components/admin/FormDrawer";
import Toast from "@/components/admin/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ProductData } from "@/features/product/Products";

type CategoriesProps = {
  categories: string[];
  setCategories: Dispatch<SetStateAction<string[]>>;
  products: ProductData[];
  setProducts: Dispatch<SetStateAction<ProductData[]>>;
  searchTerm: string;
};

function Categories({ categories, setCategories, products, setProducts, searchTerm }: CategoriesProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingCategory(null);
    setName("");
  };

  const openAddDrawer = () => {
    setEditingCategory(null);
    setName("");
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (category: string) => {
    setEditingCategory(category);
    setName(category);
    setIsDrawerOpen(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedName = name.trim();
    if (!normalizedName) return;
    if (categories.some((category) => category.toLowerCase() === normalizedName.toLowerCase() && category !== editingCategory)) {
      setToastMessage("A category with that name already exists");
      return;
    }
    if (editingCategory) {
      setCategories((previous) => previous.map((category) => category === editingCategory ? normalizedName : category));
      setProducts((previous) => previous.map((product) => product.productType === editingCategory
        ? { ...product, productType: normalizedName }
        : product,
      ));
    } else {
      setCategories((previous) => [...previous, normalizedName]);
    }
    setToastMessage(editingCategory ? "Category updated" : "Category added");
    closeDrawer();
  };

  const filteredCategories = categories.filter((category) => category.toLowerCase().includes(searchTerm.toLowerCase()));

  const toggleCategory = (nameToToggle: string) => {
    setSelectedNames((previous) => previous.includes(nameToToggle)
      ? previous.filter((nameItem) => nameItem !== nameToToggle)
      : [...previous, nameToToggle],
    );
  };

  const deleteCategories = (names: string[]) => {
    const used = names.filter((category) => products.some((product) => product.productType === category));
    if (used.length > 0) {
      setToastMessage(`Remove ${used.join(", ")} from products before deleting`);
      return;
    }
    if (!window.confirm(`Delete ${names.length} selected categor${names.length === 1 ? "y" : "ies"}?`)) return;
    setCategories((previous) => previous.filter((category) => !names.includes(category)));
    setSelectedNames([]);
    setToastMessage("Selected categories deleted");
  };

  return (
    <AdminPage>
      <AdminPageHeader
        title="Categories"
        description="Organize products by category."
        action={<Button onClick={openAddDrawer}><Plus />Add Category</Button>}
      />
      <DataTable
        title="Category list"
        description="Categories are used as product types."
        toolbar={
          <div className="bulk-actions">
            <span>{selectedNames.length} selected</span>
            <Button variant="outline" disabled={selectedNames.length === 0} onClick={() => deleteCategories(selectedNames)}>
              <Trash2 />Delete selected
            </Button>
          </div>
        }
      >
        {filteredCategories.length === 0 ? (
          <EmptyState
            title={categories.length === 0 ? "No categories yet" : "No categories found"}
            description={categories.length === 0 ? "Add a category to organize products." : "Try a different search."}
            action={categories.length === 0 ? <Button onClick={openAddDrawer}><Plus />Add Category</Button> : undefined}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-background hover:bg-background">
                <TableHead className="w-12 px-[18px]"><span className="sr-only">Select</span></TableHead>
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Category</TableHead>
                <TableHead className="h-12 px-[18px] text-sm font-medium normal-case tracking-normal">Products</TableHead>
                <TableHead className="h-12 px-[18px] text-right text-sm font-medium normal-case tracking-normal">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category} className="border-t border-border">
                  <TableCell className="px-[18px] py-3">
                    <input
                      type="checkbox"
                      aria-label={`Select ${category}`}
                      checked={selectedNames.includes(category)}
                      onChange={() => toggleCategory(category)}
                    />
                  </TableCell>
                  <TableCell className="px-[18px] py-3 font-medium">{category}</TableCell>
                  <TableCell className="px-[18px] py-3">{products.filter((product) => product.productType === category).length}</TableCell>
                  <TableCell className="px-[18px] py-3">
                    <div className="flex justify-end gap-4">
                      <button type="button" className="text-sm font-medium text-primary hover:underline" onClick={() => openEditDrawer(category)}>Edit</button>
                      <button type="button" className="text-sm font-medium text-destructive hover:underline" onClick={() => deleteCategories([category])}>Delete</button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTable>
      <FormDrawer
        open={isDrawerOpen}
        onOpenChange={(open) => !open && closeDrawer()}
        title={editingCategory ? "Edit Category" : "Add Category"}
        description="Enter a category name for product organization."
        formId="category-form"
        submitLabel={editingCategory ? "Save changes" : "Save category"}
      >
        <form id="category-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-2">
            <Label htmlFor="category-name">Category name</Label>
            <Input id="category-name" value={name} onChange={(event) => setName(event.target.value)} required />
          </div>
        </form>
      </FormDrawer>
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
    </AdminPage>
  );
}

export default Categories;
