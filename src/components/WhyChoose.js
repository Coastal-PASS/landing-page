import React from "react";

const WhyChoose = () => {
  return (
    <div className="why-choose-area pd-bottom-120 pd-top-120">
      <div className="container">
        <div className="section-title mt-4 mt-lg-0">
          <div className="row">
            <div className="col-lg-5">
              <h6 className="color-base bg-none mb-3">Why choose us?</h6>
              <h2 className="title">
                High-Tech Advantage, With Old Fashioned Service
              </h2>
            </div>
            <div className="col-xl-6 col-lg-7 offset-xl-1 align-self-end">
              <p className="content">
                Our commitment to quality and reliability has made us a trusted
                partner for farmers and agricultural businesses. We pride
                ourselves on delivering consistent results and building
                long-term relationships with our clients.
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-7 col-lg-6 col-md-8 order-lg-last">
            <img src="assets/img/ct/jake_barn.png" alt="img" />
          </div>
          <div className="col-xl-5 col-lg-6 align-self-center align-self-center">
            <div className="why-choose-us-list mb-3 mt-4 mt-lg-0">
              <div className="media">
                <h4 className="count">01</h4>
                <div className="media-left me-4 align-self-center">
                  <img src="assets/img/home-7/7.png" alt="img" />
                </div>
                <div className="media-body">
                  <h4>Expertise and Innovations</h4>
                  <p>
                    Years of industry experience paired with the latest
                    technology, ensuring optimal solutions for your farm.
                  </p>
                </div>
              </div>
            </div>
            <div className="why-choose-us-list mb-3">
              <div className="media">
                <h4 className="count color-base">02</h4>
                <div className="media-left me-4 align-self-center">
                  <img src="assets/img/home-7/7.png" alt="img" />
                </div>
                <div className="media-body">
                  <h4>Comprehensive Support</h4>
                  <p>
                    End-to-end services from equipment sales to maintenance,
                    tailored to your specific needs.
                  </p>
                </div>
              </div>
            </div>
            <div className="why-choose-us-list">
              <div className="media">
                <h4 className="count">03</h4>
                <div className="media-left me-4 align-self-center">
                  <img src="assets/img/home-7/7.png" alt="img" />
                </div>
                <div className="media-body">
                  <h4>Cutting-Edge Technology</h4>
                  <p>
                    Partnered with top brands like New Holland, Raven, and PTX
                    Trimble for superior products.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChoose;
