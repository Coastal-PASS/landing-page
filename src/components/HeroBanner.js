"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FaArrowAltCircleRight } from "react-icons/fa";
import ModalVideo from "react-modal-video";

const HeroBanner = () => {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      {/* ================== Banner Start ==================*/}
      <div
        className="banner-area bg-relative banner-area-2 bg-cover mt-0"
        style={{
          backgroundImage: 'url("./assets/img/ct/hero.jpg")',
          position: "relative",
        }}
      >
        <div className="overlay"></div>
        <div className="container">
          <div className="row">
            <div className="col-lg-7 pb-xl-6 align-self-center">
              <div className="banner-inner pe-xl-4 pb-5">
                <h6
                  className="bg-none text-white wow animated fadeInLeft mb-4"
                  data-wow-duration="1.5s"
                  data-wow-delay="0.3s"
                >
                  Empower Your Farm With Precision Technology
                </h6>
                <h2
                  className="title text-white wow animated fadeInLeft"
                  data-wow-duration="1.5s"
                  data-wow-delay="0.4s"
                >
                  Revolutionizing Agriculture, One Field At A Time...
                </h2>
                <p
                  className="content text-white pe-xl-4 wow animated fadeInLeft"
                  data-wow-duration="1.5s"
                  data-wow-delay="0.5s"
                >
                  At Coastal PASS, we blend innovative technology with expert
                  service to boost agricultural efficiency and sustainability.
                  Discover how our top-tier equipment and cutting-edge SaaS
                  solutions can transform your operations.
                </p>
                <Link
                  className="btn btn-base border-radius-0 wow animated fadeInLeft"
                  data-wow-duration="1.5s"
                  data-wow-delay="0.6s"
                  href="/contact"
                >
                  Get In Touch <FaArrowAltCircleRight className="mt-4" />
                </Link>
                <div
                  className="d-inline-block align-self-center wow animated fadeInLeft mt-4 mt-md-0"
                  data-wow-duration="1.5s"
                  data-wow-delay="0.7s"
                >
                  <Link
                    onClick={() => setOpen(true)}
                    className="video-play-btn-hover"
                    href="#"
                  >
                    <img src="assets/img/video.svg" alt="img" />{" "}
                    <h6 className="d-inline-block text-white">Watch Video</h6>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================== Banner End ==================*/}
      <ModalVideo
        channel="youtube"
        autoplay
        isOpen={isOpen}
        videoId="OqdMp-dZnjU"
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default HeroBanner;
