"use client";
import React from "react";
import { FaStar } from "react-icons/fa";
import Slider from "react-slick";
import { Autoplay } from "swiper";
const TestimonialSeven = () => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 8000,
    slidesToShow: 2,
    slidesToScroll: 2,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          arrows: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };
  return (
    <>
      {/* testimonial-area start */}
      <div
        className="testimonial-area testimonial-area_6 bg-cover pd-top-60 pd-bottom-120"
        style={{ backgroundColor: "#2B2B5E" }}
      >
        <div className="container pd-top-120">
          <div className="row justify-content-center">
            <div className="col-xl-7 col-lg-9">
              <div className="section-title style-white text-center">
                <h6 className="sub-title">Testimonials</h6>
                <h2 className="title">
                  What Do Clients <span>Think</span> About Us?
                </h2>
              </div>
            </div>
          </div>
          <div className="testimonial-slider-2 owl-carousel slider-control-dots">
            <Slider {...settings}>
              <div className="item">
                <div className="single-testimonial-inner style-3">
                  <div className="row">
                    <div className="col-md-5">
                      <div className="thumb">
                        <div className="shadow-img">
                          <img src="assets/img/testimonial/0.png" alt="img" />
                        </div>
                        <img
                          className="main-img"
                          src="assets/img/testimonial/10.png"
                          alt="img"
                        />
                      </div>
                    </div>
                    <div className="col-md-7 align-self-center">
                      <div className="details">
                        <img
                          className="quote"
                          src="assets/img/testimonial/01.png"
                          alt="img"
                        />
                        <p className="designation mb-0 text-white">
                          We recently integrated Raven's sprayer kits into our
                          equipment lineup, thanks to Coastal PASS. The
                          precision application control has allowed us to reduce
                          chemical use and achieve better crop coverage. The
                          support team was quick to assist with installation and
                          training, ensuring we got the most out of this
                          advanced technology.
                        </p>
                        <h6 className="mb-0 mt-3">John D. - Farm Manager</h6>
                        <div className="ratting-inner mt-3">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="single-testimonial-inner style-3">
                  <div className="row">
                    <div className="col-md-5">
                      <div className="thumb">
                        <div className="shadow-img">
                          <img src="assets/img/testimonial/0.png" alt="img" />
                        </div>
                        <img
                          className="main-img"
                          src="assets/img/testimonial/11.png"
                          alt="img"
                        />
                      </div>
                    </div>
                    <div className="col-md-7 align-self-center">
                      <div className="details">
                        <img
                          className="quote"
                          src="assets/img/testimonial/01.png"
                          alt="img"
                        />
                        <p className="designation mb-0 text-white">
                          The field leveling and water management systems from
                          PTX Trimble, provided by [Your Company Name], have
                          revolutionized our irrigation efficiency. The
                          precision and accuracy of their technology have
                          significantly improved our water distribution,
                          resulting in healthier crops and reduced water usage.
                          Their expertise and support have been invaluable.
                        </p>
                        <h6 className="mb-0 mt-3">John D. - Farm Manager</h6>
                        <div className="ratting-inner mt-3">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="single-testimonial-inner style-3">
                  <div className="row">
                    <div className="col-md-5">
                      <div className="thumb">
                        <div className="shadow-img">
                          <img src="assets/img/testimonial/0.png" alt="img" />
                        </div>
                        <img
                          className="main-img"
                          src="assets/img/testimonial/10.png"
                          alt="img"
                        />
                      </div>
                    </div>
                    <div className="col-md-7 align-self-center">
                      <div className="details">
                        <img
                          className="quote"
                          src="assets/img/testimonial/01.png"
                          alt="img"
                        />
                        <p className="designation mb-0 text-white">
                          As an early beta tester of AgSupport, we've seen
                          firsthand how it streamlines our service operations.
                          The platform's intuitive interface and robust features
                          have made scheduling and managing services much
                          easier. The fleet management capabilities are a huge
                          bonus, helping us track and maintain our equipment
                          efficiently. This tool is a game-changer for our
                          dealership.
                        </p>
                        <h6 className="mb-0 mt-3">Mike R. - Coastal Tractor</h6>
                        <div className="ratting-inner mt-3">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="single-testimonial-inner style-3">
                  <div className="row">
                    <div className="col-md-5">
                      <div className="thumb">
                        <div className="shadow-img">
                          <img src="assets/img/testimonial/0.png" alt="img" />
                        </div>
                        <img
                          className="main-img"
                          src="assets/img/testimonial/11.png"
                          alt="img"
                        />
                      </div>
                    </div>
                    <div className="col-md-7 align-self-center">
                      <div className="details">
                        <img
                          className="quote"
                          src="assets/img/testimonial/01.png"
                          alt="img"
                        />
                        <p className="designation mb-0 text-white">
                          Participating in the beta testing of AgSupport has
                          been a rewarding experience. The system's capabilities
                          in managing our fleet and scheduling services are
                          unparalleled. It's clear that Coastal PASS understands
                          the needs of the agricultural industry and delivers
                          solutions that enhance operational efficiency and
                          customer satisfaction.
                        </p>
                        <h6 className="mb-0 mt-3">
                          Devon L. - Ag Service Company
                        </h6>
                        <div className="ratting-inner mt-3">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Slider>
          </div>
        </div>
      </div>
      {/* testimonial-area start */}
    </>
  );
};

export default TestimonialSeven;
