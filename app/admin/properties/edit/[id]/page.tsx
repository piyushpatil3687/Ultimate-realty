"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";

const amenitiesList = [
  "Parking",
  "Lift",
  "Gym",
  "Swimming Pool",
  "Security",
  "CCTV",
  "Garden",
  "Club House",
  "Children's Play Area",
  "Power Backup",
  "Water Supply",
  "Intercom",
  "Gas Pipeline",
  "Visitor Parking",
];

type FormData = {
  title: string;
  price: string;
  bhk: string;
  bedrooms: string;
  bathrooms: string;
  balconies: string;
  floor: string;
  total_floors: string;
  furnishing_status: string;
  carpet_area: string;
  built_up_area: string;
  plot_area: string;
  location: string;
  city: string;
  pincode: string;
  complete_address: string;
  google_maps_url: string;
  latitude: string;
  longitude: string;
  description: string;
  video_url: string;
};

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();

  const propertyId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [propertyType, setPropertyType] = useState("");
  const [listingType, setListingType] = useState("");

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    price: "",
    bhk: "",
    bedrooms: "",
    bathrooms: "",
    balconies: "",
    floor: "",
    total_floors: "",
    furnishing_status: "",
    carpet_area: "",
    built_up_area: "",
    plot_area: "",
    location: "",
    city: "Pune",
    pincode: "",
    complete_address: "",
    google_maps_url: "",
    latitude: "",
    longitude: "",
    description: "",
    video_url: "",
  });

  useEffect(() => {
    loadProperty();
  }, [propertyId]);

  async function loadProperty() {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", propertyId)
        .single();

      if (error) {
        console.error("Load property error:", error);
        alert("Unable to load property.");
        router.push("/admin/properties");
        return;
      }

      setPropertyType(data.property_type || "");
      setListingType(data.listing_type || "");

      setSelectedAmenities(
        Array.isArray(data.amenities) ? data.amenities : []
      );

      setExistingImages(
        Array.isArray(data.images) ? data.images : []
      );

      const videos = Array.isArray(data.videos) ? data.videos : [];

      setFormData({
        title: data.title || "",
        price: data.price || "",
        bhk: data.bhk || "",
        bedrooms: data.bedrooms || "",
        bathrooms: data.bathrooms || "",
        balconies: data.balconies || "",
        floor: data.floor || "",
        total_floors: data.total_floors || "",
        furnishing_status: data.furnishing_status || "",
        carpet_area: data.carpet_area || "",
        built_up_area: data.built_up_area || "",
        plot_area: data.plot_area || "",
        location: data.location || "",
        city: data.city || "Pune",
        pincode: data.pincode || "",
        complete_address: data.complete_address || "",
        google_maps_url: data.google_maps_url || "",
        latitude:
          data.latitude !== null && data.latitude !== undefined
            ? String(data.latitude)
            : "",
        longitude:
          data.longitude !== null && data.longitude !== undefined
            ? String(data.longitude)
            : "",
        description: data.description || "",
        video_url: videos.length > 0 ? videos[0] : "",
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong while loading the property.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function toggleAmenity(amenity: string) {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  }

  function handleImageSelection(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    setSelectedImages((prev) => [...prev, ...files]);
  }

  function removeExistingImage(index: number) {
    setExistingImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index)
    );
  }

  function removeSelectedImage(index: number) {
    setSelectedImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index)
    );
  }

  async function uploadNewImages(): Promise<string[]> {
    const uploadedUrls: string[] = [];

    for (const file of selectedImages) {
      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName = `${crypto.randomUUID()}.${extension}`;

      const filePath = `properties/${propertyId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Image upload error:", uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("property-images")
        .getPublicUrl(filePath);

      uploadedUrls.push(data.publicUrl);
    }

    return uploadedUrls;
  }

  async function handleSaveProperty(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter Property Title.");
      return;
    }

    if (!propertyType) {
      alert("Please select Property Type.");
      return;
    }

    if (!listingType) {
      alert("Please select Listing Type.");
      return;
    }

    try {
      setSaving(true);

      // Upload newly selected images
      const newImageUrls =
        selectedImages.length > 0
          ? await uploadNewImages()
          : [];

      const allImages = [
        ...existingImages,
        ...newImageUrls,
      ];

      const videos = formData.video_url.trim()
        ? [formData.video_url.trim()]
        : [];

      const updateData = {
        title: formData.title.trim(),
        property_type: propertyType,
        listing_type: listingType,
        price: formData.price.trim(),
        location: formData.location.trim(),
        city: formData.city.trim(),
        bhk: formData.bhk.trim(),
        carpet_area: formData.carpet_area.trim(),
        built_up_area: formData.built_up_area.trim(),
        description: formData.description.trim(),

        amenities: selectedAmenities,
        images: allImages,
        videos,

        latitude: formData.latitude.trim()
          ? Number(formData.latitude)
          : null,

        longitude: formData.longitude.trim()
          ? Number(formData.longitude)
          : null,

        bedrooms: formData.bedrooms.trim(),
        bathrooms: formData.bathrooms.trim(),
        balconies: formData.balconies.trim(),
        floor: formData.floor.trim(),
        total_floors: formData.total_floors.trim(),
        furnishing_status: formData.furnishing_status.trim(),
        pincode: formData.pincode.trim(),
        complete_address: formData.complete_address.trim(),
        google_maps_url: formData.google_maps_url.trim(),
        plot_area: formData.plot_area.trim(),

        updated_at: new Date().toISOString(),
      };

      console.log("Updating property:", propertyId);
      console.log("Update data:", updateData);

      const { error } = await supabase
        .from("properties")
        .update(updateData)
        .eq("id", propertyId);

      if (error) {
        console.error("UPDATE ERROR:", error);
        alert(`Update failed: ${error.message}`);
        return;
      }

      alert("Property updated successfully!");

      // Go back to property list
      window.location.href = "/admin/properties";
    } catch (error: any) {
      console.error("Save error:", error);
      alert(
        `Something went wrong: ${
          error?.message || "Unknown error"
        }`
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          Loading property...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.eyebrow}>
            PROPERTY MANAGEMENT
          </div>

          <h1 className={styles.title}>
            Edit Property
          </h1>

          <p className={styles.subtitle}>
            Update property information, specifications,
            location, amenities and media.
          </p>
        </div>

        <form onSubmit={handleSaveProperty}>
          {/* BASIC INFORMATION */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>01</div>

              <h2 className={styles.sectionTitle}>
                Basic Information
              </h2>
            </div>

            <div className={styles.grid}>
              <div className={`${styles.field} ${styles.full}`}>
                <label className={styles.label}>
                  Property Title{" "}
                  <span className={styles.required}>*</span>
                </label>

                <input
                  className={styles.input}
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Luxury 3 BHK Apartment"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Property Type{" "}
                  <span className={styles.required}>*</span>
                </label>

                <select
                  className={styles.select}
                  value={propertyType}
                  onChange={(e) =>
                    setPropertyType(e.target.value)
                  }
                >
                  <option value="">
                    Select Property Type
                  </option>
                  <option value="Flat">Flat</option>
                  <option value="Apartment">
                    Apartment
                  </option>
                  <option value="Villa">Villa</option>
                  <option value="Plot">Plot</option>
                  <option value="Commercial">
                    Commercial
                  </option>
                  <option value="Office">Office</option>
                  <option value="Shop">Shop</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Listing Type{" "}
                  <span className={styles.required}>*</span>
                </label>

                <select
                  className={styles.select}
                  value={listingType}
                  onChange={(e) =>
                    setListingType(e.target.value)
                  }
                >
                  <option value="">
                    Select Listing Type
                  </option>
                  <option value="Sale">Sale</option>
                  <option value="Rent">Rent</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Price
                </label>

                <input
                  className={styles.input}
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="₹50 Lakh"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  BHK
                </label>

                <select
                  className={styles.select}
                  name="bhk"
                  value={formData.bhk}
                  onChange={handleChange}
                >
                  <option value="">Select BHK</option>
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="4 BHK">4 BHK</option>
                  <option value="5 BHK">5 BHK</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </section>

          {/* PROPERTY DETAILS */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>02</div>

              <h2 className={styles.sectionTitle}>
                Property Details
              </h2>
            </div>

            <div className={styles.gridThree}>
              <div className={styles.field}>
                <label className={styles.label}>
                  Bedrooms
                </label>

                <input
                  className={styles.input}
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  placeholder="e.g. 2"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Bathrooms
                </label>

                <input
                  className={styles.input}
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  placeholder="e.g. 2"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Balconies
                </label>

                <input
                  className={styles.input}
                  name="balconies"
                  value={formData.balconies}
                  onChange={handleChange}
                  placeholder="e.g. 2"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Floor
                </label>

                <input
                  className={styles.input}
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  placeholder="e.g. 5th Floor"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Total Floors
                </label>

                <input
                  className={styles.input}
                  name="total_floors"
                  value={formData.total_floors}
                  onChange={handleChange}
                  placeholder="e.g. 12"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Furnishing Status
                </label>

                <select
                  className={styles.select}
                  name="furnishing_status"
                  value={formData.furnishing_status}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Status
                  </option>
                  <option value="Unfurnished">
                    Unfurnished
                  </option>
                  <option value="Semi-Furnished">
                    Semi-Furnished
                  </option>
                  <option value="Fully Furnished">
                    Fully Furnished
                  </option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Carpet Area
                </label>

                <input
                  className={styles.input}
                  name="carpet_area"
                  value={formData.carpet_area}
                  onChange={handleChange}
                  placeholder="e.g. 900 sq.ft."
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Built-up Area
                </label>

                <input
                  className={styles.input}
                  name="built_up_area"
                  value={formData.built_up_area}
                  onChange={handleChange}
                  placeholder="e.g. 1100 sq.ft."
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Plot Area
                </label>

                <input
                  className={styles.input}
                  name="plot_area"
                  value={formData.plot_area}
                  onChange={handleChange}
                  placeholder="e.g. 2000 sq.ft."
                />
              </div>
            </div>
          </section>

          {/* LOCATION */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>03</div>

              <h2 className={styles.sectionTitle}>
                Location Details
              </h2>
            </div>

            <div className={styles.grid}>
              <div className={styles.field}>
                <label className={styles.label}>
                  Locality
                </label>

                <input
                  className={styles.input}
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ravet, Pune"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  City
                </label>

                <input
                  className={styles.input}
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Pune"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Pincode
                </label>

                <input
                  className={styles.input}
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="e.g. 412101"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Google Maps URL
                </label>

                <input
                  className={styles.input}
                  name="google_maps_url"
                  value={formData.google_maps_url}
                  onChange={handleChange}
                  placeholder="Paste Google Maps link"
                />
              </div>

              <div className={`${styles.field} ${styles.full}`}>
                <label className={styles.label}>
                  Complete Address
                </label>

                <input
                  className={styles.input}
                  name="complete_address"
                  value={formData.complete_address}
                  onChange={handleChange}
                  placeholder="Enter complete property address"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Latitude
                </label>

                <input
                  className={styles.input}
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="e.g. 18.6508"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Longitude
                </label>

                <input
                  className={styles.input}
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="e.g. 73.7581"
                />
              </div>
            </div>
          </section>

          {/* DESCRIPTION */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>04</div>

              <h2 className={styles.sectionTitle}>
                Property Overview
              </h2>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Description
              </label>

              <textarea
                className={styles.textarea}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a detailed description of the property..."
              />
            </div>
          </section>

          {/* AMENITIES */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>05</div>

              <h2 className={styles.sectionTitle}>
                Amenities
              </h2>
            </div>

            <div className={styles.amenities}>
              {amenitiesList.map((amenity) => (
                <label
                  key={amenity}
                  className={styles.amenity}
                >
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={selectedAmenities.includes(
                      amenity
                    )}
                    onChange={() =>
                      toggleAmenity(amenity)
                    }
                  />

                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </section>

          {/* IMAGES */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>06</div>

              <h2 className={styles.sectionTitle}>
                Property Photos
              </h2>
            </div>

            {existingImages.length > 0 && (
              <>
                <p className={styles.subtitle}>
                  Existing property photos
                </p>

                <div className={styles.imagesGrid}>
                  {existingImages.map((image, index) => (
                    <div
                      className={styles.imageCard}
                      key={`${image}-${index}`}
                    >
                      <img
                        src={image}
                        alt={`Property ${index + 1}`}
                      />

                      <button
                        type="button"
                        className={styles.removeImage}
                        onClick={() =>
                          removeExistingImage(index)
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className={styles.uploadBox}>
              <label className={styles.label}>
                Add New Photos
              </label>

              <input
                type="file"
                className={styles.fileInput}
                accept="image/*"
                multiple
                onChange={handleImageSelection}
              />
            </div>

            {selectedImages.length > 0 && (
              <>
                <p className={styles.subtitle}>
                  New photos selected
                </p>

                <div className={styles.imagesGrid}>
                  {selectedImages.map((file, index) => (
                    <div
                      className={styles.imageCard}
                      key={`${file.name}-${index}`}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                      />

                      <button
                        type="button"
                        className={styles.removeImage}
                        onClick={() =>
                          removeSelectedImage(index)
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>

          {/* VIDEO */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>07</div>

              <h2 className={styles.sectionTitle}>
                Property Video
              </h2>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Video URL
              </label>

              <input
                className={styles.input}
                name="video_url"
                value={formData.video_url}
                onChange={handleChange}
                placeholder="Paste YouTube / video URL"
              />
            </div>
          </section>

          {/* ACTIONS */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() =>
                router.push("/admin/properties")
              }
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.saveButton}
              disabled={saving}
            >
              {saving
                ? "Saving Changes..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}