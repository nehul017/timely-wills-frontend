import React from 'react';

import AddressForm from './AddressForm';
import MainInfoAboutForm from './MainInfoAboutForm';
import RelationshipForm from './RelationshipForm';

function AboutSection() {
  return (
    <>
      <MainInfoAboutForm />
      <AddressForm />
      <RelationshipForm />
    </>
  );
}

export default AboutSection;
