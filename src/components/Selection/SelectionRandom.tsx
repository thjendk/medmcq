import React from 'react';
import SelectionNSelector from './SelectionComponents/SelectionNSelector';
import { Divider } from 'semantic-ui-react';
import SelectionSearch from './SelectionComponents/SelectionSearch';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';

export interface SelectionRandomProps {}

const SelectionRandom: React.FC<SelectionRandomProps> = () => {
  return (
    <div>
      <SelectionNSelector />
      <Divider />
      <SelectionSearch />
    </div>
  );
};

export default SelectionRandom;
