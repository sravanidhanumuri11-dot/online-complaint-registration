export interface HistoryEvent {
  title: string;
  timestamp: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Completed';
  description?: string;
  completed: boolean;
}

export interface DepartmentMetric {
  metricId: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  department: string;
}

export interface Officer {
  name: string;
  title: string;
  avatar: string;
}

export interface Complaint {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  civicId?: string;
  address: string;
  anonymous: boolean;
  department: string;
  category: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Resolved';
  createdAt: string;
  history: HistoryEvent[];
  metrics: DepartmentMetric[];
  officer: Officer;
  locationDetails?: string;
  photoUrl?: string;
}

export interface QuickMetric {
  label: string;
  value: string;
  sublabel: string;
}
