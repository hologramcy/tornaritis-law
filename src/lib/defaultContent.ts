import type { NewsroomPost, PracticeArea, TeamMember } from './types';

type SeedPracticeArea = Omit<PracticeArea, 'id' | 'created_at' | 'updated_at'>;
type SeedTeamMember = Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>;
type SeedNewsroomPost = Omit<NewsroomPost, 'id' | 'created_at' | 'updated_at'>;

const practiceIntro =
  'Tornaritis Law Firm, Attorneys and Consultants provide international clients a sophisticated, premier-quality work product in high-stakes international legal services.';

export const defaultPracticeAreas: SeedPracticeArea[] = [
  {
    slug: 'banking-finance',
    title: 'Banking & Finance',
    summary: 'Banking licensing, authorisation, regulatory process and finance-related legal advice in Cyprus.',
    body: `${practiceIntro}

Introduction

Banking licence application process includes pre-application meetings, the application stage, licensing of the bank, and authorisation for the commencement of banking business by the bank.

A credit institution must obtain authorisation from the Central Bank of Cyprus before commencing operations in the Republic or abroad. A credit institution established in the Republic must have its registered office and central administration in Cyprus, and its head office in the Member State which issued the authorisation and in which it conducts business.

Overview of the process

Minimum capital
- The law sets the minimum amount of capital for an applicant at EUR 5 million.
- The initial capital consists of one or more elements referred to in Article 26(1)(a) to (e) of Regulation (EU) No. 575/2013.
- The Central Bank may authorise specific categories of credit institutions whose initial capital is less than this amount, provided the initial capital is not less than EUR 1,000,000 and the Commission and European Banking Authority are informed.

Timings
- Where the Central Bank refuses authorisation, it must notify the applicant in writing within six months from receipt of the application or, if incomplete, within six months from receipt of all required information.
- In any event, a decision to grant or refuse authorisation must be issued within twelve months of receipt of the application.
- A licensed credit institution may return its licence by written notice to the Central Bank.

Management

At least two Executive Directors who effectively direct the business of the credit institution are required.

The phases

Pre-application phase
- Disclosure of direct or indirect shareholders or members holding qualifying holdings, or the twenty largest shareholders or members where no qualifying holdings exist.
- Assessment of shareholder or member suitability.
- Confirmation that close links or third-country rules do not obstruct effective supervision.
- Provision of information requested by the Central Bank for ongoing monitoring.

Application phase

The application form must be submitted by or on behalf of the applicant to the Central Bank and accompanied by a plan of activities, the organisational structure of the credit institution, and any other documents and information required by the Central Bank.

Licensing

The Central Bank issues authorisation if the members of the management body have good reputation, sufficient knowledge, qualifications and experience, the overall composition reflects a wide range of experience, and board members meet the applicable capacity and eligibility requirements.`,
    locale: 'en',
    display_order: 1,
    is_published: true,
  },
  {
    slug: 'corporate-law',
    title: 'Corporate Law',
    summary: 'Corporate administration, transactions, due diligence and trusted guidance for businesses and shareholders.',
    body: `${practiceIntro}

Introduction

Corporate Law is one of our firm’s largest practice areas. We have significant experience in offering clients the required approach and delivering comprehensive solutions meeting their business needs and objectives.

We conduct legal due diligence and draft relevant legal documents and reports, such as domestic and cross-border offers, letters of intent, memoranda of understanding, contracts of sale and purchase, shareholder agreements and joint venture contracts.

Each member of our corporate team has the practical experience and knowledge needed to serve as a reliable, trusted guide for clients in frequently complicated matters, including:
- Start-up of new businesses
- Support and sustained performance of established businesses
- Private international law
- Legal due diligence reports
- Shareholders agreements
- Joint venture contracts
- Memoranda of understanding
- Sale and purchase agreements

Related literature includes forming a Cyprus company FAQs and Cyprus International Trust information.`,
    locale: 'en',
    display_order: 2,
    is_published: true,
  },
  {
    slug: 'funds',
    title: 'Funds',
    summary: 'Advice on Cyprus Alternative Investment Funds, investor classes, structures and regulatory framework.',
    body: `${practiceIntro}

Introduction

Alternative Investment Funds Law 131(I)/2014 came into force on 27 July 2014. The Cyprus Securities and Exchange Commission is the regulatory authority responsible for overseeing Alternative Investment Funds.

Investor base
- Retail investors
- Well-informed investors
- Professional investors

Types of AIFs
- AIF with unlimited number of persons
- AIF with limited number of persons

Legal forms
- Common fund
- Fixed or variable capital investment company
- Limited liability partnership

Umbrella structures
- Multiple investment compartments
- Management of segregated portfolios of assets and liabilities, such being ring-fenced
- Increased potential investor base

Investment objectives may include private equity, infrastructure, real estate, venture capital, funds of funds, debt or equity securities, loan origination funds and other strategies.

Investor details are not filed with the Registrar of Companies or other public authorities. Management and performance fees can be structured flexibly, and subscription and redemption terms may also be flexible, including subscriptions in kind.`,
    locale: 'en',
    display_order: 3,
    is_published: true,
  },
  {
    slug: 'due-diligence',
    title: 'Due Diligence',
    summary: 'Business, legal and financial due diligence to assess transactions, risks and opportunities.',
    body: `${practiceIntro}

Introduction

Tornaritis Law Firm undertakes due diligence exercises of business, legal and financial affairs of corporate bodies and helps clients assess business proposals, identify possible legal problems and take informed corporate decisions.

It is important to understand the risks and opportunities of a potential investment. Clients need to know what they are purchasing and whether they will get what they expect. The right steps must be taken to turn an investment into value after signing and closing.

Business transactions such as mergers and acquisitions require legal due diligence investigation. Legal due diligence consists of scrutiny of all, or specific parts, of the legal affairs of the target company with a view to uncovering legal risks and providing the buyer with extensive insight into the company’s legal matters.

Tornaritis Law Firm, with the assistance of professional investigators, prepares complete due diligence reports covering business partners, analysis of the cooperation process, the target company’s strengths and weaknesses, risks and advantages in connection with the transaction, and comprehensive legal due diligence relating to the proposed business transaction.

Legal audits may be necessary to determine which legal and structural issues an enterprise faces. Tornaritis attorneys have wide experience assisting with all of these matters, including due diligence request lists, data room instructions, non-disclosure agreements, business acquisition agreements and similar documents.`,
    locale: 'en',
    display_order: 4,
    is_published: true,
  },
  {
    slug: 'electronic-money-institution',
    title: 'Electronic Money Institution',
    summary: 'Regulatory guidance for electronic money institutions and e-money services in Cyprus.',
    body: `${practiceIntro}

Introduction

According to the EU Directive and Cyprus Electronic Money Law, electronic money is electronically, including magnetically, stored monetary value represented by a claim on the issuer, issued on receipt of funds for the purpose of making payment transactions and accepted by a natural or legal person other than the electronic money issuer.

Regulator: Central Bank of Cyprus.

Electronic Money Institutions are governed by the Electronic Money Law. The provision of electronic money services in the Republic of Cyprus is regulated by the Electronic Money Laws of 2012 and 2018, which transposed the relevant European framework into national law.

Tornaritis Law Firm assists with the legal and regulatory work needed for EMI structuring, licensing and operation, including application preparation, regulatory documentation and compliance with Central Bank requirements.`,
    locale: 'en',
    display_order: 5,
    is_published: true,
  },
  {
    slug: 'taxation',
    title: 'Taxation',
    summary: 'Tax planning and Cyprus tax advice for companies, individuals and cross-border structures.',
    body: `${practiceIntro}

Introduction

Our taxation practice supports clients with Cyprus tax planning, corporate tax matters, international tax considerations and the tax implications of commercial transactions and structures.

We advise in coordination with corporate, finance, fiduciary and real estate matters so that legal and commercial objectives are considered together with relevant tax issues.`,
    locale: 'en',
    display_order: 6,
    is_published: true,
  },
  {
    slug: 'fiduciary-services',
    title: 'Fiduciary Services',
    summary: 'Company administration, fiduciary support and corporate services for Cyprus and international clients.',
    body: `${practiceIntro}

Introduction

Tornaritis Law Firm offers fiduciary and corporate administration services to a wide range of international companies worldwide.

Our services support clients in the establishment, administration and ongoing legal maintenance of corporate structures, always with attention to compliance, confidentiality and practical business needs.`,
    locale: 'en',
    display_order: 7,
    is_published: true,
  },
  {
    slug: 'financial-services-regulatory',
    title: 'Financial Services Regulatory',
    summary: 'Regulatory advice for financial services businesses, investment firms and licensed institutions.',
    body: `${practiceIntro}

Introduction

Tornaritis Law Firm advises financial services businesses on regulatory obligations, licensing, ongoing compliance and legal matters affecting regulated institutions.

Our experience includes acting as legal advisor for CIF companies, funds, nominated advisor work for the Cyprus Stock Exchange, e-money licence applications and banking licence applications.`,
    locale: 'en',
    display_order: 8,
    is_published: true,
  },
  {
    slug: 'litigation',
    title: 'Litigation',
    summary: 'Cost-aware dispute resolution, litigation, interim orders, advocacy and enforcement.',
    body: `${practiceIntro}

Introduction

Tornaritis Law Firm’s strength as litigators lies in the pursuit of one goal: resolving each client’s dispute in the most cost-effective manner with the most favourable outcome possible.

Our lawyers recognise that cost management is essential and that litigation is not the only solution to a legal dispute. We consider every available avenue of resolution, including alternative dispute resolution, before advising court action. When action is advised, we are passionate about pursuing and defending client rights and providing practical solutions to disputes through risk analysis and options.

Our team assists businesses and individuals with:
- Advice relating to alternative dispute resolution
- Risk analysis
- Document collation and preparation
- Obtaining interim orders
- Advocacy
- Enforcement

We handle large and complex claims, both domestic and international, and are regularly instructed by some of Cyprus’ largest financial institutions in relation to substantial disputes.

Banking litigation

We advise on medium to high-value banking disputes for banks, corporate clients and individuals. Our experience includes disputes between financial institutions, bonds and debt finance, syndicated or bilateral finance, trade finance, letters of credit, documentary credits, factoring, discounting, securitisation, asset-based lending, foreign currency, commodity disputes, fraud and asset recovery.

Company and commercial litigation

We advise on disputes arising from commercial transactions and business relationships, acting for corporate entities, financial institutions and individuals.

Personal injury

We advise in injury, accident and insurance claims and disputes, including personal injury and medical accident matters.

Property litigation

We advise on real estate disputes involving purchasers and vendors, landlords and tenants, construction firms, developers, management companies and financial institutions.

Insolvency and winding up litigation

We assist clients in restructuring or insolvency proceedings and have experience in winding up matters, including winding up by the court.`,
    locale: 'en',
    display_order: 9,
    is_published: true,
  },
  {
    slug: 'oil-gas',
    title: 'Oil & Gas',
    summary: 'Legal support for oil, gas, energy and infrastructure-related commercial matters.',
    body: `${practiceIntro}

Introduction

Tornaritis Law Firm advises on legal matters connected with oil, gas and energy-related projects, drawing on its wider corporate, finance, regulatory and dispute resolution experience.`,
    locale: 'en',
    display_order: 10,
    is_published: true,
  },
  {
    slug: 'payment-institutions',
    title: 'Payment Institutions',
    summary: 'Advice on payment institution licensing, regulatory compliance and payment services.',
    body: `${practiceIntro}

Introduction

Tornaritis Law Firm assists clients with payment institution matters in Cyprus, including regulatory requirements, licensing considerations and compliance obligations connected with payment services.`,
    locale: 'en',
    display_order: 11,
    is_published: true,
  },
  {
    slug: 'real-estate',
    title: 'Real Estate',
    summary: 'Property acquisition, development, ownership, management and real estate dispute support.',
    body: `${practiceIntro}

Introduction

Tornaritis Law Firm advises on all aspects of the ownership and management of property. We offer up-to-date legal advice on new and revised real estate laws, regulations and policies.

We assist clients with all aspects of property matters, including reviewing, revising and amending contracts, reviewing and preparing closing documents to ensure clear title, and representing clients at residential and commercial real estate closings.

Our team includes creative tax lawyers who interpret real estate laws to offer advantageous solutions to clients, taking into consideration relevant tax implications and concerns.`,
    locale: 'en',
    display_order: 12,
    is_published: true,
  },
  {
    slug: 'shipping-admiralty-law',
    title: 'Shipping & Admiralty Law',
    summary: 'Shipping and admiralty advice for commercial and legal issues in Cyprus and abroad.',
    body: `${practiceIntro}

Introduction

Tornaritis & Co LLC provides high-quality services in the field of admiralty and shipping law. The firm advises on all aspects of shipping and admiralty law and helps resolve commercial and legal problems in Cyprus and abroad.

The main areas of experience include:
- Claims for loss or damage to cargo
- Salvage claims
- Advice on marine insurance, including H&M, P&I and FD&D
- Choice of flag and registration
- Oil-pollution claims
- Pollution policies and legislation
- General average
- Collisions
- Personal injury claims
- Transshipment and towage agreements
- Disputes under shipbuilding and repairing contracts
- Financing, security and enforcement of mortgages
- Freight and off-hire disputes
- Employment issues relating to officers and crew`,
    locale: 'en',
    display_order: 13,
    is_published: true,
  },
  {
    slug: 'technology-ecommerce',
    title: 'Technology & Ecommerce',
    summary: 'IT, e-commerce, software, licensing, intellectual property and data-related legal advice.',
    body: `${practiceIntro}

Introduction

Tornaritis Law Firm’s Technology & E-Commerce Department offers computer law and information technology advice on IT issues. Using IT advisers with experience and knowledge of local and international laws, we advise on e-commerce, IT issues and the creation and enforcement of intellectual property rights.

We act as consultants to credit bureaus and advise companies on full turnkey projects, including credit bureaus in Romania, Bulgaria and Cyprus.

We represent providers and consumers of software and hardware and assist with:
- Data protection
- Exporting data outside the European Union
- Negotiating and drafting software licence agreements
- Negotiating and drafting technology joint venture agreements
- Professional services agreements
- Drafting and responding to requests for proposals
- Custom software development and maintenance agreements
- Source code escrow arrangements
- IT help desk agreements
- Licence and technology sales agreements
- Proper licensing of company software
- Software and technology audits

Electronic money institution in Cyprus

The e-money regulatory framework affects e-money issuers and intermediaries involved in the distribution or redemption of e-money. Intermediaries such as kiosk or supermarket operators selling or charging prepaid cards for an e-money issuer may be classified as e-money agents and subject to their own regulatory regime.`,
    locale: 'en',
    display_order: 14,
    is_published: true,
  },
  {
    slug: 'immigration-law',
    title: 'Immigration Law',
    summary: 'Citizenship, permanent residence, employment permits, immigration permits and visas.',
    body: `${practiceIntro}

Introduction

We have significant experience offering clients the required approach and delivering comprehensive solutions meeting their needs and objectives.

Our immigration work includes:
- Citizenship applications
- Permanent residence permits
- Employment permits
- Immigration permits
- Visas

Citizenship applications

In accordance with the Cyprus Investment Programme, non-Cypriot nationals may acquire Cyprus citizenship by naturalisation by complying with the economic criteria and conditions set in the relevant Council of Ministers decisions and the programme’s code of conduct.

Citizenship may also be based on years living in Cyprus for EU nationals and their dependants, third-country nationals and their dependants, and certain parents or adult children of Cypriot citizens, subject to legal and continuous residence requirements.

Permanent residence permits

An immigration permit under Regulation 6.2 of the Aliens and Immigration Regulations gives a non-EU national the right to permanently reside in Cyprus and exempts the holder from immigration entry procedures. Family members may also obtain permits, subject to the applicable conditions.`,
    locale: 'en',
    display_order: 15,
    is_published: true,
  },
  {
    slug: 'data-privacy',
    title: 'Data Privacy',
    summary: 'Data protection, cybersecurity, GDPR, breach response and privacy advisory services.',
    body: `${practiceIntro}

Introduction

In a digital world, data is far more than a string of numbers and letters. It is a personal representation of our lives, a reflection of online interaction and a powerful tool for businesses and organisations.

Data security and privacy are major concerns when protecting data. Companies and organisations must understand the laws and regulations governing collection, use and storage of data, and must take steps to ensure data is handled securely and ethically.

Our Data Privacy and Cybersecurity lawyers assist with:
- Implementing measures, policies and protocols to guard data
- Implementing GDPR and other national and international regulations
- Creating plans to tackle cybersecurity issues
- Constructing tailored cyber response plans in the event of a breach
- Advising boards on internal and external breach handling
- Supervising breach investigations and liaising with authorities and other parties
- Addressing individual rights issues, including customer and employee subject access requests
- Explaining privacy implications of emerging technologies like AI and blockchain
- Advising on future digital regulations and data security
- Drafting data sharing agreements, from simple processing agreements to complex data pooling

Partnership with deleteme.com

deleteme.com makes it easy to take control of your online presence and delete your presence on other sites. It helps individuals and businesses protect identity and stop companies from collecting, aggregating and trading data without knowledge.`,
    locale: 'en',
    display_order: 16,
    is_published: true,
  },
];

export const defaultTeamMembers: SeedTeamMember[] = [
  { name: 'Criton Tornaritis', title: 'Senior Partner', email: 'criton@tornaritislaw.com', bio: '', image_url: '', locale: 'en', display_order: 1, is_published: true },
  { name: 'Alexandros Alexandrou', title: 'Senior Partner', email: 'alexandros@tornaritislaw.com', bio: '', image_url: '', locale: 'en', display_order: 2, is_published: true },
  { name: 'Marios Panayiotou', title: 'Senior Partner', email: 'marios@tornaritislaw.com', bio: '', image_url: '', locale: 'en', display_order: 3, is_published: true },
  { name: 'Charalambos Artemis', title: 'Senior Associate', email: 'charalambos@tornaritislaw.com', bio: '', image_url: '', locale: 'en', display_order: 4, is_published: true },
  { name: 'Kypros Karaviotis', title: 'Senior Associate', email: 'kypros@tornaritislaw.com', bio: '', image_url: '', locale: 'en', display_order: 5, is_published: true },
  { name: 'Christina Panayiotou', title: 'Associate', email: 'christinap@tornaritislaw.com', bio: '', image_url: '', locale: 'en', display_order: 6, is_published: true },
  { name: 'Yiannis Lytras', title: 'Associate', email: 'yiannis@tornaritislaw.com', bio: '', image_url: '', locale: 'en', display_order: 7, is_published: true },
  { name: 'Christos Kakas', title: 'Associate', email: 'christosk@tornaritislaw.com', bio: '', image_url: '', locale: 'en', display_order: 8, is_published: true },
  { name: 'Stella Renou', title: 'Associate', email: 'stella@tornaritislaw.com', bio: '', image_url: '', locale: 'en', display_order: 9, is_published: true },
  { name: 'Roger Syngelides', title: 'Paralegal', email: 'roger@tornaritislaw.com', bio: '', image_url: '', locale: 'en', display_order: 10, is_published: true },
  { name: 'Yiota Neoptolemou', title: 'Office Administrator', email: 'yiota@tornaritislaw.com', bio: '', image_url: '', locale: 'en', display_order: 11, is_published: true },
];

export const defaultPosts: SeedNewsroomPost[] = [
  {
    slug: 'russias-economic-and-trade-sanctions',
    title: 'Russia’s Economic and trade sanctions',
    excerpt: 'A legal update from Tornaritis Law Firm on economic and trade sanctions.',
    body: 'A legal update from Tornaritis Law Firm on economic and trade sanctions.',
    category: 'News',
    author_name: 'Tornaritis Law Firm',
    locale: 'en',
    is_published: true,
    published_at: new Date('2023-05-10T20:10:26').toISOString(),
  },
  {
    slug: 'european-union-eu-approves-4th-anti-money-laundering-directive',
    title: 'EU Approves 4th Anti-Money Laundering Directive',
    excerpt: 'An update on European Union anti-money laundering regulation.',
    body: 'An update on European Union anti-money laundering regulation.',
    category: 'News',
    author_name: 'Tornaritis Law Firm',
    locale: 'en',
    is_published: true,
    published_at: new Date('2019-08-26T03:01:41').toISOString(),
  },
  {
    slug: 'electronic-money-institutions-emis',
    title: 'A guide to Electronic Money Institutions (EMIs)',
    excerpt: 'A guide to Electronic Money Institutions and the regulatory position in Cyprus.',
    body: 'A guide to Electronic Money Institutions and the regulatory position in Cyprus.',
    category: 'Articles',
    author_name: 'Tornaritis Law Firm',
    locale: 'en',
    is_published: true,
    published_at: new Date('2019-05-07T03:09:18').toISOString(),
  },
  {
    slug: 'cyprus-payment-institution',
    title: 'Cyprus Payment Institution',
    excerpt: 'A legal note on payment institutions in Cyprus.',
    body: 'A legal note on payment institutions in Cyprus.',
    category: 'Articles',
    author_name: 'Tornaritis Law Firm',
    locale: 'en',
    is_published: true,
    published_at: new Date('2018-03-20T14:47:54').toISOString(),
  },
  {
    slug: 'lawyers-conflicts-of-interest',
    title: 'Lawyers’ Conflicts of Interest and the problems that come with it',
    excerpt: 'An article on conflicts of interest and professional legal obligations.',
    body: 'An article on conflicts of interest and professional legal obligations.',
    category: 'Publications',
    author_name: 'Tornaritis Law Firm',
    locale: 'en',
    is_published: true,
    published_at: new Date('2015-08-14T10:19:00').toISOString(),
  },
  {
    slug: 'cyprus-investment-company-cif-and-forex-companies',
    title: 'Cyprus Investment Company CIF And FOREX companies',
    excerpt: 'A publication on Cyprus investment companies and FOREX companies.',
    body: 'A publication on Cyprus investment companies and FOREX companies.',
    category: 'Publications',
    author_name: 'Tornaritis Law Firm',
    locale: 'en',
    is_published: true,
    published_at: new Date('2015-05-17T10:46:05').toISOString(),
  },
  {
    slug: 'company-formation-in-cyprus-frequently-asked-questions',
    title: 'Company Formation in Cyprus Frequently Asked Questions',
    excerpt: 'Frequently asked questions about company formation in Cyprus.',
    body: 'Frequently asked questions about company formation in Cyprus.',
    category: 'Publications',
    author_name: 'Tornaritis Law Firm',
    locale: 'en',
    is_published: true,
    published_at: new Date('2015-03-17T11:02:47').toISOString(),
  },
];

export const legalPages = {
  'privacy-policy': {
    title: 'Privacy Policy',
    badge: 'Legal',
    body: `Owner and Data Controller: tornaritislaw.com
Owner contact email: office@tornaritislaw.com

This Privacy Policy explains how we handle and treat your data when you register or visit our site, www.tornaritislaw.com, or engage with us to use the products or services that Tornaritis Law provides.

Purpose of this Policy

This Privacy Policy explains our approach to personal information that we collect from you or obtain from a third party and the purposes for which we process your personal information. It also sets out your rights in respect of our processing of your personal information.

Who are we and what do we do

Tornaritis Law is a law firm providing legal and other client services in accordance with the relevant laws of the jurisdictions in which it operates.

How to contact us

If you have questions about this Privacy Policy or want to exercise your rights, contact us by email at office@tornaritislaw.com or by phone at +357 22 456 056.

What personal information do we collect

We may collect personal information in the course of our business, including through use of the site, when you contact or request information from us, when you engage our legal or other services, or as a result of your relationship with our staff or clients.

Our purposes include verifying identity, delivering services, improving and marketing services, carrying out requests, investigating or settling inquiries or disputes, complying with law or regulator requirements, enforcing agreements, protecting rights, property and safety, recruitment purposes, and other purposes required or permitted by law.`,
  },
  disclaimer: {
    title: 'Disclaimer',
    badge: 'Legal',
    body: `Thank you for visiting the website of Tornaritis Law. This website is intended for informational purposes only. None of the information contained in this website is intended to constitute, nor does it constitute, legal advice or a solicitation of any particular prospective client.

Law is a rapidly changing field. Although we intend the information contained on this website to be useful, we do not guarantee that any information contained here is correct, complete or up to date.

This website is not intended to and does not create an attorney-client relationship between you and Tornaritis Law. An attorney-client relationship cannot be formed by reading the information on this website. The only way to become our client is by specific and explicit agreement with an individual attorney at Tornaritis Law.

You should not act or rely on any information contained on this website without seeking the advice of an attorney.

Any information sent to us by email may not be confidential or privileged. Sending us an email will not make you a client of Tornaritis Law.

All materials contained on this website are the copyrighted property of Tornaritis Law unless a separate copyright notice is placed on the material. Reproduction, distribution, republication and retransmission are prohibited unless prior written permission has been obtained.`,
  },
  careers: {
    title: 'Careers',
    badge: 'Join the firm',
    body: `We are always looking for new talent to hire. If you want to join our dynamic team and you are excited to work in the legal world, please contact us and send your CV.

Our team will review submitted applications and respond for more information if required.

Please send CVs in PDF format to office@tornaritislaw.com.`,
  },
};
