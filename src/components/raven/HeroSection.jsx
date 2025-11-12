const HeroSection = ({ hero, logos = [] }) => {
  if (!hero) return null;

  return (
    <section
      className="banner-area bg-relative banner-area-2 bg-cover raven-hero py-5 mt-0"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(4,37,92,0.92), rgba(12,44,148,0.85)), url('/assets/img/ct/hero.jpg')",
      }}
    >
      <div className="container text-white">
        <div className="row align-items-center g-5">
          <div className="col-lg-7 order-2 order-lg-1">
            <p className="text-uppercase mb-2 letter-spacing-2 fw-semibold text-white">
              {hero.kicker}
            </p>
            <h1 className="title text-white mb-4">{hero.title}</h1>
            {hero.paragraphs?.map((paragraph) => (
              <p className="content text-white mb-3" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
          <div className="col-lg-5 order-1 order-lg-2">
            <div className="rounded-4 overflow-hidden shadow-lg bg-white">
              <img
                src={hero.image}
                alt="Raven Air Blast Sprayer"
                className="img-fluid"
              />
            </div>
            <div className="d-flex flex-wrap align-items-center gap-3 mt-4 justify-content-center justify-content-lg-end">
              {logos.map((logo) => (
                <div key={logo.alt} className="bg-white rounded-3 py-2 px-3">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    style={{ maxHeight: 36 }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
