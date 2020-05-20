import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import { UserAnswerInput } from 'types/generated';

const initialState = {
  userAnswers: [] as UserAnswerInput[],
  questionIndex: 0,
  didInvalidate: false,
  imgOpen: false,
  hidePercentages: false,
  examMode: true,
  examModeStart: null as Date | null,
  usedExamTime: ''
};

const quizReducer = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    resetQuiz: (state) => {
      state.userAnswers = [];
      state.questionIndex = 0;
      state.usedExamTime = '';
    },
    changeQuestion: (state, action: PayloadAction<number>) => {
      state.questionIndex = action.payload;
    },
    setImgOpen: (state, action: PayloadAction<boolean>) => {
      state.imgOpen = action.payload;
    },
    answer: (state, action: PayloadAction<{ answer: UserAnswerInput; answerIds: number[] }>) => {
      // Check if question is already answered. Then we are in examMode.
      const index = state.userAnswers.findIndex((answer) =>
        action.payload.answerIds.includes(answer.answerId)
      );

      if (index !== -1) {
        if (state.examMode) {
          state.userAnswers[index] = action.payload.answer;
        }
      } else {
        state.userAnswers.push(action.payload.answer);
      }
    },
    togglePercentages: (state) => {
      state.hidePercentages = !state.hidePercentages;
    },
    startExamMode: (state) => {
      state.examMode = true;
      state.hidePercentages = true;
      state.examModeStart = new Date();
    },
    stopExamMode: (state) => {
      state.usedExamTime = moment.duration(moment(new Date()).diff(state.examModeStart)).humanize();
      state.examMode = false;
      state.hidePercentages = false;
      state.examModeStart = null;
    }
  }
});

export default quizReducer;
