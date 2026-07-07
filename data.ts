import { Complaint, QuickMetric } from './types';

export const HERO_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuAAJP9qsZXSGnxMVXFXcNshOaoy6aR3MfyMK461ZF9wM7ZtB8zFLZ-X3qHNGkKY3F2U_fK8u8pfERgbUIaXBEoXu43NpZ-lsM17Jvtj6g2AZ0WtBiDWwp-Yl2zdkr6jBkL8qFM10p3CU1dPw_Egy5sSwXWbJTZxt5vdWhf-VZbnbAmj7LkJJDF2oIXA-brO0L1Czb-bA2-H7Pl2fNEXMCPQ6IrlIAxAMEX7zZx6y7N-wGgVaVrM5lQYGWBM_HFlq5zMxT1132zEheys";
export const USER_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuBhx4GGJSr9zl1FbPHQxNwpWqCQPZa6r91JqZ9UVPxt8jNLM3aymW9QlkWtmvCJ_9Ay2O20E6RqWquDi-h1esVjpqaIV9BZhBmrg0fgf6M_KcsUZVxAhPFbcWKKs2HfJuKsxQkt7Qu7YGfvUC17xazQKyhf5BvQYGKJfWtF5Ry8NLZsLo3Dyc_56coqduO1OGYqWW-IercwJXPt5_QlnwrQi7Lz5IHLu7pTFM2Tq-yL0mSoMK6yoiF0w6yn5Flb1zduBJMs0pUhwZf3";
export const OFFICER_CHEN = "https://lh3.googleusercontent.com/aida-public/AB6AXuBr1SfWXqpI2MmfDOXgr4qzFXOESLsXmHAg-5VflxPA6DehbsLSRxEVrszfK8QLLQTunoNvbDqHRSy-ts4b52MbP95mBiWSEj8tjPwDM6g33gJVcAwzu1yhDcu1H2ltD4xnqHVjq_tRKlPZsjXxcPdjo1yICDdwWsrWHGDzXAmZXQMf8vBd0aw8LbRFgUx4WoI5cQTRTUyElC9TaGS2vUlU31ZlWvs4Oy4DCRA_t_34QWIueS68kSEHFfi-c0UPlbFb6LsMMi3RQcO9";
export const OFFICER_SMITH = "https://lh3.googleusercontent.com/aida-public/AB6AXuCojxRm8jFKWHIyePaX6Yj6UOdNzKUTiFcRNGhkFkMDn8YrAT3ojHYBJrtO_26FRV-H8CWMwE1twsFSDIFsq3nFi9329TkFwuqv4U5nB2nSZhLbPKUqXzsporjX15sX8AgRw0zta9IB1rBuGP_kKewP5Wptq1qyaHWgO8mNwL4F3p62jPHu_yRXTvLs6sVWnpWDEeVn3PQbRY9YMgSvcUks5ONlIHL-v1dkQ5Qqh05r1RR60-L_nJovh8AjuG3adAJuu4YlJYoYdwRe";
export const SECTOR_MAP = "https://lh3.googleusercontent.com/aida-public/AB6AXuBan-W-m6bL22ogfBmIDOsBcsjtSGW8fcnJZ7ZTPVT4hWHA4_uwmlJhgq_Cf4IVj7ZBNkYTD0zBuTzKNAhMjXYCW1i2RbzyWmsRVnE6nSFH43n276msjuQ4Y9vLaDFUd-hJHVeDDjD77LMtA7HoZVBi9QPBwW51UsB-APRJh1K1Tm-KdoY6hG4vtYtVEYLGDAV5GBtsnoio4snyozABGq_GzwFT72Cof6hLo3lK6M3ZjMatX8K_2UCKGIbZWyo0sv_M04ciIFJf_UY0";

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: "CR-8829-2024",
    fullName: "Alexander Hamilton",
    email: "alexander@example.gov",
    phone: "+1 (555) 000-0000",
    civicId: "ID-0000000",
    address: "Sector 7-B, City Center",
    anonymous: false,
    department: "Urban Development",
    category: "Pavement integrity assessment",
    description: "Reporting a deep fissure and material separation in the pedestrian pavement alongside the public square of Sector 7-B.",
    priority: "High",
    status: "In Progress",
    createdAt: "May 12, 2024",
    locationDetails: "Sector 7-B • City Center",
    history: [
      {
        title: "Complaint Filed",
        timestamp: "May 12, 2024 • 09:15 AM",
        status: "Pending",
        completed: true
      },
      {
        title: "Review Completed",
        timestamp: "May 13, 2024 • 02:30 PM",
        status: "In Progress",
        completed: true
      },
      {
        title: "Investigation Underway",
        timestamp: "May 14, 2024 • Active",
        status: "In Progress",
        description: "Technicians have been dispatched to the site in Sector 7-B to evaluate the structural concerns reported.",
        completed: true
      },
      {
        title: "Resolution Estimate",
        timestamp: "Target: May 20, 2024",
        status: "Completed",
        completed: false
      }
    ],
    metrics: [
      {
        metricId: "INFR-001",
        description: "Pavement integrity assessment",
        priority: "High",
        department: "Urban Development"
      },
      {
        metricId: "UTIL-092",
        description: "Lighting fixture inspection",
        priority: "Medium",
        department: "Municipal Services"
      },
      {
        metricId: "ENVI-443",
        description: "Drainage clear-out report",
        priority: "Low",
        department: "Sanitation"
      }
    ],
    officer: {
      name: "David Chen",
      title: "Senior Case Officer",
      avatar: OFFICER_CHEN
    }
  },
  {
    id: "CR-2024-8842",
    fullName: "Eleanor Vance",
    email: "eleanor.v@example.com",
    phone: "+1 (555) 123-4567",
    civicId: "ID-4993822",
    address: "Oakridge Park, Sector 4",
    anonymous: true,
    department: "Parks & Rec",
    category: "Playground Damage",
    description: "The swingset chain is rusted and partially broken on the left side, presenting a severe safety risk for local children.",
    priority: "Medium",
    status: "In Progress",
    createdAt: "June 02, 2024",
    locationDetails: "Sector 4 • Oakridge Park",
    history: [
      {
        title: "Complaint Filed",
        timestamp: "June 02, 2024 • 10:00 AM",
        status: "Pending",
        completed: true
      },
      {
        title: "Dispatch Action",
        timestamp: "June 03, 2024 • 08:30 AM",
        status: "In Progress",
        description: "Assigned to Sector 4 Maintenance unit. Parts ordered for swing-set repair.",
        completed: true
      },
      {
        title: "Estimated Resolution",
        timestamp: "Target: June 10, 2024",
        status: "Completed",
        completed: false
      }
    ],
    metrics: [
      {
        metricId: "PRK-102",
        description: "Equipment structural analysis",
        priority: "Medium",
        department: "Parks & Rec"
      }
    ],
    officer: {
      name: "Sarah Jenkins",
      title: "Park Superintendent",
      avatar: OFFICER_SMITH
    }
  },
  {
    id: "CR-2024-9110",
    fullName: "Marcus Aurelius",
    email: "marcus@civic.org",
    phone: "+1 (555) 987-6543",
    civicId: "",
    address: "Grand Avenue & 5th St",
    anonymous: false,
    department: "Public Works",
    category: "Street Light Outage",
    description: "An entire string of four consecutive decorative lampposts is completely dark on the western sidewalk, making night walking hazardous.",
    priority: "High",
    status: "Resolved",
    createdAt: "May 10, 2024",
    locationDetails: "Sector 1 • Downtown",
    history: [
      {
        title: "Complaint Filed",
        timestamp: "May 10, 2024 • 08:15 PM",
        status: "Pending",
        completed: true
      },
      {
        title: "Crew Dispatched",
        timestamp: "May 11, 2024 • 11:30 AM",
        status: "In Progress",
        completed: true
      },
      {
        title: "Resolved & Closed",
        timestamp: "May 12, 2024 • 03:45 PM",
        status: "Resolved",
        description: "Power ballast replaced and all four LED light arrays verified fully functional.",
        completed: true
      }
    ],
    metrics: [
      {
        metricId: "PW-084",
        description: "Electrical infrastructure audit",
        priority: "High",
        department: "Public Works"
      }
    ],
    officer: {
      name: "David Chen",
      title: "Senior Case Officer",
      avatar: OFFICER_CHEN
    }
  },
  {
    id: "CR-2024-5211",
    fullName: "Clara Oswald",
    email: "clara.o@example.com",
    phone: "+1 (555) 444-5555",
    civicId: "",
    address: "Rosewood Drive, Sector 9",
    anonymous: false,
    department: "Waste Mgmt",
    category: "Missed Collection",
    description: "Solid waste recycling trucks missed the odd-numbered houses on Rosewood Drive two weeks in a row.",
    priority: "Low",
    status: "Resolved",
    createdAt: "June 15, 2024",
    locationDetails: "Sector 9 • Suburbia",
    history: [
      {
        title: "Complaint Filed",
        timestamp: "June 15, 2024 • 02:00 PM",
        status: "Pending",
        completed: true
      },
      {
        title: "Route Auditor Assigned",
        timestamp: "June 16, 2024 • 09:00 AM",
        status: "In Progress",
        completed: true
      },
      {
        title: "Recycling Dispatched",
        timestamp: "June 17, 2024 • 11:00 AM",
        status: "Resolved",
        description: "Missed bins have been collected and route instructions updated for driver consistency.",
        completed: true
      }
    ],
    metrics: [
      {
        metricId: "WM-419",
        description: "Missed collection audit",
        priority: "Low",
        department: "Waste Mgmt"
      }
    ],
    officer: {
      name: "Robert Lang",
      title: "Sanitation Coordinator",
      avatar: OFFICER_SMITH
    }
  }
];

export const QUICK_METRICS: QuickMetric[] = [
  { label: "94%", value: "94%", sublabel: "Resolution Rate" },
  { label: "4.2d", value: "4.2d", sublabel: "Avg. Response Time" },
  { label: "12k+", value: "12k+", sublabel: "Issues Resolved" },
  { label: "$2.4M", value: "$2.4M", sublabel: "Budget Efficiency" }
];

export interface HelpfulDoc {
  title: string;
  size: string;
  type: string;
  icon: string;
}

export const HELPFUL_DOCUMENTS: HelpfulDoc[] = [
  {
    title: "Citizen Rights Charter",
    size: "1.2 MB",
    type: "PDF",
    icon: "file-text"
  },
  {
    title: "Infrastructure Guidelines",
    size: "4.5 MB",
    type: "PDF",
    icon: "shield"
  },
  {
    title: "Sector 7-B Zoning Plan",
    size: "800 KB",
    type: "JPG",
    icon: "map"
  }
];

export const DEPARTMENTS = [
  { id: "public_works", name: "Public Works", issues: ["Street Light Outage", "Pothole Repair", "Sewer/Drain Blockage", "Sidewalk Damage"] },
  { id: "parks_rec", name: "Parks & Rec", issues: ["Playground Damage", "Vandalism", "Overgrown Vegetation", "Dead Tree Removal"] },
  { id: "waste_mgmt", name: "Waste Mgmt", issues: ["Missed Collection", "Illegal Dumping", "Litter/Trash Bin Overflow", "Hazardous Waste"] },
  { id: "traffic", name: "Traffic", issues: ["Broken Traffic Light", "Missing/Damaged Sign", "Road Blockage", "Speeding/Safety Review"] },
  { id: "sanitation", name: "Sanitation", issues: ["Drainage clear-out report", "Odor Complaint", "Pest/Vector Control"] }
];
