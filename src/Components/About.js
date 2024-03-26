import React from "react";
import Doctor from "../Assets/doctors-care-two.png";
import SolutionStep from "./SolutionStep";
import "../Styles/About.css";

function About() {
  return (
    <div className="about-section" id="about">
      <div className="about-image-content">
        <img src={Doctor} alt="Doctor Group" className="about-image1" />
      </div>

      <div className="about-text-content">
        <h3 className="about-title">
          <span>About Us</span>
        </h3>
        <p className="about-description">
        Introducing Medi-Family Care, your dependable resource for individualised and easily accessible medical care. 
        Prioritising your well-being, our skilled physicians provide specialised services and online consultations. 
        Come along with us on this voyage in the direction of better health.
        </p>

        <h4 className="about-text-title">Your Solutions</h4>

        <SolutionStep
          title="Choose a Specialist"
          description="At Medi-Family Care, find the ideal specialist and make reservations with ease. Your health is their top priority, and they provide individualised care."
        />

        <SolutionStep
          title="Make a Schedule"
          description="Select the time and day that work best for you, and let our committed team of medical specialists to provide individualized treatment to ensure your well-being."
        />

        <SolutionStep
          title="Get Your Solutions"
          description="In order to help you attain the best possible health, our knowledgeable physicians and specialists are available to offer professional guidance and individualised treatment plans."
        />
      </div>
    </div>
  );
}

export default About;
