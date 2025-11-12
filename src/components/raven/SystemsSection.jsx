const ratioWrapper = {
  position: "relative",
  width: "100%",
  paddingBottom: "62%",
  overflow: "hidden",
  borderRadius: "16px",
  background: "transparent",
};

const ratioImage = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "contain",
  padding: "1rem",
};

const paragraphStyle = {
  wordBreak: "break-word",
  overflowWrap: "anywhere",
};

const SystemsSection = ({ implementNote, options, connectivity }) => {
  if (!implementNote && (!options?.length || !connectivity)) return null;

  return (
    <section className="pd-top-60 pd-bottom-90 bg-light">
      <div className="container">
        <div className="bg-white rounded-4 shadow-sm mb-5 p-4 p-md-5 d-flex flex-column flex-lg-row align-items-center gap-4">
          <div className="flex-shrink-0">
            <img
              src="/assets/img/raven-brocure/rcm.png"
              alt="RCM Universal"
              style={{ maxHeight: 170, width: "auto" }}
            />
          </div>
          <div className="flex-grow-1">
            <h5 className="mb-3 text-uppercase">Implement Base Kit</h5>
            <p className="mb-0 text-dark mt-3" style={paragraphStyle}>
              {implementNote}
            </p>
          </div>
        </div>

        <div className="section-title text-center mb-5">
          <h6 className="sub-title">Tractor Control Options</h6>
          <h2 className="title">Choose the in-cab experience that fits your crew</h2>
        </div>

        <div className="row g-4">
          {options?.map((option) => (
            <div className="col-md-6" key={option.title}>
              <div className="bg-white rounded-4 shadow-sm p-4 h-100 d-flex flex-column">
                <div style={ratioWrapper} className="mb-3">
                  <img src={option.image} alt={option.title} style={ratioImage} />
                </div>
                <h5 className="mb-3 text-uppercase">{option.title}</h5>
                <p className="mb-0 flex-grow-1" style={paragraphStyle}>
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {connectivity ? (
          <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 mt-5 d-flex flex-column flex-lg-row align-items-center gap-4">
            <div className="flex-grow-1">
              <h3 className="mb-3">{connectivity.title}</h3>
              <p className="mb-0" style={paragraphStyle}>
                {connectivity.description}
              </p>
            </div>
            {connectivity.icon ? (
              <div className="flex-shrink-0">
                <img
                  src={connectivity.icon}
                  alt="Field Hub 2.1"
                  style={{ maxHeight: 170, width: "auto" }}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default SystemsSection;
