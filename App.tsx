import React from 'react';
import { Layout } from './components/Layout';
import { StepWizard } from './components/StepWizard';

const App: React.FC = () => {
  return (
    <Layout>
      <StepWizard />
    </Layout>
  );
};

export default App;