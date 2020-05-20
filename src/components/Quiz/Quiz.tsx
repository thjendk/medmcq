import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Translate, LocalizeContextProps, withLocalize } from 'react-localize-redux';
import quizTranslations from './quizTranslations.json';

import { Container, Button, Divider } from 'semantic-ui-react';

import { Swipeable } from 'react-swipeable';
import QuizLoader from './QuizLoader';
import Question from 'components/Question/Question';
import QuizNavigator from './QuizNavigator';
import QuizSummary from './QuizSummary';

import { useHistory } from 'react-router';
import { smoothScroll } from '../../utils/quiz';
import { ReduxState } from 'redux/reducers';
import quizReducer from 'redux/reducers/quiz';
import QuestionStopExamMode from 'components/Question/QuestionStopExamMode';
import LoadingPage from 'components/Misc/Utility/LoadingPage';
import Semester from 'classes/Semester';

/**
 *  Hovedcomponent til Quizzen.
 *  Den håndterer navigationen mellem spørgsmål, og kalder de components
 *  der viser progression, spørgsmål m.v.
 *
 *  Props: deklareres og forklares i bunden.
 */
export interface QuizProps extends LocalizeContextProps {}

const Quiz: React.SFC<QuizProps> = ({ addTranslation }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const semesters = useSelector((state: ReduxState) => state.metadata.semesters);
  const questionIndex = useSelector((state: ReduxState) => state.quiz.questionIndex);
  const questions = useSelector((state: ReduxState) => state.questions.questions);
  const imgOpen = useSelector((state: ReduxState) => state.quiz.imgOpen);
  const examMode = useSelector((state: ReduxState) => state.quiz.examMode);
  const { isFetching } = useSelector((state: ReduxState) => state.questions);
  const max = questions.length;

  useEffect(() => {
    addTranslation(quizTranslations);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [questionIndex]);

  useEffect(() => {
    if (!semesters) Semester.fetchAll();
  }, []);

  const handleChangeQuestion = (questionNumber: number) => {
    dispatch(quizReducer.actions.changeQuestion(questionNumber));
    smoothScroll();
  };

  /**
   * Navigation ved piletaster
   * Tjekker om det aktive element er et TEXTAREA (kommentarfeltet) og
   * navigerer i så fald IKKE
   */
  const handleKeyDown = (e: KeyboardEvent) => {
    if (imgOpen) return;
    if (document.activeElement.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowLeft') {
      if (questionIndex > 0) {
        handleChangeQuestion(questionIndex - 1);
      }
    } else if (e.key === 'ArrowRight') {
      if (questionIndex < max - 1) {
        handleChangeQuestion(questionIndex + 1);
      }
    }
  };

  const swiped = (deltaX: number) => {
    if (imgOpen) return;

    // Navigation ved swipes
    const min = 0;

    let move;

    if (deltaX > 75) {
      move = 1;
    }

    if (deltaX < -75) {
      move = -1;
    }

    if (move >= min && move < max) {
      smoothScroll();
      dispatch(quizReducer.actions.changeQuestion(questionIndex + move));
    }

    if (move >= min && move < max) handleChangeQuestion(move);
  };

  /* 
Hvis vi er ved at hente spørgsmål eller quizzen er invalid (-- i så fald henter vi nye spørgsmål
i componentDidMount) 
*/
  if (isFetching) {
    return (
      <Translate>
        {({ translate }) => (
          <QuizLoader
            handleRetry={() => history.push('/')}
            handleAbort={() => history.push('/')}
            text={{
              retry: translate('quizLoader.retry') as string,
              fetching: translate('quizLoader.fetching') as string,
              abort: translate('quizLoader.abort') as string,
              long_wait: translate('quizLoader.long_wait') as string
            }}
          />
        )}
      </Translate>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex-container">
        <div className="content">
          <Container>
            <h1>
              <Translate id="quizLoader.noresultsHeader" />
            </h1>
            <Button onClick={() => history.push('/')} basic color="blue">
              <Translate id="quizLoader.noresults" />
            </Button>
          </Container>
        </div>
      </div>
    );
  }

  if (!semesters) return <LoadingPage />;
  return (
    <div className="flex-container">
      <div className="content">
        <QuizNavigator handleNavigate={handleChangeQuestion} position="top" />

        <Swipeable onSwipedLeft={(e) => swiped(e.deltaX)} onSwipedRight={(e) => swiped(e.deltaX)}>
          <Question />
        </Swipeable>

        {examMode && <QuestionStopExamMode />}
        <Divider hidden />

        <QuizNavigator handleNavigate={handleChangeQuestion} />
        <QuizSummary clickHandler={handleChangeQuestion} />
      </div>
    </div>
  );
};

export default withLocalize(Quiz);
