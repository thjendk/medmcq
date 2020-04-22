import React, { useEffect, useState } from 'react';
import LoadingPage from 'components/Misc/Utility/LoadingPage';
import Quiz from 'components/Quiz/Quiz';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router';
import QuizClass from 'classes/Quiz';

export interface QuizShareRouteProps {}

const QuizShareRoute: React.SFC<QuizShareRouteProps> = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [hasError, setHasError] = useState(false);
  const history = useHistory();
  const params = useParams<{ ids: string }>();
  const ids = params.ids.split(',').map((id) => Number(id));

  useEffect(() => {
    const fetchQuestions = async () => {
      // Check if valid ids
      ids.forEach((id) => {
        if (isNaN(id)) {
          toast('Ugyldigt link', { autoClose: 3000, type: toast.TYPE.ERROR });
          return history.push('/');
        }
      });

      try {
        await QuizClass.start({ ids });
        setIsFetching(false);
      } catch (error) {
        setHasError(true);
      }
    };

    fetchQuestions();
  }, [history, params.ids]);

  if (hasError) {
    toast('Intet spørgsmål blev fundet', { autoClose: 3000, type: toast.TYPE.ERROR });
    history.push('/');
    return null;
  }
  if (isFetching) return <LoadingPage />;
  return <Quiz />;
};

export default QuizShareRoute;
