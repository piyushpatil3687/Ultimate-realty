"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { supabase } from "@/lib/supabase";

type PropertyFormData = {
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

const initialFormData: PropertyFormData = {
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
};

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

export default function AddPropertyPage() {
  const router = useRouter();

  const [formData, setFormData] =
    useState<PropertyFormData>(initialFormData);

  const [propertyType, setPropertyType] = useState("");
  const [listingType, setListingType] = useState("");

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const [saving, setSaving] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  /* --------------------------------
     AUTH CHECK
  -------------------------------- */

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.replace("/admin/login");
        return;
      }

      setCheckingAuth(false);
    };

    checkUser();
  }, [router]);

  /* --------------------------------
     FORM CHANGE
  -------------------------------- */

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* --------------------------------
     AMENITIES
  -------------------------------- */

  const handleAmenityChange = (amenity: string) => {
    setSelectedAmenities((previous) => {
      if (previous.includes(amenity)) {
        return previous.filter((item) => item !== amenity);
      }

      return [...previous, amenity];
    });
  };

  /* --------------------------------
     IMAGE SELECT
  -------------------------------- */

  const handleImageSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) {
      return;
    }

    setSelectedImages((previous) => [
      ...previous,
      ...files,
    ]);

    event.target.value = "";
  };

  /* --------------------------------
     REMOVE SELECTED IMAGE
  -------------------------------- */

  const removeSelectedImage = (index: number) => {
    setSelectedImages((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  /* --------------------------------
     UPLOAD IMAGES
  -------------------------------- */

  const uploadImageFiles = async (files: File[]) => {
    if (files.length === 0) {
      return [];
    }

    const imageUrls: string[] = [];

    for (const image of files) {
      const fileExtension =
        image.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName = `${crypto.randomUUID()}.${fileExtension}`;

      const filePath = `properties/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(filePath, image);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("property-images")
        .getPublicUrl(filePath);

      imageUrls.push(data.publicUrl);
    }

    return imageUrls;
  };

  const uploadImages = async () => {
    if (selectedImages.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    setUploadingImages(true);

    try {
      const imageUrls = await uploadImageFiles(selectedImages);

      setUploadedImageUrls((previous) => [
        ...previous,
        ...imageUrls,
      ]);

      setSelectedImages([]);

      alert("Images uploaded successfully.");
    } catch (error) {
      console.error("Image upload error:", error);

      alert(
        "Image upload failed. Please check your Supabase Storage settings."
      );
    } finally {
      setUploadingImages(false);
    }
  };

  /* --------------------------------
     VIDEO SELECT
  -------------------------------- */

  const handleVideoSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;

    setSelectedVideo(file);

    event.target.value = "";
  };

  /* --------------------------------
     UPLOAD VIDEO
  -------------------------------- */

  const uploadVideoFile = async (file: File) => {
    setUploadingVideo(true);

    try {
      const fileExtension =
        file.name.split(".").pop()?.toLowerCase() || "mp4";

      const fileName = `${crypto.randomUUID()}.${fileExtension}`;

      const filePath = `properties/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("property-videos")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("property-videos")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } finally {
      setUploadingVideo(false);
    }
  };

  /* --------------------------------
     SAVE PROPERTY
  -------------------------------- */

  const handleSaveProperty = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    if (!formData.title.trim()) {
      alert("Please enter the property title.");
      return;
    }

    if (!propertyType) {
      alert("Please select the property type.");
      return;
    }

    if (!listingType) {
      alert("Please select the listing type.");
      return;
    }

    if (!formData.price.trim()) {
      alert("Please enter the property price.");
      return;
    }

    if (!formData.location.trim()) {
      alert("Please enter the property locality.");
      return;
    }

    if (!formData.city.trim()) {
      alert("Please enter the city.");
      return;
    }

    setSaving(true);

    try {
      /* -----------------------------
         CHECK ADMIN USER
      ----------------------------- */

      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        alert("Your admin session has expired. Please login again.");

        router.replace("/admin/login");
        return;
      }

      /* -----------------------------
         CREATE PROPERTY ID
      ----------------------------- */

      const propertyId = crypto.randomUUID();

      /* -----------------------------
         CREATE PROPERTY FIRST
         WITH EMPTY MEDIA ARRAYS
      ----------------------------- */

      const propertyPayload = {
        id: propertyId,

        title: formData.title.trim(),

        property_type: propertyType,

        listing_type: listingType,

        price: formData.price.trim(),

        location: formData.location.trim(),

        city: formData.city.trim(),

        bhk: formData.bhk,

        bedrooms: formData.bedrooms,

        bathrooms: formData.bathrooms,

        balconies: formData.balconies,

        floor: formData.floor,

        total_floors: formData.total_floors,

        furnishing_status: formData.furnishing_status,

        carpet_area: formData.carpet_area,

        built_up_area: formData.built_up_area,

        plot_area: formData.plot_area,

        pincode: formData.pincode,

        complete_address: formData.complete_address,

        google_maps_url: formData.google_maps_url,

        latitude: formData.latitude
          ? Number(formData.latitude)
          : null,

        longitude: formData.longitude
          ? Number(formData.longitude)
          : null,

        description: formData.description,

        amenities: selectedAmenities,

        images: [],

        videos: [],

        updated_at: new Date().toISOString(),
      };

      const { error: insertError } = await supabase
        .from("properties")
        .insert(propertyPayload);

      if (insertError) {
        console.error(
          "Property insert error:",
          insertError
        );

        throw insertError;
      }

      /* -----------------------------
         UPLOAD REMAINING SELECTED IMAGES
      ----------------------------- */

      let finalImageUrls = [...uploadedImageUrls];

      if (selectedImages.length > 0) {
        const newImageUrls = await uploadImageFiles(
          selectedImages
        );

        finalImageUrls = [
          ...finalImageUrls,
          ...newImageUrls,
        ];
      }

      /* -----------------------------
         VIDEO
      ----------------------------- */

      const finalVideoUrls: string[] = [];

      if (selectedVideo) {
        const videoUrl = await uploadVideoFile(
          selectedVideo
        );

        finalVideoUrls.push(videoUrl);
      } else if (formData.video_url.trim()) {
        finalVideoUrls.push(
          formData.video_url.trim()
        );
      }

      /* -----------------------------
         UPDATE PROPERTY WITH MEDIA
      ----------------------------- */

      const { error: updateError } = await supabase
        .from("properties")
        .update({
          images: finalImageUrls,
          videos: finalVideoUrls,
          updated_at: new Date().toISOString(),
        })
        .eq("id", propertyId);

      if (updateError) {
        console.error(
          "Property media update error:",
          updateError
        );

        throw updateError;
      }

      /* -----------------------------
         SUCCESS
      ----------------------------- */

      alert("Property saved successfully! 🎉");

      router.push("/admin/properties");

      router.refresh();
    } catch (error) {
      console.error("Save property error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Unknown error";

      alert(
        `Property could not be saved.\n\nError: ${message}`
      );
    } finally {
      setSaving(false);
    }
  };

  /* --------------------------------
     CANCEL
  -------------------------------- */

  const handleCancel = () => {
    if (saving) {
      return;
    }

    router.push("/admin/properties");
  };

  /* --------------------------------
     AUTH LOADING
  -------------------------------- */

  if (checkingAuth) {
    return (
      <main className={styles.propertyPage}>
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
          }}
        >
          Checking admin access...
        </div>
      </main>
    );
  }

  return (
    <main className={styles.propertyPage}>

      {/* HEADER */}

      <header className={styles.propertyHeader}>
        <div>
          <p className={styles.breadcrumb}>
            ADMIN / PROPERTIES / ADD PROPERTY
          </p>

          <h1>Add New Property</h1>

          <p className={styles.headerDescription}>
            Create a complete property listing with details,
            media and location information.
          </p>
        </div>

        <button
          type="button"
          className={styles.backLink}
          onClick={handleCancel}
        >
          ← Properties
        </button>
      </header>

      {/* FORM */}

      <form
        className={styles.propertyForm}
        onSubmit={handleSaveProperty}
      >

        {/* 01 BASIC INFORMATION */}

        <section className={styles.propertySection}>

          <div className={styles.sectionHeading}>
            <span>01</span>

            <div>
              <h2>Basic Information</h2>

              <p>
                Enter the main information about this property.
              </p>
            </div>
          </div>

          <div className={styles.formGrid}>

            <div
              className={`${styles.formGroup} ${styles.fullWidth}`}
            >
              <label>Property Title *</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Example: Premium 3 BHK Apartment in Ravet"
                required
              />
            </div>

            <div className={styles.formGroup}>

              <label>Property Type *</label>

              <select
                value={propertyType}
                onChange={(e) =>
                  setPropertyType(e.target.value)
                }
                required
              >
                <option value="">
                  Select property type
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

            <div className={styles.formGroup}>

              <label>Listing Type *</label>

              <select
                value={listingType}
                onChange={(e) =>
                  setListingType(e.target.value)
                }
                required
              >
                <option value="">
                  Select listing type
                </option>

                <option value="Sale">
                  For Sale
                </option>

                <option value="Rent">
                  For Rent
                </option>
              </select>

            </div>

            <div className={styles.formGroup}>

              <label>Price *</label>

              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Example: ₹85 Lakh"
                required
              />

            </div>

            <div className={styles.formGroup}>

              <label>BHK</label>

              <select
                name="bhk"
                value={formData.bhk}
                onChange={handleChange}
              >
                <option value="">
                  Select BHK
                </option>

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

        {/* 02 PROPERTY DETAILS */}

        <section className={styles.propertySection}>

          <div className={styles.sectionHeading}>
            <span>02</span>

            <div>
              <h2>Property Details</h2>

              <p>
                Add rooms, floor and area information.
              </p>
            </div>
          </div>

          <div className={styles.formGrid}>

            <div className={styles.formGroup}>
              <label>Bedrooms</label>

              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                placeholder="Example: 3"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Bathrooms</label>

              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                placeholder="Example: 2"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Balconies</label>

              <input
                type="number"
                name="balconies"
                value={formData.balconies}
                onChange={handleChange}
                placeholder="Example: 2"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Floor</label>

              <input
                type="text"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                placeholder="Example: 8th Floor"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Total Floors</label>

              <input
                type="number"
                name="total_floors"
                value={formData.total_floors}
                onChange={handleChange}
                placeholder="Example: 15"
              />
            </div>

            <div className={styles.formGroup}>

              <label>Furnishing Status</label>

              <select
                name="furnishing_status"
                value={formData.furnishing_status}
                onChange={handleChange}
              >
                <option value="">
                  Select status
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

            <div className={styles.formGroup}>
              <label>Carpet Area</label>

              <input
                type="text"
                name="carpet_area"
                value={formData.carpet_area}
                onChange={handleChange}
                placeholder="Example: 1200 sq.ft"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Built-up Area</label>

              <input
                type="text"
                name="built_up_area"
                value={formData.built_up_area}
                onChange={handleChange}
                placeholder="Example: 1450 sq.ft"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Plot Area</label>

              <input
                type="text"
                name="plot_area"
                value={formData.plot_area}
                onChange={handleChange}
                placeholder="Example: 2000 sq.ft"
              />
            </div>

          </div>
        </section>

        {/* 03 LOCATION */}

        <section className={styles.propertySection}>

          <div className={styles.sectionHeading}>
            <span>03</span>

            <div>
              <h2>Location</h2>

              <p>
                Provide the property's location information.
              </p>
            </div>
          </div>

          <div className={styles.formGrid}>

            <div className={styles.formGroup}>

              <label>Locality *</label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Example: Ravet"
                required
              />

            </div>

            <div className={styles.formGroup}>

              <label>City *</label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Example: Pune"
                required
              />

            </div>

            <div className={styles.formGroup}>

              <label>Pincode</label>

              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Example: 412101"
              />

            </div>

            <div
              className={`${styles.formGroup} ${styles.fullWidth}`}
            >

              <label>Complete Address</label>

              <textarea
                name="complete_address"
                rows={3}
                value={formData.complete_address}
                onChange={handleChange}
                placeholder="Enter complete property address..."
              />

            </div>

            <div
              className={`${styles.formGroup} ${styles.fullWidth}`}
            >

              <label>Google Maps URL</label>

              <input
                type="url"
                name="google_maps_url"
                value={formData.google_maps_url}
                onChange={handleChange}
                placeholder="Paste Google Maps location URL"
              />

            </div>

            <div className={styles.formGroup}>

              <label>Latitude</label>

              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="Example: 18.6500"
              />

            </div>

            <div className={styles.formGroup}>

              <label>Longitude</label>

              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="Example: 73.7500"
              />

            </div>

          </div>
        </section>

        {/* 04 DESCRIPTION */}

        <section className={styles.propertySection}>

          <div className={styles.sectionHeading}>
            <span>04</span>

            <div>
              <h2>Description</h2>

              <p>
                Write complete information about the property.
              </p>
            </div>
          </div>

          <div className={styles.formGroup}>

            <textarea
              name="description"
              rows={8}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the property, nearby locations, connectivity, special features and other important information..."
            />

          </div>
        </section>

        {/* 05 AMENITIES */}

        <section className={styles.propertySection}>

          <div className={styles.sectionHeading}>
            <span>05</span>

            <div>
              <h2>Amenities</h2>

              <p>
                Select all amenities available at the property.
              </p>
            </div>
          </div>

          <div className={styles.amenitiesGrid}>

            {amenitiesList.map((amenity) => (

              <label
                key={amenity}
                className={styles.amenityItem}
              >

                <input
                  type="checkbox"
                  value={amenity}
                  checked={selectedAmenities.includes(
                    amenity
                  )}
                  onChange={() =>
                    handleAmenityChange(amenity)
                  }
                />

                <span>{amenity}</span>

              </label>

            ))}

          </div>
        </section>

        {/* 06 PROPERTY PHOTOS */}

        <section className={styles.propertySection}>

          <div className={styles.sectionHeading}>
            <span>06</span>

            <div>
              <h2>Property Photos</h2>

              <p>
                Upload multiple high-quality photos of the property.
              </p>
            </div>
          </div>

          <div className={styles.uploadBox}>

            <div className={styles.uploadIcon}>
              +
            </div>

            <h3>
              Upload Property Photos
            </h3>

            <p>
              JPG, PNG or WEBP · Multiple images allowed
            </p>

            <label className={styles.uploadButton}>

              Choose Photos

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageSelect}
              />

            </label>

          </div>

          {/* IMAGE PREVIEW */}

          {selectedImages.length > 0 && (

            <div className={styles.imagePreviewGrid}>

              {selectedImages.map(
                (image, index) => (

                  <div
                    key={`${image.name}-${index}`}
                    className={styles.imagePreview}
                  >

                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Property preview ${index + 1}`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeSelectedImage(index)
                      }
                      className={
                        styles.removeImageButton
                      }
                    >
                      ×
                    </button>

                    <div className={styles.imageName}>
                      {image.name}
                    </div>

                  </div>

                )
              )}

            </div>
          )}

          {/* UPLOAD BUTTON */}

          {selectedImages.length > 0 && (

            <button
              type="button"
              onClick={uploadImages}
              disabled={uploadingImages || saving}
              className={styles.uploadImagesButton}
            >

              {uploadingImages
                ? "Uploading..."
                : `Upload ${selectedImages.length} Photo${
                    selectedImages.length > 1
                      ? "s"
                      : ""
                  }`}

            </button>

          )}

          {/* SUCCESS */}

          {uploadedImageUrls.length > 0 && (

            <div className={styles.uploadSuccess}>

              ✓ {uploadedImageUrls.length} photo
              {uploadedImageUrls.length > 1
                ? "s"
                : ""} uploaded successfully

            </div>

          )}

        </section>

        {/* 07 PROPERTY VIDEO */}

        <section className={styles.propertySection}>

          <div className={styles.sectionHeading}>
            <span>07</span>

            <div>
              <h2>Property Video</h2>

              <p>
                Upload a property video or provide a video URL.
              </p>
            </div>
          </div>

          <div className={styles.uploadBox}>

            <div className={styles.uploadIcon}>
              +
            </div>

            <h3>
              Upload Property Video
            </h3>

            <p>
              MP4 or WEBM
            </p>

            <label className={styles.uploadButton}>

              Choose Video

              <input
                type="file"
                accept="video/mp4,video/webm"
                onChange={handleVideoSelect}
              />

            </label>

            {selectedVideo && (

              <p
                style={{
                  marginTop: "12px",
                  fontSize: "14px",
                }}
              >
                Selected: {selectedVideo.name}
              </p>

            )}

          </div>

          <div
            className={`${styles.formGroup} ${styles.videoUrl}`}
          >

            <label>
              Or Video URL
            </label>

            <input
              type="url"
              name="video_url"
              value={formData.video_url}
              onChange={handleChange}
              placeholder="YouTube or video URL"
            />

          </div>

        </section>

        {/* ACTIONS */}

        <div className={styles.propertyActions}>

          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleCancel}
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
              ? "Saving Property..."
              : "Save Property →"}

          </button>

        </div>

      </form>
    </main>
  );
}