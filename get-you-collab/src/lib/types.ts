export type UserRole = "admin" | "creator";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  creatorId?: string;
  avatarUrl?: string;
  phone?: string;
}

export type CreatorStage = "Lead" | "Contacted" | "Negotiating" | "Onboarded" | "Active";
export type FollowerTier = "Nano" | "Micro" | "Macro" | "Mega";

export interface Creator {
  id: string;
  name: string;
  handle: string;
  email: string;
  phone: string;
  niche: "Beauty" | "Tech" | "Fitness" | "Fashion" | "Lifestyle" | "Food" | "Gaming";
  platform: "Instagram" | "YouTube" | "Mixed";
  city: string;
  avatarUrl: string;
  followersCount: number;
  avgViews: number;
  engagementRate: number; // percentage, e.g. 4.8
  followerTier: FollowerTier;
  stage: CreatorStage;
  reliabilityScore: number; // 0-100
  onTimeDeliveryRate: number; // percentage, e.g. 96
  upiId: string;
  bankAccountNumber: string;
  bankIfsc: string;
  panNumber: string;
  audienceGenderSplit: { female: number; male: number };
  audienceAgeSplit: { "18-24": number; "25-34": number; "35+": number };
  topCities: string[];
  totalSales: number;
  totalCommission: number;
  activeDealsCount: number;
  createdAt: string;
}

export interface Brand {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  contactEmail: string;
  website: string;
  logoUrl: string;
  status: "Active" | "On Hold" | "Prospect";
  totalSpend: number;
  createdAt: string;
}

export interface Campaign {
  id: string;
  brandId: string;
  brandName: string;
  name: string;
  objective: string;
  budget: number;
  startDate: string;
  endDate: string;
  status: "Draft" | "Active" | "Completed" | "Paused";
  commissionRate: number; // percentage
  clicks: number;
  orders: number;
  totalSales: number;
  totalCommission: number;
  createdAt: string;
}

export type DealStatus =
  | "Invited"
  | "Accepted"
  | "Declined"
  | "Content Submitted"
  | "Approved"
  | "Live"
  | "Completed";

export interface Deal {
  id: string;
  campaignId: string;
  campaignName: string;
  brandName: string;
  creatorId: string;
  creatorName: string;
  dealValue: number;
  commissionPercentage: number;
  status: DealStatus;
  deliverables: string;
  deadline: string;
  terms?: string;
  lastActivity: string;
  clicks: number;
  orders: number;
  sales: number;
  commission: number;
  trackingBadge: "Tracked" | "Pending Link" | "Inactive";
  contentSubmittedUrl?: string;
  contentDraftNotes?: string;
  createdAt: string;
}

export type ContentStatus =
  | "Draft"
  | "Pending Approval"
  | "Revision Requested"
  | "Approved"
  | "Live";

export interface ContentItem {
  id: string;
  dealId: string;
  campaignName: string;
  creatorId: string;
  creatorName: string;
  title: string;
  contentType: "Reel" | "Story" | "YouTube Video" | "Short" | "Static Post";
  liveUrl?: string;
  draftAssetUrl?: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  status: ContentStatus;
  reviewNotes?: string;
  submittedAt?: string;
  approvedAt?: string;
  publishedAt?: string;
  createdAt: string;
}

export interface TrackingLink {
  id: string;
  campaignId: string;
  campaignName: string;
  creatorId: string;
  creatorName: string;
  slug: string;
  destinationUrl: string;
  couponCode: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  clicksCount: number;
  ordersCount: number;
  totalRevenue: number;
  isActive: boolean;
  createdAt: string;
}

export interface ClickRecord {
  id: string;
  trackingLinkId: string;
  campaignName: string;
  creatorName: string;
  city: string;
  device: string;
  timestamp: string;
}

export interface OrderRecord {
  id: string;
  campaignId: string;
  campaignName: string;
  creatorId: string;
  creatorName: string;
  orderNumber: string;
  orderValue: number;
  commission: number;
  customerCity: string;
  status: "Confirmed" | "Shipped" | "Delivered" | "Cancelled" | "Returned";
  orderedAt: string;
}

export interface Payout {
  id: string;
  creatorId: string;
  creatorName: string;
  amount: number;
  tdsDeducted: number; // 10%
  netAmount: number;
  paymentMethod: "UPI" | "NEFT" | "IMPS";
  utrNumber?: string;
  invoiceNumber: string;
  status: "Pending" | "Processing" | "Paid" | "Failed";
  paidAt?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  creatorId?: string;
  creatorName?: string;
  campaignName?: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Pending" | "In Progress" | "Completed";
  createdAt: string;
}

export interface Activity {
  id: string;
  actorName: string;
  action: string;
  entityType: string;
  entityName: string;
  details: string;
  timestamp: string;
}
