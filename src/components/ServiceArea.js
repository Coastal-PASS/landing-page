import Link from "next/link";
import React from "react";
import { FaTractor, FaWater } from "react-icons/fa";
import { GiField, GiPlantWatering } from "react-icons/gi";
import { PiFarm } from "react-icons/pi";

const ServiceArea = () => {
  return (
    <>
      {/*=================== service area five start ===================*/}
      <div className="service-area service-area_5 bg-gray bg-relative pd-top-120 pd-bottom-120">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="section-title text-center">
                <h6 className="sub-title-nh-blue">Our Services</h6>
                <h2 className="title">
                  Comprehensive Solutions <br />
                  For Modern Agriculture
                </h2>
              </div>
            </div>
          </div>
          <div className="row custom-no-gutter">
            <div className="col-lg-4 col-md-6">
              <div className="single-service-inner-3 single-service-inner-3-left">
                <div className="thumb">
                  <div className="thumb-inner">
                    <FaTractor color="#0c2c94" size="2.5em" />
                  </div>
                </div>
                <div className="details">
                  <h5 className="mb-3">
                    <Link href="/service-details">Fleet Telematics</Link>
                  </h5>
                  <p className="mb-0">
                    We offer OEM and add-on solutions to monitor location,
                    engine hours, and diagnostics for tractors and fleet
                    vehicles
                  </p>
                </div>
              </div>
              <div className="single-service-inner-3 single-service-inner-3-left">
                <div className="thumb">
                  <div className="thumb-inner">
                    <FaWater color="#0c2c94" size="2.5em" />
                  </div>
                </div>
                <div className="details">
                  <h5 className="mb-3">
                    <Link href="/service-details">Water Management</Link>
                  </h5>
                  <p className="mb-0">
                    Optimize water usage with advanced field leveling and
                    surveying, ensuring your fields are perfectly prepared for
                    effective irrigation and water management.
                  </p>
                </div>
              </div>
              <div className="single-service-inner-3 single-service-inner-3-left mb-0">
                <div className="thumb">
                  <div className="thumb-inner">
                    <GiPlantWatering color="#0c2c94" size="2.5em" />
                  </div>
                </div>
                <div className="details">
                  <h5 className="mb-3">
                    <Link href="/service-details">Seeding Solutions</Link>
                  </h5>
                  <p className="mb-0">
                    Accurately plant every seed with rate control and blockage
                    prevention, optimizing yield and maximizing ROI while
                    preventing over-seeding or under-seeding.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 bg-blue-right d-lg-inline-block d-none">
              <div className="service-thumb service-middle-section">
                <img src="assets/img/ct/emblem.png" alt="img" />
                <img src="assets/img/ct/emblem.png" alt="img" />
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="single-service-inner-3 single-service-inner-3-right">
                <div className="thumb">
                  <div className="thumb-inner">
                    <GiPlantWatering color="#0c2c94" size="2.5em" />
                  </div>
                </div>
                <div className="details">
                  <h5 className="mb-3">
                    <Link href="/service-details">Application Control</Link>
                  </h5>
                  <p className="mb-0">
                    Enhance crop management with precision spraying equipment,
                    ensuring accurate application of fertilizers and pesticides
                    for optimal coverage.
                  </p>
                </div>
              </div>
              <div className="single-service-inner-3 single-service-inner-3-right">
                <div className="thumb">
                  <div className="thumb-inner">
                    <PiFarm color="#0c2c94" size="2.5em" />
                  </div>
                </div>
                <div className="details">
                  <h5 className="mb-3">
                    <Link href="/service-details">AgTech Innovation</Link>
                  </h5>
                  <p className="mb-0">
                    We provide consulting services to advance agtech projects
                    and create new applications for existing agricultural
                    technologies.
                  </p>
                </div>
              </div>
              <div className="single-service-inner-3 single-service-inner-3-right mb-0">
                <div className="thumb">
                  <div className="thumb-inner">
                    <GiField color="#0c2c94" size="2.5em" />
                  </div>
                </div>
                <div className="details">
                  <h5 className="mb-3">
                    <Link href="/service-details">AgSupport</Link>
                  </h5>
                  <p className="mb-0">
                    Introducing AgSupport, our upcoming SaaS platform in
                    development, streamlining service scheduling and improving
                    fleet and customer management.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================== service area end ===================*/}
    </>
  );
};

export default ServiceArea;
