import Link from "next/link";
import React from "react";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaPhoneAlt,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <>
      {/* ================== Footer One Start ==================*/}
      <footer className="footer-area footer-top bg-black bg-cover">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <div className="widget widget_about">
                <div className="thumb">
                  <img src="assets/img/ct/logo-white.png" alt="img" />
                </div>
                <div className="details">
                  <p>
                    We are dedicated to transforming the agricultural industry
                    through innovative precision technology. Our mission is to
                    enhance efficiency, productivity, and sustainability on
                    farms around the world. With a strong focus on delivering
                    top-quality equipment and developing cutting-edge software
                    solutions, we aim to empower farmers and agricultural
                    businesses to achieve greater success.
                  </p>
                  <br />
                  <p>
                    Join us as we pave the way for a more efficient and
                    sustainable future in agriculture.
                  </p>
                  <p className="mt-3">
                    <FaPhoneAlt /> 831-612-PASS (7227)
                  </p>
                  <p className="mt-2">
                    <FaEnvelope /> hello@coastalpas.com
                  </p>
                  {/* <ul className="social-media">
                    <li>
                      <Link href="#">
                        <FaFacebookF />
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <FaTwitter />
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <FaInstagram />
                      </Link>
                    </li>
                    <li>
                      <Link href="#">
                        <FaYoutube />
                      </Link>
                    </li>
                  </ul> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom text-center">
          <div className="container">
            <p>
              © Copyright 2024 CoManaged Technology Solutions LLC – All Rights
              Reserved
            </p>
          </div>
        </div>
      </footer>
      {/* ================== Footer One  end ==================*/}
    </>
  );
};

export default Footer;
