import { format, parse } from 'date-fns';
import { AsYouType } from 'libphonenumber-js';
// eslint-disable-next-line import/no-extraneous-dependencies
import _ from 'lodash';

import { FamilyMember } from '@/services/will/types';
import { FamilyData } from '@/store/will/family-and-guardians/types';
import { Agent } from '@/types';

export const formatDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);
  if (match) {
    const formattedDate = [match[1], match[2], match[3]]
      .filter(Boolean)
      .join('/');
    if (formattedDate.length === 10) {
      const parsedDate = parse(formattedDate, 'MM/dd/yyyy', new Date());
      if (!Number.isNaN(parsedDate.getTime())) {
        return format(parsedDate, 'MM/dd/yyyy');
      }
    }
    return formattedDate;
  }
  return value;
};

export const formatPhoneNumber = (value: string) => {
  const maxFormattedLength = value[0] === '1' ? 16 : 14;
  const truncatedValue = value.slice(0, maxFormattedLength);

  return new AsYouType('US').input(truncatedValue);
};

export const formatAmount = (value: string) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const digitsOnly = +value.replace(/[^\d]/g, '');

  return formatter.format(digitsOnly);
};

export const shouldCallAPI = (obj1: unknown, obj2: unknown) => {
  return _.isEqual(obj1, obj2);
};

export const getAgentOptions = (agent: Agent) => {
  return [
    { id: 1, key: 'Full name:', value: agent.fullName },
    { id: 2, key: 'Email address:', value: agent.email },
    { id: 3, key: 'Phone Number:', value: agent.phoneNumber },
    {
      id: 4,
      key: 'Agents residential address:',
      value: Object.values(agent.address)
        .filter((item) => item)
        .join(', '),
    },
  ];
};

export const getInitAgent = (): Agent => {
  return {
    fullName: '',
    phoneNumber: '',
    email: '',
    address: {
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      zip_code: '',
    },
  };
};

export const prepareGuardianForRequest = (agent: Agent) => {
  if (!agent?.fullName) return null;

  return {
    address: {
      state: agent?.address?.state || '',
      address_line_1: agent?.address?.address_line_1 || '',
      city: agent?.address?.city || '',
      zip_code: agent?.address?.zip_code || '',
      address_line_2: agent?.address?.address_line_2 || '',
    },
    fullName: agent?.fullName || null,
    phoneNumber: agent?.phoneNumber || null,
    email: agent?.email || null,
  };
};

export const prepareAgentForRequest = (agent: Agent) => {
  if (!agent?.fullName) return null;

  return {
    address: {
      state: agent?.address?.state || '',
      address_line_1: agent?.address?.address_line_1 || '',
      city: agent?.address?.city || '',
      zip_code: agent?.address?.zip_code || '',
      address_line_2: agent?.address?.address_line_2 || '',
    },
    fullName: agent?.fullName || null,
    phoneNumber: agent?.phoneNumber || null,
    email: agent?.email || null,
  };
};

export const getKeyDecision = (data?: string | null) => {
  if (data === 'Right after signing this form') return 'affterSigning';

  if (
    data === 'Only after my physician determines I can’t make my own decisions'
  ) {
    return 'afterICantMakeDesitions';
  }

  if (data === 'On a certain date that I will specify') {
    return 'afterDate';
  }

  return null;
};

export const getValueDecision = (data?: string | null) => {
  if (data === 'affterSigning') {
    return 'Right after signing this form';
  }

  if (data === 'afterICantMakeDesitions') {
    return 'Only after my physician determines I can’t make my own decisions';
  }

  if (data === 'afterDate') {
    return 'On a certain date that I will specify';
  }

  return '';
};

export const getSeparateKidsAndPets = (family: FamilyMember[]) => {
  const { children, pets } = family.reduce(
    (accum, curr) => {
      if (curr.type === 'child') {
        accum.children.push({
          fullName: curr.fullName,
          birthday: curr.birthday,
          type: 'child',
          guardian: curr.guardian.length ? curr.guardian[0] : null,
        });
      } else {
        accum.pets.push({
          fullName: curr.fullName,
          type: 'pet',
          petType: curr.petType,
          guardian: curr.guardian.length ? curr.guardian[0] : null,
        });
      }
      return accum;
    },
    { children: [], pets: [] } as unknown as FamilyData,
  );

  return { children, pets };
};

export const removeScrollForBody = () => {
  const body = document.querySelector('body');

  body?.classList.toggle('overflow-hidden');
};
