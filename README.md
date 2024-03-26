# Medi-FamilyCare Hospitals

Welcome to the Medi-FamilyCare Hospitals repository! This is a 3rd year diploma computer engineering project, published for tutorial purpses. This is a React-based Flask backend website with simple session authentication(without 3rd party) aimed at providing accessible and personalized healthcare services to users with Access control. 

## Project Abstract

The project aims to enhance the security of electronic medical records (EMRs) and clinical administration systems (CAS) by implementing attribute-based encryption (ABE) techniques. Electronic health records contain highly sensitive information about patients' medical conditions, treatments, and personal details. Protecting the confidentiality and integrity of this data is crucial to maintaining patient privacy and preventing unauthorized access or data breaches.
In recent years, the widespread adoption of electronic health records has brought numerous benefits to healthcare providers, including improved accessibility, efficiency, and collaboration. However, the digital nature of EMRs has also raised concerns regarding the confidentiality and privacy of sensitive patient information. Unauthorized access, data breaches, and insider threats pose significant risks to the security of healthcare systems, necessitating robust encryption mechanisms. Attribute-based encryption offers a promising solution to address these security challenges. This cryptographic scheme allows access control to be based on attributes or characteristics associated with users and data. By leveraging ABE, access to sensitive medical information can be restricted to authorized individuals based on predefined attributes such as the role of the user, department, or level of clearance. This approach enhances the granularity of access control, ensuring that only authorized personnel can access specific medical records. ABE enables data owners to define access policies based on attributes such as job roles, clearances. ABE can empower patients to have greater control over their own health information. This patient-centric approach to privacy aligns with the principles of patient autonomy and consent. 
Clinical administration systems, which include electronic medical records and healthcare databases, are critical components of modern healthcare infrastructure. ABE can enhance security in these systems.
The objectives of this project include the implementation of attribute-based encryption technique in EMR and CAS systems. This project aims to develop and implement an enhanced security system for online CAS, ensuring the confidentiality, integrity, and availability of patient data. It utilizes ABE to protect patient data both when it is stored in databases. This ensures that even if an unauthorized entity gains access to the data, it remains unintelligible. In the digital era of healthcare, as the security and privacy of electronic health records and medical information systems are of paramount importance, ABE is helpful in protecting confidentiality of the medical records and systems. This project is implemented in React.js Frontend, Flask backend, and SQLite3.

## Getting Started

Clone this repository: `git clone https://github.com/vkichu77/Medi-FamilyCare-Hospitals.git`

Initialize Backend locally:
1. create and goto virtual environment "virtenvprj2024"
2. Use requirements.txt file in Medi-FamilyCare-Hospitals directory: run `pip install -r requiremnts.txt -y`

To run Frontend locally:
1. Navigate to the project directory: `cd Medi-FamilyCare-Hospitals`
2. Install dependencies: `npm install`
3. Start flask backend: `npm run flask-start`
4. Start the development server: `npm start`
5. Open your browser and visit: `http://localhost:3000/Medi-FamilyCare`

## License

This project is licensed under the [MIT License](./LICENSE "Project LICENSE").
This project design is based on `https://github.com/Alkaison/Health-Plus`
