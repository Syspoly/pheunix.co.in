import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB, getDbStatus } from '../config/db.js';
import Admin from '../models/Admin.js';
import Service from '../models/Service.js';
import Project from '../models/Project.js';
import WebsiteSetting from '../models/WebsiteSetting.js';
import Enquiry from '../models/Enquiry.js';
import { fallbackStore } from './dataStore.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const seedDatabase = async () => {
  console.log('[Seed] Starting database seed process...');
  await connectDB();
  const { isMongooseConnected } = getDbStatus();

  // 1. Seed Admin
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'PheunixAdmin2026!';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  const defaultAdmin = {
    username: 'pheunix_admin',
    email: 'admin@pheunix.com',
    password: hashedPassword,
    role: 'superadmin',
    createdAt: new Date()
  };

  if (isMongooseConnected) {
    await Admin.deleteMany({});
    await Admin.create(defaultAdmin);
    console.log('[Seed] Admin account created in MongoDB: admin@pheunix.com');
  } else {
    await fallbackStore.admins.deleteMany({});
    await fallbackStore.admins.create(defaultAdmin);
    console.log('[Seed] Admin account created in local persistent store: admin@pheunix.com');
  }

  // 2. Seed Services (5 Core Services)
  const servicesData = [
    {
      title: 'Website Development',
      slug: 'website-development',
      tagline: 'Turn visitors into customers with fast, responsive, beautifully designed web experiences.',
      shortDescription: 'We build professional websites and web applications that help customers discover your business, explore your offerings and get in touch.',
      fullDescription: 'From fast-loading company websites to bespoke web applications and e-commerce stores, we design modern online experiences that work seamlessly on desktops, tablets, and phones.',
      icon: 'Globe',
      visualType: 'laptop-mobile',
      businessProblem: 'Without an engaging, modern website, potential customers look elsewhere. Traditional websites are often outdated, slow to load, or difficult to read on mobile devices.',
      howItWorks: 'We plan the layout around your target customer’s journey, design clean visuals that highlight your credibility, build fast code, and test on every screen size before launch.',
      benefits: [
        'Clear, professional first impression that establishes business credibility',
        'Fully responsive design that looks stunning on smartphones, tablets, and laptops',
        'Built with SEO and speed best practices so customers can find you easily',
        'Intuitive enquiry and contact mechanisms that convert visitors into leads'
      ],
      useCases: [
        'Business websites',
        'E-commerce stores',
        'Booking websites',
        'Custom web applications'
      ],
      workflowSteps: [
        { stepNumber: 1, title: 'Understand Your Goals', description: 'We map out your business objectives and audience expectations.' },
        { stepNumber: 2, title: 'Clean Architecture & Design', description: 'We craft intuitive layouts with balanced white space and readable typography.' },
        { stepNumber: 3, title: 'Agile Development', description: 'We build responsive frontends and secure backends with modern standards.' },
        { stepNumber: 4, title: 'Launch & Verification', description: 'We test across devices and browsers to guarantee smooth performance.' }
      ],
      order: 1,
      isPublished: true
    },
    {
      title: 'App Development',
      slug: 'app-development',
      tagline: 'Put your business directly in your customers’ hands with intuitive mobile apps.',
      shortDescription: 'We create mobile app experiences that make it easier for customers to access your services and interact with your business.',
      fullDescription: 'Whether you need a customer shopping app, a service booking portal, or an internal team utility, we engineer reliable iOS and Android apps with smooth navigation.',
      icon: 'Smartphone',
      visualType: 'app-screens',
      businessProblem: 'Customers expect on-the-go convenience. When they have to navigate complex desktop steps from a mobile phone, engagement and repeat orders drop.',
      howItWorks: 'We design simple touch interfaces, connect secure cloud databases and payment systems, and ensure immediate responsiveness on any mobile device.',
      benefits: [
        'Direct touchpoint on your customers’ home screens with push notifications',
        'Frictionless mobile ordering, booking, and account management',
        'Smooth touch gestures and fast performance on Android & iOS',
        'Secure cloud data storage with offline-friendly capabilities'
      ],
      useCases: [
        'Customer applications',
        'Shopping applications',
        'Booking applications',
        'Business applications'
      ],
      workflowSteps: [
        { stepNumber: 1, title: 'User Flow Design', description: 'We map out screen transitions for effortless navigation.' },
        { stepNumber: 2, title: 'Interactive Prototype', description: 'You test the visual screens and flow before coding starts.' },
        { stepNumber: 3, title: 'App Engineering & API', description: 'We connect secure backend APIs, auth, and database operations.' },
        { stepNumber: 4, title: 'Testing & App Store Prep', description: 'We test on real physical phones and help with deployment.' }
      ],
      order: 2,
      isPublished: true
    },
    {
      title: 'Digital Marketing',
      slug: 'digital-marketing',
      tagline: 'Reach the exact people searching for your services across search and social.',
      shortDescription: 'We help your business build an online presence and communicate with relevant audiences through digital channels.',
      fullDescription: 'From organic search engine optimization to targeted social media campaigns and transparent analytics, we help you communicate where your audience spends their time.',
      icon: 'TrendingUp',
      visualType: 'analytics-social',
      businessProblem: 'Having a great service means little if nobody knows you exist. Many businesses struggle with low visibility and unfocused advertising spend.',
      howItWorks: 'We research your audience, optimize your content for search queries, run targeted promotional campaigns, and measure results clearly.',
      benefits: [
        'Targeted visibility that brings relevant potential clients to your channels',
        'Search engine optimisation that builds organic, compounding traffic over time',
        'Content that educates your buyers and builds lasting credibility',
        'Clear performance metrics showing exactly how your campaigns perform'
      ],
      useCases: [
        'Search engine optimisation',
        'Social media marketing',
        'Online advertising',
        'Content marketing'
      ],
      workflowSteps: [
        { stepNumber: 1, title: 'Audience Research', description: 'We identify what your potential buyers are searching for.' },
        { stepNumber: 2, title: 'Channel Strategy', description: 'We focus on the digital channels where your audience is most active.' },
        { stepNumber: 3, title: 'Creative Execution', description: 'We create engaging social assets, search ads, and SEO content.' },
        { stepNumber: 4, title: 'Measurement & Tuning', description: 'We track leads and optimize campaigns for consistent improvement.' }
      ],
      order: 3,
      isPublished: true
    },
    {
      title: 'Business Marketing',
      slug: 'business-marketing',
      tagline: 'Clarify your core proposition and establish a cohesive, trustworthy brand identity.',
      shortDescription: 'We help you communicate your brand’s value, promote your offerings and develop a clear marketing approach for your business.',
      fullDescription: 'Before advertising, your business needs a strong voice, compelling value proposition, and consistent visual identity. We help you define and communicate what makes your business unique.',
      icon: 'Megaphone',
      visualType: 'branding-journey',
      businessProblem: 'Many companies sound identical to competitors. Without clear brand positioning and messaging, potential clients hesitate to trust them.',
      howItWorks: 'We study what makes your offering special, define your brand pillars and tone of voice, and create marketing collateral that reinforces credibility.',
      benefits: [
        'Distinct brand personality that stands out in a crowded market',
        'Cohesive visual identity across brochures, presentations, and digital touchpoints',
        'Clear messaging that explains your value proposition in plain language',
        'Practical promotional roadmaps tailored to your realistic business budget'
      ],
      useCases: [
        'Branding support',
        'Marketing strategy',
        'Business promotion',
        'Campaign planning'
      ],
      workflowSteps: [
        { stepNumber: 1, title: 'Brand Positioning', description: 'We identify your distinct strengths and target market niche.' },
        { stepNumber: 2, title: 'Identity & Messaging', description: 'We craft clear value statements and cohesive brand guidelines.' },
        { stepNumber: 3, title: 'Marketing Collateral', description: 'We design brand boards, brochures, and digital presentations.' },
        { stepNumber: 4, title: 'Market Launch', description: 'We roll out your brand messaging consistently across customer touchpoints.' }
      ],
      order: 4,
      isPublished: true
    },
    {
      title: 'Business Automation',
      slug: 'business-automation',
      tagline: 'Free your team from repetitive manual tasks with seamless tool workflows.',
      shortDescription: 'We help simplify repetitive tasks by connecting business tools and organising workflows that can run automatically.',
      fullDescription: 'Connect your enquiry forms, email alerts, customer databases, and reporting spreadsheets into smart automated pipelines that run 24/7 without manual copy-pasting.',
      icon: 'Cpu',
      visualType: 'workflow-automation',
      businessProblem: 'Manual data entry, missed enquiry follow-ups, and copy-pasting between spreadsheets waste hours every day and cause human errors.',
      howItWorks: 'We map your current steps: Customer Enquiry → Notification → Lead Record → Follow-Up Reminder, and automate them with reliable software integrations.',
      benefits: [
        'Instant enquiry alerts so no prospective customer waits for a reply',
        'Automated database updates eliminating repetitive copy-paste errors',
        'Scheduled follow-ups and reminders sent automatically on time',
        'Automated summary reports delivered directly to your management inbox'
      ],
      useCases: [
        'Enquiry management',
        'Automated notifications',
        'Follow-up workflows',
        'Reporting workflows',
        'Business tool integrations'
      ],
      workflowSteps: [
        { stepNumber: 1, title: 'Workflow Audit', description: 'We identify manual, repetitive bottlenecks in your daily work.' },
        { stepNumber: 2, title: 'Integration Design', description: 'We connect your forms, CRM, messaging, and spreadsheets.' },
        { stepNumber: 3, title: 'Automated Logic Setup', description: 'We configure rules: Enquiry → Alert → CRM Entry → Reminder.' },
        { stepNumber: 4, title: 'Verification & Reliability', description: 'We test all edge cases so the automation runs smoothly 24/7.' }
      ],
      order: 5,
      isPublished: true
    }
  ];

  if (isMongooseConnected) {
    await Service.deleteMany({});
    await Service.insertMany(servicesData);
    console.log('[Seed] 5 Core Services seeded into MongoDB.');
  } else {
    await fallbackStore.services.deleteMany({});
    for (const s of servicesData) {
      await fallbackStore.services.create(s);
    }
    console.log('[Seed] 5 Core Services seeded into local persistent store.');
  }

  // 3. Seed Projects (Clearly labelled Concept Demonstrations & Sample Solutions)
  const projectsData = [
    {
      title: 'Lumina Boutique eCommerce Experience',
      slug: 'lumina-boutique-ecommerce',
      category: 'Websites',
      projectType: 'Concept Demonstration',
      shortDescription: 'Modern, airy lifestyle storefront featuring instant search, mobile checkout, and high-performance product storytelling.',
      fullDescription: 'A demonstration of an accessible e-commerce experience designed for retail brands. It focuses on large visuals, lightning-fast product filtering, and a 2-step checkout flow built with clean React components.',
      image: '/images/portfolio/lumina-ecommerce.svg',
      technologies: ['React.js', 'Node.js', 'REST API', 'Modern CSS', 'Stripe Integration'],
      features: ['Lightning fast product filter', 'Mobile-first cart drawer', 'Dynamic inventory indicators', 'Accessible checkout'],
      clientChallenge: 'Traditional shop templates are heavy, cluttered with popups, and slow on 4G mobile devices.',
      deliveredSolution: 'Crafted an airy, minimalist store architecture with responsive images and instant category filtering.',
      order: 1,
      isPublished: true
    },
    {
      title: 'UrbanBite Table Booking & Menu App',
      slug: 'urbanbite-table-booking-app',
      category: 'Mobile Apps',
      projectType: 'Prototype Showcase',
      shortDescription: 'Intuitive smartphone reservation and digital menu application for dining venues.',
      fullDescription: 'An interactive mobile app prototype demonstrating real-time table availability, digital menu browsing with dietary filters, and direct WhatsApp booking confirmation.',
      image: '/images/portfolio/urbanbite-app.svg',
      technologies: ['React Native / Mobile UI', 'Node.js', 'Express', 'MongoDB'],
      features: ['Real-time slot picker', 'Visual food photo previews', 'One-tap booking confirmation', 'Automated SMS alerts'],
      clientChallenge: 'Restaurants lose walk-in and phone bookings when the staff is busy serving tables during peak hours.',
      deliveredSolution: 'A simple 3-tap mobile reservation flow that sends instant customer reminders and keeps table sheets synchronized.',
      order: 2,
      isPublished: true
    },
    {
      title: 'Apex Consulting SEO & Inbound Engine',
      slug: 'apex-consulting-seo-engine',
      category: 'Marketing',
      projectType: 'Concept Demonstration',
      shortDescription: 'Content and search positioning blueprint demonstrating organic visibility growth for professional service firms.',
      fullDescription: 'A structured digital marketing demonstration showing how targeted keyword research, structured data schemas, and thought-leadership articles attract qualified corporate enquiries.',
      image: '/images/portfolio/apex-marketing.svg',
      technologies: ['Technical SEO', 'Schema Markup', 'Analytics Dashboard', 'Content Strategy'],
      features: ['Keyword intent mapping', 'Search snippets optimization', 'Audience engagement tracking', 'Conversion heatmaps'],
      clientChallenge: 'Professional advisory firms struggle to explain technical expertise without sounding overly dense.',
      deliveredSolution: 'Structured plain-language knowledge guides with prominent lead enquiry prompts and search optimization.',
      order: 3,
      isPublished: true
    },
    {
      title: 'AutoLead Flow: Multi-Channel Lead Pipeline',
      slug: 'autolead-flow-automation',
      category: 'Automation',
      projectType: 'Concept Demonstration',
      shortDescription: 'Automated workflow connecting website forms, instant WhatsApp alerts, and spreadsheet lead tracking.',
      fullDescription: 'Demonstrates a complete business automation sequence: Website Enquiry → Instant Telegram/WhatsApp Notification → CRM Record → Scheduled 24h Follow-up Email.',
      image: '/images/portfolio/autolead-workflow.svg',
      technologies: ['Webhooks', 'Express API', 'Node.js', 'Google Sheets API', 'WhatsApp Business Webhook'],
      features: ['Instant 5-second lead alerts', 'Zero manual data entry', 'Automatic duplicate detection', 'Weekly executive summaries'],
      clientChallenge: 'Sales teams often respond 12 to 24 hours after a lead submits a form, drastically reducing conversion probability.',
      deliveredSolution: 'Built a real-time webhook pipeline that delivers lead details to the sales team phone in under 5 seconds.',
      order: 4,
      isPublished: true
    },
    {
      title: 'NovaHealth Patient Care Web Portal',
      slug: 'novahealth-care-portal',
      category: 'Websites',
      projectType: 'Concept Demonstration',
      shortDescription: 'Accessible healthcare clinic portal with doctor availability, health tips, and appointment requests.',
      fullDescription: 'Demonstration of an accessible, bright, patient-friendly portal designed with soft peach and ivory accents, large readable text, and simple appointment enquiry forms.',
      image: '/images/portfolio/novahealth-portal.svg',
      technologies: ['React.js', 'Express', 'Accessible WCAG 2.1 UI', 'Mongoose'],
      features: ['High-contrast readable typography', 'Doctor schedule checker', 'Secure contact forms', 'Mobile patient view'],
      clientChallenge: 'Patients get frustrated by confusing healthcare websites with buried phone numbers and difficult appointment booking.',
      deliveredSolution: 'Designed a calming, clear layout with immediate contact options and clean doctor profiles.',
      order: 5,
      isPublished: true
    },
    {
      title: 'FitTrack Member Club Mobile Companion',
      slug: 'fittrack-member-companion',
      category: 'Mobile Apps',
      projectType: 'Prototype Showcase',
      shortDescription: 'Member attendance, workout schedules, and class reservations on mobile devices.',
      fullDescription: 'A gym and fitness club app demonstration showing personal schedule cards, QR code entry passes, and class booking with notification reminders.',
      image: '/images/portfolio/fittrack-mobile.svg',
      technologies: ['Mobile UI Framework', 'REST API', 'Express.js', 'Token Auth'],
      features: ['Digital QR check-in', 'Class reservation with 1-tap cancel', 'Trainer direct chat', 'Weekly progress metrics'],
      clientChallenge: 'Fitness centers experience high front-desk congestion and manual class sign-up friction.',
      deliveredSolution: 'Created an effortless member self-service mobile flow that reduces front-desk workload.',
      order: 6,
      isPublished: true
    }
  ];

  if (isMongooseConnected) {
    await Project.deleteMany({});
    await Project.insertMany(projectsData);
    console.log('[Seed] 6 Portfolio Projects seeded into MongoDB.');
  } else {
    await fallbackStore.projects.deleteMany({});
    for (const p of projectsData) {
      await fallbackStore.projects.create(p);
    }
    console.log('[Seed] 6 Portfolio Projects seeded into local persistent store.');
  }

  // 4. Seed Website Settings
  const settingsData = [
    { key: 'hero_label', value: 'CREATIVE TECHNOLOGY & DIGITAL SOLUTIONS', group: 'hero' },
    { key: 'hero_heading', value: 'Big Ideas. Smart Technology. Real Business Possibilities.', group: 'hero' },
    { key: 'hero_subheading', value: 'At PHEUNIX, we help businesses build a strong digital presence, connect with customers, simplify everyday work and turn ideas into practical digital solutions.', group: 'hero' },
    { key: 'company_tagline', value: 'We Serve Few Uniques', group: 'brand' },
    { key: 'company_phone', value: '+91 98285 57487', group: 'contact' },
    { key: 'company_email', value: 'connect@pheunix.com', group: 'contact' },
    { key: 'company_address', value: 'Creative Tech Studio, India', group: 'contact' },
    { key: 'cta_heading', value: 'Have an Idea? Let’s Make It Happen.', group: 'cta' },
    { key: 'cta_description', value: 'Tell us what you want to build, improve or simplify. We will help you explore a suitable digital approach for your business.', group: 'cta' }
  ];

  if (isMongooseConnected) {
    await WebsiteSetting.deleteMany({});
    await WebsiteSetting.insertMany(settingsData);
    console.log('[Seed] Website Settings seeded into MongoDB.');
  } else {
    await fallbackStore.settings.deleteMany({});
    for (const st of settingsData) {
      await fallbackStore.settings.create(st);
    }
    console.log('[Seed] Website Settings seeded into local persistent store.');
  }

  // 5. Seed Sample Initial Enquiries for Admin View
  const sampleEnquiries = [
    {
      fullName: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      phone: '+91 98765 43210',
      businessName: 'Sharma Heritage Handicrafts',
      industry: 'Retail and E-commerce',
      serviceRequired: 'Website Development',
      estimatedBudget: 'Flexible',
      projectDescription: 'We are looking to build a clean, modern online store to showcase our handcrafted wooden decor items to customers across India and abroad.',
      preferredContactMethod: 'Email',
      consent: true,
      status: 'New',
      internalNotes: [],
      ipAddress: '127.0.0.1',
      createdAt: new Date(Date.now() - 3600000 * 2)
    },
    {
      fullName: 'Pooja Verma',
      email: 'pooja.verma@example.com',
      phone: '+91 98234 56789',
      businessName: 'Verma Dental & Wellness Clinic',
      industry: 'Professional Services',
      serviceRequired: 'Business Automation',
      estimatedBudget: 'Under ₹50,000',
      projectDescription: 'We need automated appointment confirmations and reminder messages sent to patients on WhatsApp 2 hours before their scheduled clinic visit.',
      preferredContactMethod: 'Phone',
      consent: true,
      status: 'In Discussion',
      internalNotes: [
        { note: 'Spoke with Dr. Pooja; requested a workflow diagram for clinic timings.', author: 'pheunix_admin', createdAt: new Date(Date.now() - 3600000) }
      ],
      ipAddress: '127.0.0.1',
      createdAt: new Date(Date.now() - 86400000)
    }
  ];

  if (isMongooseConnected) {
    await Enquiry.deleteMany({});
    await Enquiry.insertMany(sampleEnquiries);
    console.log('[Seed] Sample enquiries seeded into MongoDB.');
  } else {
    await fallbackStore.enquiries.deleteMany({});
    for (const eq of sampleEnquiries) {
      await fallbackStore.enquiries.create(eq);
    }
    console.log('[Seed] Sample enquiries seeded into local persistent store.');
  }

  console.log('[Seed] Seeding completed successfully!');
  console.log('----------------------------------------------------');
  console.log('Admin Credentials:');
  console.log('Email: admin@pheunix.com');
  console.log('Password: PheunixAdmin2026!');
  console.log('----------------------------------------------------');
};

// If run directly
if (process.argv[1].endsWith('seed.js')) {
  seedDatabase().then(() => {
    process.exit(0);
  }).catch((err) => {
    console.error('[Seed Error]', err);
    process.exit(1);
  });
}
