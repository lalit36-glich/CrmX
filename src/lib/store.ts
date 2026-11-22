"use client";

import {
  Creator,
  Brand,
  Campaign,
  Deal,
  ContentItem,
  TrackingLink,
  Payout,
  Task,
  Activity,
  UserProfile,
  UserRole,
  DealStatus,
  ContentStatus,
  CreatorStage,
} from "./types";
import {
  SEED_PROFILES,
  SEED_BRANDS,
  SEED_CAMPAIGNS,
  SEED_CREATORS,
  SEED_DEALS,
  SEED_CONTENT_ITEMS,
  SEED_TRACKING_LINKS,
  SEED_PAYOUTS,
  SEED_TASKS,
  SEED_ACTIVITIES,
} from "./seed-data";

interface AppState {
  currentUser: UserProfile;
  profiles: UserProfile[];
  creators: Creator[];
  brands: Brand[];
  campaigns: Campaign[];
  deals: Deal[];
  contentItems: ContentItem[];
  trackingLinks: TrackingLink[];
  payouts: Payout[];
  tasks: Task[];
  activities: Activity[];
}

const STORAGE_KEY = "gyc_crm_state_v1";

function getInitialState(): AppState {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
  }

  return {
    currentUser: SEED_PROFILES[1], // Default: Aarav Mehta (Creator) for instant test
    profiles: SEED_PROFILES,
    creators: SEED_CREATORS,
    brands: SEED_BRANDS,
    campaigns: SEED_CAMPAIGNS,
    deals: SEED_DEALS,
    contentItems: SEED_CONTENT_ITEMS,
    trackingLinks: SEED_TRACKING_LINKS,
    payouts: SEED_PAYOUTS,
    tasks: SEED_TASKS,
    activities: SEED_ACTIVITIES,
  };
}

class Store {
  private state: AppState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = getInitialState();
  }

  private persist() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch {
        // Storage quota exceeded or disabled
      }
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error("Listener error", err);
      }
    });
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): AppState {
    return this.state;
  }

  public resetToDefaults() {
    this.state = {
      currentUser: SEED_PROFILES[1],
      profiles: SEED_PROFILES,
      creators: SEED_CREATORS,
      brands: SEED_BRANDS,
      campaigns: SEED_CAMPAIGNS,
      deals: SEED_DEALS,
      contentItems: SEED_CONTENT_ITEMS,
      trackingLinks: SEED_TRACKING_LINKS,
      payouts: SEED_PAYOUTS,
      tasks: SEED_TASKS,
      activities: SEED_ACTIVITIES,
    };
    this.persist();
  }

  // Auth / Role switcher
  public setCurrentUser(user: UserProfile) {
    this.state.currentUser = user;
    this.persist();
  }

  public switchRole(role: UserRole, creatorId?: string) {
    if (role === "admin") {
      this.state.currentUser = this.state.profiles.find((p) => p.role === "admin") || SEED_PROFILES[0];
    } else {
      const cId = creatorId || "crt-aarav-mehta";
      const creator = this.state.creators.find((c) => c.id === cId);
      this.state.currentUser = {
        id: `usr-creator-${cId}`,
        email: creator?.email || "aarav@creator.in",
        fullName: creator?.name || "Aarav Mehta",
        role: "creator",
        creatorId: cId,
        avatarUrl: creator?.avatarUrl,
        phone: creator?.phone,
      };
    }
    this.persist();
  }

  // Deals
  public updateDealStatus(dealId: string, status: DealStatus) {
    this.state.deals = this.state.deals.map((d) =>
      d.id === dealId ? { ...d, status, lastActivity: "Just now" } : d
    );
    this.addActivity(
      this.state.currentUser.fullName,
      `updated deal status to ${status}`,
      "Deal",
      dealId
    );
    this.persist();
  }

  public submitContentForDeal(dealId: string, url: string, notes?: string) {
    const deal = this.state.deals.find((d) => d.id === dealId);
    if (!deal) return;

    this.state.deals = this.state.deals.map((d) =>
      d.id === dealId
        ? {
            ...d,
            status: "Content Submitted",
            contentSubmittedUrl: url,
            contentDraftNotes: notes,
            lastActivity: "Just now",
          }
        : d
    );

    // Create a new content item in pending review
    const newContent: ContentItem = {
      id: `cnt-${Date.now()}`,
      dealId: deal.id,
      campaignName: deal.campaignName,
      creatorId: deal.creatorId,
      creatorName: deal.creatorName,
      title: `${deal.campaignName} - Creator Submission`,
      contentType: "Reel",
      draftAssetUrl: url,
      viewsCount: 0,
      likesCount: 0,
      commentsCount: 0,
      status: "Pending Approval",
      reviewNotes: notes,
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    this.state.contentItems = [newContent, ...this.state.contentItems];
    this.addActivity(
      deal.creatorName,
      "submitted content for review",
      "Content",
      deal.campaignName,
      `Asset link: ${url}`
    );
    this.persist();
  }

  // Content Approvals
  public approveContent(contentId: string, liveUrl?: string) {
    this.state.contentItems = this.state.contentItems.map((c) =>
      c.id === contentId
        ? {
            ...c,
            status: "Approved",
            liveUrl: liveUrl || c.liveUrl || "https://instagram.com/reel/live-approved",
            approvedAt: new Date().toISOString(),
          }
        : c
    );

    const item = this.state.contentItems.find((c) => c.id === contentId);
    if (item) {
      // Advance deal to Approved/Live
      this.state.deals = this.state.deals.map((d) =>
        d.id === item.dealId ? { ...d, status: "Approved", lastActivity: "Content approved" } : d
      );
      this.addActivity("Agency Admin", "approved content submission", "Content", item.title);
    }
    this.persist();
  }

  public rejectContent(contentId: string, reviewNotes: string) {
    this.state.contentItems = this.state.contentItems.map((c) =>
      c.id === contentId
        ? {
            ...c,
            status: "Revision Requested",
            reviewNotes,
          }
        : c
    );

    const item = this.state.contentItems.find((c) => c.id === contentId);
    if (item) {
      this.addActivity(
        "Agency Admin",
        "requested revisions on content",
        "Content",
        item.title,
        `Notes: ${reviewNotes}`
      );
    }
    this.persist();
  }

  // Creator profile & bank update
  public updateCreator(creatorId: string, updates: Partial<Creator>) {
    this.state.creators = this.state.creators.map((c) =>
      c.id === creatorId ? { ...c, ...updates } : c
    );
    this.addActivity(
      this.state.currentUser.fullName,
      "updated creator profile & bank details",
      "Creator",
      creatorId
    );
    this.persist();
  }

  public updateCreatorStage(creatorId: string, stage: CreatorStage) {
    this.state.creators = this.state.creators.map((c) =>
      c.id === creatorId ? { ...c, stage } : c
    );
    this.addActivity(
      "Agency Admin",
      `moved creator to stage ${stage}`,
      "Creator",
      creatorId
    );
    this.persist();
  }

  public addCreator(creator: Omit<Creator, "id" | "createdAt" | "totalSales" | "totalCommission" | "activeDealsCount">) {
    const newCreator: Creator = {
      ...creator,
      id: `crt-${Date.now()}`,
      totalSales: 0,
      totalCommission: 0,
      activeDealsCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.state.creators = [newCreator, ...this.state.creators];
    this.addActivity("Agency Admin", "onboarded new creator", "Creator", creator.name);
    this.persist();
    return newCreator;
  }

  // Tracking Simulation (Simulate click / simulate order live!)
  public recordClick(trackingLinkId: string) {
    const link = this.state.trackingLinks.find((l) => l.id === trackingLinkId);
    if (!link) return;

    this.state.trackingLinks = this.state.trackingLinks.map((l) =>
      l.id === trackingLinkId ? { ...l, clicksCount: l.clicksCount + 1 } : l
    );

    // Also update campaign & deal clicks
    this.state.campaigns = this.state.campaigns.map((c) =>
      c.id === link.campaignId ? { ...c, clicks: c.clicks + 1 } : c
    );

    this.state.deals = this.state.deals.map((d) =>
      d.campaignId === link.campaignId && d.creatorId === link.creatorId
        ? { ...d, clicks: d.clicks + 1 }
        : d
    );

    this.persist();
  }

  public simulateOrder(trackingLinkId: string, orderValue: number) {
    const link = this.state.trackingLinks.find((l) => l.id === trackingLinkId);
    if (!link) return;

    const commissionRate = 10; // 10%
    const commission = Math.round((orderValue * commissionRate) / 100);

    // Update link
    this.state.trackingLinks = this.state.trackingLinks.map((l) =>
      l.id === trackingLinkId
        ? {
            ...l,
            clicksCount: l.clicksCount + 1,
            ordersCount: l.ordersCount + 1,
            totalRevenue: l.totalRevenue + orderValue,
          }
        : l
    );

    // Update deal
    this.state.deals = this.state.deals.map((d) =>
      d.campaignId === link.campaignId && d.creatorId === link.creatorId
        ? {
            ...d,
            orders: d.orders + 1,
            sales: d.sales + orderValue,
            commission: d.commission + commission,
            lastActivity: "New order just now",
          }
        : d
    );

    // Update campaign
    this.state.campaigns = this.state.campaigns.map((c) =>
      c.id === link.campaignId
        ? {
            ...c,
            orders: c.orders + 1,
            totalSales: c.totalSales + orderValue,
            totalCommission: c.totalCommission + commission,
          }
        : c
    );

    // Update creator stats
    this.state.creators = this.state.creators.map((c) =>
      c.id === link.creatorId
        ? {
            ...c,
            totalSales: c.totalSales + orderValue,
            totalCommission: c.totalCommission + commission,
          }
        : c
    );

    this.addActivity(
      "Shopify Webhook",
      `attributed order of ₹${orderValue} (Comm: ₹${commission})`,
      "Order",
      link.creatorName,
      `Coupon: ${link.couponCode}`
    );
    this.persist();
  }

  // Payouts
  public markPayoutPaid(payoutId: string, utrNumber: string) {
    this.state.payouts = this.state.payouts.map((p) =>
      p.id === payoutId
        ? {
            ...p,
            status: "Paid",
            utrNumber,
            paidAt: new Date().toISOString(),
          }
        : p
    );
    const payout = this.state.payouts.find((p) => p.id === payoutId);
    if (payout) {
      this.addActivity(
        "Agency Finance",
        `marked payout as Paid (UTR: ${utrNumber})`,
        "Payout",
        payout.invoiceNumber,
        `Amount: ₹${payout.netAmount} to ${payout.creatorName}`
      );
    }
    this.persist();
  }

  public createPayout(creatorId: string, amount: number, paymentMethod: "UPI" | "NEFT" | "IMPS") {
    const creator = this.state.creators.find((c) => c.id === creatorId);
    if (!creator) return;

    const tdsDeducted = Math.round(amount * 0.1); // 10% TDS
    const netAmount = amount - tdsDeducted;
    const invNumber = `INV-GYC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newPayout: Payout = {
      id: `pay-${Date.now()}`,
      creatorId,
      creatorName: creator.name,
      amount,
      tdsDeducted,
      netAmount,
      paymentMethod,
      invoiceNumber: invNumber,
      status: "Processing",
      createdAt: new Date().toISOString(),
    };

    this.state.payouts = [newPayout, ...this.state.payouts];
    this.addActivity(
      "Agency Finance",
      `created payout invoice ${invNumber}`,
      "Payout",
      creator.name,
      `Gross: ₹${amount}, TDS: ₹${tdsDeducted}, Net: ₹${netAmount}`
    );
    this.persist();
  }

  // Tasks
  public updateTaskStatus(taskId: string, status: "Pending" | "In Progress" | "Completed") {
    this.state.tasks = this.state.tasks.map((t) =>
      t.id === taskId ? { ...t, status } : t
    );
    this.persist();
  }

  public addTask(task: Omit<Task, "id" | "createdAt">) {
    const newTask: Task = {
      ...task,
      id: `tsk-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.state.tasks = [newTask, ...this.state.tasks];
    this.persist();
  }

  // Brands & Campaigns
  public addBrand(brand: Omit<Brand, "id" | "createdAt" | "totalSpend">) {
    const newBrand: Brand = {
      ...brand,
      id: `brd-${Date.now()}`,
      totalSpend: 0,
      createdAt: new Date().toISOString(),
    };
    this.state.brands = [newBrand, ...this.state.brands];
    this.persist();
  }

  public addCampaign(campaign: Omit<Campaign, "id" | "createdAt" | "clicks" | "orders" | "totalSales" | "totalCommission">) {
    const newCampaign: Campaign = {
      ...campaign,
      id: `cmp-${Date.now()}`,
      clicks: 0,
      orders: 0,
      totalSales: 0,
      totalCommission: 0,
      createdAt: new Date().toISOString(),
    };
    this.state.campaigns = [newCampaign, ...this.state.campaigns];
    this.persist();
  }

  // Activity helper
  private addActivity(
    actorName: string,
    action: string,
    entityType: string,
    entityName: string,
    details?: string
  ) {
    const act: Activity = {
      id: `act-${Date.now()}`,
      actorName,
      action,
      entityType,
      entityName,
      details: details || "",
      timestamp: "Just now",
    };
    this.state.activities = [act, ...this.state.activities.slice(0, 50)];
  }
}

// Singleton instance
export const appStore = new Store();
