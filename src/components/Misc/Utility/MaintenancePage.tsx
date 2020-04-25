import React from 'react';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';

export interface MaintenancePageProps {}

const MaintenancePage: React.SFC<MaintenancePageProps> = () => {
  const maintenance = useSelector((state: ReduxState) => state.settings.maintenance);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 10,
      }}
    >
      <h1 style={{ fontSize: '3em' }}>MedMCQ</h1>
      <p style={{ fontSize: '1.5em' }}>{maintenance.message}</p>
    </div>
  );
};

export default MaintenancePage;
