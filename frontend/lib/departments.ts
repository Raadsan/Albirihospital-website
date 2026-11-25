type DepartmentContent = {
  title: string
  breadcrumb: string
  aboutImage: string
  overview: string[]
  whyChoose: {
    care: string
    introduction: string
    reasons: { title: string; description: string }[]
  }
  services: {
    title: string
    introduction: string
    items: { title: string; description: string }[]
  }
  careNeeds: {
    title: string
    introduction: string
    groups: { title: string; items: string[] }[]
  }
  facilities: {
    title: string
    introduction: string
    items: string[]
  }
  locations: { campus: "km14" | "adado"; description: string }[]
  doctorDepartments: string[]
  questions: { question: string; answer: string }[]
}

export const departments = {
  inpatient: {
    title: "Inpatient Services",
    breadcrumb: "Inpatient",
    aboutImage: "/images/inpatient_room.png",
    overview: [
      "The Inpatient Department cares for patients who need to stay in hospital for treatment, continued monitoring, or recovery after surgery. Doctors and nurses provide care throughout the stay, with private and shared rooms available depending on the ward.",
      "Admissions start at the customer care desk at reception. Staff explain the admission process and direct patients and families to the appropriate ward. Al-Birri has 90 inpatient beds at KM14 and 30 at the Adado branch.",
    ],
    whyChoose: {
      care: "Inpatient Care",
      introduction: "For patients who need to stay in hospital, Al-Birri provides nursing care, patient monitoring, and support after surgery. Here is what patients and their families can expect from admission through recovery.",
      reasons: [
        { title: "Nursing around the clock", description: "Ward nurses are available day and night to provide care. During your stay, they work with the doctors looking after you to carry out your care plan." },
        { title: "Support after surgery", description: "The surgical and ward teams coordinate your move out of theatre. If you need to stay in hospital, ward staff can explain what to expect during your recovery." },
        { title: "Private and shared rooms", description: "Al-Birri has private rooms and shared wards. You can ask the admissions desk about room availability and which ward is appropriate for your stay." },
        { title: "Guidance at admission", description: "Start at the customer care desk at reception. Staff explain the check-in process and direct patients and families to the appropriate ward." },
        { title: "Patient monitoring", description: "Wards have monitoring equipment to help the care team track a patient's condition during treatment or recovery. The team determines what monitoring each patient needs." },
        { title: "Maternity admissions", description: "The inpatient division includes maternity wards. Mothers who need to stay after delivery can receive care in the ward while the team coordinates support for their newborn." },
        { title: "Meals during your stay", description: "The hospital provides meals for admitted patients. Ask the ward team about meal arrangements when you check in." },
        { title: "Two hospital locations", description: "Inpatient services are available at KM14 in Mogadishu and at the Adado branch. Reception can help confirm where a planned admission will take place." },
      ],
    },
    services: {
      title: "Inpatient Care Services",
      introduction: "During a hospital stay, the ward team carries out the care plan and stays in contact with the departments involved in your treatment or recovery.",
      items: [
        { title: "Medical and nursing care", description: "Doctors oversee treatment, and ward nurses provide day-to-day care throughout your stay." },
        { title: "Observation and monitoring", description: "Staff monitor your condition as directed by your care team and share any changes with the doctors looking after you." },
        { title: "Post-operative care", description: "The ward and surgical teams coordinate the transfer from theatre and continue care during recovery." },
        { title: "Maternity ward care", description: "Mothers admitted to the maternity ward receive inpatient care during their stay, with newborn support coordinated by the maternity team." },
      ],
    },
    careNeeds: {
      title: "Reasons for a Hospital Stay",
      introduction: "The admitting clinician determines whether you need to stay and which ward is appropriate for your care.",
      groups: [
        { title: "Treatment and observation", items: ["Treatment that requires a hospital admission", "Continued observation after assessment", "Ongoing monitoring under the care of a ward team"] },
        { title: "Recovery and maternity stays", items: ["Recovery after a planned operation", "Ward care after emergency surgery", "An inpatient stay after delivery"] },
      ],
    },
    facilities: {
      title: "Inpatient Facilities and Support",
      introduction: "Al-Birri provides ward care at KM14 and Adado. Reception can confirm room options and admission arrangements for your branch.",
      items: ["Private rooms and shared wards", "Patient monitoring equipment", "Round-the-clock ward nursing", "Meals for admitted patients", "Maternity wards", "Customer care desk for admissions"],
    },
    locations: [
      { campus: "km14", description: "90 inpatient beds across private rooms and general wards." },
      { campus: "adado", description: "30 inpatient beds and a maternity ward." },
    ],
    doctorDepartments: ["inpatient"],
    questions: [
      { question: "Where do I check in for admission?", answer: "Start at the customer care desk at the hospital reception. Staff will direct you to the appropriate ward and explain the admission process." },
      { question: "Can I request a private room?", answer: "Ask the admissions team about private and shared room availability when arranging your stay." },
      { question: "How can I confirm visiting hours?", answer: "Call 4446 or ask the ward team for the visiting arrangements for your relative’s ward." },
    ],
  },
  outpatient: {
    title: "Outpatient Clinic",
    breadcrumb: "Outpatient",
    aboutImage: "/images/outpatient_clinic.png",
    overview: [
      "The Outpatient Department provides general and specialist consultations for patients who can return home after their visit. You can come for a first assessment, have previous results reviewed, or return for follow-up care. Specialist clinics include cardiology, ear, nose and throat, and ophthalmology.",
      "When your clinician requests a lab test or scan, the clinic can coordinate it with the relevant department. Some tests can be done on the same day. The appointment desk can confirm the clinic schedule and help you choose the right branch for your visit.",
    ],
    whyChoose: {
      care: "Outpatient Care",
      introduction: "Al-Birri's outpatient clinics bring consultations, follow-up visits, and access to lab tests and imaging together for patients who can go home after their visit.",
      reasons: [
        { title: "General consultations", description: "Arrange a first assessment or a visit to review an existing concern. The clinician can discuss the next step and refer you to a specialist when needed." },
        { title: "Several specialist clinics", description: "Outpatient services include cardiology, ear, nose and throat, and ophthalmology. Reception can also help with clinic schedules for orthopedics, dermatology, nephrology, and neurosurgery." },
        { title: "Access to tests and imaging", description: "When your clinician requests a lab test or scan, the clinic can direct you to the appropriate department. Some diagnostic tests can be done on the same day." },
        { title: "Follow-up visits", description: "Return to review test results or discuss your progress. Bring relevant records from earlier visits so the clinician can see what has already been done." },
        { title: "On-site pharmacy", description: "If your clinician writes a prescription, you can check availability at the hospital pharmacy. Pharmacy staff can also clarify directions when you collect your medicine." },
        { title: "Care without an overnight stay", description: "Outpatient appointments are designed for patients who can go home after their visit. If a hospital stay is needed, the clinician can discuss admission with you." },
        { title: "Help planning your appointment", description: "The appointment desk can confirm when a clinic runs, which branch to visit, and whether your preferred specialist is available." },
        { title: "Clinics in Mogadishu and Adado", description: "Al-Birri has outpatient clinics at KM14 and Adado. Specialty schedules differ by branch, so you can confirm the location with the appointment desk before travelling." },
      ],
    },
    services: {
      title: "Outpatient Visits and Diagnostic Services",
      introduction: "Outpatient appointments cover first assessments, referrals, and follow-up. You can return home after your visit unless your clinician recommends admission.",
      items: [
        { title: "General consultations", description: "Discuss a concern with a clinician and review whether you need testing, follow-up, or a referral to a specialist." },
        { title: "Specialist consultations", description: "The appointment desk can help you find the right clinic, including orthopedics, neurosurgery, dermatology, and nephrology." },
        { title: "Lab tests and imaging", description: "If your clinician requests a test or scan, the clinic can direct you to the appropriate department and help you check availability." },
        { title: "Follow-up and results review", description: "Return with any new results or earlier records to review your progress and discuss the next step in your care." },
      ],
    },
    careNeeds: {
      title: "Common Reasons for an Outpatient Visit",
      introduction: "Use these examples to identify what kind of appointment you need. The appointment desk can confirm the clinic schedule and location.",
      groups: [
        { title: "General appointments", items: ["A first assessment of a health concern", "Review of test results or records", "A planned follow-up visit"] },
        { title: "Specialist referrals", items: ["Cardiology consultations", "Ear, nose and throat assessments", "Ophthalmology appointments"] },
      ],
    },
    facilities: {
      title: "Outpatient Facilities and Support",
      introduction: "Consultation rooms and access to hospital diagnostic services support outpatient visits. Same-day testing is available for some requests.",
      items: ["General and specialist consultation rooms", "Hospital laboratory access", "Access to diagnostic imaging", "Same-day testing for eligible visits", "On-site outpatient pharmacy", "Appointment desk for clinic schedules"],
    },
    locations: [
      { campus: "km14", description: "Ask the appointment desk for the clinic schedule at the main hospital." },
      { campus: "adado", description: "Outpatient consultations and specialty clinics serve the Adado community." },
    ],
    doctorDepartments: ["outpatient", "general medicine", "cardiology", "ent", "ophthalmology", "orthopedics", "neurosurgery", "dermatology", "nephrology"],
    questions: [
      { question: "Do I need to stay overnight?", answer: "An outpatient visit is designed for patients to go home the same day. Your clinician will discuss admission if a hospital stay is needed." },
      { question: "What should I bring to the clinic?", answer: "Bring any referral, previous test results, and a list of the medicines you take so your care team can review them." },
      { question: "How can I find out when a specialist is available?", answer: "Use the appointment form above or call 4446. The appointment desk can confirm the specialist’s schedule and location." },
    ],
  },
  theatre: {
    title: "Operating Theatre",
    breadcrumb: "Theatre (OT)",
    aboutImage: "/images/operating_theatre.png",
    overview: [
      "Al-Birri’s operating theatres support scheduled and emergency procedures, including general surgery, caesarean deliveries, and selected orthopedic and gynecological procedures. At KM14, the major and obstetric theatres are available around the clock for emergencies.",
      "The surgical and anesthesia teams coordinate care from pre-operative preparation to monitoring during the procedure. After surgery, the team explains what happens next, including recovery and transfer to an inpatient ward when needed.",
    ],
    whyChoose: {
      care: "Surgery",
      introduction: "Al-Birri's surgery and anesthesia teams coordinate care before, during, and after procedures. Its operating theatres support planned surgery and emergency cases, with major and obstetric theatres at KM14.",
      reasons: [
        { title: "Dedicated operating theatres", description: "KM14 has separate major and obstetric theatres. The hospital supports general surgery as well as selected orthopedic and gynecological procedures." },
        { title: "Anesthesia and monitoring", description: "The anesthesia team helps prepare patients and monitors them during the procedure. The theatre is equipped with anesthesia workstations and patient monitoring equipment." },
        { title: "Laparoscopic options", description: "Laparoscopic procedures are available for selected cases. Your surgeon can discuss the options and explain which approach is suitable for your planned operation." },
        { title: "Coordinated recovery", description: "The theatre team explains what to expect after the operation. If you need an inpatient stay, the surgical team coordinates your transfer to the ward." },
        { title: "Emergency theatre access at KM14", description: "The major and obstetric theatres at KM14 operate around the clock for emergencies. Emergency cases are prioritized alongside the planned surgery schedule." },
        { title: "Obstetric surgery", description: "The obstetric theatre supports scheduled and emergency caesarean deliveries. The theatre and maternity teams coordinate care before delivery and during recovery." },
        { title: "Infection control in theatre", description: "The operating theatres follow infection control and sterile field procedures. These practices support the theatre team's work during both planned and emergency operations." },
        { title: "Minor procedures in Adado", description: "The Adado branch also provides selected minor surgical procedures. Reception can confirm which procedures are available there and whether your visit needs to be at KM14." },
      ],
    },
    services: {
      title: "Surgical Services and Procedures",
      introduction: "Al-Birri’s theatre teams support planned and emergency procedures. The surgeon and anesthesia team explain the proposed procedure, preparation, and recovery arrangements.",
      items: [
        { title: "General surgery", description: "The hospital carries out major and minor general procedures. The surgical team confirms the plan and where the operation will take place." },
        { title: "Laparoscopic procedures", description: "A laparoscopic approach is available for selected cases. Your surgeon can explain whether it is an option for your procedure." },
        { title: "Obstetric surgery", description: "The obstetric theatre supports scheduled and emergency caesarean deliveries in coordination with the maternity team." },
        { title: "Gynecological and orthopedic procedures", description: "The theatre supports selected procedures in gynecology and orthopedics. Check availability with the appropriate specialist team." },
      ],
    },
    careNeeds: {
      title: "Cases Supported by the Operating Theatre",
      introduction: "The surgical team confirms which procedures each branch can provide. KM14 has major and obstetric theatres for emergency cases.",
      groups: [
        { title: "Planned surgery", items: ["Scheduled general surgery", "Selected minor procedures", "Planned caesarean delivery"] },
        { title: "Urgent surgery and recovery", items: ["Emergency cases referred by a hospital clinician", "Emergency caesarean delivery", "Transfer from theatre to the ward when required"] },
      ],
    },
    facilities: {
      title: "Operating Theatre Equipment and Facilities",
      introduction: "At KM14, dedicated major and obstetric theatres support the work of the surgical and anesthesia teams.",
      items: ["Major operating theatre at KM14", "Obstetric operating theatre at KM14", "Anesthesia workstations", "Patient monitoring equipment", "Laparoscopic instruments", "Infection control and sterile field procedures"],
    },
    locations: [
      { campus: "km14", description: "Major and obstetric theatres operate around the clock for emergency cases." },
      { campus: "adado", description: "The regional branch provides minor surgical procedures. Call to confirm availability." },
    ],
    doctorDepartments: ["theatre", "surgery"],
    questions: [
      { question: "How is a planned procedure arranged?", answer: "Your surgeon’s team will discuss the procedure and coordinate scheduling with the hospital." },
      { question: "Who gives me instructions before surgery?", answer: "Follow the directions from your surgical and anesthesia teams. Contact them if you have questions about arrival, medicines, or preparation." },
      { question: "Where do I go after surgery?", answer: "The team will explain your recovery arrangements and whether you will return home or move to a hospital ward." },
    ],
  },
  specialties: {
    title: "Medical Specialties",
    breadcrumb: "Specialties",
    aboutImage: "/images/specialties_consultation.png",
    overview: [
      "Al-Birri offers specialist consultations for adults and children across fields including cardiology, internal medicine, pediatrics, obstetrics and gynecology, general surgery, and dentistry. Patients can see a specialist for an assessment, a review of previous reports, or follow-up care.",
      "Specialists can request lab tests or imaging when they need more information to plan care. If you have a referral or want to see a particular doctor, the appointment desk can confirm which clinic and branch to visit.",
    ],
    whyChoose: {
      care: "Specialist Care",
      introduction: "Al-Birri brings specialists for adults and children into one hospital network. Patients can request a focused assessment, bring earlier results for review, and return for follow-up with the appropriate clinic.",
      reasons: [
        { title: "Heart care and internal medicine", description: "Cardiology and internal medicine clinics provide specialist assessment and follow-up. The appointment desk can confirm which clinic runs at your preferred branch." },
        { title: "Pediatric and neonatal services", description: "Al-Birri has services for children and newborns. The appointment desk can help families identify the appropriate clinic for their child's age and referral." },
        { title: "Hospital laboratory and imaging", description: "Specialists can request lab tests or imaging through other hospital departments when they need more information to plan your care." },
        { title: "Review of earlier reports", description: "Bring any previous test results, scans, referrals, or prescriptions. The specialist can review them during the consultation and explain what further information is needed." },
        { title: "Obstetrics and gynecology", description: "Specialist appointments are available in obstetrics and gynecology. Reception can confirm whether to book through the maternity team or a gynecology clinic." },
        { title: "Surgery, ENT, and dental clinics", description: "The specialist network also includes general surgery, ear, nose and throat, and dentistry. Ask the appointment desk about the right clinic for your referral." },
        { title: "Doctor directory and booking", description: "Browse the doctor directory to find a specialist or request a particular doctor. The appointment team can confirm availability before your visit." },
        { title: "Specialty clinics close to home", description: "Specialist services are available at KM14, and Adado runs outpatient specialty clinics. Exact schedules vary, so check which branch offers the service you need." },
      ],
    },
    services: {
      title: "Specialist Consultations and Services",
      introduction: "Al-Birri’s specialists assess referrals, review previous results, and plan follow-up care. The appointment desk can direct you to the appropriate clinic.",
      items: [
        { title: "Cardiology and internal medicine", description: "Consult a specialist for assessment, review of existing records, or follow-up after a previous visit." },
        { title: "Pediatrics and neonatology", description: "The hospital provides specialist services for children and newborns. Families can ask the appointment desk which team handles their referral." },
        { title: "Obstetrics and gynecology", description: "The appointment desk can direct you to the maternity team or a gynecology clinic, depending on the purpose of your visit." },
        { title: "General surgery, ENT, and dentistry", description: "Arrange a consultation to review a referral, discuss a planned procedure, or ask about the next step in your care." },
      ],
    },
    careNeeds: {
      title: "Types of Specialist Referrals",
      introduction: "The clinic you need depends on your referral and the service available at each branch. Tell the appointment desk which type of assessment you have been referred for.",
      groups: [
        { title: "Medical and diagnostic assessments", items: ["Heart health assessment or follow-up", "Internal medicine review", "Ear, nose and throat or dental assessment"] },
        { title: "Family care and procedures", items: ["Pediatric or newborn specialist review", "Obstetrics or gynecology consultation", "Surgical assessment before a planned procedure"] },
      ],
    },
    facilities: {
      title: "Facilities Supporting Specialist Care",
      introduction: "Specialists can request tests and coordinate with other hospital departments when they need more information to plan your care.",
      items: ["Specialist consultation rooms", "Hospital laboratory services", "Diagnostic imaging department", "Operating theatres", "Maternity services", "Neonatal care at KM14"],
    },
    locations: [
      { campus: "km14", description: "Call the main hospital to confirm where your specialist is seeing patients." },
      { campus: "adado", description: "The regional branch runs outpatient specialty clinics. Schedules vary by specialty." },
    ],
    doctorDepartments: ["specialties", "cardiology", "general medicine", "internal medicine", "pediatrics", "neonatology", "maternity", "gynecology", "surgery", "ent", "dental care"],
    questions: [
      { question: "What if I’m unsure which specialist to see?", answer: "Call 4446 and tell reception which service you are looking for. They can direct you to the appropriate clinic." },
      { question: "Can I request a particular doctor?", answer: "Use the doctor directory to find your specialist and request an appointment. The appointment team will confirm availability." },
      { question: "Can I bring results from another facility?", answer: "Yes. Bring relevant reports, imaging, referrals, and current prescriptions for your specialist to review." },
    ],
  },
  maternity: {
    title: "Maternity & Neonatal Care",
    breadcrumb: "Maternity",
    aboutImage: "/images/maternity_room.png",
    overview: [
      "The Maternity Department supports mothers and babies from antenatal visits through childbirth and postnatal recovery. The team provides checkups and delivery planning for routine and high-risk pregnancies and works with the obstetric theatre for planned and emergency caesarean deliveries.",
      "After birth, the team supports mothers during recovery and coordinates care for their newborns. The KM14 main hospital has a neonatal intensive care unit (NICU) for babies who need closer monitoring or specialized support.",
    ],
    whyChoose: {
      care: "Maternity Care",
      introduction: "Al-Birri supports mothers and babies from antenatal visits to delivery and postnatal recovery. Maternity, theatre, and newborn care teams work together when mothers or babies need additional support.",
      reasons: [
        { title: "Antenatal checkups", description: "Antenatal visits give you time to discuss your pregnancy, review previous results, and plan for delivery. The maternity desk can confirm when the clinic is open." },
        { title: "High-risk pregnancy care", description: "The team provides follow-up for routine and high-risk pregnancies. If you need closer monitoring, the maternity team can discuss the plan for your visits and delivery." },
        { title: "Vaginal and caesarean deliveries", description: "The hospital supports vaginal delivery and planned or emergency caesarean deliveries. The maternity and obstetric theatre teams coordinate the arrangements when surgery is needed." },
        { title: "24-hour emergency obstetric care", description: "The maternity and operating theatre teams at KM14 are available around the clock for obstetric emergencies. KM14 has a dedicated obstetric operating theatre." },
        { title: "Private labor and recovery rooms", description: "Dedicated labor rooms and separate recovery suites provide space for care during childbirth and after delivery. Ask the team about arrangements for your visit." },
        { title: "Postnatal care for mothers", description: "After delivery, the maternity team supports mothers during the first stage of recovery. You can ask the team about your hospital stay and the plan for follow-up." },
        { title: "Neonatal intensive care at KM14", description: "The neonatal intensive care unit supports newborns who need specialized care or closer monitoring. The maternity team coordinates with the newborn care team when extra support is needed." },
        { title: "Maternity services in Adado", description: "The Adado branch also offers maternal health consultations, delivery suites, and an inpatient maternity ward. The appointment desk can confirm what is available at each branch." },
      ],
    },
    services: {
      title: "Maternity and Newborn Care Services",
      introduction: "Al-Birri’s maternity team supports mothers through pregnancy, delivery, and postnatal recovery. When a baby needs extra monitoring, the team coordinates with newborn care staff.",
      items: [
        { title: "Antenatal consultations", description: "Discuss your pregnancy, review earlier antenatal records, and plan for delivery. The team also arranges follow-up for high-risk pregnancies." },
        { title: "Vaginal and caesarean delivery", description: "The maternity team supports vaginal delivery and works with the obstetric theatre for planned and emergency caesarean deliveries." },
        { title: "Postnatal recovery", description: "After delivery, the team supports mothers as they recover and explains the arrangements for their stay and follow-up." },
        { title: "Neonatal intensive care", description: "At KM14, the neonatal intensive care unit supports newborns who need specialized care or close monitoring." },
      ],
    },
    careNeeds: {
      title: "Visits and Care During Pregnancy and After Birth",
      introduction: "The maternity team can explain which appointments and hospital services are relevant at each stage of your care.",
      groups: [
        { title: "Pregnancy and delivery", items: ["Routine antenatal appointments", "Follow-up for high-risk pregnancies", "Delivery planning and obstetric assessment"] },
        { title: "After delivery", items: ["Postnatal care and recovery", "Inpatient maternity stays", "Newborn assessment and monitoring"] },
      ],
    },
    facilities: {
      title: "Maternity and Neonatal Facilities",
      introduction: "KM14 has facilities for obstetric surgery and neonatal intensive care. The Adado branch provides maternal health consultations, delivery suites, and inpatient maternity care.",
      items: ["Private labor rooms", "Postnatal recovery suites", "Obstetric operating theatre at KM14", "Neonatal intensive care unit at KM14", "24-hour emergency obstetric care at KM14", "Delivery suites and a maternity ward in Adado"],
    },
    locations: [
      { campus: "km14", description: "Maternity care, obstetric surgery, and neonatal intensive care." },
      { campus: "adado", description: "Maternal health consultations, delivery suites, and an inpatient maternity ward." },
    ],
    doctorDepartments: ["maternity", "gynecology", "obstetrics", "neonatology"],
    questions: [
      { question: "How can I arrange an antenatal visit?", answer: "Send an appointment request above or call 4446 to ask the maternity team about clinic times." },
      { question: "Does Al-Birri have a neonatal intensive care unit?", answer: "The KM14 main hospital has a NICU for newborns who need specialized care and monitoring." },
      { question: "What records should I bring to a maternity appointment?", answer: "Bring any antenatal records, previous scan or lab reports, and a list of current medicines." },
    ],
  },
  pharmacy: {
    title: "Hospital Pharmacy",
    breadcrumb: "Pharmacy",
    aboutImage: "/images/hospital_pharmacy.png",
    overview: [
      "The hospital pharmacy supplies prescription medicines to patients on the wards and those visiting outpatient clinics. Pharmacy staff check prescriptions before dispensing and can help you find out whether a prescribed medicine or over-the-counter product is available.",
      "When you collect a prescription, you can ask the pharmacist to explain the directions and how to store the medicine. The KM14 pharmacy provides round-the-clock dispensing, and the Adado branch also has an on-site pharmacy.",
    ],
    whyChoose: {
      care: "Pharmacy Services",
      introduction: "Al-Birri's hospital pharmacies serve both admitted patients and people visiting outpatient clinics. Pharmacy staff check prescriptions, dispense medicines, and answer questions about directions and storage.",
      reasons: [
        { title: "Prescription double-checks", description: "Pharmacy staff check prescription details before dispensing medicines. Bring your prescription so the team can review the specific items your clinician has requested." },
        { title: "Clear directions at collection", description: "Ask your pharmacist to explain the written directions when you collect your medicine. You can also ask how the medicine should be stored." },
        { title: "Inpatient and outpatient dispensing", description: "The pharmacy supplies medicines for patients on the wards and those filling a prescription after a clinic visit. Both services are available through the hospital pharmacy." },
        { title: "24-hour dispensing at KM14", description: "The main hospital pharmacy at KM14 provides dispensing around the clock. You can call the main line to ask about access or the availability of a prescribed medicine." },
        { title: "Over-the-counter products", description: "The pharmacy also stocks non-prescription products. Speak with the pharmacist about which products are available and the directions printed on them." },
        { title: "Stock checks before travelling", description: "Call 4446 and ask for the pharmacy at your preferred branch. The team can check whether the medicine on your prescription is in stock before you make the trip." },
        { title: "Medicine and poison information", description: "The hospital pharmacy offers medicine information and poison information support. Contact the hospital to reach the team that handles your question." },
        { title: "Pharmacy access in Adado", description: "The Adado branch has an on-site pharmacy for patients receiving care there. Ask the branch pharmacy to confirm stock and collection arrangements." },
      ],
    },
    services: {
      title: "Pharmacy Services and Medicine Information",
      introduction: "Al-Birri dispenses medicines for admitted patients and people visiting outpatient clinics. The pharmacy team checks prescriptions and can answer questions when you collect your medicine.",
      items: [
        { title: "Prescription dispensing", description: "Bring your prescription so pharmacy staff can check the details and dispense the items that are available." },
        { title: "Medication counseling", description: "Ask the pharmacist to explain the directions on your prescription and any storage instructions for the medicine you collect." },
        { title: "Over-the-counter products", description: "Pharmacy staff can tell you which non-prescription products are stocked and explain the directions on their packaging." },
        { title: "Medicine information", description: "Contact the pharmacy if you need help understanding a medicine label or want to check availability at your preferred branch." },
      ],
    },
    careNeeds: {
      title: "How the Hospital Pharmacy Can Help",
      introduction: "Patients and caregivers can speak to the pharmacy at the branch where they are receiving care.",
      groups: [
        { title: "Collecting medicines", items: ["Filling a prescription after an outpatient visit", "Dispensing medicines for admitted patients", "Checking stock before travelling"] },
        { title: "Questions for the pharmacist", items: ["Understanding prescription directions", "Checking medicine storage instructions", "Asking about available non-prescription products"] },
      ],
    },
    facilities: {
      title: "Pharmacy Facilities and Support",
      introduction: "KM14 and Adado have on-site hospital pharmacies. Round-the-clock dispensing is available at KM14.",
      items: ["Inpatient and outpatient dispensing", "Prescription safety checks", "24-hour pharmacy at KM14", "On-site pharmacy in Adado", "Medicine information support", "Poison information services"],
    },
    locations: [
      { campus: "km14", description: "The hospital pharmacy provides inpatient and outpatient dispensing around the clock." },
      { campus: "adado", description: "The regional hospital has an on-site pharmacy. Call to check stock before travelling." },
    ],
    doctorDepartments: ["pharmacy"],
    questions: [
      { question: "What should I bring to fill a prescription?", answer: "Bring the prescription and any current medicine list you have. The pharmacy team can check the details with you." },
      { question: "Can I check if a medicine is in stock before visiting?", answer: "Call 4446 and ask to speak to the pharmacy at your preferred branch." },
      { question: "Who can explain the directions on my prescription?", answer: "Ask the pharmacist when you collect your medication, and contact your care team if the instructions are unclear." },
    ],
  },
  laboratory: {
    title: "Diagnostic Laboratory",
    breadcrumb: "Laboratory",
    aboutImage: "/images/3.png",
    overview: [
      "The diagnostic laboratory processes samples that clinicians request for assessment and follow-up. Its dedicated sections handle hematology, biochemistry, serology, and parasitology testing. At KM14, automated analyzers support laboratory testing, and the team also provides blood typing and transfusion support.",
      "The laboratory desk can confirm whether a requested test is available, explain how to submit a sample, and tell you when and where to collect the report. The Adado branch also offers on-site laboratory and blood testing.",
    ],
    whyChoose: {
      care: "Laboratory Testing",
      introduction: "Al-Birri's diagnostic laboratory handles clinician-requested tests through dedicated testing sections. The laboratory desk can help patients confirm which tests are available and explain how to submit samples and collect reports.",
      reasons: [
        { title: "Hematology and biochemistry", description: "Dedicated laboratory sections process tests requested by clinicians to assess blood cells and other blood markers. The lab desk can confirm availability for a particular test." },
        { title: "Automated analyzers at KM14", description: "The main hospital uses automated analyzers for sample testing. Clinicians can request laboratory tests to support their assessment and follow-up." },
        { title: "Blood typing and transfusion support", description: "The laboratory provides blood grouping and related testing to support the hospital's transfusion service when a patient's care team requests it." },
        { title: "Guidance before giving a sample", description: "Preparation and sample requirements vary by test. The laboratory desk can explain what your test request requires and how to submit the sample." },
        { title: "Serology and parasitology", description: "Separate testing sections handle selected tests related to immune responses and parasites. Ask the laboratory about the specific test listed on your referral." },
        { title: "24-hour service at KM14", description: "The laboratory at the KM14 main hospital operates around the clock. Call to confirm when your specific test can be processed or when a report can be collected." },
        { title: "Clear report collection arrangements", description: "Report timing depends on the test. When you submit your sample, the lab desk can tell you when the report is expected and where to pick it up." },
        { title: "On-site testing in Adado", description: "The Adado branch offers laboratory services and blood testing. You can check with reception before travelling to confirm that the requested test is available there." },
      ],
    },
    services: {
      title: "Laboratory Tests and Diagnostic Services",
      introduction: "Al-Birri’s laboratory processes clinician-requested samples. The desk can confirm what the requested test requires, where to submit a sample, and when the report is expected.",
      items: [
        { title: "Hematology", description: "The hematology section handles clinician-requested testing related to blood cells." },
        { title: "Biochemistry", description: "The biochemistry section processes tests that measure chemical markers in patient samples." },
        { title: "Serology and parasitology", description: "Dedicated sections handle selected tests related to immune responses and parasites. Ask about availability for the specific test on your referral." },
        { title: "Blood typing and transfusion support", description: "The KM14 laboratory provides blood grouping and related testing for the hospital’s transfusion service." },
      ],
    },
    careNeeds: {
      title: "When Laboratory Testing Is Requested",
      introduction: "Your clinician selects the tests needed for your assessment or follow-up. If you have a request, the laboratory can confirm where the test is available.",
      groups: [
        { title: "Assessment and follow-up", items: ["Tests requested at an outpatient appointment", "Laboratory testing during an inpatient stay", "Repeat tests requested to review progress"] },
        { title: "Samples and reports", items: ["Questions about preparation for a requested test", "Submitting a sample with a test request", "Collecting the report for your clinician"] },
      ],
    },
    facilities: {
      title: "Laboratory Equipment and Facilities",
      introduction: "Automated analyzers support sample testing at the KM14 main laboratory. The Adado branch also provides on-site laboratory services and blood testing.",
      items: ["Automated analyzers at KM14", "Hematology and biochemistry sections", "Serology and parasitology sections", "Blood typing facilities at KM14", "24-hour laboratory service at KM14", "On-site laboratory testing in Adado"],
    },
    locations: [
      { campus: "km14", description: "Automated laboratory, blood typing, and transfusion support." },
      { campus: "adado", description: "On-site laboratory and blood testing. Confirm the availability of your requested test with reception." },
    ],
    doctorDepartments: ["laboratory", "pathology"],
    questions: [
      { question: "Do I need to prepare for a test?", answer: "Preparation depends on the test. Follow the instructions from your clinician or ask the laboratory before your visit." },
      { question: "How long will it take to get my results?", answer: "Turnaround varies by test. Ask the laboratory when you submit your sample for a collection time." },
      { question: "What should I bring to the lab?", answer: "Bring the test request from your clinician, if you have one, and any relevant previous reports." },
    ],
  },
  radiology: {
    title: "Radiology & Imaging",
    breadcrumb: "Radiology",
    aboutImage: "/images/2.png",
    overview: [
      "The Radiology Department provides diagnostic imaging to help clinicians assess patients and review their progress. The KM14 main hospital offers digital X-ray and high-resolution ultrasound. The imaging team uses the request from your referring clinician to identify the examination you need.",
      "Contact the radiology desk before your visit to confirm the examination and ask about any preparation. The team can also explain how to share previous scans and when the new imaging report will be available.",
    ],
    whyChoose: {
      care: "Diagnostic Imaging",
      introduction: "Al-Birri's radiology team works from your clinician's imaging request. At KM14, patients can access digital X-ray and ultrasound and ask the imaging desk about scheduling, preparation, and reports.",
      reasons: [
        { title: "Digital X-ray at KM14", description: "The imaging team carries out digital X-ray examinations at the main hospital. Staff use the examination request from your clinician to identify the imaging needed." },
        { title: "High-resolution ultrasound", description: "The KM14 department provides high-resolution ultrasound examinations. The imaging desk can confirm the scan listed on your referral and explain any preparation specific to it." },
        { title: "Help preparing for your appointment", description: "The imaging team can explain what to bring and whether your examination needs preparation. Contact the radiology desk before travelling if the instructions on your request are unclear." },
        { title: "Reports for your referring clinician", description: "The imaging report supports the clinician who requested your examination. Ask the radiology desk when the report is expected and how to collect it." },
        { title: "Radiologists and imaging technicians", description: "Radiologists and imaging technicians support diagnostic imaging at the hospital. The department can explain who will handle your examination and what happens once the scan is complete." },
        { title: "Fluoroscopy enquiries", description: "If your clinician has requested fluoroscopy, ask the radiology desk about current availability and any arrangements needed for that specific examination." },
        { title: "Support for follow-up imaging", description: "If imaging is part of your follow-up care, you can bring earlier scans and reports. The imaging team can tell you how to share them." },
        { title: "Service confirmation before travelling", description: "The radiology desk can confirm whether your requested examination is available at KM14 and explain scheduling so you know where and when to go." },
      ],
    },
    services: {
      title: "Radiology and Diagnostic Imaging Services",
      introduction: "The imaging department uses your clinician’s request to identify the examination you need. Digital X-ray and high-resolution ultrasound are available at the KM14 main hospital.",
      items: [
        { title: "Digital X-ray", description: "Radiology staff carry out the X-ray examination requested by your clinician and explain how to collect the report." },
        { title: "High-resolution ultrasound", description: "The department provides ultrasound examinations. Staff can confirm the scan on your referral and explain any preparation it requires." },
        { title: "Fluoroscopy enquiries", description: "If your clinician has requested fluoroscopy, ask the radiology desk about availability and arrangements for the examination." },
        { title: "Imaging reports", description: "Ask the imaging desk when the report will be available for review by your referring clinician." },
      ],
    },
    careNeeds: {
      title: "Common Reasons for an Imaging Visit",
      introduction: "Your clinician decides which examination to request. The imaging desk can explain what to bring and whether preparation is needed.",
      groups: [
        { title: "New imaging referrals", items: ["A clinician-requested digital X-ray", "A referral for an ultrasound examination", "An enquiry about a specific examination listed on your request"] },
        { title: "Follow-up and reports", items: ["Repeat imaging requested by your care team", "Sharing previous scans or reports", "Collecting an imaging report for your clinician"] },
      ],
    },
    facilities: {
      title: "Imaging Technology and Facilities",
      introduction: "Radiologists and imaging technicians support diagnostic imaging at KM14, where the department has digital X-ray and high-resolution ultrasound systems.",
      items: ["Digital X-ray equipment at KM14", "High-resolution ultrasound systems", "Radiologists and imaging technicians", "Imaging reports for referring clinicians"],
    },
    locations: [
      { campus: "km14", description: "Digital X-ray and ultrasound are available at the main hospital. Call to check your specific examination." },
    ],
    doctorDepartments: ["radiology"],
    questions: [
      { question: "Should I bring previous scans?", answer: "Bring any previous imaging and reports, along with the examination request from your clinician if you have one." },
      { question: "How do I prepare for an ultrasound or X-ray?", answer: "Contact the imaging team for instructions for your specific examination." },
      { question: "When can I collect my report?", answer: "The radiology desk will advise you on report timing and where to collect it." },
    ],
  },
} satisfies Record<string, DepartmentContent>

export type DepartmentSlug = keyof typeof departments
