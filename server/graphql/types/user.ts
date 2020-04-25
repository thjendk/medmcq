import { gql } from 'apollo-server-express';
import QuestionUserAnswer from 'models/question_user_answer';
import User from 'models/user';
import jwt from 'jsonwebtoken';
import QuestionCommentLike from 'models/question_comment_like';
import QuestionBookmark from 'models/question_bookmark';
import QuestionComment from 'models/question_comment';
import sgMail from '@sendgrid/mail';
import { urls } from 'misc/vars';
import ManualCompletedSet from 'models/manual_completed_set';
import crypto from 'crypto';
import _ from 'lodash';
import { Resolvers } from 'types/resolvers-types';
import Question from 'models/question';
import QuestionAnswer from 'models/questionAnswer.model';

export const typeDefs = gql`
  extend type Query {
    user: User
    checkUsernameAvailability(data: UserAvailableInput): Boolean
    profile: User # Is required for caching, so user isn't overwritten in profile
  }

  extend type Mutation {
    login(data: LoginInput): String
    signup(data: UserInput): String
    logout: String
    editUser(data: UserEditInput): String
    forgotPassword(email: String!): String
    resetPassword(token: String!, password: String!): String
    manualCompleteSet(examSetId: Int!): String
    bookmark(questionId: Int!): Bookmark
  }

  input LoginInput {
    username: String!
    password: String!
  }

  input UserInput {
    username: String!
    password: String!
    email: String
  }

  input UserAvailableInput {
    username: String
    email: String
  }

  input UserEditInput {
    password: String
    email: String
  }

  type User {
    id: Int
    username: String
    email: String
    password: String
    role: Role
    bookmarks(semester: Int): [Bookmark]
    answers(semester: Int): [UserAnswer]
    specialtyVotes: [SpecialtyVote]
    tagVotes: [TagVote]
    likes: [Like]
    liked: [Like]
    manualCompletedSets: [ManualCompletedSet]
    publicComments(semester: Int): [Comment]
    privateComments(semester: Int): [Comment]
    answeredSets: [AnsweredSet]
  }

  type AnsweredSet {
    examSetId: Int
    count: Int
  }

  type Role {
    id: Int
  }

  type Bookmark {
    id: Int
    question: Question
    user: User
  }

  type Profile {
    id: Int
  }

  type ManualCompletedSet {
    examSetId: Int
  }
`;

export const resolvers: Resolvers = {
  Query: {
    user: async (_root, _args, ctx) => {
      if (!ctx.user) return null;
      const user = await ctx.userLoader.load(ctx.user.id);
      if (!user) {
        ctx.res.cookie('user', {}, { expires: new Date(0) });
        return null;
      }
      return { id: user.id };
    },
    profile: async (_root, _args, ctx) => {
      if (!ctx.user) return null;
      const user = await ctx.userLoader.load(ctx.user.id);
      return { id: user.id };
    },
    checkUsernameAvailability: async (root, { data: { username, email } }) => {
      const user = await User.query()
        .where({ username })
        .orWhere({ email })
        .skipUndefined()
        .first();
      return !user; // Returns true if username is available (not in use)
    },
  },

  Mutation: {
    login: async (root, { data: { username, password } }, ctx) => {
      let user: Partial<User> = await User.query().findOne({ username });
      if (!user) throw new Error('Username or password is invalid');
      const isValidPassword = user.verifyPassword(password);
      if (!isValidPassword) throw new Error('Username or password is invalid');
      user = { id: user.id }; // Only ID is needed, as the user is fetched through the user query based on this ID
      const token = jwt.sign(user, process.env.SECRET);
      ctx.res.cookie('user', token, { expires: new Date(253402300000000) }); // Expires year 9999
      return 'Logged in';
    },
    logout: (root, args, ctx) => {
      ctx.res.cookie('user', null, { expires: new Date(0) });
      return 'Logged out';
    },
    signup: async (root, { data }, ctx) => {
      let user: Partial<User> = await User.query().insertAndFetch(data);
      user = { id: user.id }; // Only ID is needed, as the user is fetched through the user query based on this ID
      const token = jwt.sign(user, process.env.SECRET);
      ctx.res.cookie('user', token);
      return 'User has been created and logged in';
    },
    editUser: async (root, { data }) => {
      // TODO
      return 'Not implemented';
    },
    resetPassword: async (root, { token, password }) => {
      // Check if required fields are provided
      if (!token || !password) {
        throw new Error('You must provide a password reset token and a new password');
      }
      // Find the user with correct token and expire time
      const user = await User.query()
        .findOne({ resetPasswordToken: token })
        .andWhere('resetPasswordExpires', '>', Date.now());
      if (!user)
        return 'Reset-token er ikke gyldigt. Bed om et nyt via formularen "Jeg har glemt min kode" og prøv igen.';

      // Reset password
      await user.$query().patch({ password, resetPasswordToken: null, resetPasswordExpires: null });

      // Send mail
      const msg = {
        to: user.email,
        from: urls.fromEmail,
        templateId: 'd-df2ec6ed439b4e63a57d4ae6877721d7',
        dynamic_template_data: {
          username: user.username,
          email: user.email,
        },
      };
      sgMail.send(msg);

      // Send response
      return 'Dit kodeord er blevet nulstillet. / Your password has been reset.';
    },
    forgotPassword: async (root, { email }, ctx) => {
      if (!email) {
        throw new Error('You need to provide an email');
      }

      // Generate reset token
      const token = crypto.randomBytes(20).toString('hex');

      // Find the user
      let user: User;

      user = await User.query().findOne({ email });
      if (!user) throw new Error('Der blev ikke fundet en bruger.');

      // Update reset information
      const now = new Date();
      now.setHours(now.getHours() + 1);

      user = await user.$query().patchAndFetch({
        resetPasswordToken: token,
        resetPasswordExpires: now,
      });

      // Send mail
      const msg = {
        to: user.email,
        from: urls.fromEmail,
        templateId: 'd-c18c023d7f7847118f02d342f538c571',
        dynamic_template_data: {
          username: user.username,
          email: user.email,
          resetLink: `http://${ctx.req.headers.host}${urls.resetPassword}${token}`,
          forgotLink: `http://${ctx.req.headers.host}${urls.forgotPassword}`,
        },
      };
      sgMail.send(msg);

      // Send response
      return 'Success';
    },
    bookmark: async (root, { questionId }, ctx) => {
      const isBookmarked = await QuestionBookmark.query().findOne({
        questionId,
        userId: ctx.user.id,
      });
      if (!isBookmarked) {
        const bookmark = await QuestionBookmark.query().insert({ questionId, userId: ctx.user.id });
        return { id: bookmark.id };
      } else {
        await isBookmarked.$query().delete();
        return null;
      }
    },
    manualCompleteSet: async (root, { examSetId }, ctx) => {
      const exists = await ManualCompletedSet.query().findOne({
        userId: ctx.user.id,
        setId: examSetId,
      });
      if (exists) {
        await exists.$query().delete();
        return 'Set has been marked as not completed';
      } else {
        await ManualCompletedSet.query().insert({ userId: ctx.user.id, setId: examSetId });
        return 'Set has been marked as completed';
      }
    },
  },

  User: {
    id: ({ id }) => id,
    username: async ({ id }, _, ctx) => {
      const user = await ctx.userLoader.load(id);
      return user.username;
    },
    password: async ({ id }, _, ctx) => {
      const user = await ctx.userLoader.load(id);
      return user.password;
    },
    email: async ({ id }, _, ctx) => {
      const user = await ctx.userLoader.load(id);
      return user.email;
    },
    role: async ({ id }, _, ctx) => {
      const user = await ctx.userLoader.load(id);
      return { id: user.roleId };
    },
    answers: async ({ id }, { semester }) => {
      let query = QuestionUserAnswer.query().where('questionUserAnswer.userId', id);

      if (semester) {
        query = query
          .join('questionAnswers', 'questionUserAnswer.answerId', 'questionAnswers.id')
          .join('question', 'questionAnswers.questionId', 'question.id')
          .join('semesterExamSet', 'question.examSetId', 'semesterExamSet.id')
          .where('semesterExamSet.semesterId', semester);
      }

      const answers = await query;
      return answers.map((answer) => ({ id: answer.id }));
    },
    likes: async ({ id }) => {
      const likes = await QuestionCommentLike.query()
        .join('questionComment', 'questionCommentLike.commentId', 'questionComment.id')
        .where('questionComment.userId', id);
      return likes.map((like) => ({ commentId: like.commentId, userId: like.userId }));
    },
    liked: async ({ id }) => {
      const liked = await QuestionCommentLike.query().where({ userId: id });
      return liked.map((like) => ({ commentId: like.commentId, userId: like.userId }));
    },
    bookmarks: async ({ id }, { semester }, ctx) => {
      let query = QuestionBookmark.query().where('questionBookmark.userId', id);

      if (semester) {
        query = query
          .join('question', 'questionId', 'question.id')
          .join('semesterExamSet', 'question.examSetId', 'semesterExamSet.id')
          .where({ semesterId: semester });
      }

      const bookmarks = await query;
      return bookmarks.map((bookmark) => ({ id: bookmark.id }));
    },
    publicComments: async ({ id }, { semester }, ctx) => {
      let query = QuestionComment.query().where('questionComment.userId', id).where({ private: 0 });

      if (semester) {
        query = query
          .join('question', 'questionComment.questionId', 'question.id')
          .join('semesterExamSet', 'question.examSetId', 'semesterExamSet.id')
          .where('semesterExamSet.semesterId', semester);
      }

      const publicComments = await query;
      return publicComments.map((pubC) => ({ id: pubC.id }));
    },
    privateComments: async ({ id }, { semester }, ctx) => {
      let query = QuestionComment.query().where('questionComment.userId', id).where({ private: 1 });

      if (semester) {
        query = query
          .join('question', 'questionComment.questionId', 'question.id')
          .join('semesterExamSet', 'question.examSetId', 'semesterExamSet.id')
          .where('semesterExamSet.semesterId', semester);
      }

      const privateComments = await query;
      return privateComments.map((priC) => ({ id: priC.id }));
    },
    manualCompletedSets: async ({ id }) => {
      const completedSets = await ManualCompletedSet.query().where({ userId: id });
      return completedSets.map((completedSet) => ({ examSetId: completedSet.setId }));
    },
    answeredSets: async ({ id }, args, ctx) => {
      // Get all answerIds that have been at least answered once
      const answeredQuestions = await QuestionUserAnswer.query()
        .where({ userId: id })
        .distinct('answerId')
        .select('answerId');
      const questionAnswers = await QuestionAnswer.query().whereIn(
        'id',
        answeredQuestions.map((aq) => aq.answerId)
      );

      // Find all questions corresponding to the answeredIds
      const questions = (
        await ctx.questionLoader.loadMany(questionAnswers.map((qa) => qa.questionId))
      ).map((q) => {
        if (q instanceof Error) return;
        return q;
      });

      const examSetIds = _.uniq(questions.map((question) => question.examSetId));

      // Count the questions answered based on each examSetId
      let answeredSets = [];
      for (let examSetId of examSetIds) {
        answeredSets.push({
          examSetId,
          count: questions.filter((question) => question.examSetId === examSetId).length,
        });
      }

      return answeredSets;
    },
  },

  Bookmark: {
    id: ({ id }) => id,
    question: async ({ id }, args, ctx) => {
      const bookmark = await ctx.bookmarkLoader.load(id);
      return { id: bookmark.questionId };
    },
  },
};
