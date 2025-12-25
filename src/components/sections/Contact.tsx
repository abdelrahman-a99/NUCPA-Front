"use client";

export default function Contact() {
  return (
    <section id="contact" className="bg-dots-contact">
      <div className="container-md py-16">
        <h2 className="text-center font-pixel text-2xl sm:text-3xl">CONTACT US</h2>

        <div className="mt-10 bg-white border border-line rounded-xl2 shadow-soft p-6 sm:p-8">
          <div className="font-pixel text-[18px] mb-6 text-muted">
            Let&apos;s Connect/Talk/??
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Wait to integrate with the backend");
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-4">
              <input
                className="w-full rounded-full border border-line px-8 py-4 outline-none focus:ring-2 focus:ring-teal/40"
                placeholder="Your Name"
              />
              <input
                className="w-full rounded-full border border-line px-8 py-4 outline-none focus:ring-2 focus:ring-teal/40"
                placeholder="Your Email"
                type="email"
              />
              <input
                className="w-full rounded-full border border-line px-8 py-4 outline-none focus:ring-2 focus:ring-teal/40"
                placeholder="Your Telephone Number"
              />
            </div>

            <textarea
              className="w-full min-h-[140px] rounded-xl border border-line px-8 py-4 outline-none focus:ring-2 focus:ring-teal/40 resize-none"
              placeholder="Your Message"
            />

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full rounded-full bg-teal text-white py-4 text-[16px] font-semibold shadow-soft hover:opacity-95"
              >
                SEND
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
