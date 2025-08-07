import { WillStep } from '@/components/WillStepper';

export const accordionOptions = [
  {
    id: 1,
    title: 'What happens if I die without a will?',
    description:
      "Dying without a valid will is known as 'dying intestate.' When this happens, your estate will be handled and distributed according to your state's intestacy laws, which may not align with your personal wishes. This can lead to significant financial, emotional, and legal burdens for your loved ones.",
  },
  {
    id: 2,
    title: 'How often do I need to update my will?',
    description:
      "You should review and update your will whenever major life events occur, such as getting married, getting divorced, having or adopting a child, or experiencing significant changes in your financial circumstances. It's also wise to review your will annually or biannually to ensure it still aligns with your current wishes and complies with state laws.",
  },
];

export const willSteps: WillStep[] = [
  {
    isAccordion: true,
    step: 1,
    title: 'Family & Guardians',
    subTitle: 'family',
    subSteps: [
      'My Children',
      'Children’s Guardian',
      'My Pets',
      'Pet’s Guardian',
    ],
  },
  {
    isAccordion: true,
    step: 2,
    title: 'Your Estate',
    subTitle: 'estate',
    subSteps: ['Inheritors', 'Backups'],
  },
  {
    isAccordion: false,
    step: 3,
    title: 'Leave Gifts',
    subTitle: 'gifts',
    subSteps: [],
  },
  {
    isAccordion: true,
    step: 4,
    title: 'Executors',
    subTitle: 'executors',
    subSteps: [
      'Primary executor',
      'Backup executor',
      'Compensation',
      'Special wishes',
    ],
  },
  {
    step: 5,
    isAccordion: false,
    title: 'Review Your Will',
    subTitle: 'review',
    subSteps: [],
  },
  {
    step: 6,
    isAccordion: false,
    title: 'Download',
    subTitle: 'download',
    subSteps: [],
  },
];

export const presonTypeOptions = [
  'Spouse',
  'Domestic Partner',
  'Mother',
  'Father',
  'Sister',
  'Brother',
  'Daughter',
  'Son',
  'Stepchild',
  'Friend',
  'Sister-in-law',
  'Brother-in-law',
  'Cousin',
  'Grandchild',
  'Other',
];

export const petsTypeOptions = ['Dog', 'Cat', 'Horse', 'Fish', 'Other'];

export const estateDialogListItems1 = [
  'Your bank accounts and Individual Savings Accounts (ISAs)',
  'Stocks and shares',
  'Property you own solely',
  'Property where you own a specific percentage (also known as tenants in common)',
  'Any other assets in your sole name, or your share of jointly owned assets',
];

export const estateDialogListItems2 = [
  'Specific gifts, such as jewelry',
  'Specific sums of money (cash gifts)',
  'Most pension plans',
  'Most life insurance policies',
  'Property owned jointly with someone else (also known as joint tenants)',
  'Joint bank accounts',
];

export enum Prices {
  SUBSCRIPTION = 29,
  PARTNERS_PLAN = 70,
  MY_PLAN = 129,
}
