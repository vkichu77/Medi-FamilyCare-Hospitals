import React from "react";
import InformationCard from "./InformationCard";
import { faHeartPulse, faTruckMedical, faTooth } from "@fortawesome/free-solid-svg-icons";
import "../Styles/Info.css";

function Info() {
  return (
    <div className="info-section" id="services">
      <div className="info-title-content">
        <h3 className="info-title">
          <span>What We Do</span>
        </h3>
        <p className="info-description">
        Our goal is to make healthcare more accessible to you by providing a wide range of customised on-demand medical services. With the help of our platform, you may get in contact with qualified online physicians who can give you professional medical advice, write prescriptions online, and provide speedy refills as needed.
        </p>
      </div>

      <div className="info-cards-content">
        <InformationCard
          title="Emergency Care"
          description="Our Emergency Care service is intended to be your dependable go-to in times of need. Whether it's an unexpected sickness, injury, or any other medical issue that has to be attended to right away, our team of committed healthcare specialists is on call around-the-clock to deliver timely and effective care."
          icon={faTruckMedical}
        />

        <InformationCard
          title="Heart Disease"
          description="Using cutting edge technology, our team of skilled cardiologists and medical professionals evaluates your cardiovascular health and creates personalised treatment programmes. Our dedication lies in providing you with advanced therapies and comprehensive diagnostics to ensure your heart stays healthy and you have a joyful life."
          icon={faHeartPulse}
        />

        <InformationCard
          title="Brain Care"
          description="You can smile with assurance knowing that all of your neural health needs are met by our Care services. From regular checkups and cleanings to restorative and tumour operations, our talented neurologists offer a broad range of brain treatments."
          icon={faTooth}
        />
      </div>
    </div>
  );
}

export default Info;
