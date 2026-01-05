"use client";

import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    // 1. Validation Logic
    const nameRegex = /^[a-zA-Z\s]+$/;
    const phoneRegex = /^[0-9]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!nameRegex.test(formData.name)) {
      setErrorMessage("Full name must only contain letters and spaces.");
      setStatus("error");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Only Gmail addresses (@gmail.com) are allowed.");
      setStatus("error");
      return;
    }

    if (!phoneRegex.test(formData.phone)) {
      setErrorMessage("Phone number must contain only numbers.");
      setStatus("error");
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_NUCPA_API_BASE_URL || "https://nucpa-regestration-production.up.railway.app";
      const response = await fetch(`${apiUrl}/registration/contact/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle DRF serializer errors
        const errorKey = Object.keys(data)[0];
        const errorVal = Array.isArray(data[errorKey]) ? data[errorKey][0] : data[errorKey];
        throw new Error(errorVal || "Failed to send message");
      }

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err: any) {
      console.error("Submission error:", err);
      setStatus("error");

      const apiUrl = process.env.NEXT_PUBLIC_NUCPA_API_BASE_URL || "https://nucpa-regestration-production.up.railway.app";
      const targetUrl = `${apiUrl}/registration/contact/`;
      let msg = err.message || "Something went wrong. Please try again.";

      if (msg.includes("Failed to fetch")) {
        msg = `Connectivity issue: Cannot reach ${targetUrl}. Please ensure your backend is online and CORS is enabled.`;
      }
      setErrorMessage(msg);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name.toLowerCase().replace("your ", "")]: value }));
  };

  // Map placeholders to formData keys
  const getBindingValue = (placeholder: string) => {
    const key = placeholder.toLowerCase().replace("your ", "").replace("telephone number", "phone");
    return (formData as any)[key] || "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
    setFormData(prev => ({ ...prev, [key]: e.target.value }));
  };

  return (
    <section id="contact" className="bg-dots-contact">
      <div className="container-md py-16">
        <h2 className="text-center font-pixel text-2xl sm:text-3xl">CONTACT US</h2>

        <div className="mt-10 bg-white border border-line rounded-xl2 shadow-soft p-6 sm:p-8">
          <div className="font-pixel text-[18px] mb-6 text-muted">
            Let&apos;s Connect/Talk/??
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input
                required
                name="name"
                value={formData.name}
                onChange={(e) => handleInputChange(e, 'name')}
                className="w-full rounded-full border border-line px-8 py-4 outline-none focus:ring-2 focus:ring-teal/40"
                placeholder="Your Name"
              />
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleInputChange(e, 'email')}
                className="w-full rounded-full border border-line px-8 py-4 outline-none focus:ring-2 focus:ring-teal/40"
                placeholder="Your Email"
              />
              <input
                required
                name="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange(e, 'phone')}
                className="w-full rounded-full border border-line px-8 py-4 outline-none focus:ring-2 focus:ring-teal/40"
                placeholder="Your Telephone Number"
              />
            </div>

            <textarea
              required
              name="message"
              value={formData.message}
              onChange={(e) => handleInputChange(e, 'message')}
              className="w-full min-h-[140px] rounded-xl border border-line px-8 py-4 outline-none focus:ring-2 focus:ring-teal/40 resize-none"
              placeholder="Your Message"
            />

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={status === "loading"}
                className={`w-full rounded-full bg-teal text-white py-4 text-[16px] font-semibold shadow-soft hover:opacity-95 transition-all flex items-center justify-center gap-2 ${status === "loading" ? "opacity-70 cursor-not-allowed" : ""
                  }`}
              >
                {status === "loading" ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    SENDING...
                  </>
                ) : (
                  "SEND"
                )}
              </button>

              {status === "success" && (
                <p className="mt-4 text-center font-pixel text-teal text-sm animate-in fade-in slide-in-from-top-2">
                  ✓ Message sent successfully!
                </p>
              )}
              {status === "error" && (
                <p className="mt-4 text-center font-pixel text-red text-sm animate-in fade-in slide-in-from-top-2">
                  ❌ {errorMessage}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
