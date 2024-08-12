import React from 'react';

const ContactPage = (appInfo) => {
  return (
    <>
      <div
        className="company-container static-banner"
        style={{ backgroundImage: "url('/admin-icons/contact/banner.png')" }}
      ></div>
      <section className="company-container --small">
        <h1 className="company__title" style={{ marginTop: '190px' }}>
          If you have any questions, suggestions, or simply want to reach out to us, we're here to assist you
        </h1>

        <ul className="company-contact-options">
          <li>
            <div className="co-icon">
              <img src="/icons/contact/phone.png" style={{ width: '40px' }} alt="" />
            </div>
            <div className="co-text">
              <a href="tel:+15551234567">+1 (555) 123-4567</a>
            </div>
          </li>
          <li>
            <div className="co-icon">
              <img src="/icons/contact/mail.png" style={{ height: '32px' }} alt="" />
            </div>
            <div className="co-text">
              <a href="mailto:andr.morozov96@gmail.com">andr.morozov96@gmail.com</a>
            </div>
          </li>
          <li>
            <div className="co-icon">
              <img src="/icons/contact/chat.png" alt="" />
            </div>
            <div className="co-text">
              <a href="mailto:andr.morozov96@gmail.com">online-chat</a>
            </div>
          </li>
        </ul>
      </section>
      <div id="feedback-root"></div>
    </>
  );
};

export default ContactPage;
