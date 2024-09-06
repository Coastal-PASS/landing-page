import React from "react";

const AboutAreaOne = () => {
  return (
    <>
      {/* ================== AboutAreaOne start  ==================*/}
      <div className="about-area pd-top-120">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div
                className="about-thumb-inner pe-xl-5 me-xl-5 "
                data-aos="fade-right"
                data-aos-delay="100"
                data-aos-duration="1500"
              >
                <img
                  className="animate-img-1 top_image_bounce"
                  src="assets/img/about/2.png"
                  alt="img"
                />
                <img
                  className="animate-img-2 left_image_bounce"
                  src="assets/img/about/3.png"
                  alt="img"
                />
                <img
                  className="animate-img-3 top_image_bounce"
                  src="assets/img/banner/5.svg"
                  alt="img"
                />
                <img
                  className="main-img"
                  src="assets/img/ct/trucks.png"
                  alt="img"
                />
              </div>
            </div>
            <div
              className="col-lg-6 "
              data-aos="fade-left"
              data-aos-delay="100"
              data-aos-duration="1500"
            >
              <div className="section-title mt-5 mt-lg-0">
                <h6 className="sub-title">Lets Talk</h6>
                <p className="content mb-2 mb-xl-3">
                  At Coastal PASS, we believe good business starts with a
                  conversation—not just a form. With deep roots in agriculture,
                  we provide high-tech solutions paired with the personal,
                  old-fashioned service you deserve. Like the farmers we serve,
                  we value relationships built on trust and a handshake, whether
                  it's over the phone or in person, to help you find the best
                  solutions for your operation.
                </p>
                <div className="row">
                  <p className="content mb-2 mb-xl-3">
                    We are here to help with whatever you need, whenever you
                    need it. If you're local, feel free to stop by for a
                    face-to-face chat; we love nothing more than getting to know
                    the people we work with. And if you're pressed for time, we
                    are just a phone call away.
                  </p>
                  <div className="col-md-6">
                    <p className="content mb-2 mb-xl-3">
                      We're more than happy to meet you on your terms—whether
                      it's at the farm, over the phone, or a visit to our
                      office. Just let us know how you would like to connect!
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="content mb-2 mb-xl-3">
                      Prefer digital? We understand that too. If you would
                      rather send us a message, feel free to email us, and we
                      will get back to you as soon as possible.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ================== AboutAreaOne End  ==================*/}
    </>
  );
};

export default AboutAreaOne;
