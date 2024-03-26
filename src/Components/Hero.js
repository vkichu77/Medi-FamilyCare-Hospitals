import React, { useEffect, useState } from "react";
import Doctor from "../Assets/doctors-care-one.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCalendarCheck, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import "../Styles/Hero.css";

function Hero() {

  const [goUp, setGoUp] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  useEffect(() => {
    const onPageScroll = () => {
      if (window.scrollY > 600) {
        setGoUp(true);
      } else {
        setGoUp(false);
      }
    };
    window.addEventListener("scroll", onPageScroll);

    return () => {
      window.removeEventListener("scroll", onPageScroll);
    };
  }, []);

  return (    
    <div className="section-container">
      <div className="hero-section">
        <div className="text-section">
          <p className="text-headline">&#x1f496; Health comes first</p>
          <h2 className="text-title">
            Find your Doctor and make an Appointment
          </h2>
          <p className="text-descritpion">
            <p className="ba-checks ba-check-first">
              <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#1E8FFD" }} /> Best Professional Doctors
            </p>
            <br/>
            <p className="ba-checks">
              <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#1E8FFD" }} /> Emergency Care
            </p>
            <br/>
            <p className="ba-checks">
              <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#1E8FFD" }} /> 24/7 Consultation
            </p>
            <br/>
            <p className="ba-checks ba-check-last">
              <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#1E8FFD" }} /> Connect with a doctor at your convenience.
            </p> 
            <br/>           
          </p>
          <button
            className="text-appointment-btn"
            type="button"

          >
            <FontAwesomeIcon icon={faCalendarCheck} /> Call and Book Appointment
          </button>
          <div className="text-stats">
            <div className="text-stats-container">
              <p>145k+</p>
              <p>Receive Patients</p>
            </div>

            <div className="text-stats-container">
              <p>50+</p>
              <p>Expert Doctors</p>
            </div>

            <div className="text-stats-container">
              <p>10+</p>
              <p>Years of Experience</p>
            </div>
          </div>
        </div>

        <div className="hero-image-section">
          <img className="hero-image1" src={Doctor} alt="Doctor" />
        </div>
      </div>

      <div
        onClick={scrollToTop}
        className={`scroll-up ${goUp ? "show-scroll" : ""}`}
      >
        <FontAwesomeIcon icon={faAngleUp} />
      </div>
    </div>
  );
}

export default Hero;
