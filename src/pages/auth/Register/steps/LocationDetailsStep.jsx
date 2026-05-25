

import React, { useState } from "react";

// const COUNTRIES = [
//   "India",
// ];

export const STATES = {
  India: [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman & Nicobar Islands",
    "Chandigarh",
    "Dadra & Nagar Haveli and Daman & Diu",
    "Delhi",
    "Jammu & Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ],
};

export const CITIES = {
  "Andhra Pradesh": [
    "Alluri Sitharama Raju","Anakapalli","Anantapur","Annamayya","Bapatla",
    "Chittoor","Dr. B.R. Ambedkar Konaseema","East Godavari","Eluru",
    "Guntur","Kakinada","Krishna","Kurnool","Nandyal","NTR","Palnadu",
    "Parvathipuram Manyam","Prakasam","Sri Potti Sriramulu Nellore",
    "Sri Sathya Sai","Srikakulam","Tirupati","Visakhapatnam",
    "Vizianagaram","West Godavari","YSR Kadapa"
  ],

  "Arunachal Pradesh": [
    "Anjaw","Changlang","Dibang Valley","East Kameng","East Siang",
    "Itanagar Capital Complex","Kamle","Kra Daadi","Kurung Kumey",
    "Lepa Rada","Lohit","Longding","Lower Dibang Valley","Lower Siang",
    "Lower Subansiri","Namsai","Pakke Kessang","Papum Pare","Shi Yomi",
    "Siang","Tawang","Tirap","Upper Siang","Upper Subansiri",
    "West Kameng","West Siang","Keyi Panyor","Bichom"
  ],

  Assam: [
    "Baksa","Bajali","Barpeta","Biswanath","Bongaigaon","Cachar",
    "Charaideo","Chirang","Darrang","Dhemaji","Dhubri","Dibrugarh",
    "Dima Hasao","Goalpara","Golaghat","Hailakandi","Hojai","Jorhat",
    "Kamrup","Kamrup Metropolitan","Karbi Anglong","Karimganj",
    "Kokrajhar","Lakhimpur","Majuli","Morigaon","Nagaon","Nalbari",
    "Sivasagar","Sonitpur","South Salmara-Mankachar","Tamulpur",
    "Tinsukia","Udalguri","West Karbi Anglong"
  ],

  Bihar: [
    "Araria","Arwal","Aurangabad","Banka","Begusarai","Bhagalpur",
    "Bhojpur","Buxar","Darbhanga","East Champaran","Gaya","Gopalganj",
    "Jamui","Jehanabad","Kaimur","Katihar","Khagaria","Kishanganj",
    "Lakhisarai","Madhepura","Madhubani","Munger","Muzaffarpur",
    "Nalanda","Nawada","Patna","Purnia","Rohtas","Saharsa",
    "Samastipur","Saran","Sheikhpura","Sheohar","Sitamarhi","Siwan",
    "Supaul","Vaishali","West Champaran"
  ],

  Chhattisgarh: [
    "Balod","Baloda Bazar","Balrampur-Ramanujganj","Bastar","Bemetara",
    "Bijapur","Bilaspur","Dantewada","Dhamtari","Durg","Gariaband",
    "Gaurela-Pendra-Marwahi","Janjgir-Champa","Jashpur","Kabirdham",
    "Kanker","Khairagarh-Chhuikhadan-Gandai","Kondagaon","Korba",
    "Koriya","Mahasamund","Manendragarh-Chirmiri-Bharatpur",
    "Mohla-Manpur-Ambagarh Chowki","Mungeli","Narayanpur","Raigarh",
    "Raipur","Rajnandgaon","Sakti","Sarangarh-Bilaigarh","Sukma",
    "Surajpur","Surguja"
  ],

  Goa: ["North Goa","South Goa"],

  Gujarat: [
    "Ahmedabad","Amreli","Anand","Aravalli","Banaskantha","Bharuch",
    "Bhavnagar","Botad","Chhota Udaipur","Dahod","Dang",
    "Devbhoomi Dwarka","Gandhinagar","Gir Somnath","Jamnagar",
    "Junagadh","Kheda","Kutch","Mahisagar","Mehsana","Morbi",
    "Narmada","Navsari","Panchmahal","Patan","Porbandar","Rajkot",
    "Sabarkantha","Surat","Surendranagar","Tapi","Vadodara","Valsad"
  ],

  Haryana: [
    "Ambala","Bhiwani","Charkhi Dadri","Faridabad","Fatehabad",
    "Gurugram","Hisar","Jhajjar","Jind","Kaithal","Karnal",
    "Kurukshetra","Mahendragarh","Nuh","Palwal","Panchkula",
    "Panipat","Rewari","Rohtak","Sirsa","Sonipat","Yamunanagar"
  ],

  "Himachal Pradesh": [
    "Bilaspur","Chamba","Hamirpur","Kangra","Kinnaur","Kullu",
    "Lahaul and Spiti","Mandi","Shimla","Sirmaur","Solan","Una"
  ],

  Jharkhand: [
    "Bokaro","Chatra","Deoghar","Dhanbad","Dumka","East Singhbhum",
    "Garhwa","Giridih","Godda","Gumla","Hazaribagh","Jamtara",
    "Khunti","Koderma","Latehar","Lohardaga","Pakur","Palamu",
    "Ramgarh","Ranchi","Sahebganj","Seraikela Kharsawan","Simdega",
    "West Singhbhum"
  ],

  Karnataka: [
    "Bagalkot","Ballari","Belagavi","Bengaluru Rural","Bengaluru Urban",
    "Bidar","Chamarajanagar","Chikkaballapur","Chikkamagaluru",
    "Chitradurga","Dakshina Kannada","Davangere","Dharwad","Gadag",
    "Hassan","Haveri","Kalaburagi","Kodagu","Kolar","Koppal",
    "Mandya","Mysuru","Raichur","Ramanagara","Shivamogga","Tumakuru",
    "Udupi","Uttara Kannada","Vijayanagara","Vijayapura","Yadgir"
  ],

  Kerala: [
    "Alappuzha","Ernakulam","Idukki","Kannur","Kasaragod","Kollam",
    "Kottayam","Kozhikode","Malappuram","Palakkad","Pathanamthitta",
    "Thiruvananthapuram","Thrissur","Wayanad"
  ],

  "Madhya Pradesh": [
    "Agar Malwa","Alirajpur","Anuppur","Ashoknagar","Balaghat",
    "Barwani","Betul","Bhind","Bhopal","Burhanpur","Chhatarpur",
    "Chhindwara","Damoh","Datia","Dewas","Dhar","Dindori","Guna",
    "Gwalior","Harda","Hoshangabad","Indore","Jabalpur","Jhabua",
    "Katni","Khandwa","Khargone","Maihar","Mandla","Mandsaur",
    "Mauganj","Morena","Narmadapuram","Narsinghpur","Neemuch",
    "Niwari","Pandhurna","Panna","Raisen","Rajgarh","Ratlam","Rewa",
    "Sagar","Satna","Sehore","Seoni","Shahdol","Shajapur","Sheopur",
    "Shivpuri","Sidhi","Singrauli","Tikamgarh","Ujjain","Umaria",
    "Vidisha"
  ],

  Maharashtra: [
    "Ahmednagar","Akola","Amravati","Aurangabad","Beed","Bhandara",
    "Buldhana","Chandrapur","Dhule","Gadchiroli","Gondia","Hingoli",
    "Jalgaon","Jalna","Kolhapur","Latur","Mumbai City",
    "Mumbai Suburban","Nagpur","Nanded","Nandurbar","Nashik",
    "Osmanabad","Palghar","Parbhani","Pune","Raigad","Ratnagiri",
    "Sangli","Satara","Sindhudurg","Solapur","Thane","Wardha",
    "Washim","Yavatmal"
  ],

  Manipur: [
    "Bishnupur","Chandel","Churachandpur","Imphal East","Imphal West",
    "Jiribam","Kakching","Kamjong","Kangpokpi","Noney","Pherzawl",
    "Senapati","Tamenglong","Tengnoupal","Thoubal","Ukhrul"
  ],

  Meghalaya: [
    "East Garo Hills","East Jaintia Hills","East Khasi Hills",
    "Eastern West Khasi Hills","North Garo Hills","Ri Bhoi",
    "South Garo Hills","South West Garo Hills",
    "South West Khasi Hills","West Garo Hills",
    "West Jaintia Hills","West Khasi Hills"
  ],

  Mizoram: [
    "Aizawl","Champhai","Hnahthial","Khawzawl","Kolasib","Lawngtlai",
    "Lunglei","Mamit","Saitual","Serchhip","Siaha"
  ],

  Nagaland: [
    "Chumoukedima","Dimapur","Kiphire","Kohima","Longleng",
    "Mokokchung","Mon","Niuland","Noklak","Peren","Phek","Shamator",
    "Tseminyu","Tuensang","Wokha","Zunheboto"
  ],

  Odisha: [
    "Angul","Balangir","Balasore","Bargarh","Bhadrak","Boudh",
    "Cuttack","Deogarh","Dhenkanal","Gajapati","Ganjam",
    "Jagatsinghpur","Jajpur","Jharsuguda","Kalahandi","Kandhamal",
    "Kendrapara","Kendujhar","Khordha","Koraput","Malkangiri",
    "Mayurbhanj","Nabarangpur","Nayagarh","Nuapada","Puri",
    "Rayagada","Sambalpur","Subarnapur","Sundargarh"
  ],

  Punjab: [
    "Amritsar","Barnala","Bathinda","Faridkot","Fatehgarh Sahib",
    "Fazilka","Ferozepur","Gurdaspur","Hoshiarpur","Jalandhar",
    "Kapurthala","Ludhiana","Malerkotla","Mansa","Moga","Muktsar",
    "Pathankot","Patiala","Rupnagar","SAS Nagar","Sangrur",
    "SBS Nagar","Tarn Taran"
  ],

  Rajasthan: [
    "Ajmer","Alwar","Balotra","Banswara","Baran","Barmer","Beawar",
    "Bharatpur","Bhilwara","Bikaner","Bundi","Chittorgarh","Churu",
    "Dausa","Dholpur","Didwana-Kuchaman","Dudu","Dungarpur",
    "Gangapur City","Hanumangarh","Jaipur","Jaisalmer","Jalore",
    "Jhalawar","Jhunjhunu","Karauli","Kekri","Khairthal-Tijara",
    "Kota","Kotputli-Behror","Nagaur","Neem Ka Thana","Pali",
    "Phalodi","Pratapgarh","Rajsamand","Salumbar","Sanchore",
    "Sawai Madhopur","Shahpura","Sikar","Sirohi",
    "Sri Ganganagar","Tonk","Udaipur"
  ],

  Sikkim: [
    "Gangtok","Gyalshing","Mangan","Namchi","Pakyong","Soreng"
  ],

  "Tamil Nadu": [
    "Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore",
    "Dharmapuri","Dindigul","Erode","Kallakurichi","Kanchipuram",
    "Kanyakumari","Karur","Krishnagiri","Madurai","Mayiladuthurai",
    "Nagapattinam","Namakkal","Nilgiris","Perambalur","Pudukkottai",
    "Ramanathapuram","Ranipet","Salem","Sivaganga","Tenkasi",
    "Thanjavur","Theni","Thoothukudi","Tiruchirappalli",
    "Tirunelveli","Tirupathur","Tiruppur","Tiruvallur",
    "Tiruvannamalai","Tiruvarur","Vellore","Viluppuram",
    "Virudhunagar"
  ],

  Telangana: [
    "Adilabad","Bhadradri Kothagudem","Hanumakonda","Hyderabad",
    "Jagtial","Jangaon","Jayashankar Bhupalpally",
    "Jogulamba Gadwal","Kamareddy","Karimnagar","Khammam",
    "Kumuram Bheem","Mahabubabad","Mahabubnagar","Mancherial",
    "Medak","Medchal-Malkajgiri","Mulugu","Nagarkurnool",
    "Nalgonda","Narayanpet","Nirmal","Nizamabad","Peddapalli",
    "Rajanna Sircilla","Rangareddy","Sangareddy","Siddipet",
    "Suryapet","Vikarabad","Wanaparthy","Warangal",
    "Yadadri Bhuvanagiri"
  ],

  Tripura: [
    "Dhalai","Gomati","Khowai","North Tripura","Sepahijala",
    "South Tripura","Unakoti","West Tripura"
  ],

  Uttarakhand: [
    "Almora","Bageshwar","Chamoli","Champawat","Dehradun",
    "Haridwar","Nainital","Pauri Garhwal","Pithoragarh",
    "Rudraprayag","Tehri Garhwal","Udham Singh Nagar","Uttarkashi"
  ],

  "West Bengal": [
    "Alipurduar","Bankura","Birbhum","Cooch Behar",
    "Dakshin Dinajpur","Darjeeling","Hooghly","Howrah",
    "Jalpaiguri","Jhargram","Kalimpong","Kolkata","Malda",
    "Murshidabad","Nadia","North 24 Parganas",
    "Paschim Bardhaman","Paschim Medinipur","Purba Bardhaman",
    "Purba Medinipur","Purulia","South 24 Parganas",
    "Uttar Dinajpur"
  ],

  "Andaman & Nicobar Islands": [
    "Nicobar","North & Middle Andaman","South Andaman"
  ],

  Chandigarh: ["Chandigarh"],

  "Dadra & Nagar Haveli and Daman & Diu": [
    "Dadra & Nagar Haveli","Daman","Diu"
  ],

  Delhi: [
    "Central Delhi","East Delhi","New Delhi","North Delhi",
    "North East Delhi","North West Delhi","Shahdara","South Delhi",
    "South East Delhi","South West Delhi","West Delhi"
  ],

  "Jammu & Kashmir": [
    "Anantnag","Bandipora","Baramulla","Budgam","Doda","Ganderbal",
    "Jammu","Kathua","Kishtwar","Kulgam","Kupwara","Poonch",
    "Pulwama","Rajouri","Ramban","Reasi","Samba","Shopian",
    "Srinagar","Udhampur"
  ],

  Ladakh: ["Kargil","Leh"],

  Lakshadweep: ["Lakshadweep"],

  Puducherry: ["Karaikal","Mahe","Puducherry","Yanam"],
};

const LocationDetailsStep = ({ data, setData, onNext, onBack }) => {
  const initial = data.locationDetails || {};

   const country = "India";
  const [state, setState] = useState(initial.state || "");
  const [city, setCity] = useState(initial.city || "");

  const [drawer, setDrawer] = useState(null); // country | state | city

  const handleNext = () => {
    setData((prev) => ({
      ...prev,
      locationDetails: {
        country,
        state,
        city,
      },
    }));
    onNext();
  };

  const getList = () => {
    // if (drawer === "country") return COUNTRIES;
    if (drawer === "state") return STATES[country] || [];
    if (drawer === "city") return CITIES[state] || [];
    return [];
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-4 border-b">
        <button onClick={onBack}>←</button>
        <h1 className="text-base font-semibold text-navy">
          Location Details (3/5)
        </h1>
      </div>

      {/* CONTENT */}
      <div className="flex-1 px-4 py-6 space-y-6">
        {/* Country */}
        <SelectField
          label="Residing country"
          value={country}
          // onClick={() => setDrawer("country")}
        />

        {/* State */}
        {country && (
          <SelectField
            label="Residing state"
            value={state}
            placeholder="Select resident state"
            onClick={() => setDrawer("state")}
          />
        )}

        {/* City */}
        {state && (
          <SelectField
            label="Residing city"
            value={city}
            placeholder="Select resident city"
            onClick={() => setDrawer("city")}
          />
        )}
      </div>

      {/* FOOTER */}
      <div className="px-4 py-4 border-t">
        <button
          onClick={handleNext}
          disabled={!state || !city}
          className={`w-full py-4 rounded-xl font-semibold text-base
            ${
              state && city
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-400"
            }`}
        >
          Next
        </button>

        <p className="text-xs text-center text-gray-400 mt-3">
          Need help? Call <span className="font-medium">+91 9620559231</span>
        </p>
      </div>

      {/* SIDE DRAWER */}
      {drawer && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="absolute right-0 top-0 h-full w-[90%] bg-white shadow-lg flex flex-col">
            <div className="px-4 py-4 border-b flex justify-between items-center">
              <h3 className="text-base font-semibold capitalize">
                Select {drawer}
              </h3>
              <button onClick={() => setDrawer(null)}>✕</button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {getList().map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    if (drawer === "country") {
                      setCountry(item);
                      setState("");
                      setCity("");
                    }
                    if (drawer === "state") {
                      setState(item);
                      setCity("");
                    }
                    if (drawer === "city") setCity(item);
                    setDrawer(null);
                  }}
                  className="w-full text-left px-5 py-4 border-b"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SelectField = ({ label, value, placeholder, onClick }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <button
      onClick={onClick}
      className="w-full border rounded-xl px-4 py-3
                 flex justify-between items-center text-left"
    >
      <span className={value ? "text-gray-800" : "text-gray-400"}>
        {value || placeholder}
      </span>
      <span className="text-gray-400">⌄</span>
    </button>
  </div>
);

export default LocationDetailsStep;