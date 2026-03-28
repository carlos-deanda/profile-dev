import React, { useState } from 'react';

const Contactme = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleOnchange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(form);
  };

  const handleSendEmail = async(e) => {
    e.preventDefault();
    const data = await fetch('/api/server', {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        message: form.message,
      }),
    });

    const res = await data.json();
    console.log(res);
  };


  return (
    <div>
      Contactme
      <div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleOnchange}
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleOnchange}
          />
        </div>
        <div style={{ paddingTop: '20px' }}>
          <textarea
            name="message"
            type="message"
            rows="10"
            cols="50"
            value={form.message}
            onChange={handleOnchange}
          />
        </div>
        <button style={{ width: '140px', height: '40px' }}>Contact Me</button>
      </div>
      <button onclick={handleSendEmail}>Go Back</button>
    </div>
  );
};

export default Contactme;