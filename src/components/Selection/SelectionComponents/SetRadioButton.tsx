import React from 'react';
import { Form, Radio } from 'semantic-ui-react';
import { Translate } from 'react-localize-redux';
import { useSelector } from 'react-redux';
import ExamSet from 'classes/ExamSet';
import { ReduxState } from 'redux/reducers';
import Selection from 'classes/Selection';
import SetRadioButtonMetadata from './SetRadioButtonMetadata';

export interface SetRadioButtonProps {
  set: ExamSet;
}

const SetRadioButton: React.SFC<SetRadioButtonProps> = ({ set }) => {
  const user = useSelector((state: ReduxState) => state.auth.user);
  const chosenSetId = useSelector((state: ReduxState) => state.selection.examSetId);

  const handleChange = async (examSetId: number) => {
    Selection.change({ type: 'examSetId', value: examSetId });
  };
  const reExam = (season: ExamSet['season'], activeLanguage: { code: string }) => {
    const isEnglish = activeLanguage.code === 'gb';
    if (season.match(/re/)) {
      if (isEnglish) {
        return 'Reexam';
      }
      return 'Reeksamen';
    }
    return '';
  };

  const translateSeason = (season: ExamSet['season'], activeLanguage: { code: string }) => {
    const isEnglish = activeLanguage.code === 'gb';

    if (season.match(/F/)) {
      if (isEnglish) {
        return 'Spring';
      }
      return 'Forår';
    }
    if (season.match(/E/)) {
      if (isEnglish) {
        return 'Autumn';
      }
      return 'Efterår';
    }
  };

  return (
    <Form.Group key={set.id}>
      <Form.Field>
        <Translate>
          {({ activeLanguage = { code: 'dk' } }) => (
            <>
              <Radio
                label={`${translateSeason(set.season, activeLanguage)} ${set.year} ${reExam(
                  set.season,
                  activeLanguage
                )}`}
                checked={set.id === chosenSetId}
                name="selectedSetId"
                onChange={() => handleChange(set.id)}
              />{' '}
              {user && <SetRadioButtonMetadata user={user} examSet={set} />}
            </>
          )}
        </Translate>
      </Form.Field>
    </Form.Group>
  );
};

export default SetRadioButton;
