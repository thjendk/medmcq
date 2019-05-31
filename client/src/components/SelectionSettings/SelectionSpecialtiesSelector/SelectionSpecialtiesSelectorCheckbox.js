import React from 'react';
import PropTypes from 'prop-types';

import { Form, Checkbox, Divider } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';

/**
 * Component der viser checkboxes for hvert speciale.
 * Alle prps fra SelectionSpecialtiesSelector.js
 */
const SelectionSpecialtiesSelectorCheckbox = ({
  speciale,
  erValgt,
  type,
  onChange
}) => {
  return (
    <Form.Group key={speciale.value}>
      <Form.Field>
        <Translate>
          {({ translate }) => {
            return (
              <>
                <Checkbox
                  label={translate(
                    'selectionSpecialtiesSelector.checkbox_labels',
                    {
                      speciale: speciale.name,
                      n: speciale.questionCount
                    }
                  )}
                  value={speciale.id}
                  checked={erValgt}
                  name={type}
                  onChange={onChange}
                />
                <Divider vertical hidden />
              </>
            );
          }}
        </Translate>
      </Form.Field>
    </Form.Group>
  );
};

SelectionSpecialtiesSelectorCheckbox.propTypes = {
  /**
   * Type: Ændrer vi specialer eller tags?
   */
  type: PropTypes.string,

  /**
   * Speciale-objekt af form: {"text": "Navn", "value": "slug"}
   */
  speciale: PropTypes.object,

  /**
   * Boolean. Er specialet allerede valgt?
   */
  erValgt: PropTypes.bool,

  /**
   * Hvor mange spg. per speciale?
   */
  antalPerSpeciale: PropTypes.number,

  /**
   * Func der ændrer valgene.
   */
  onChange: PropTypes.func
};

export default SelectionSpecialtiesSelectorCheckbox;
