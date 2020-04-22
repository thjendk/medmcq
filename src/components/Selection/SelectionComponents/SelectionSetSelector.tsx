import React from 'react';
import _ from 'lodash';
import { useSelector } from 'react-redux';

import SetRadioButton from './SetRadioButton';
import { Form, Header } from 'semantic-ui-react';

import { Translate } from 'react-localize-redux';
import { ReduxState } from 'redux/reducers';

const SelectionSetSelector = () => {
  const selectedSemester = useSelector((state: ReduxState) => state.selection.semesterId);
  const semester = useSelector((state: ReduxState) =>
    state.metadata.semesters.find((semester) => semester.id === selectedSemester)
  );
  const user = useSelector((state: ReduxState) => state.auth.user);

  if (!selectedSemester) {
    return (
      <Header as="h3">
        <Translate id="selectionSetSelector.choose_semester" />
      </Header>
    );
  }
  return (
    <Form>
      <Header as="h3">
        <Translate id="selectionSetSelector.header" data={{ semester: semester.value }} />
      </Header>
      {user && (
        <p>
          <Translate id="selectionSetSelector.subtitle" />
        </p>
      )}

      {_(semester.examSets)
        .sortBy((examSet) => examSet.year)
        .reverse()
        .map((examSet) => {
          return <SetRadioButton key={examSet.id} set={examSet} />;
        })
        .value()}
    </Form>
  );
};

export default SelectionSetSelector;
