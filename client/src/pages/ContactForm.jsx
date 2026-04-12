import React, { useState } from "react";

const ContactForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    alert("Message sent successfully 🚀");
    setForm({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-gradient-to-br from-blue-100 via-blue-50 to-gray-200 p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 mb-1">
        Contact & Suggestions
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 mb-5">
        We’ll respond as soon as possible.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs font-medium text-slate-600">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter Your Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full mt-1 bg-white border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 text-sm"
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Email</label>
          <input
            type="email"
            name="email"
            placeholder="yourname@gmail.com "
            value={form.email}
            onChange={handleChange}
            className="w-full mt-1 bg-white border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 text-sm"
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Message</label>
          <textarea
            name="message"
            placeholder="If you have any suggestions or queries.."
            rows="3"
            value={form.message}
            onChange={handleChange}
            className="w-full mt-1 bg-white border border-slate-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-slate-700 text-white py-2.5 rounded-lg hover:bg-slate-800 transition text-sm font-medium"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactForm;