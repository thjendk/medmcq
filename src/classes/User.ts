import client from 'apolloClient';
import { gql } from 'apollo-boost';
import { store } from 'IndexApp';
import Apollo from './Apollo';
import authReducer from 'redux/reducers/auth';
import { User as UserType, LoginInput, UserInput, Bookmark } from 'types/generated';

interface User extends UserType {}

class User {
  static login = async (data: LoginInput): Promise<User> => {
    const mutation = gql`
      mutation($data: LoginInput) {
        login(data: $data)
      }
    `;

    await Apollo.mutate<string>('login', mutation, { data }); // Sets a JWT as cookie
    const user = await User.fetch();
    return user;
  };

  static logout = async () => {
    const mutation = gql`
      mutation {
        logout
      }
    `;

    await Apollo.mutate('logout', mutation); // Removes the JWT cookie
    await store.dispatch(authReducer.actions.logout());
  };

  static signup = async (data: UserInput) => {
    const mutation = gql`
      mutation($data: UserInput) {
        signup(data: $data)
      }
    `;

    await Apollo.mutate<string>('signup', mutation, { data });
    await User.fetch();
  };

  /**
   * Fetches the user based on the stored cookie in "user". The stored cookie is
   * manipulated based on login and logout.
   */
  static fetch = async () => {
    const query = gql`
      query {
        user {
          id
          username
          email
          role {
            id
          }
          likes {
            commentId
          }
          bookmarks {
            question {
              id
            }
          }
          answeredSets {
            examSetId
            count
          }
          manualCompletedSets {
            examSetId
          }
        }
      }
    `;

    const user = await Apollo.query<User>('user', query);
    await store.dispatch(authReducer.actions.login(user));
    return user;
  };

  static getAnsweredQuestions = async () => {
    const res = await client.query<{ user: Partial<User> }>({
      query: gql`
        query {
          user {
            answers {
              id
              answer
              answerTime
              question {
                id
              }
            }
          }
        }
      `
    });

    return res.data.user;
  };

  static resetPassword = async ({
    token,
    password
  }: {
    token: string;
    password: string;
  }): Promise<string> => {
    const mutation = gql`
      mutation($token: String!, $password: String!) {
        resetPassword(token: $token, password: $password)
      }
    `;

    const message = await Apollo.mutate<string>('resetPassword', mutation, { token, password });
    return message;
  };

  static forgotPassword = async ({ email }: { email: string }) => {
    const mutation = gql`
      mutation($email: String!) {
        forgotPassword(email: $email)
      }
    `;

    await Apollo.mutate('forgotPassword', mutation, { email });
  };

  static edit = async (data: Partial<User>) => {
    const mutation = gql`
      mutation($data: UserEditInput) {
        editUser(data: $data)
      }
    `;

    await Apollo.mutate('editUser', mutation, { data });
    await User.fetch();
  };

  /**
   * Checks if the supplied username or email is available.
   */
  static checkAvailable = async (data: Partial<User>) => {
    const query = gql`
      query($data: UserAvailableInput) {
        checkUsernameAvailability(data: $data)
      }
    `;

    const isAvailable = await Apollo.query<boolean>('checkUsernameAvailability', query, {
      data
    });
    return isAvailable;
  };

  /**
   * Completes a examSet manually, by clicking on the checkmark.
   */
  static manualCompleteSet = async ({ examSetId }: { examSetId: number }) => {
    const mutation = gql`
      mutation($examSetId: Int!) {
        manualCompleteSet(examSetId: $examSetId)
      }
    `;

    await Apollo.mutate('manualCompleteSet', mutation, { examSetId });
    await store.dispatch(authReducer.actions.manualCompleteSet({ examSetId }));
  };

  static bookmark = async ({ questionId }: { questionId: number }) => {
    const mutation = gql`
      mutation($questionId: Int!) {
        bookmark(questionId: $questionId) {
          id
          question {
            id
          }
        }
      }
    `;

    const bookmark = await Apollo.mutate<Bookmark>('bookmark', mutation, { questionId });
    if (!bookmark)
      return store.dispatch(
        authReducer.actions.addOrRemoveBookmark({ question: { id: questionId } })
      );
    store.dispatch(authReducer.actions.addOrRemoveBookmark(bookmark));
  };
}

export default User;
