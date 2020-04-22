import React from 'react';
import PropTypes from 'prop-types';

import { Container } from 'semantic-ui-react';

import { withLocalize, Translate } from 'react-localize-redux';
import errorTranslation from './404Translation.json';

/**
 * 404-page.
 */
const ErrorPage = ({ addTranslation }) => {
  addTranslation(errorTranslation);
  return (
    <div className="flex-container">
      <Container className="content">
        <h3>
          <Translate id="404.header" />
        </h3>
        <p>
          <Translate id="404.text" />
        </p>
      </Container>
    </div>
  );
};

ErrorPage.propTypes = {
  /**
   * Func der tilføjer oversættelser
   * Fra react-localize-redux
   */
  addTranslation: PropTypes.func
};

export default withLocalize(ErrorPage);
