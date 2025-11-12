const ClosingSection = ({ closing }) => {
  if (!closing) return null;

  return (
    <section className="pd-top-90 pd-bottom-90 bg-light">
      <div className="container">
        <div className="row g-4 align-items-center">
          <div className="col-lg-6">
            <img
              src={closing.orchardImage}
              alt="Aerial orchard view"
              className="img-fluid rounded shadow-sm"
            />
          </div>
          <div className="col-lg-6">
            <div className="section-title mt-4 mt-lg-0">
              {closing.paragraphs?.map((paragraph) => (
                <p className="content mb-3" key={paragraph} style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClosingSection;
