const ContactStrip = ({ contact }) => {
  if (!contact) return null;

  return (
    <div
      className="py-4"
      style={{ background: "linear-gradient(120deg, #041a3b, #0c2c94)" }}
    >
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center gap-3 text-center text-md-start text-white">
          <strong>{contact.text}</strong>
          <span>•</span>
          <a href={contact.website.href} className="text-decoration-none text-white">
            {contact.website.label}
          </a>
          <span>•</span>
          <a href={contact.instagram.href} className="text-decoration-none text-white">
            {contact.instagram.label}
          </a>
          <span>•</span>
          <a href={contact.phone.href} className="text-decoration-none text-white">
            {contact.phone.label}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactStrip;
