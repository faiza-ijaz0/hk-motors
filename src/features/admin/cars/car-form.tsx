"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CategoryManagerDialog } from "@/features/admin/cars/category-manager-dialog";
import { getYearOptions } from "@/lib/years";
import {
  createCarAction,
  createMakeAction,
  createModelAction,
  updateCarAction,
  type CarFormInput,
} from "@/services/admin-cars-actions";

import type { AdminCarDetail, CarFormOptions } from "@/services/admin-cars";
import type { Enums } from "@/types/supabase";

const YEARS = getYearOptions();

const CONDITIONS: Enums<"car_condition">[] = [
  "new",
  "used",
  "certified_pre_owned",
];
const STATUSES: Enums<"car_status">[] = [
  "draft",
  "pending_review",
  "published",
  "reserved",
  "sold",
  "archived",
];
const TRANSMISSIONS: Enums<"transmission_type">[] = [
  "automatic",
  "manual",
  "cvt",
  "dual_clutch",
];
const FUEL_TYPES: Enums<"fuel_type">[] = [
  "petrol",
  "diesel",
  "hybrid",
  "electric",
  "lpg",
];
const DRIVETRAINS: Enums<"drivetrain_type">[] = ["fwd", "rwd", "awd", "4wd"];

export function CarForm({
  car,
  options,
}: {
  car?: AdminCarDetail;
  options: CarFormOptions;
}) {
  const isEdit = Boolean(car);
  const [submitting, setSubmitting] = useState(false);

  const [makes, setMakes] = useState(options.makes);
  const [models, setModels] = useState(options.models);
  const [categories, setCategories] = useState(options.categories);
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);

  const [makeId, setMakeId] = useState(car?.makeId ?? "");
  const [modelId, setModelId] = useState(car?.modelId ?? "");
  const [categoryId, setCategoryId] = useState(car?.categoryId ?? "");
  const [year, setYear] = useState(String(car?.year ?? ""));
  const [condition, setCondition] = useState<Enums<"car_condition">>(
    car?.condition ?? "used",
  );
  const [status, setStatus] = useState<Enums<"car_status">>(
    car?.status ?? "draft",
  );
  const [transmission, setTransmission] = useState(car?.transmission ?? "");
  const [fuelType, setFuelType] = useState(car?.fuelType ?? "");
  const [drivetrain, setDrivetrain] = useState(car?.drivetrain ?? "");
  const [isFeatured, setIsFeatured] = useState(car?.isFeatured ?? false);

  const [newMakeName, setNewMakeName] = useState("");
  const [addingMake, setAddingMake] = useState(false);
  const [newModelName, setNewModelName] = useState("");
  const [addingModel, setAddingModel] = useState(false);

  const modelsForMake = models.filter((m) => m.make_id === makeId);

  async function handleAddMake() {
    if (!newMakeName.trim()) return;
    setAddingMake(true);
    const result = await createMakeAction(newMakeName.trim());
    setAddingMake(false);
    if (result.success) {
      setMakes((prev) => [
        ...prev,
        { id: result.id, name: newMakeName.trim() },
      ]);
      setMakeId(result.id);
      setNewMakeName("");
      toast.success(`Added make "${newMakeName.trim()}"`);
    } else {
      toast.error("Couldn't add make", { description: result.error });
    }
  }

  async function handleAddModel() {
    if (!newModelName.trim() || !makeId) return;
    setAddingModel(true);
    const result = await createModelAction(makeId, newModelName.trim());
    setAddingModel(false);
    if (result.success) {
      setModels((prev) => [
        ...prev,
        { id: result.id, name: newModelName.trim(), make_id: makeId },
      ]);
      setModelId(result.id);
      setNewModelName("");
      toast.success(`Added model "${newModelName.trim()}"`);
    } else {
      toast.error("Couldn't add model", { description: result.error });
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const input: CarFormInput = {
      title: String(form.get("title") ?? ""),
      makeId,
      modelId,
      categoryId,
      year,
      vin: String(form.get("vin") ?? ""),
      price: String(form.get("price") ?? ""),
      currencyCode: String(form.get("currency_code") ?? "PKR"),
      mileage: String(form.get("mileage") ?? ""),
      condition,
      status,
      transmission,
      fuelType,
      drivetrain,
      exteriorColor: String(form.get("exterior_color") ?? ""),
      interiorColor: String(form.get("interior_color") ?? ""),
      engine: String(form.get("engine") ?? ""),
      horsepower: String(form.get("horsepower") ?? ""),
      seats: String(form.get("seats") ?? ""),
      doors: String(form.get("doors") ?? ""),
      description: String(form.get("description") ?? ""),
      isFeatured,
    };

    const result = isEdit
      ? await updateCarAction(car!.id, input)
      : await createCarAction(input);

    // createCarAction redirects on success (never returns a value in that
    // case) — only handle the result object here, which covers both the
    // edit-success path and any validation/failure path from either action.
    if (result) {
      setSubmitting(false);
      if (result.success) {
        toast.success("Vehicle saved");
      } else {
        toast.error("Something went wrong", { description: result.error });
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-4">
        <h2 className="font-display text-lg">Basic Info</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required defaultValue={car?.title} />
          </div>

          <div className="space-y-2">
            <Label>Make</Label>
            <Select
              value={makeId}
              onValueChange={(v) => {
                setMakeId(v);
                setModelId("");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a make" />
              </SelectTrigger>
              <SelectContent>
                {makes.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Input
                placeholder="Add new make…"
                value={newMakeName}
                onChange={(e) => setNewMakeName(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={addingMake}
                onClick={handleAddMake}
              >
                Add
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Model</Label>
            <Select
              value={modelId}
              onValueChange={setModelId}
              disabled={!makeId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {modelsForMake.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Input
                placeholder="Add new model…"
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
                disabled={!makeId}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={addingModel || !makeId}
                onClick={handleAddModel}
              >
                Add
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Category (optional)</Label>
              <button
                type="button"
                onClick={() => setCategoryManagerOpen(true)}
                className="text-primary text-xs font-medium hover:underline"
              >
                Manage
              </button>
            </div>
            <Select
              value={categoryId || "none"}
              onValueChange={(v) => setCategoryId(v === "none" ? "" : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <CategoryManagerDialog
              open={categoryManagerOpen}
              onOpenChange={setCategoryManagerOpen}
              categories={categories}
              onCategoriesChange={(next) => {
                setCategories(next);
                if (categoryId && !next.some((c) => c.id === categoryId)) {
                  setCategoryId("");
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Year</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a year" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vin">VIN (optional)</Label>
            <Input id="vin" name="vin" defaultValue={car?.vin ?? ""} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg">Pricing &amp; Status</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              required
              defaultValue={car?.price}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency_code">Currency Code</Label>
            <Input
              id="currency_code"
              name="currency_code"
              defaultValue={car?.currencyCode ?? "PKR"}
            />
          </div>
          <div className="space-y-2">
            <Label>Condition</Label>
            <Select
              value={condition}
              onValueChange={(v) => setCondition(v as Enums<"car_condition">)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONDITIONS.map((c) => (
                  <SelectItem key={c} value={c} className="capitalize">
                    {c.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as Enums<"car_status">)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 pt-2 sm:col-span-2">
            <Checkbox
              id="is_featured"
              checked={isFeatured}
              onCheckedChange={(checked) => setIsFeatured(checked === true)}
            />
            <Label htmlFor="is_featured" className="font-normal">
              Feature this vehicle on the homepage
            </Label>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg">Specifications</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="mileage">Mileage (km)</Label>
            <Input
              id="mileage"
              name="mileage"
              type="number"
              defaultValue={car?.mileage ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label>Transmission</Label>
            <Select
              value={transmission || "none"}
              onValueChange={(v) => setTransmission(v === "none" ? "" : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Not set" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Not set</SelectItem>
                {TRANSMISSIONS.map((t) => (
                  <SelectItem key={t} value={t} className="capitalize">
                    {t.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Fuel Type</Label>
            <Select
              value={fuelType || "none"}
              onValueChange={(v) => setFuelType(v === "none" ? "" : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Not set" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Not set</SelectItem>
                {FUEL_TYPES.map((f) => (
                  <SelectItem key={f} value={f} className="capitalize">
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Drivetrain</Label>
            <Select
              value={drivetrain || "none"}
              onValueChange={(v) => setDrivetrain(v === "none" ? "" : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Not set" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Not set</SelectItem>
                {DRIVETRAINS.map((d) => (
                  <SelectItem key={d} value={d} className="uppercase">
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="exterior_color">Exterior Color</Label>
            <Input
              id="exterior_color"
              name="exterior_color"
              defaultValue={car?.exteriorColor ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interior_color">Interior Color</Label>
            <Input
              id="interior_color"
              name="interior_color"
              defaultValue={car?.interiorColor ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="engine">Engine</Label>
            <Input id="engine" name="engine" defaultValue={car?.engine ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="horsepower">Horsepower</Label>
            <Input
              id="horsepower"
              name="horsepower"
              type="number"
              defaultValue={car?.horsepower ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seats">Seats</Label>
            <Input
              id="seats"
              name="seats"
              type="number"
              defaultValue={car?.seats ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doors">Doors</Label>
            <Input
              id="doors"
              name="doors"
              type="number"
              defaultValue={car?.doors ?? ""}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg">Description</h2>
        <Textarea
          name="description"
          rows={5}
          defaultValue={car?.description ?? ""}
        />
      </section>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? "Saving…" : isEdit ? "Save Changes" : "Create Vehicle"}
        </Button>
      </div>
    </form>
  );
}
