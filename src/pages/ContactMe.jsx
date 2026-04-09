import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ContactMe.css';

const ContactMe = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    const data = await fetch('/api/server', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const res = await data.json();
    console.log(res);
  };

  return (
    <section className="contact-container">
      <h1 className="contact-title">Contact Me</h1>
      <p className="contact-description">
        Have a project in mind or just want to say hi? Fill out the form below and I’ll get back to you!
      </p>

      <form className="contact-form" onSubmit={handleSendEmail}>
        <div className="input-group">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleOnChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleOnChange}
            required
          />
        </div>

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleOnChange}
        />

        <textarea
          name="message"
          placeholder="Your Message"
          rows="8"
          value={form.message}
          onChange={handleOnChange}
          required
        />

        <button type="submit" className="btn btn-submit">Send Message</button>
      </form>

    </section>
  );
};

export default ContactMe;