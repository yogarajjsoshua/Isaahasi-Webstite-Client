// Form types
export interface VolunteerFormData {
  fullName: string;
  email: string;
  mobileNumber: string;
  message: string;
}

export interface PartnerFormData {
  fullName: string;
  organisationName: string;
  email: string;
  mobileNumber: string;
  message: string;
}

export interface NewsletterFormData {
  email: string;
}

export interface DonorInfo {
  fullName: string;
  email: string;
  mobileNumber: string;
  address: string;
  nationality: 'indian' | 'non-indian';
  panNumber?: string;
}

export interface DonationData {
  amount: number;
  type: 'once' | 'monthly';
  donor: DonorInfo;
}

// Form submission types
export interface FormSubmission {
  type: 'volunteer' | 'partner' | 'newsletter';
  data: VolunteerFormData | PartnerFormData | NewsletterFormData;
}

// Component prop types
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  id: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'textarea';
  label: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'url';
  pattern?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

// Team member type
export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

// Story type
export interface Story {
  name: string;
  quote: string;
  content: string;
  image: string;
}

// Update/news type
export interface Update {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  content: string;
}

// Partner type
export interface Partner {
  name: string;
  logo: string;
}
