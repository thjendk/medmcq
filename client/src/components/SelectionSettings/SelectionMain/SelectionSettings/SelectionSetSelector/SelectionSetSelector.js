import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { groupQuestions, getIds } from '../../../../../utils/questions';

import SetRadioButton from './SetRadioButton';
import { Form, Radio, Divider, Header, Icon } from 'semantic-ui-react';

const SelectionSetSelector = ({
    semester,
    activeSet,
    sets,
    questions,
    answeredQuestions,
    onChange,
}) => {
    if (!semester)
        return (
            <Header as="h3">
                Vælg et semester for at se tilgængelige eksamenssæt
            </Header>
        );
    return (
        <Form>
            <Header as="h3">
                For {semester}. semester er der følgende eksamenssæt at vælge
                mellem:
            </Header>

            {sets.map(set => {
                return (
                    <SetRadioButton
                        set={set}
                        answeredQuestions={answeredQuestions}
                        groupedQuestions={groupQuestions(questions)[set.api]}
                        activeSet={activeSet}
                        onChange={onChange}
                    />
                );
            })}
        </Form>
    );
};

SelectionSetSelector.propTypes = {
    semester: PropTypes.number,
    activeSet: PropTypes.string,
    sets: PropTypes.array,
    questions: PropTypes.array,
    answeredQuestions: PropTypes.object,
    onChange: PropTypes.func,
};

export default SelectionSetSelector;