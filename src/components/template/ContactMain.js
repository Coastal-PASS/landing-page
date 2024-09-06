"use client";
import React from "react";

const ContactMain = () => {
  return (
    <>
      {/* ================= Contact Main start =================*/}
      <>
        {/* contact list start */}
        <div className="contact-page-list">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6">
                <div className="media single-contact-list">
                  <div className="media-left">
                    <img src="assets/img/icon/13.svg" alt="img" />
                  </div>
                  <div className="media-body">
                    <h5>Call Us</h5>
                    <h6>
                      <a href="tel:+18316127277">831.612.PASS (7277)</a>
                    </h6>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="media single-contact-list">
                  <div className="media-left">
                    <img src="assets/img/icon/14.svg" alt="img" />
                  </div>
                  <div className="media-body">
                    <h5>Email Us</h5>
                    <h6>
                      <a href="mailto:hello@coastalpass.com">
                        hello@coastalpass.com
                      </a>
                    </h6>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="media single-contact-list">
                  <div className="media-left">
                    <img src="assets/img/icon/15.svg" alt="img" />
                  </div>
                  <div className="media-body">
                    <h5>Visit Us</h5>
                    <h6>10 Harris Pl, Salinas, CA, 93901</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* contact list start */}
        {/* map start */}
        <div className="contact-g-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d29208.601361499546!2d90.3598076!3d23.7803374!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1589109092857!5m2!1sen!2sbd"
            title="Coastal PASS Map"
          />
        </div>
        {/* map end */}
      </>

      {/* ================= Contact Main End =================*/}
    </>
  );
};

export default ContactMain;
