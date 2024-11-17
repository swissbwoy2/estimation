interface EmailData {
  to: string;
  subject: string;
  propertyData: any;
  estimatedValue: number;
}

export async function sendEmail(data: EmailData): Promise<void> {
  // Note: In a real implementation, this would use a backend service or email API
  // For demo purposes, we'll just log the data
  console.log('Email would be sent with:', data);
}