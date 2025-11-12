const paragraphStyle = {
  wordBreak: "break-word",
  overflowWrap: "anywhere",
};

const BulletList = ({ items }) => (
  <ul className="mb-0 ps-4" style={paragraphStyle}>
    {items?.map((item) => (
      <li key={item} className="mb-2">
        {item}
      </li>
    ))}
  </ul>
);

const AgSyncSection = ({ content }) => {
  if (!content) return null;

  return (
    <section className="about-area pd-top-90 pd-bottom-60">
      <div className="container">
        <div className="row g-4 align-items-center">
          <div className="col-lg-6">
            <div className="about-thumb-inner pe-xl-5 me-xl-5">
              <img
                src={content.screenshot}
                alt="AgSync Dispatch Pro"
                className="w-100 rounded shadow-sm"
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="section-title mt-4 mt-lg-0">
              <h6 className="sub-title">- {content.platformTitle}</h6>
                <p className="content mb-3" style={paragraphStyle}>
                  <strong>Unmatched scheduling platform:</strong> {content.platformIntro}
                </p>
              <BulletList items={content.platformBullets} />
              <p className="content mt-4 mb-2 fw-bold" style={paragraphStyle}>
                • {content.advantageTitle}
              </p>
              <BulletList items={content.advantageBullets} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgSyncSection;
