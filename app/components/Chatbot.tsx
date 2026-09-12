"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import styles from "./Chatbot.module.css";

type Message = {
  id: number;
  sender: "bot" | "user";
  text: string;
  properties?: Property[];
};

type Property = {
  id: string;
  title: string;
  property_type: string | null;
  listing_type: string | null;
  price: string | null;
  location: string | null;
  city: string | null;
  bhk: string | null;
  carpet_area: string | null;
  images: string[] | null;
};

const quickQuestions = [
  "Find a property",
  "Properties for Sale",
  "Properties for Rent",
  "Property locations",
  "Contact Ultimate Realty",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Hello! 👋 Welcome to Ultimate Realty UR. How can I help you today?",
    },
  ]);

  async function fetchProperties(listingType?: string) {
    let query = supabase
      .from("properties")
      .select(
        "id, title, property_type, listing_type, price, location, city, bhk, carpet_area, images"
      )
      .order("created_at", { ascending: false })
      .limit(3);

    if (listingType) {
      query = query.ilike("listing_type", listingType);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Chatbot property fetch error:", error);
      return [];
    }

    return (data || []) as Property[];
  }

  async function getBotReply(question: string) {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes("sale") || lowerQuestion.includes("buy")) {
      const properties = await fetchProperties();

      if (properties.length === 0) {
        return "I couldn't find any properties for Sale right now. Please check again later or contact Ultimate Realty UR.";
      }

      return `I found ${properties.length} recent properties available in our listings. You can view them in the Properties section.`;
    }

    if (lowerQuestion.includes("rent") || lowerQuestion.includes("rental")) {
      const properties = await fetchProperties();

      if (properties.length === 0) {
        return "I couldn't find any rental properties right now. Please check again later or contact Ultimate Realty UR.";
      }

      return `I found ${properties.length} recent rental listings. You can explore them in the Properties section.`;
    }

    if (
      lowerQuestion.includes("find") ||
      lowerQuestion.includes("property")
    ) {
      const properties = await fetchProperties();

      if (properties.length === 0) {
        return "I couldn't find any properties right now. Please check our Properties page or contact Ultimate Realty UR.";
      }

      return `Great! 🏠 I found ${properties.length} available properties. You can explore them and filter by location, property type, budget, BHK and Sale/Rent.`;
    }

    if (
      lowerQuestion.includes("location") ||
      lowerQuestion.includes("where")
    ) {
      return "📍 Ultimate Realty UR is based in Ravet, Mukai Chowk, Pune. We help customers explore properties across Pune.";
    }

    if (
      lowerQuestion.includes("contact") ||
      lowerQuestion.includes("phone") ||
      lowerQuestion.includes("call")
    ) {
      return "📞 You can contact Ultimate Realty UR at +91 90675 13120 or email us at ultimaterealty711@gmail.com.";
    }

    return "I'd be happy to help! 😊 You can explore properties, check Sale/Rent options, ask about locations, or contact our team.";
  }

  async function handleQuestion(question: string) {
    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: question,
    };

    setMessages((previous) => [...previous, userMessage]);

    setTimeout(async () => {
      const lowerQuestion = question.toLowerCase();

      const shouldShowProperties =
        lowerQuestion.includes("find") ||
        lowerQuestion.includes("sale") ||
        lowerQuestion.includes("rent") ||
        lowerQuestion.includes("property");

       if (shouldShowProperties) {
        let listingType: string | undefined;

        if (
          lowerQuestion.includes("sale") ||
          lowerQuestion.includes("buy")
        ) {
          listingType = "Sale";
        } else if (
          lowerQuestion.includes("rent") ||
          lowerQuestion.includes("rental")
        ) {
          listingType = "Rent";
        }

        const properties = await fetchProperties(listingType);

        const botMessage: Message = {
          id: Date.now() + 1,
          sender: "bot",
          text:
            properties.length > 0
              ? "Here are some of our latest properties 🏠"
              : "I couldn't find any properties right now. Please contact Ultimate Realty UR.",
          properties,
        };

        setMessages((previous) => [...previous, botMessage]);
        return;
      }

      const reply = await getBotReply(question);

      const botMessage: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: reply,
      };

      setMessages((previous) => [...previous, botMessage]);
    }, 400);
  }

  function handleWhatsApp() {
    window.open(
      "https://wa.me/919067513120",
      "_blank",
      "noopener,noreferrer"
    );
  }

  function handleProperties() {
    window.location.href = "/properties";
  }

  function handleContact() {
    window.location.href = "/contact";
  }

  return (
    <>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className={styles.chatBrand}>
              <div className={styles.chatLogo}>
                <img
                  src="/images/ultimate-realty-logo.png"
                  alt="Ultimate Realty"
                />
              </div>

              <div>
                <strong>Ultimate Realty UR</strong>
                <span>Property Assistant</span>
              </div>
            </div>

            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              ×
            </button>
          </div>

          <div className={styles.chatBody}>
            <div className={styles.onlineStatus}>
              <span></span>
              Online
            </div>

            <div className={styles.messages}>
              {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={
                    message.sender === "bot"
                      ? styles.botMessage
                      : styles.userMessage
                  }
                >
                  {message.text}
                </div>

                {message.properties && message.properties.length > 0 && (
                  <div className={styles.propertyResults}>
                    {message.properties.map((property) => (
                      <div
                        key={property.id}
                        className={styles.propertyCard}
                      >
                        <div className={styles.propertyImage}>
                          {property.images && property.images.length > 0 ? (
                            <img
                              src={property.images[0]}
                              alt={property.title}
                            />
                          ) : (
                            <div className={styles.noPropertyImage}>
                              🏠
                            </div>
                          )}
                        </div>

                        <div className={styles.propertyInfo}>
                          <h4>{property.title}</h4>

                          <div className={styles.propertyMeta}>
                            {property.bhk && (
                              <span>{property.bhk} BHK</span>
                            )}

                            {property.property_type && (
                              <span>{property.property_type}</span>
                            )}

                            {property.listing_type && (
                              <span>{property.listing_type}</span>
                            )}
                          </div>

                          {property.price && (
                            <div className={styles.propertyPrice}>
                              {property.price}
                            </div>
                          )}

                          {(property.location || property.city) && (
                            <div className={styles.propertyLocation}>
                              📍 {property.location || property.city}
                            </div>
                          )}

                          {property.carpet_area && (
                            <div className={styles.propertyArea}>
                              {property.carpet_area} sq.ft
                            </div>
                          )}

                          <Link
                            href={`/properties/${property.id}`}
                            className={styles.viewPropertyButton}
                          >
                            View Property →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            </div>

            <div className={styles.quickTitle}>
              How can we help?
            </div>

            <div className={styles.quickQuestions}>
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => handleQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>

            <div className={styles.actionButtons}>
              <button
                type="button"
                onClick={handleProperties}
                className={styles.primaryAction}
              >
                🏠 View Properties
              </button>

              <button
                type="button"
                onClick={handleContact}
                className={styles.secondaryAction}
              >
                📝 Send Enquiry
              </button>

              <button
                type="button"
                onClick={handleWhatsApp}
                className={styles.whatsappAction}
              >
                💬 WhatsApp Us
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        className={`${styles.chatButton} ${
          isOpen ? styles.chatButtonOpen : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? "×" : "💬"}

        {!isOpen && (
          <span className={styles.chatNotification}>
            1
          </span>
        )}
      </button>
    </>
  );
}