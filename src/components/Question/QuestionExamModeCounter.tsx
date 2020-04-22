import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import moment from 'moment-timezone';
import 'moment/locale/da';
import { Loader } from 'semantic-ui-react';
moment.locale('da');

export interface QuestionExamModeCounterProps {}

const QuestionExamModeCounter: React.SFC<QuestionExamModeCounterProps> = () => {
  const [counter, setCounter] = useState('');
  const examModeStart = useSelector((state: ReduxState) => state.quiz.examModeStart);

  useEffect(() => {
    setCounter(moment.duration(moment(new Date()).diff(examModeStart)).humanize());
    const interval = setInterval(() => {
      const difference = moment.duration(moment(new Date()).diff(examModeStart)).humanize();
      setCounter(difference);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!counter)
    return (
      <div>
        <Loader active inline size="tiny" />
      </div>
    );
  return <p>Du har brugt {counter}</p>;
};

export default QuestionExamModeCounter;
