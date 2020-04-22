import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';

import { Button } from 'semantic-ui-react';

/**
 * A component that shows the filter buttons on the AnswerDetails-component.
 */
const AnswerDetailsFilterButtons = ({ handleClick }) => (
  <Button.Group widths="4">
    <Button basic color="blue" onClick={() => handleClick(null)}>
      <Translate id="profileAnswerDetails.filter.show_all" />
    </Button>
    <Button basic positive onClick={() => handleClick('allRight')}>
      <Translate id="profileAnswerDetails.filter.show_correct" />
    </Button>
    <Button basic negative onClick={() => handleClick('allWrong')}>
      <Translate id="profileAnswerDetails.filter.show_wrong" />
    </Button>
    <Button basic color="yellow" onClick={() => handleClick('mixed')}>
      <Translate id="profileAnswerDetails.filter.show_mixed" />
    </Button>
  </Button.Group>
);

AnswerDetailsFilterButtons.propTypes = {
  /**
   * Sets state in parent component to the clicked filter
   */
  handleClick: PropTypes.func
};

export default AnswerDetailsFilterButtons;
