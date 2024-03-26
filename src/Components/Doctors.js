import React from "react";
import DoctorCard from "./DoctorCard";
import profile1 from "../Assets/profile-1.png";
import profile2 from "../Assets/profile-2.png";
import profile3 from "../Assets/profile-3.png";
import profile4 from "../Assets/profile-4.png";
import "../Styles/Doctors.css";

function Doctors() {
  return (
    <div className="doctor-section" id="doctors">
      <div className="dt-title-content">
        <h3 className="dt-title">
          <span>Meet Our Doctors</span>
        </h3>

        <p className="dt-description">
        Meet the outstanding group of specialists at Medi-FamilyCare who are committed to offering the best possible healthcare. Put your faith in their expertise and experience to guide you towards a better and healthier life.
        </p>
      </div>

      <div className="dt-cards-content">
        <DoctorCard
          img={profile1}
          name="Dr.KANNAN"
          title="Cardiology"
          stars="4.9"
          reviews="1800"
        />
        <DoctorCard
          img={profile2}
          name="Dr.Kala"
          title="Gynaecology"
          // stars="4.8"
          reviews="700"
        />
        <DoctorCard
          img={profile3}
          name="Dr.Gunasundari"
          title="Orthopedics"
          stars="4.7"
          reviews="450"
        />
        <DoctorCard
          img={profile4}
          name="Dr. MADAN"
          title="Neurology"
          stars="4.8"
          reviews="500"
        />
      </div>
    </div>
  );
}

export default Doctors;
