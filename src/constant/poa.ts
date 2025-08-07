import { Step } from '@/types';

export const accordionOptions = [
  {
    id: 1,
    title:
      'What is a durable power of attorney? How does it compare to ageneral power of attorney?',
    description:
      'A durable power of attorney (DPOA) is a legal document that grants a designated person the authority to manage your financial and medical affairs if you become incapacitated. Unlike a general power of attorney, which becomes invalid if you lose mental capacity, a DPOA remains in effect, ensuring continuous management of your affairs. This distinction makes a DPOA essential for long-term planning and situations where ongoing decision-making is needed.',
  },
  {
    id: 2,
    title: 'What are health care directives, and what all does that entail?',
    description:
      'Health care directives are legal documents that outline your preferences for medical treatment and care if you become unable to communicate your wishes. These directives typically include a living will, which specifies your choices for life-sustaining treatments and a health care power of attorney, which appoints someone to make medical decision on your behalf. Together, these documents ensure that your health care preferences are honored and provide guidance to your loved ones and medical professionals during critical times',
  },
];

export const healthCareList = [
  {
    id: 1,
    title: 'Medical Power of Attorney',
    description:
      'Appoints an agent to make healthcare decisions for you if you become incapacitated.',
  },
  {
    id: 2,
    title: 'Living Will',
    description:
      'Specifies your preferences for medical treatments and end-of-life care.',
  },
];

export const durableList = [
  {
    id: 1,
    title: 'Agent Information',
    description:
      'The name and contact information of the person you are appointing as your agent.',
  },
  {
    id: 2,
    title: 'Scope of Authority',
    description:
      'The specific financial powers you wish to grant your agent, such as managing bank accounts, paying bills, or handling investments.',
  },
  {
    id: 3,
    title: 'Activation',
    description:
      'When you want the POA to take effect (immediately or upon a specific event).',
  },
];

export const durablePOASteps: Step[] = [
  { step: 1, title: 'Designated Agent' },
  { step: 2, title: 'Powers you wish to grant' },
  { step: 3, title: 'Signing' },
  { step: 4, title: 'Review' },
  { step: 5, title: 'Download' },
];

export const livingWillSteps: Step[] = [
  { step: 1, title: 'Wishes' },
  { step: 2, title: 'Specific Wishes' },
  { step: 3, title: 'Review' },
  { step: 4, title: 'Download' },
];

export const medicalPOASteps: Step[] = [
  { step: 1, title: 'Designated Agent' },
  { step: 2, title: 'Agent Powers' },
  { step: 3, title: 'Guardian' },
  { step: 4, title: 'Primary Physician' },
  { step: 5, title: 'Signing' },
  { step: 6, title: 'Review' },
  { step: 7, title: 'Download' },
];

export const medicalPOALivingWillSteps: Step[] = [
  { step: 1, title: 'Designated Agent' },
  { step: 2, title: 'Agent Powers' },
  { step: 3, title: 'Guardian' },
  { step: 4, title: 'Wishes' },
  { step: 5, title: 'Primary Physician' },
  { step: 6, title: 'Signing' },
  { step: 7, title: 'Review' },
  { step: 8, title: 'Download' },
];

export const stateOptions = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];

export const agentsPowersQuestions = [
  'Do you wish to grant your agent with general overall authority?',
  'Would you like your agent(s) to have authority to provide for the maintenance of yourself and your family?',
  'Would you like your agent(s) to have authority to manage your accounts at banks and other financial institutions?',
  'Would you like your agent(s) to have authority to manage your tangible personal property?',
  'Would you like your agent(s) to have authority to manage your real estate on your behalf?',
  'Would you like your agent(s) to have authority to manage your insurance and annuity transactions?',
  'Would you like your agent(s) to have authority to manage your retirement plan accounts?',
  'Would you like your agent(s) to have authority to manage your governmental benefits?',
  'Would you like your agent(s) to have authority to manage tax matters on your behalf?',
  'Would you like your agent(s) to have authority to manage your interest in any estate or trust?',
  'Would you like your agent(s) to have authority to make gifts on your behalf using your property?',
  'Would you like your agent(s) to have authority to manage your stocks, bonds, commodities, options, and other security transactions?',
  'Would you like your agent(s) to have authority to manage your claims and litigations?',
];

export const agentsPowersQuestionsWithAnswers = [
  {
    question:
      'Would you like your agent(s) to have authority to provide for the maintenance of yourself and your family?',
    answer:
      'To make any expenditures for the maintenance, education, and medical care of myself and my family.',
    name: 'isMaintenance',
  },
  {
    question:
      'Would you like your agent(s) to have authority to manage your accounts at banks and other financial institutions?',
    answer:
      'To manage bank and financial interests, including handling bank accounts, conducting transactions, making deposits, and writing checks.',
    name: 'isManageAccounts',
  },
  {
    question:
      'Would you like your agent(s) to have authority to manage your tangible personal property?',
    answer:
      'To buy, sell, exchange, or otherwise manage tangible personal property, such as your jewelry, vehicle, and furniture. Note that real estate is not considered tangible personal property.',
    name: 'isManageProperty',
  },
  {
    question:
      'Would you like your agent(s) to have authority to manage your real estate on your behalf?',
    answer:
      'To sell, mortgage, exchange, lease or otherwise deal with real estate/land.',
    name: 'isManageRealEstate',
  },
  {
    question:
      'Would you like your agent(s) to have authority to manage your insurance and annuity transactions?',
    answer:
      "This includes tasks like updating beneficiaries, paying premiums, or making claims on your behalf. If you're unsure, consider whether you want your agent(s) to have full control over these financial responsibilities.",
    name: 'isManageInsuranceAndAnnuityTransactions',
  },
  {
    question:
      'Would you like your agent(s) to have authority to manage your retirement plan accounts?',
    answer:
      'To act for me in all matters affecting my retirement plans and benefits.',
    name: 'isManageRetirementAccounts',
  },
  {
    question:
      'Would you like your agent(s) to have authority to manage your governmental benefits?',
    answer:
      'To act on my behalf in securing all governmental benefits owed to me, including filing claims or applications, collecting and managing any benefits received, and communicating with government representatives regarding these benefits.',
    name: 'isManageGovernmentalBenefits',
  },
  {
    question:
      'Would you like your agent(s) to have authority to manage tax matters on your behalf?',
    answer:
      'To take any necessary actions to fulfill tax obligations, including filing and paying taxes and claiming tax refunds.',
    name: 'isManageTaxMatters',
  },
  {
    question:
      'Would you like your agent(s) to have authority to manage your interest in any estate or trust?',
    answer:
      'To act for me in estate, trust, and other beneficiary transactions.',
    name: 'isManageEstateTrust',
  },
  {
    question:
      'Would you like your agent(s) to have authority to make gifts on your behalf using your property?',
    answer:
      'The authority to give gifts to family members on special occasions, such as birthdays and holidays.',
    name: 'isMakeGifts',
  },
  {
    question:
      'Would you like your agent(s) to have authority to manage your stocks, bonds, commodities, options, and other security transactions?',
    answer:
      'The authority to manage and conduct transactions involving stocks and bonds, as well as securities, commodities, and options. This includes buying and selling securities, exercising voting rights or options, collecting dividends, and establishing or managing accounts on my behalf with securities and futures brokers.',
    name: 'isManageSecurities',
  },
  {
    question:
      'Would you like your agent(s) to have authority to manage your claims and litigations?',
    answer:
      'To represent me in legal matters, including defending against lawsuits brought against me and initiating lawsuits on my behalf.',
    name: 'isManageClaimsLitigations',
  },
];

export const appointAgentPopupOptions = [
  'Is at least 18 years old',
  'Knows them well',
  'Will be available for the long term',
  'Lives nearby or can travel to be by their side if needed',
  'Can separate their own feelings from those of the person they represent',
  'Can manage conflicting opinions among family, friends, and medical personnel',
  'Can advocate strongly in the face of unresponsive doctors or institutions',
];

export const agentPopupDecisions = [
  'Right after signing this form: Your agent can start making decisions immediately upon signing. Choose this if you need assistance with tasks right away.',
  'Only after my physician determines I can’t make my own decisions: The agent’s authority activates only if your doctor confirms you’re unable to make decisions. This is ideal if you want to retain control until you’re incapacitated.',
];

export const monthsOptions = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const daysOptions = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
];

const currentYear = new Date().getFullYear();
export const yearsOptions = Array.from({ length: 21 }, (_, i) =>
  (currentYear + i).toString(),
);

export const immediateEffectivePoaHeading =
  'DFPAs created with Timely become effective upon execution. This means your agent(s) will have the authority to act on your behalf immediately.';
export const immediateEffectivePoaParagraph =
  "While DFPAs created with Timely give agents immediate authority following execution, it doesn't mean they can use this power right away. Agents must adhere to the principal's instructions. If the principal directs the agent not to act until a certain date or triggering event, the agent must follow those instructions.";

export const disabilityEffectivePoaHeading =
  'DFPAs created using Timely become effective when two licensed physicians confirm my incapacity. This grants your agent(s) the authority to act on your behalf once all signatures and other formalities are completed.';
export const disabilityEffectivePoaParagraph =
  "Although DFPAs created using Timely give agents the power to act when I am incapacitated, this doesn't necessarily mean they can start using their authority immediately. Agents must adhere to the principal's instructions. If a principal directs their agent not to act on their behalf until a specific date or another triggering event occurs, the agent is obligated to follow those instructions.";
