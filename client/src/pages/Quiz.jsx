import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../actions';

import { withLocalize, Translate } from 'react-localize-redux';
import quizTranslations from '../Translations/quizTranslations.json';

import { Container, Button } from 'semantic-ui-react';

import { Swipeable } from 'react-swipeable';
import QuizLoader from '../components/Quiz/QuizLoader';
import Question from '../containers/Question';
import QuizNavigator from '../components/Quiz/QuizNavigator';
import QuizSummary from '../components/Quiz/QuizSummary';

import { smoothScroll } from '../utils/quiz';
import { urls } from '../utils/common';
import { withRouter } from 'react-router';

const flickNumber = 0.1;

/**
 *  Hovedcomponent til Quizzen.
 *  Den håndterer navigationen mellem spørgsmål, og kalder de components
 *  der viser progression, spørgsmål m.v.
 *
 *  Props: deklareres og forklares i bunden.
 */

class QuizMain extends Component {
  /**
   * state:
   * - qn : Indeholder navigationen (spørgsmålsindeks)
   */
  state = { qn: 0, imgOpen: false };

  constructor(props) {
    super(props);

    this.props.addTranslation(quizTranslations);

    this.onChangeQuestion = this.onChangeQuestion.bind(this);
    this.navigateToPage = this.navigateToPage.bind(this);
    this.getQuestions = this.getQuestions.bind(this);
    this.swiped = this.swiped.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onImgClick = this.onImgClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeydown);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeydown);
  }

  /**
   * Henter spørgsmål fra API'en baseret på de valgte indstillinger.
   * Sætter desuden navigationen (qn) til 0
   */
  getQuestions() {
    let { getQuestions, settings } = this.props;
    getQuestions(settings);
    this.setState({ qn: 0 });
  }

  /**
   * Navigerer til en side.
   * @param  {string} path alle URLS bør defineres og kaldes fra 'src/utils/common.js'
   */
  navigateToPage(path) {
    this.props.history.push(urls[path]);
  }

  /**
   * Navigation mellem spørgsmål
   */
  onKeydown(e) {
    if (!this.state.imgOpen) {
      /**
       * Navigation ved piletaster
       * Tjekker om det aktive element er et TEXTAREA (kommentarfeltet) og
       * navigerer i så fald IKKE
       */
      let { questions } = this.props.quiz;

      let qn = this.state.qn;

      let max = Object.keys(questions).length;
      if (document.activeElement.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft') {
        if (qn > 0) this.onChangeQuestion(this.state.qn - 1);
      } else if (e.key === 'ArrowRight') {
        if (qn < max - 1) this.onChangeQuestion(this.state.qn + 1);
      }
    }
  }

  swiped(e, deltaX) {
    if (!this.state.imgOpen) {
      let { questions } = this.props.quiz;
      // Navigation ved swipes
      let min = 0;
      let max = Object.keys(questions).length;

      let move;

      if (deltaX > 75) {
        move = this.state.qn + 1;
      }

      if (deltaX < -75) {
        move = this.state.qn - 1;
      }
      if (move >= min && move < max) this.onChangeQuestion(move);
    }
  }

  /**
   * Den egentlige navigationsfunktion
   * @param  {number} q det indeks der ønskes navigeret til
   */
  onChangeQuestion(q) {
    this.setState({
      qn: q
    });

    smoothScroll();
  }

  /** Håndtering af pop-up af billeder **/
  onImgClick() {
    this.setState((prevState) => {
      return { imgOpen: !prevState.imgOpen };
    });
  }

  render() {
    let { quiz, answers, user } = this.props;

    let { qn } = this.state;

    let { questions } = quiz;

    if (quiz.isFetching) {
      return (
        <Translate>
          {({ translate }) => (
            <QuizLoader
              handleRetry={this.getQuestions}
              handleAbort={() => this.navigateToPage('root')}
              text={{
                retry: translate('quizLoader.retry'),
                fetching: translate('quizLoader.fetching'),
                abort: translate('quizLoader.abort'),
                long_wait: translate('quizLoader.long_wait')
              }}
            />
          )}
        </Translate>
      );
    }

    if (Object.keys(questions).length === 0) {
      return (
        <div className="flex-container">
          <div className="content">
            <Container>
              <h1>
                <Translate id="quizLoader.noresultsHeader" />
              </h1>
              <Button onClick={() => this.props.history.push('/')} basic color="blue">
                <Translate id="quizLoader.noresults" />
              </Button>
            </Container>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-container">
        <div className="content">
          <QuizNavigator
            onNavigate={this.onChangeQuestion}
            qn={qn}
            qmax={Object.keys(questions).length}
            position="top"
          />

          <Swipeable
            onSwipedLeft={this.swiped}
            onSwipedRight={this.swiped}
            flickThreshold={flickNumber}
            // onSwiped={this.swipeChecker}
          >
            <Question
              onImgClick={this.onImgClick}
              imgOpen={this.state.imgOpen}
              question={questions[qn]}
              user={user}
              qn={qn}
            />
          </Swipeable>

          <QuizNavigator
            onNavigate={this.onChangeQuestion}
            qn={qn}
            qmax={Object.keys(questions).length}
          />

          <QuizSummary
            questions={questions}
            answers={answers}
            clickHandler={this.onChangeQuestion}
          />
        </div>
      </div>
    );
  }
}

QuizMain.propTypes = {
  /**
   * fra redux
   *
   */
  quiz: PropTypes.object,

  /**
   * Fra Redux
   * Den funktion, der henter spørgsmålene fra API'en
   */
  getQuestions: PropTypes.func,

  /**
   * Fra Redux
   * Et object indeholde de valgte indstillinger (inkl. en liste over
   * spørgsmål fra semesteret). Se settingsReducer.js
   */
  settings: PropTypes.object,

  /**
   * Fra Redux
   * Et array indeholdende BOOLEANS for hvert indeks i props.questions.
   * Benyttes til at farve overblikket grønt/rødt. se answersReducer.js
   */
  answers: PropTypes.array,

  /**
   * Fra Redux
   * Et objekt indeholdende brugeren (id, brugernavn, email, gemte svar mv.)
   * Se authReducer.js
   */
  user: PropTypes.object,

  /**
   * Fra ReactRouter.
   * Indeholder nuværende path m.v. - og mulighed for navigation.
   */
  history: PropTypes.object,

  /**
   * Tilføjer quizTranslations i hele app'en
   */
  addTranslation: PropTypes.func
};

function mapStateToProps(state) {
  return {
    quiz: state.quiz,
    answers: state.answers,
    settings: state.settings,
    user: state.auth.user
  };
}

export default withRouter(
  withLocalize(
    connect(
      mapStateToProps,
      actions
    )(QuizMain)
  )
);