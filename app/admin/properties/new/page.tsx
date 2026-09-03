"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { supabase } from "@/lib/supabase";

export default function AddPropertyPage() {
  const [propertyType, setPropertyType] = useState("");
  const [listingType, setListingType] = useState("");

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);

  // Select images
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

    // Allow selecting the same file again
    event.target.value = "";
  };

  // Remove selected image
  const removeSelectedImage = (index: number) => {
    setSelectedImages((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  // Upload images to Supabase Storage
  const uploadImages = async () => {
    if (selectedImages.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    setUploadingImages(true);

    try {
      const imageUrls: string[] = [];

      for (const image of selectedImages) {
        const fileExtension =
          image.name.split(".").pop()?.toLowerCase() || "jpg";

        const fileName =
          `${crypto.randomUUID()}.${fileExtension}`;

        const filePath =
          `properties/${fileName}`;

        const { error: uploadError } =
          await supabase.storage
            .from("property-images")
            .upload(filePath, image);

        if (uploadError) {
          throw uploadError;
        }

        const { data } =
          supabase.storage
            .from("property-images")
            .getPublicUrl(filePath);

        imageUrls.push(data.publicUrl);
      }

      setUploadedImageUrls((previous) => [
        ...previous,
        ...imageUrls,
      ]);

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

        <a
          href="/admin/properties"
          className={styles.backLink}
        >
          ← Properties
        </a>
      </header>


      <form className={styles.propertyForm}>

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
              <label>
                Property Title *
              </label>

              <input
                type="text"
                name="title"
                placeholder="Example: Premium 3 BHK Apartment in Ravet"
              />
            </div>


            <div className={styles.formGroup}>

              <label>
                Property Type *
              </label>

              <select
                value={propertyType}
                onChange={(e) =>
                  setPropertyType(e.target.value)
                }
              >
                <option value="">
                  Select property type
                </option>

                <option value="Flat">
                  Flat
                </option>

                <option value="Apartment">
                  Apartment
                </option>

                <option value="Villa">
                  Villa
                </option>

                <option value="Plot">
                  Plot
                </option>

                <option value="Commercial">
                  Commercial
                </option>

                <option value="Office">
                  Office
                </option>

                <option value="Shop">
                  Shop
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

            </div>


            <div className={styles.formGroup}>

              <label>
                Listing Type *
              </label>

              <select
                value={listingType}
                onChange={(e) =>
                  setListingType(e.target.value)
                }
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

              <label>
                Price *
              </label>

              <input
                type="text"
                name="price"
                placeholder="Example: ₹85 Lakh"
              />

            </div>


            <div className={styles.formGroup}>

              <label>
                BHK
              </label>

              <select name="bhk">

                <option value="">
                  Select BHK
                </option>

                <option value="1 BHK">
                  1 BHK
                </option>

                <option value="2 BHK">
                  2 BHK
                </option>

                <option value="3 BHK">
                  3 BHK
                </option>

                <option value="4 BHK">
                  4 BHK
                </option>

                <option value="5 BHK">
                  5 BHK
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

          </div>

        </section>


        {/* 02 PROPERTY DETAILS */}

        <section className={styles.propertySection}>

          <div className={styles.sectionHeading}>

            <span>02</span>

            <div>
              <h2>
                Property Details
              </h2>

              <p>
                Add rooms, floor and area information.
              </p>
            </div>

          </div>


          <div className={styles.formGrid}>

            <div className={styles.formGroup}>
              <label>
                Bedrooms
              </label>

              <input
                type="number"
                placeholder="Example: 3"
              />
            </div>


            <div className={styles.formGroup}>
              <label>
                Bathrooms
              </label>

              <input
                type="number"
                placeholder="Example: 2"
              />
            </div>


            <div className={styles.formGroup}>
              <label>
                Balconies
              </label>

              <input
                type="number"
                placeholder="Example: 2"
              />
            </div>


            <div className={styles.formGroup}>
              <label>
                Floor
              </label>

              <input
                type="text"
                placeholder="Example: 8th Floor"
              />
            </div>


            <div className={styles.formGroup}>
              <label>
                Total Floors
              </label>

              <input
                type="number"
                placeholder="Example: 15"
              />
            </div>


            <div className={styles.formGroup}>

              <label>
                Furnishing Status
              </label>

              <select>

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

              <label>
                Carpet Area
              </label>

              <input
                type="text"
                placeholder="Example: 1200 sq.ft"
              />

            </div>


            <div className={styles.formGroup}>

              <label>
                Built-up Area
              </label>

              <input
                type="text"
                placeholder="Example: 1450 sq.ft"
              />

            </div>


            <div className={styles.formGroup}>

              <label>
                Plot Area
              </label>

              <input
                type="text"
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
              <h2>
                Location
              </h2>

              <p>
                Provide the property's location information.
              </p>
            </div>

          </div>


          <div className={styles.formGrid}>

            <div className={styles.formGroup}>

              <label>
                Locality *
              </label>

              <input
                type="text"
                placeholder="Example: Ravet"
              />

            </div>


            <div className={styles.formGroup}>

              <label>
                City *
              </label>

              <input
                type="text"
                defaultValue="Pune"
              />

            </div>


            <div className={styles.formGroup}>

              <label>
                Pincode
              </label>

              <input
                type="text"
                placeholder="Example: 412101"
              />

            </div>


            <div
              className={`${styles.formGroup} ${styles.fullWidth}`}
            >

              <label>
                Complete Address
              </label>

              <textarea
                rows={3}
                placeholder="Enter complete property address..."
              />

            </div>


            <div
              className={`${styles.formGroup} ${styles.fullWidth}`}
            >

              <label>
                Google Maps URL
              </label>

              <input
                type="url"
                placeholder="Paste Google Maps location URL"
              />

            </div>


            <div className={styles.formGroup}>

              <label>
                Latitude
              </label>

              <input
                type="text"
                placeholder="Example: 18.6500"
              />

            </div>


            <div className={styles.formGroup}>

              <label>
                Longitude
              </label>

              <input
                type="text"
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
              <h2>
                Description
              </h2>

              <p>
                Write complete information about the property.
              </p>
            </div>

          </div>


          <div className={styles.formGroup}>

            <textarea
              rows={8}
              placeholder="Describe the property, nearby locations, connectivity, special features and other important information..."
            />

          </div>

        </section>


        {/* 05 AMENITIES */}

        <section className={styles.propertySection}>

          <div className={styles.sectionHeading}>

            <span>05</span>

            <div>
              <h2>
                Amenities
              </h2>

              <p>
                Select all amenities available at the property.
              </p>
            </div>

          </div>


          <div className={styles.amenitiesGrid}>

            {[
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
            ].map((amenity) => (

              <label
                key={amenity}
                className={styles.amenityItem}
              >

                <input
                  type="checkbox"
                  value={amenity}
                />

                <span>
                  {amenity}
                </span>

              </label>

            ))}

          </div>

        </section>


        {/* 06 PROPERTY PHOTOS */}

        <section className={styles.propertySection}>

          <div className={styles.sectionHeading}>

            <span>06</span>

            <div>
              <h2>
                Property Photos
              </h2>

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
              disabled={uploadingImages}
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

              <h2>
                Property Video
              </h2>

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
              />

            </label>

          </div>


          <div
            className={`${styles.formGroup} ${styles.videoUrl}`}
          >

            <label>
              Or Video URL
            </label>

            <input
              type="url"
              placeholder="YouTube or video URL"
            />

          </div>

        </section>


        {/* ACTIONS */}

        <div className={styles.propertyActions}>

          <button
            type="button"
            className={styles.cancelButton}
          >
            Cancel
          </button>


          <button
            type="submit"
            className={styles.saveButton}
          >
            Save Property →
          </button>

        </div>

      </form>

    </main>
  );
}